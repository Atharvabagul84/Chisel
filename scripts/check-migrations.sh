#!/usr/bin/env bash
# Applies every Supabase migration, in filename order, to an empty PostgreSQL database and then
# checks the schema's security invariants. CI runs this against PostgreSQL 17; it never touches a
# hosted Supabase project. Usage: DATABASE_URL=postgres://... scripts/check-migrations.sh
set -euo pipefail
: "${DATABASE_URL:?Set DATABASE_URL to an empty PostgreSQL database}"
cd "$(dirname "$0")/.."

run_sql() { psql "$DATABASE_URL" --no-psqlrc --quiet -v ON_ERROR_STOP=1 -f "$1"; }

# Supabase provides these roles and auth.uid()/auth.jwt(); plain PostgreSQL needs the test stub.
run_sql tests/fixtures/supabase-auth.sql
for migration in supabase/migrations/*.sql; do
  echo "Applying $migration"
  run_sql "$migration"
done
run_sql supabase/checks/schema-invariants.sql
echo "All migrations applied and schema invariants hold."
