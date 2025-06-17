-- Create a dedicated separate schema
create schema if not exists "gis";

create extension postgis with schema "gis";

alter table public.spots
add column location gis.geography(Point, 4326) not null;

create index on public.spots using gist(location);

GRANT USAGE ON SCHEMA gis TO anon, authenticated, service_role;

create or replace view public.spots_with_details as
select 
  s.id,
  s.title,
  s.body,
  s.user_id,
  s.created_at,
  s.updated_at,
  s.location,
  -- Extract coordinates from PostGIS geography point
  gis.st_y(s.location::gis.geometry)::float8 as latitude,
  gis.st_x(s.location::gis.geometry)::float8 as longitude,
  -- Aggregate media as JSONB array
  coalesce(
    jsonb_agg(
      distinct jsonb_build_object(
        'id', m.id,
        'storage_key', m.storage_key,
        'position', m.position,
        'created_at', m.created_at
      )
    ) filter (where m.id is not null),
    '[]'::jsonb
  ) as media,
  -- Aggregate tags as JSONB array
  coalesce(
    jsonb_agg(
      distinct jsonb_build_object(
        'id', t.id,
        'label', t.label,
        'slug', t.slug,
        'is_system', t.is_system
      )
    ) filter (where t.id is not null),
    '[]'::jsonb
  ) as tags
from 
  public.spots s
left join 
  public.media m on s.id = m.spot_id
left join 
  public.spot_tags st on s.id = st.spot_id
left join 
  public.tags t on st.tag_id = t.id
group by 
  s.id, s.title, s.body, s.user_id, s.created_at, s.updated_at, s.location;

-- Grant access to the view
grant select on public.spots_with_details to anon, authenticated, service_role;
