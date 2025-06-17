-- ============================================================================
-- Seed Data for Longhorn Studies
-- ============================================================================

-- Note: In a real application, users would be created through Supabase Auth
-- This seed data assumes some test users exist in auth.users
-- You'll need to create these users through your app's signup process first

-- ============================================================================
-- Sample Tags (System Tags)
-- ============================================================================
INSERT INTO public.tags (label, slug, is_system) VALUES
  ('Study Spot', 'study-spot', true),
  ('Library', 'library', true),
  ('Quiet', 'quiet', true),
  ('Group Study', 'group-study', true),
  ('24/7 Access', '24-7-access', true),
  ('Coffee', 'coffee', true),
  ('Outdoor', 'outdoor', true),
  ('WiFi', 'wifi', true),
  ('Charging Stations', 'charging-stations', true),
  ('Computer Lab', 'computer-lab', true),
  ('Engineering', 'engineering', true),
  ('Business', 'business', true),
  ('Liberal Arts', 'liberal-arts', true),
  ('Science', 'science', true),
  ('Graduate', 'graduate', true);

-- ============================================================================
-- Sample Auth Users
-- ============================================================================
-- Note: These users will automatically create corresponding profiles via trigger
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES
    (
        '12345678-1234-5678-9012-123456789001',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'sam.rodriguez@utexas.edu',
        crypt('password123', gen_salt('bf')),
        now(),
        null,
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Sam Rodriguez", "username": "longhorn_sam"}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    ),
    (
        '12345678-1234-5678-9012-123456789002',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'sarah.chen@utexas.edu',
        crypt('password123', gen_salt('bf')),
        now(),
        null,
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Sarah Chen", "username": "ut_sarah"}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    ),
    (
        '12345678-1234-5678-9012-123456789003',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'alex.johnson@utexas.edu',
        crypt('password123', gen_salt('bf')),
        now(),
        null,
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Alex Johnson", "username": "hook_em_alex"}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    ),
    (
        '12345678-1234-5678-9012-123456789004',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'taylor.williams@utexas.edu',
        crypt('password123', gen_salt('bf')),
        now(),
        null,
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Taylor Williams", "username": "tower_taylor"}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    );

-- ============================================================================
-- Sample Spots (UT Austin Study Locations)
-- ============================================================================
INSERT INTO public.spots (id, user_id, title, body, location, created_at, updated_at) VALUES
  (
    '11111111-2222-3333-4444-555555555001'::uuid,
    '12345678-1234-5678-9012-123456789001'::uuid,
    'PCL 4th Floor - Silent Study',
    'Perfect quiet study space with individual desks and great natural lighting. One of the best spots for focused individual work on campus.',
    'POINT(-97.739358 30.283680)',
    now() - interval '2 days',
    now() - interval '2 days'
  ),
  (
    '11111111-2222-3333-4444-555555555002'::uuid,
    '12345678-1234-5678-9012-123456789002'::uuid,
    'Engineering Library Group Study Rooms',
    'Reservable group study rooms with whiteboards and projectors. Great for engineering project work and group collaboration.',
    'POINT(-97.736925 30.289156)',
    now() - interval '1 day',
    now() - interval '1 day'
  ),
  (
    '11111111-2222-3333-4444-555555555003'::uuid,
    '12345678-1234-5678-9012-123456789003'::uuid,
    'GSB Graduate Study Rooms',
    'Premium study rooms in the Graduate School of Business. Quiet environment perfect for MBA students and graduate work.',
    'POINT(-97.739125 30.284875)',
    now() - interval '3 hours',
    now() - interval '3 hours'
  ),
  (
    '11111111-2222-3333-4444-555555555004'::uuid,
    '12345678-1234-5678-9012-123456789004'::uuid,
    'Tower Garden Outdoor Study',
    'Beautiful outdoor study area with tables and benches. Perfect for reading and light studying when the weather is nice.',
    'POINT(-97.739442 30.286156)',
    now() - interval '5 hours',
    now() - interval '5 hours'
  ),
  (
    '11111111-2222-3333-4444-555555555005'::uuid,
    '12345678-1234-5678-9012-123456789001'::uuid,
    'Life Sciences Library - Collaborative Zone',
    'Open collaborative study area with moveable furniture. Great for group projects and science courses.',
    'POINT(-97.737289 30.284567)',
    now() - interval '1 hour',
    now() - interval '1 hour'
  ),
  (
    '11111111-2222-3333-4444-555555555006'::uuid,
    '12345678-1234-5678-9012-123456789002'::uuid,
    'FAC Computer Lab - 24/7 Access',
    'Computer lab with 24/7 access for students. Multiple workstations and printing services available.',
    'POINT(-97.738125 30.284125)',
    now() - interval '6 hours',
    now() - interval '6 hours'
  ),
  (
    '11111111-2222-3333-4444-555555555007'::uuid,
    '12345678-1234-5678-9012-123456789003'::uuid,
    'Starbucks in Student Union',
    'Casual study spot with coffee and light background noise. Good for reading and casual studying with friends.',
    'POINT(-97.739789 30.285234)',
    now() - interval '30 minutes',
    now() - interval '30 minutes'
  ),
  (
    '11111111-2222-3333-4444-555555555008'::uuid,
    '12345678-1234-5678-9012-123456789004'::uuid,
    'Main Building Study Alcoves',
    'Historic study nooks in the iconic Main Building. Quiet individual study spaces with beautiful architecture.',
    'POINT(-97.739525 30.286234)',
    now() - interval '2 hours',
    now() - interval '2 hours'
  );

-- ============================================================================
-- Sample Spot-Tag Relationships
-- ============================================================================
INSERT INTO public.spot_tags (spot_id, tag_id) 
SELECT st.spot_id, st.tag_id 
FROM (
  SELECT spot_id, (SELECT id FROM public.tags WHERE slug = tag_slug) as tag_id
  FROM (
    VALUES
      -- PCL 4th Floor
      ('11111111-2222-3333-4444-555555555001'::uuid, 'study-spot'),
      ('11111111-2222-3333-4444-555555555001'::uuid, 'library'),
      ('11111111-2222-3333-4444-555555555001'::uuid, 'quiet'),
      ('11111111-2222-3333-4444-555555555001'::uuid, 'wifi'),
      ('11111111-2222-3333-4444-555555555001'::uuid, 'charging-stations'),
      
      -- Engineering Library
      ('11111111-2222-3333-4444-555555555002'::uuid, 'study-spot'),
      ('11111111-2222-3333-4444-555555555002'::uuid, 'library'),
      ('11111111-2222-3333-4444-555555555002'::uuid, 'quiet'),
      ('11111111-2222-3333-4444-555555555002'::uuid, 'engineering'),
      ('11111111-2222-3333-4444-555555555002'::uuid, 'science'),
      ('11111111-2222-3333-4444-555555555002'::uuid, 'group-study'),
      
      -- GSB Study Rooms
      ('11111111-2222-3333-4444-555555555003'::uuid, 'study-spot'),
      ('11111111-2222-3333-4444-555555555003'::uuid, 'group-study'),
      ('11111111-2222-3333-4444-555555555003'::uuid, 'business'),
      ('11111111-2222-3333-4444-555555555003'::uuid, 'graduate'),
      ('11111111-2222-3333-4444-555555555003'::uuid, 'wifi'),
      
      -- Tower Garden
      ('11111111-2222-3333-4444-555555555004'::uuid, 'study-spot'),
      ('11111111-2222-3333-4444-555555555004'::uuid, 'outdoor'),
      
      -- Life Sciences Library
      ('11111111-2222-3333-4444-555555555005'::uuid, 'study-spot'),
      ('11111111-2222-3333-4444-555555555005'::uuid, 'library'),
      ('11111111-2222-3333-4444-555555555005'::uuid, 'science'),
      ('11111111-2222-3333-4444-555555555005'::uuid, 'quiet'),
      ('11111111-2222-3333-4444-555555555005'::uuid, 'group-study'),
      
      -- FAC Computer Lab
      ('11111111-2222-3333-4444-555555555006'::uuid, 'study-spot'),
      ('11111111-2222-3333-4444-555555555006'::uuid, 'computer-lab'),
      ('11111111-2222-3333-4444-555555555006'::uuid, 'wifi'),
      ('11111111-2222-3333-4444-555555555006'::uuid, '24-7-access'),
      
      -- Starbucks Union
      ('11111111-2222-3333-4444-555555555007'::uuid, 'study-spot'),
      ('11111111-2222-3333-4444-555555555007'::uuid, 'coffee'),
      ('11111111-2222-3333-4444-555555555007'::uuid, 'wifi'),
      ('11111111-2222-3333-4444-555555555007'::uuid, 'group-study'),
      
      -- Main Building
      ('11111111-2222-3333-4444-555555555008'::uuid, 'study-spot'),
      ('11111111-2222-3333-4444-555555555008'::uuid, 'quiet'),
      ('11111111-2222-3333-4444-555555555008'::uuid, 'liberal-arts')
  ) AS spot_tag_mapping(spot_id, tag_slug)
) AS st
WHERE st.tag_id IS NOT NULL;
