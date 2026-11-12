-- Table permissions for app's two API roles (table and column perms).
--   anon          = signed-out visitors: no access to any table.
--   authenticated = signed-in students: only what is granted below.
-- Written by hand on purpose: `supabase db pull` doesn't capture per-column permissions, and the
-- dashboard can reset a table's permissions. Safe to run more than once.

-- 1. Revokes permissions on every table
revoke all on table public.majors, public.places, public.spots, public.spot_hours,
                    public.profiles, public.user_settings
  from anon, authenticated;

-- 2. Provides full access to using the secret key (service_role is supa default)
grant all on table public.majors, public.places, public.spots, public.spot_hours,
                   public.profiles, public.user_settings
  to service_role;

-- 3. Allows signed-in users to view spot catalog
grant select on table public.majors, public.places, public.spots, public.spot_hours
  to authenticated;

-- 4. Auth user profiles access. Every profile can be read (profiles_read). A student can
--    create and edit ONLY their own rows (profiles_insert_own, profiles_update_own).
grant select on table public.profiles to authenticated;
grant insert (id, username, display_name, avatar_path, bio, graduation_year, majors)
  on table public.profiles to authenticated;
grant update (username, display_name, avatar_path, bio, graduation_year, majors)
  on table public.profiles to authenticated;

-- 5. Auth user settings access. A student can read and edit ONLY their own rows
--    (user_settings_read_own, user_settings_update_own).
grant select on table public.user_settings to authenticated;
grant update (preferred_ambience, preferred_spot_type, preferred_amenities,
              needs_wheelchair, location_enabled)
  on table public.user_settings to authenticated;