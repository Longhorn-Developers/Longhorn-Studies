SET local check_function_bodies = off;

CREATE SCHEMA "private";

CREATE EXTENSION "citext" SCHEMA "extensions";

CREATE TABLE "public"."majors" (
  "key"  text NOT NULL,
  "name" text NOT NULL,
  CONSTRAINT "majors_key_check" CHECK ((key ~ '^[a-z0-9_]+$'::text)),
  CONSTRAINT "majors_name_key" UNIQUE (name),
  CONSTRAINT "majors_pkey" PRIMARY KEY (key)
);

ALTER TABLE "public"."majors"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."majors" FROM "anon";

CREATE TABLE "public"."places" (
  "id"          uuid             NOT NULL DEFAULT gen_random_uuid(),
  "code"        text,
  "common_name" text,
  "full_name"   text             NOT NULL,
  "address"     text,
  "latitude"    double precision NOT NULL,
  "longitude"   double precision NOT NULL,
  CONSTRAINT "places_code_check" CHECK ((code ~ '^[A-Z0-9]{2,5}$'::text)),
  CONSTRAINT "places_code_key" UNIQUE (code),
  CONSTRAINT "places_common_name_key" UNIQUE (common_name),
  CONSTRAINT "places_full_name_key" UNIQUE (full_name),
  CONSTRAINT "places_latitude_check" CHECK (((latitude >= ('-90'::integer)::double precision) AND (latitude <= (90)::double precision))),
  CONSTRAINT "places_longitude_check" CHECK (((longitude >= ('-180'::integer)::double precision) AND (longitude <= (180)::double precision))),
  CONSTRAINT "places_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."places"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"              uuid                     NOT NULL,
  "username"        extensions.citext        NOT NULL,
  "display_name"    text,
  "avatar_path"     text,
  "bio"             text,
  "graduation_year" smallint,
  "created_at"      timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"      timestamp with time zone NOT NULL DEFAULT now(),
  "majors"          text[]                   NOT NULL DEFAULT '{}'::text[],
  CONSTRAINT "profiles_bio_check" CHECK ((char_length(bio) <= 180)),
  CONSTRAINT "profiles_display_name_check" CHECK (((char_length(display_name) >= 1) AND (char_length(display_name) <= 50))),
  CONSTRAINT "profiles_graduation_year_check" CHECK (((graduation_year >= 1950) AND (graduation_year <= 2100))),
  CONSTRAINT "profiles_majors_max_3" CHECK ((cardinality(majors) <= 3)),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id),
  CONSTRAINT "profiles_username_check" CHECK ((username OPERATOR(extensions.~) '^[A-Za-z0-9_.]{3,24}$'::extensions.citext)),
  CONSTRAINT "profiles_username_key" UNIQUE (username)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."profiles" FROM "anon";

CREATE TABLE "public"."spot_hours" (
  "id"      uuid                   NOT NULL DEFAULT gen_random_uuid(),
  "spot_id" uuid                   NOT NULL,
  "opens"   time without time zone NOT NULL,
  "closes"  time without time zone NOT NULL,
  CONSTRAINT "spot_hours_not_empty" CHECK ((opens <> closes)),
  CONSTRAINT "spot_hours_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."spot_hours"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."spot_hours" FROM "anon";

CREATE TABLE "public"."spots" (
  "id"       uuid NOT NULL DEFAULT gen_random_uuid(),
  "place_id" uuid NOT NULL,
  "name"     text NOT NULL,
  CONSTRAINT "spots_pkey" PRIMARY KEY (id),
  CONSTRAINT "spots_place_id_name_key" UNIQUE (place_id, name)
);

ALTER TABLE "public"."spots"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."spots" FROM "anon";

CREATE TABLE "public"."user_settings" (
  "user_id" uuid NOT NULL,
  CONSTRAINT "user_settings_pkey" PRIMARY KEY (user_id)
);

ALTER TABLE "public"."user_settings"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."user_settings" FROM "anon";

CREATE TYPE "public"."ambience" AS ENUM (
  'quiet',
  'collaborative'
);

ALTER TABLE "public"."user_settings"
  ADD COLUMN "preferred_ambience" public.ambience;

CREATE TYPE "public"."amenity" AS ENUM (
  'outlets',
  'printers',
  'computers',
  'whiteboards',
  'tv_projector',
  'food_nearby',
  'drink_nearby'
);

CREATE TYPE "public"."college" AS ENUM (
  'architecture',
  'business',
  'civic_leadership',
  'communication',
  'education',
  'engineering',
  'fine_arts',
  'geosciences',
  'liberal_arts',
  'natural_sciences',
  'nursing',
  'pharmacy',
  'public_affairs',
  'social_work',
  'undergraduate_studies'
);

ALTER TABLE "public"."majors"
  ADD COLUMN "colleges" public.college[] NOT NULL;

CREATE TYPE "public"."id_required" AS ENUM (
  'none',
  'specific',
  'any',
  'unknown'
);

ALTER TABLE "public"."spot_hours"
  ADD COLUMN "id_required" public.id_required NOT NULL DEFAULT 'unknown'::public.id_required;

ALTER TABLE "public"."spot_hours"
  ADD COLUMN "created_at" timestamp WITH time zone NOT NULL DEFAULT now();

ALTER TABLE "public"."spot_hours"
  ADD COLUMN "id_colleges" public.college[] NOT NULL DEFAULT '{}'::public.college[];

ALTER TABLE "public"."spot_hours"
  ADD COLUMN "id_majors" text[] NOT NULL DEFAULT '{}'::text[];

CREATE TYPE "public"."spot_type" AS ENUM (
  'indoor',
  'outdoor'
);

ALTER TABLE "public"."spots"
  ADD COLUMN "type" public.spot_type NOT NULL;

ALTER TABLE "public"."spots"
  ADD COLUMN "floor" smallint;

ALTER TABLE "public"."spots"
  ADD COLUMN "ambience" public.ambience NOT NULL;

ALTER TABLE "public"."spots"
  ADD COLUMN "description" text;

ALTER TABLE "public"."spots"
  ADD COLUMN "photo_paths" text[] NOT NULL DEFAULT '{}'::text[];

ALTER TABLE "public"."spots"
  ADD COLUMN "latitude" double precision;

ALTER TABLE "public"."spots"
  ADD COLUMN "longitude" double precision;

ALTER TABLE "public"."user_settings"
  ADD COLUMN "preferred_spot_type" public.spot_type;

ALTER TABLE "public"."user_settings"
  ADD COLUMN "needs_wheelchair" boolean NOT NULL DEFAULT false;

ALTER TABLE "public"."user_settings"
  ADD COLUMN "location_enabled" boolean NOT NULL DEFAULT false;

ALTER TABLE "public"."user_settings"
  ADD COLUMN "created_at" timestamp WITH time zone NOT NULL DEFAULT now();

ALTER TABLE "public"."user_settings"
  ADD COLUMN "updated_at" timestamp WITH time zone NOT NULL DEFAULT now();

ALTER TABLE "public"."user_settings"
  ADD COLUMN "preferred_amenities" public.amenity[] NOT NULL DEFAULT '{}'::public.amenity[];

CREATE TYPE "public"."status" AS ENUM (
  'active',
  'inactive'
);

ALTER TABLE "public"."majors"
  ADD COLUMN "status" public.status NOT NULL DEFAULT 'active'::public.status;

ALTER TABLE "public"."majors"
  ADD COLUMN "aliases" text;

ALTER TABLE "public"."majors"
  ADD COLUMN "created_at" timestamp WITH time zone NOT NULL DEFAULT now();

ALTER TABLE "public"."majors"
  ADD COLUMN "updated_at" timestamp WITH time zone NOT NULL DEFAULT now();

ALTER TABLE "public"."places"
  ADD COLUMN "status" public.status NOT NULL DEFAULT 'active'::public.status;

ALTER TABLE "public"."places"
  ADD COLUMN "created_at" timestamp WITH time zone NOT NULL DEFAULT now();

ALTER TABLE "public"."places"
  ADD COLUMN "updated_at" timestamp WITH time zone NOT NULL DEFAULT now();

ALTER TABLE "public"."spots"
  ADD COLUMN "status" public.status NOT NULL DEFAULT 'active'::public.status;

ALTER TABLE "public"."spots"
  ADD COLUMN "created_at" timestamp WITH time zone NOT NULL DEFAULT now();

ALTER TABLE "public"."spots"
  ADD COLUMN "updated_at" timestamp WITH time zone NOT NULL DEFAULT now();

ALTER TABLE "public"."spots"
  ADD COLUMN "amenities" public.amenity[] NOT NULL DEFAULT '{}'::public.amenity[];

CREATE TYPE "public"."weekday" AS ENUM (
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat'
);

ALTER TABLE "public"."spot_hours"
  ADD COLUMN "weekdays" public.weekday[] NOT NULL;

CREATE OR REPLACE FUNCTION private.check_major_keys()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$declare
  keys text[];
  unknown_key text;
begin
  if tg_table_name = 'profiles' then
    keys := new.majors;
  else
    keys := new.id_majors;
  end if;

  if cardinality(keys) <> (select count(distinct k) from unnest(keys) as k) then
    raise exception 'The same major is listed more than once.' using errcode = '23514';
  end if;

  select k into unknown_key
    from unnest(keys) as k
   where not exists (select 1 from public.majors m where m.key = k)
   limit 1;
  if unknown_key is not null then
    raise exception 'Unknown major: %', unknown_key using errcode = '23503';
  end if;

  return new;
end;$function$;

CREATE OR REPLACE FUNCTION private.create_user_settings()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$BEGIN
  insert into public.user_settings (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return null;
END;$function$;

CREATE OR REPLACE FUNCTION private.set_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$BEGIN
  new.updated_at := now();
  return new;
END;$function$;

CREATE OR REPLACE FUNCTION private.update_spot()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$BEGIN
  if tg_op in ('UPDATE', 'DELETE') then
    update public.spots set updated_at = now() where id = old.spot_id;
  END if;
  if tg_op in ('INSERT', 'UPDATE') then
    update public.spots set updated_at = now() where id = new.spot_id;
  END if;
  return null;
END;$function$;

ALTER TABLE "public"."majors"
  ADD CONSTRAINT "majors_colleges_check" CHECK ((cardinality(colleges) >= 1));

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."spot_hours"
  ADD CONSTRAINT "spot_hours_id_lists" CHECK (((id_required = 'specific'::public.id_required) = ((cardinality(id_colleges) + cardinality(id_majors)) > 0)));

ALTER TABLE "public"."spot_hours"
  ADD CONSTRAINT "spot_hours_unique_period" UNIQUE (spot_id, weekdays, opens, id_required, id_colleges, id_majors);

ALTER TABLE "public"."spot_hours"
  ADD CONSTRAINT "spot_hours_weekdays_check" CHECK ((cardinality(weekdays) >= 1));

ALTER TABLE "public"."spots"
  ADD CONSTRAINT "spots_floor_check" CHECK (((floor >= '-5'::integer) AND (floor <= 50)));

ALTER TABLE "public"."spots"
  ADD CONSTRAINT "spots_lat_lng_pair" CHECK (((latitude IS NULL) = (longitude IS NULL)));

ALTER TABLE "public"."spots"
  ADD CONSTRAINT "spots_latitude_check" CHECK (((latitude >= ('-90'::integer)::double precision) AND (latitude <= (90)::double precision)));

ALTER TABLE "public"."spots"
  ADD CONSTRAINT "spots_longitude_check" CHECK (((longitude >= ('-180'::integer)::double precision) AND (longitude <= (180)::double precision)));

ALTER TABLE "public"."spot_hours"
  ADD CONSTRAINT "spot_hours_spot_id_fkey" FOREIGN KEY (spot_id) REFERENCES public.spots(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."spots"
  ADD CONSTRAINT "spots_place_id_fkey" FOREIGN KEY (place_id) REFERENCES public.places(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "public"."user_settings"
  ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE TRIGGER majors_set_updated_at
  BEFORE UPDATE ON public.majors
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER places_set_updated_at
  BEFORE UPDATE ON public.places
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER profiles_check_major_keys
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION private.check_major_keys();

CREATE TRIGGER profiles_create_user_settings
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION private.create_user_settings();

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER spot_hours_check_major_keys
  BEFORE INSERT OR UPDATE ON public.spot_hours
  FOR EACH ROW
  EXECUTE FUNCTION private.check_major_keys();

CREATE TRIGGER spot_hours_update_spot
  AFTER INSERT OR DELETE OR UPDATE ON public.spot_hours
  FOR EACH ROW
  EXECUTE FUNCTION private.update_spot();

CREATE TRIGGER spots_set_updated_at
  BEFORE UPDATE ON public.spots
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER user_settings_set_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE POLICY "majors_read" ON "public"."majors"
  FOR SELECT
  TO "authenticated"
  USING (true);

CREATE POLICY "places_read" ON "public"."places"
  FOR SELECT
  TO "authenticated"
  USING ((status = ANY (ARRAY['active'::public.status, 'inactive'::public.status])));

CREATE POLICY "profiles_insert_own" ON "public"."profiles"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((( SELECT auth.uid() AS uid) = id));

CREATE POLICY "profiles_read" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING (true);

CREATE POLICY "profiles_update_own" ON "public"."profiles"
  FOR UPDATE
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = id))
  WITH CHECK ((( SELECT auth.uid() AS uid) = id));

CREATE POLICY "spot_hours_read" ON "public"."spot_hours"
  FOR SELECT
  TO "authenticated"
  USING (true);

CREATE POLICY "spots_read" ON "public"."spots"
  FOR SELECT
  TO "authenticated"
  USING ((status = ANY (ARRAY['active'::public.status, 'inactive'::public.status])));

CREATE POLICY "user_settings_read_own" ON "public"."user_settings"
  FOR SELECT
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "user_settings_update_own" ON "public"."user_settings"
  FOR UPDATE
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id))
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "user_avatars_own_folder eq7zk6_0" ON "storage"."objects"
  FOR SELECT
  TO "authenticated"
  USING (((bucket_id = 'user_avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));

CREATE POLICY "user_avatars_own_folder eq7zk6_1" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((bucket_id = 'user_avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));

CREATE POLICY "user_avatars_own_folder eq7zk6_2" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING (((bucket_id = 'user_avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));

CREATE POLICY "user_avatars_own_folder eq7zk6_3" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING (((bucket_id = 'user_avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));

COMMENT ON EXTENSION "citext" IS 'data type for case-insensitive character strings';

COMMENT ON TABLE "public"."majors" IS 'UT undergraduate majors (currently)';

COMMENT ON TABLE "public"."places" IS 'generalized location (parent of spots)';

COMMENT ON TABLE "public"."profiles" IS 'user to user data (public currently)';

COMMENT ON TABLE "public"."spot_hours" IS 'open/close times for spots (considers college/major)';

COMMENT ON TABLE "public"."spots" IS 'specific location (child of places)';

COMMENT ON TABLE "public"."user_settings" IS 'private user preferences/app config';

COMMENT ON TYPE "public"."status" IS 'UI display discriminator';

REVOKE ALL ON TABLE "public"."majors" FROM "authenticated";

GRANT SELECT ON TABLE "public"."majors" TO "authenticated";

REVOKE ALL ON TABLE "public"."majors" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."majors" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."majors" TO "service_role";

REVOKE ALL ON TABLE "public"."places" FROM "anon";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."places" TO "anon";

REVOKE ALL ON TABLE "public"."places" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."places" TO "authenticated";

REVOKE ALL ON TABLE "public"."places" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."places" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."places" TO "service_role";

REVOKE ALL ON TABLE "public"."profiles" FROM "authenticated";

GRANT SELECT ON TABLE "public"."profiles" TO "authenticated";

REVOKE ALL ON TABLE "public"."profiles" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "service_role";

REVOKE ALL ON TABLE "public"."spot_hours" FROM "authenticated";

GRANT SELECT ON TABLE "public"."spot_hours" TO "authenticated";

REVOKE ALL ON TABLE "public"."spot_hours" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."spot_hours" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."spot_hours" TO "service_role";

REVOKE ALL ON TABLE "public"."spots" FROM "authenticated";

GRANT SELECT ON TABLE "public"."spots" TO "authenticated";

REVOKE ALL ON TABLE "public"."spots" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."spots" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."spots" TO "service_role";

REVOKE ALL ON TABLE "public"."user_settings" FROM "authenticated";

GRANT SELECT ON TABLE "public"."user_settings" TO "authenticated";

REVOKE ALL ON TABLE "public"."user_settings" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."user_settings" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."user_settings" TO "service_role";

