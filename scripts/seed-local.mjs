// Creates test accounts in the LOCAL Supabase (Docker) for trying the admin.
// Usage: node scripts/seed-local.mjs   (reads .env.test.local)
// Never point this at the hosted project: it refuses non-local URLs.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(".env.test.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);
if (!/^http:\/\/(127\.0\.0\.1|localhost)[:/]/.test(env.SUPABASE_URL)) {
  console.error("Refusing: SUPABASE_URL is not a local address.");
  process.exit(1);
}

// Local-only test accounts.
const PASSWORD = "local-admin-123";
const ACCOUNTS = [
  { email: "admin@test.local", name: "Ada Admin", role: "admin" },
  { email: "editor@test.local", name: "Eddie Editor", role: "editor" },
  { email: "user@test.local", name: "Uma User", role: "user" },
];

const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { data: list } = await db.auth.admin.listUsers({ perPage: 1000 });
for (const a of ACCOUNTS) {
  let user = list.users.find((u) => u.email === a.email);
  if (!user) {
    const { data, error } = await db.auth.admin.createUser({
      email: a.email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: a.name },
    });
    if (error) throw error;
    user = data.user;
  }
  const { error } = await db.from("profiles").update({ role: a.role, full_name: a.name }).eq("id", user.id);
  if (error) throw error;
  console.log(`${a.role.padEnd(6)} ${a.email}`);
}
console.log(`Password for all: see PASSWORD in scripts/seed-local.mjs`);
