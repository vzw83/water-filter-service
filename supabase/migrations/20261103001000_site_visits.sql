create table if not exists public.site_visits (
  session_id uuid primary key,
  visited_at timestamptz not null default now()
);

create index if not exists site_visits_visited_at_idx
  on public.site_visits (visited_at desc);

alter table public.site_visits enable row level security;
revoke all on table public.site_visits from anon, authenticated;
grant insert (session_id) on table public.site_visits to anon, authenticated;

drop policy if exists "Visitors can register a visit" on public.site_visits;
create policy "Visitors can register a visit"
  on public.site_visits for insert to anon, authenticated
  with check (session_id is not null);

create or replace function public.admin_visit_stats(
  p_period text,
  p_bucket_count integer default 14
)
returns table (bucket_start timestamptz, visits bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_count integer := greatest(1, least(coalesce(p_bucket_count, 14), 60));
  v_step interval;
  v_start timestamptz;
  v_end timestamptz;
begin
  if not public.is_admin() then
    raise insufficient_privilege using message = 'Administrator access required';
  end if;

  if p_period not in ('day', 'week', 'month', 'year') then
    raise invalid_parameter_value using message = 'Unsupported statistics period';
  end if;

  v_step := case p_period
    when 'day' then interval '1 day'
    when 'week' then interval '1 week'
    when 'month' then interval '1 month'
    else interval '1 year'
  end;
  v_end := date_trunc(p_period, now());
  v_start := v_end - ((v_count - 1) * v_step);

  return query
    with buckets as (
      select generate_series(v_start, v_end, v_step) as period_start
    )
    select buckets.period_start, count(site_visits.session_id)::bigint
    from buckets
    left join public.site_visits
      on date_trunc(p_period, site_visits.visited_at) = buckets.period_start
    group by buckets.period_start
    order by buckets.period_start;
end;
$$;

revoke all on function public.admin_visit_stats(text, integer) from public, anon;
grant execute on function public.admin_visit_stats(text, integer) to authenticated;
