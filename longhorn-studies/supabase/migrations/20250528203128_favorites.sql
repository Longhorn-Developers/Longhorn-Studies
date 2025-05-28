-- ============================================================================
-- Favorites
-- ============================================================================
create table public.favorites (
  user_id uuid references auth.users(id) on delete cascade,
  spot_id uuid references spots(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, spot_id)
);

-- Enable row level security
alter table public.favorites enable row level security;

-- Users can only manage their own favorites
create policy "Users can manage their favorites" on public.favorites
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Create view to join favorites with spot details for easier querying
create or replace view public.spot_favorites as
select 
  f.created_at as favorited_at,
  s.*
from 
  public.favorites f
join 
  public.spots_with_details s on f.spot_id = s.id;
