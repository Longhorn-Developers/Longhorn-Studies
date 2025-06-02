import { GoogleAPI } from 'https://deno.land/x/google_deno_integration@v1.1/mod.ts';
import { createClient } from 'jsr:@supabase/supabase-js';

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { Database, TablesInsert } from './types/database.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

const GOOGLE_APPLICATION_CREDENTIALS = JSON.parse(
  Deno.env.get('GOOGLE_APPLICATION_CREDENTIALS') || '{}'
);

type Spot = TablesInsert<'spots'> & {
  selectedTags: TablesInsert<'tags'>[];
  location: {
    latitude: number;
    longitude: number;
  };
  images: Image[];
};

type Image = {
  fileName: string;
  mimeType: string;
  position: number;
  base64: string;
};

const uploadImagesToSupabase = async (
  supabase: ReturnType<typeof createClient<Database>>,
  spot_data_id: string,
  images: Image[]
) => {
  try {
    // Upload the first image as the main spot image (you can modify this to handle multiple images)
    // Upload each image with its position index
    await Promise.all(
      images.map(async (image) => {
        const file_path = `spots/${spot_data_id}/${new Date().getTime()}-${image.fileName}`;
        const { error } = await supabase.storage
          .from('media')
          .upload(file_path, image.base64, { contentType: image.mimeType });

        if (error) {
          throw new Error(`Error uploading image: ${error}`);
        }

        await supabase.from('media').insert({
          spot_id: spot_data_id,
          storage_key: file_path,
          position: image.position,
        });
      })
    );
  } catch (error) {
    console.error('Error in image upload process:', error);
    return null;
  }
};

Deno.serve(async (req) => {
  // Check if the request is a POST request
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Initialize variables
  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(JSON.stringify({ error: 'Missing environment variables.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const authorization = req.headers.get('Authorization');

  if (!authorization) {
    return new Response(JSON.stringify({ error: `No authorization header passed` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Initialize supabase client
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        authorization,
      },
    },
    auth: {
      persistSession: false,
    },
  });

  const { images, selectedTags, location, ...spot_data } = (await req.json()) as Spot;

  try {
    // Insert the spot

    const { data: spot, error: spotError } = await supabase
      .from('spots')
      .insert({
        ...spot_data,
        // Transform location coordinates to POINT type
        location: `POINT(${location.longitude} ${location.latitude})`,
      })
      .select()
      .single();

    if (spotError) {
      console.error('Error inserting data:', spotError);
      return new Response(JSON.stringify({ error: 'Error adding spot.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Spot tag handling
    if (selectedTags.length > 0) {
      // Upsert tags the user selected/created
      const userLabels = selectedTags.map((tag) => tag.label);
      const { data: tags, error: tagsError } = await supabase.rpc('upsert_tags', {
        label_list: userLabels,
      });

      if (tagsError) {
        console.error('Error upserting tags:', tagsError);
        // We can still continue since the spot was created
      } else if (tags) {
        // Bridge spot <-> tags
        const { error: linkError } = await supabase
          .from('spot_tags')
          .insert(tags.map((t) => ({ spot_id: spot.id, tag_id: t.id })));

        if (linkError) {
          console.error('Error linking tags to spot:', linkError);
        }
      } else {
        console.error('No tags returned from upsert unexpectedly');
      }
    }

    // upload images if present
    if (images.length > 0) {
      const vision = new GoogleAPI({
        email: GOOGLE_APPLICATION_CREDENTIALS.client_email,
        key: GOOGLE_APPLICATION_CREDENTIALS.private_key,
        scope: ['https://www.googleapis.com/auth/cloud-platform'],
      });

      const result = await vision.post('https://vision.googleapis.com/v1/images:annotate', {
        requests: images.map((image) => ({
          image: {
            content: image.base64, // Use each image for analysis
          },
          features: [
            {
              type: 'SAFE_SEARCH_DETECTION',
            },
          ],
        })),
      });

      // Go through results and throw an error if any image is flagged
      const unallowedFlags = ['LIKELY', 'VERY_LIKELY'];
      for (const response of result.responses) {
        if (response.safeSearchAnnotation) {
          const safeSearch = response.safeSearchAnnotation;
          if (
            unallowedFlags.includes(safeSearch.adult) ||
            unallowedFlags.includes(safeSearch.spoof) ||
            unallowedFlags.includes(safeSearch.medical) ||
            unallowedFlags.includes(safeSearch.violence) ||
            unallowedFlags.includes(safeSearch.racy)
          ) {
            return new Response(JSON.stringify({ error: 'Image contains inappropriate content' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            });
          }
        } else {
          console.warn('No SafeSearch annotation found for an image');
        }
      }

      // Upload spot images to Supabase
      await uploadImagesToSupabase(supabase, spot.id, images);
    }

    return new Response(JSON.stringify({ id: spot.id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in adding spot:', error);
    return new Response(JSON.stringify(error instanceof Error ? error.message : error), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/new-spot' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
