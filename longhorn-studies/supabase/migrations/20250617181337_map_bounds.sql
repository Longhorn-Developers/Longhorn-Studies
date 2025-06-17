create or replace function spots_in_view(min_lat float, min_long float, max_lat float, max_long float)
returns setof public.spots_with_details
set search_path to ''
language sql
as $$
	select *
	from public.spots_with_details
	where location 
    operator(gis.&&) 
    gis.ST_SetSRID(gis.ST_MakeBox2D(gis.ST_Point(min_long, min_lat), gis.ST_Point(max_long, max_lat)), 4326)
$$;
