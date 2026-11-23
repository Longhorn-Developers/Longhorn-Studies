-- Added reservation link, room number and estimated capacity to SPOTS table. All NULLable if we don't have that data.
-- forces links to start with "https://" + standard constraints for room name and capacity
alter table public.spots
  add column booking_url text,
  add column room text,
  add column capacity integer,
  add constraint spots_booking_url_check check (booking_url ~ '^https://'),
  add constraint spots_room_check check (char_length(room) between 1 and 20),
  add constraint spots_capacity_check check (capacity > 0);

-- Removed needs_wheelchair column from user settings since we areen't tracking that anymore
alter table public.user_settings
  drop column needs_wheelchair;