import type { Metadata } from "next";
import { Avatar } from "@/components/avatar";
import { AdminPage, SetupNotice, StatusPill, cardCls, timeAgo } from "@/components/admin/ui";
import { RoleSelect } from "@/components/admin/role-select";
import { requirePage, isMissingTable } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Users & roles" };

type Row = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
};

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const { supabase, viewer } = await requirePage("admin", "/admin/users");
  const { data, error } = await supabase.rpc("admin_list_users");

  if (isMissingTable(error)) {
    return (
      <AdminPage title="Users & roles">
        <SetupNotice />
      </AdminPage>
    );
  }

  const all = (data ?? []) as Row[];
  const needle = q.trim().toLowerCase();
  const rows = needle
    ? all.filter((r) => r.email.toLowerCase().includes(needle) || (r.full_name ?? "").toLowerCase().includes(needle))
    : all;
  const counts = { admin: 0, editor: 0, user: 0 } as Record<string, number>;
  for (const r of all) counts[r.role] = (counts[r.role] ?? 0) + 1;

  return (
    <AdminPage
      title="Users & roles"
      intro={`${all.length} account${all.length === 1 ? "" : "s"} · ${counts.admin} admin · ${counts.editor} editor. Editors write articles; admins can change everything.`}
    >
      <form className="mb-4" role="search">
        <label htmlFor="q" className="sr-only">
          Search users
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Search by name or email"
          className="w-full max-w-sm rounded-lg border border-line bg-white px-3.5 py-2 text-sm outline-none focus:border-forest"
        />
      </form>
      {error ? <p className="mb-4 text-sm text-red-600">Couldn’t load users: {error.message}</p> : null}
      <ul className={`${cardCls} divide-y divide-line overflow-hidden`}>
        {rows.map((u) => (
          <li key={u.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
            <Avatar src={u.avatar_url} name={u.full_name ?? u.email} className="h-9 w-9 text-xs" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-forest">
                {u.full_name || "No name"}
                {u.id === viewer.userId ? <span className="ml-2 font-normal text-ink/45">(you)</span> : null}
              </p>
              <p className="truncate text-xs text-ink/55">
                {u.email}
                <span className="hidden sm:inline">
                  {" "}
                  · joined {timeAgo(u.created_at)}
                  {u.last_sign_in_at ? ` · last seen ${timeAgo(u.last_sign_in_at)}` : ""}
                </span>
              </p>
            </div>
            {u.id === viewer.userId ? (
              <StatusPill tone="neutral">Admin</StatusPill>
            ) : (
              <RoleSelect userId={u.id} role={u.role} name={u.full_name || u.email} />
            )}
          </li>
        ))}
        {rows.length === 0 ? <li className="px-5 py-10 text-center text-sm text-ink/55">No matching accounts.</li> : null}
      </ul>
    </AdminPage>
  );
}
