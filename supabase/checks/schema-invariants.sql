-- Security invariants for the applied schema. Run after every migration (CI does this on
-- PostgreSQL 17; tests/schema-invariants.test.ts does it on PGlite). Raises on the first violation.
do $$
declare
  offender text;
begin
  if not exists (select 1 from pg_tables where schemaname = 'public') then
    raise exception 'no public tables: migrations did not apply';
  end if;

  select string_agg(c.relname, ', ') into offender
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind in ('r', 'p') and not c.relrowsecurity;
  if offender is not null then raise exception 'row-level security is off on: %', offender; end if;

  select string_agg(format('%s (%s)', c.relname, r.rolname), ', ') into offender
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  cross join (values ('anon'), ('authenticated')) as r(rolname)
  where n.nspname = 'public' and c.relkind in ('r', 'p')
    and has_table_privilege(r.rolname, c.oid, 'INSERT,UPDATE,DELETE,TRUNCATE');
  if offender is not null then raise exception 'client roles can write tables directly: %', offender; end if;

  select string_agg(p.proname, ', ') into offender
  from pg_proc p where p.pronamespace = 'public'::regnamespace and p.prosecdef;
  if offender is not null then raise exception 'security definer functions in the exposed public schema: %', offender; end if;

  select string_agg(p.proname, ', ') into offender
  from pg_proc p
  where p.prosecdef and p.pronamespace = 'chisel_private'::regnamespace
    and not coalesce(p.proconfig @> array['search_path=""'], false);
  if offender is not null then raise exception 'security definer functions without an empty search_path: %', offender; end if;

  if has_schema_privilege('anon', 'chisel_private', 'USAGE') then
    raise exception 'anon can use the private schema';
  end if;

  select string_agg(p.proname, ', ') into offender
  from pg_proc p
  where p.pronamespace in ('public'::regnamespace, 'chisel_private'::regnamespace)
    and p.proname like 'chisel%' and has_function_privilege('anon', p.oid, 'EXECUTE');
  if offender is not null then raise exception 'anon can execute: %', offender; end if;
end
$$;
