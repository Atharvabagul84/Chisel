import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

// Runs the same invariant check CI runs on PostgreSQL 17 (scripts/check-migrations.sh).
const read = (path: string) => readFile(join(process.cwd(), path), "utf8");
const migratedDatabase = async () => {
  const db = new PGlite();
  await db.exec(await read("tests/fixtures/supabase-auth.sql"));
  for (const file of (await readdir(join(process.cwd(), "supabase/migrations"))).filter((name) => name.endsWith(".sql")).sort()) {
    await db.exec(await read(join("supabase/migrations", file)));
  }
  return db;
};

test("the migrated schema meets the security invariants", async () => {
  const db = await migratedDatabase();
  await db.exec(await read("supabase/checks/schema-invariants.sql"));
  await db.close();
});

test("the invariant check rejects tables without RLS, direct client writes and exposed definer functions", async () => {
  const invariants = await read("supabase/checks/schema-invariants.sql");
  const cases = [
    ["create table public.leak (id int)", /row-level security is off on: leak/],
    ["create table public.leak (id int); alter table public.leak enable row level security; grant insert on public.leak to authenticated", /client roles can write tables directly: leak \(authenticated\)/],
    ["create function public.chisel_leak() returns int language sql security definer as 'select 1'", /security definer functions in the exposed public schema: chisel_leak/],
  ] as const;
  for (const [change, message] of cases) {
    const db = await migratedDatabase();
    await db.exec(change);
    await assert.rejects(db.exec(invariants), message);
    await db.close();
  }
});
