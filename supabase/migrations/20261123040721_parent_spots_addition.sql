-- Allows spots to be parents of other spots (so we can have rooms be "children" of other spots without a redundant table)
-- Rules I decided on:
--   * Parents can only have one level of children. No children of children or self referencing (cycles).
--   * Children must be in the same place as its parent (the foreign key matches both columns).
--   * Parent spots with children can't be deleted; they should be hidden with inactive status instead.
--   * Child spots may repeat names but parent spots need unique names within their place.
-- ALSO, child spots are only displayed on parent spot cards so filtering for inactive child spots/handling child spot data inheritance isn't needed.

alter table public.spots
  add column parent_spot_id uuid;

-- Parent spot_id + place_id combined foreign key for parent spot uniqueness
alter table public.spots
  add constraint spots_id_place_id_key unique (id, place_id);

alter table public.spots
  add constraint spots_parent_spot_fkey
    foreign key (parent_spot_id, place_id) references public.spots (id, place_id)
    on update cascade on delete restrict,
  add constraint spots_not_own_parent check (parent_spot_id <> id);

-- Child spots may share names constraint
alter table public.spots
  drop constraint spots_place_id_name_key;
create unique index spots_top_level_name_key on public.spots (place_id, name)
  where parent_spot_id is null;

-- Allows easy lookups for a place's spots or a parent's children
create index spots_place_id_idx on public.spots (place_id);
create index spots_parent_spot_id_idx on public.spots (parent_spot_id);

-- Trigger for ensuring only single level children
create or replace function private.check_spot_parent()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.parent_spot_id is null then
    return new;
  end if;
  if exists (select 1 from public.spots where id = new.parent_spot_id and parent_spot_id is not null) then
    raise exception 'A child spot can''t have children of its own (one level only).' using errcode = '23514';
  end if;
  if exists (select 1 from public.spots where parent_spot_id = new.id) then
    raise exception 'This spot has children, so it can''t become a child itself.' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger spots_check_parent
  before insert or update of parent_spot_id on public.spots
  for each row execute function private.check_spot_parent();

