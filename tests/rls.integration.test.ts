// Runs against a real Supabase (local Docker stack: `npx supabase start`, then
// apply supabase/schema.sql, content.sql, admin.sql). Reads keys from
// .env.test.local. Skips itself when that file is missing.
import { readFileSync, existsSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function loadEnv(): Record<string, string> | null {
  const file = ".env.test.local";
  if (!existsSync(file)) return null;
  return Object.fromEntries(
    readFileSync(file, "utf8")
      .split(/\r?\n/)
      .filter((l) => l.includes("=") && !l.startsWith("#"))
      .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
  );
}

const env = loadEnv();
const run = env ? describe : describe.skip;
const opts = { auth: { persistSession: false, autoRefreshToken: false } };

run("row level security (real database)", () => {
  let service: SupabaseClient;
  let anon: SupabaseClient;
  const users: Record<"admin" | "editor" | "user", { id: string; client: SupabaseClient }> = {} as never;
  const stamp = Date.now();

  async function makeUser(kind: "admin" | "editor" | "user") {
    const email = `${kind}-${stamp}@test.local`;
    const password = `pw-${stamp}-${kind}-Aa1!`;
    const { data, error } = await service.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: `Test ${kind}` },
    });
    if (error) throw error;
    const id = data.user.id;
    if (kind !== "user") {
      const { error: e } = await service.from("profiles").update({ role: kind }).eq("id", id);
      if (e) throw e;
    }
    const client = createClient(env!.SUPABASE_URL, env!.SUPABASE_ANON_KEY, opts);
    const { error: se } = await client.auth.signInWithPassword({ email, password });
    if (se) throw se;
    users[kind] = { id, client };
  }

  beforeAll(async () => {
    service = createClient(env!.SUPABASE_URL, env!.SUPABASE_SERVICE_ROLE_KEY, opts);
    anon = createClient(env!.SUPABASE_URL, env!.SUPABASE_ANON_KEY, opts);
    await makeUser("admin");
    await makeUser("editor");
    await makeUser("user");
  });

  // Leave the database as we found it: versions published by the test admin,
  // the draft, and the test accounts (posts/team rows cascade or are removed
  // inside each test).
  afterAll(async () => {
    if (!users.admin) return;
    await service.from("site_content_versions").delete().eq("published_by", users.admin.id);
    await service.from("site_content_draft").delete().eq("updated_by", users.admin.id);
    await service.from("site_content_draft").delete().contains("content", { hero: { title: `Draft ${stamp}` } });
    for (const u of Object.values(users)) await service.auth.admin.deleteUser(u.id);
  });

  describe("roles", () => {
    it("a user cannot promote themselves", async () => {
      const { error } = await users.user.client.from("profiles").update({ role: "admin" }).eq("id", users.user.id);
      expect(error?.message).toMatch(/Only admins/);
    });

    it("an editor cannot promote themselves", async () => {
      const { error } = await users.editor.client
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", users.editor.id);
      expect(error?.message).toMatch(/Only admins/);
    });

    it("a user can still edit their own name", async () => {
      const { error } = await users.user.client
        .from("profiles")
        .update({ full_name: "Renamed" })
        .eq("id", users.user.id);
      expect(error).toBeNull();
    });

    it("an admin cannot change their own role", async () => {
      const { error } = await users.admin.client.from("profiles").update({ role: "user" }).eq("id", users.admin.id);
      expect(error?.message).toMatch(/own role/);
    });

    it("an admin can change someone else's role", async () => {
      const c = users.admin.client;
      const { error } = await c.from("profiles").update({ role: "editor" }).eq("id", users.user.id);
      expect(error).toBeNull();
      await c.from("profiles").update({ role: "user" }).eq("id", users.user.id);
      const { data } = await service.from("profiles").select("role").eq("id", users.user.id).single();
      expect(data?.role).toBe("user");
    });

    it("only admins can list users with emails", async () => {
      const { error } = await users.user.client.rpc("admin_list_users");
      expect(error).not.toBeNull();
      const { error: anonErr } = await anon.rpc("admin_list_users");
      expect(anonErr).not.toBeNull();
      const { data, error: adminErr } = await users.admin.client.rpc("admin_list_users");
      expect(adminErr).toBeNull();
      const me = (data as { id: string; email: string }[]).find((r) => r.id === users.admin.id);
      expect(me?.email).toBe(`admin-${stamp}@test.local`);
    });
  });

  describe("site content", () => {
    it("only admins can read or write the draft", async () => {
      const draft = { id: 1, content: { hero: { title: `Draft ${stamp}` } } };
      const { error } = await users.admin.client.from("site_content_draft").upsert(draft);
      expect(error).toBeNull();

      for (const c of [anon, users.user.client, users.editor.client]) {
        const { data } = await c.from("site_content_draft").select("*");
        expect(data ?? []).toEqual([]);
        const { error: w } = await c.from("site_content_draft").upsert({ id: 1, content: {} });
        expect(w).not.toBeNull();
      }
    });

    it("admins publish versions; everyone reads them; nobody edits them", async () => {
      const a = users.admin.client;
      const { data: v, error } = await a
        .from("site_content_versions")
        .insert({ content: { hero: { title: `Live ${stamp}` } }, changed_keys: ["hero.title"], published_by: users.admin.id })
        .select("id")
        .single();
      expect(error).toBeNull();

      const { data: latest } = await anon
        .from("site_content_versions")
        .select("id, content")
        .order("id", { ascending: false })
        .limit(1)
        .single();
      expect(latest?.id).toBe(v!.id);

      // Cannot forge another publisher, and non-admins cannot publish.
      const forged = await a
        .from("site_content_versions")
        .insert({ content: {}, published_by: users.editor.id });
      expect(forged.error).not.toBeNull();
      const byEditor = await users.editor.client
        .from("site_content_versions")
        .insert({ content: {}, published_by: users.editor.id });
      expect(byEditor.error).not.toBeNull();

      // Updates silently match zero rows under RLS.
      await a.from("site_content_versions").update({ content: {} }).eq("id", v!.id);
      const { data: still } = await service.from("site_content_versions").select("content").eq("id", v!.id).single();
      expect(still?.content).toEqual({ hero: { title: `Live ${stamp}` } });
    });
  });

  describe("team", () => {
    it("is seeded", async () => {
      const { count } = await service.from("team_members").select("*", { count: "exact", head: true });
      expect(count).toBeGreaterThanOrEqual(6);
    });

    it("hidden members are invisible to the public, visible to admins", async () => {
      const a = users.admin.client;
      const { data: m, error } = await a
        .from("team_members")
        .insert({ name: `Hidden ${stamp}`, is_active: false })
        .select("id")
        .single();
      expect(error).toBeNull();
      const pub = await anon.from("team_members").select("id").eq("id", m!.id);
      expect(pub.data).toEqual([]);
      const adm = await a.from("team_members").select("id").eq("id", m!.id);
      expect(adm.data).toHaveLength(1);
      await a.from("team_members").delete().eq("id", m!.id);
    });

    it("editors and users cannot change the team", async () => {
      for (const c of [users.editor.client, users.user.client, anon]) {
        const { error } = await c.from("team_members").insert({ name: "Nope" });
        expect(error).not.toBeNull();
      }
    });
  });

  describe("articles", () => {
    it("editors write their own posts only; users cannot post", async () => {
      const e = users.editor.client;
      const { data: p, error } = await e
        .from("posts")
        .insert({ author_id: users.editor.id, title: "Mine", slug: `mine-${stamp}`, body: "x" })
        .select("id")
        .single();
      expect(error).toBeNull();

      const { data: adminPost } = await users.admin.client
        .from("posts")
        .insert({ author_id: users.admin.id, title: "Admin's", slug: `admins-${stamp}`, body: "x" })
        .select("id")
        .single();
      await e.from("posts").update({ title: "Hijacked" }).eq("id", adminPost!.id);
      const { data: check } = await service.from("posts").select("title").eq("id", adminPost!.id).single();
      expect(check?.title).toBe("Admin's");

      const { error: userErr } = await users.user.client
        .from("posts")
        .insert({ author_id: users.user.id, title: "x", slug: `u-${stamp}`, body: "" });
      expect(userErr).not.toBeNull();

      // Drafts are not public.
      const { data: pub } = await anon.from("posts").select("id").eq("id", p!.id);
      expect(pub).toEqual([]);

      await service.from("posts").delete().in("id", [p!.id, adminPost!.id]);
    });
  });

  describe("storage", () => {
    it("only admins can upload site media", async () => {
      const file = new Blob(["x"], { type: "image/png" });
      const byEditor = await users.editor.client.storage.from("site-media").upload(`t/${stamp}.png`, file);
      expect(byEditor.error).not.toBeNull();
      const byAdmin = await users.admin.client.storage.from("site-media").upload(`t/${stamp}.png`, file);
      expect(byAdmin.error).toBeNull();
      await users.admin.client.storage.from("site-media").remove([`t/${stamp}.png`]);
    });
  });
});
