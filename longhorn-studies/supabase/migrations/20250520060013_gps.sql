-- Create a dedicated separate schema
create schema if not exists "gis";

create extension postgis with schema "gis";

alter table public.spots
add column location gis.geography(Point, 4326) not null;

create index on public.spots using gist(location);
