import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Avatar } from "@/components/avatar";
import { AdminPage, EmptyState, SetupNotice, StatusPill, btnPrimary, btnSecondary, cardCls, iconBtn } from "@/components/admin/ui";
import { requirePage, isMissingTable } from "@/lib/admin/auth";
import { groupTeam, type TeamMember } from "@/lib/team";
import { moveMember, toggleMember } from "./actions";

export const metadata: Metadata = { title: "Team" };

export default async function TeamAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const { supabase } = await requirePage("admin", "/admin/team");
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const addButton = (
    <Link href="/admin/team/new" className={btnPrimary}>
      <Icon.Plus className="h-4 w-4" /> Add person
    </Link>
  );

  if (isMissingTable(error)) {
    return (
      <AdminPage title="Team">
        <SetupNotice />
      </AdminPage>
    );
  }

  const groups = groupTeam((data ?? []) as TeamMember[]);
  const hiddenCount = (data ?? []).filter((m) => !m.is_active).length;

  return (
    <AdminPage
      title="Team"
      intro={
        <>
          The people shown on the home page and the{" "}
          <Link href="/team" target="_blank" className="font-semibold text-leaf hover:underline">
            Team page
          </Link>
          . Use the arrows to change the order.
          {hiddenCount ? ` ${hiddenCount} hidden.` : ""}
        </>
      }
      actions={addButton}
    >
      {saved ? (
        <p role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-800">
          {saved === "deleted" ? "Person removed." : "Saved. The website is updated."}
        </p>
      ) : null}

      {error ? <p className="mb-5 text-sm text-red-600">Couldn’t load the team: {error.message}</p> : null}

      {groups.length === 0 ? (
        <EmptyState icon={Icon.Users} title="No one on the team yet" body="Add the people behind Green Solutions." action={addButton} />
      ) : (
        <div className="space-y-8">
          {groups.map(({ group, members }) => (
            <section key={group}>
              <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
                {group} <span className="text-ink/30">· {members.length}</span>
              </h2>
              <ul className={`${cardCls} divide-y divide-line overflow-hidden`}>
                {members.map((m, i) => (
                  <li key={m.id} className={`flex items-center gap-3 px-3 py-3 sm:px-4 ${m.is_active ? "" : "bg-paper/70"}`}>
                    <div className="flex flex-col">
                      <form action={moveMember}>
                        <input type="hidden" name="id" value={m.id} />
                        <input type="hidden" name="dir" value="up" />
                        <button type="submit" disabled={i === 0} className={`${iconBtn} h-7 w-7`} aria-label={`Move ${m.name} up`}>
                          <Icon.ArrowUp className="h-3.5 w-3.5" />
                        </button>
                      </form>
                      <form action={moveMember}>
                        <input type="hidden" name="id" value={m.id} />
                        <input type="hidden" name="dir" value="down" />
                        <button
                          type="submit"
                          disabled={i === members.length - 1}
                          className={`${iconBtn} h-7 w-7`}
                          aria-label={`Move ${m.name} down`}
                        >
                          <Icon.ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>
                    <Avatar src={m.photo_url} name={m.name} className={`h-11 w-11 text-sm ${m.is_active ? "" : "opacity-50"}`} />
                    <div className="min-w-0 flex-1">
                      <Link href={`/admin/team/${m.id}`} className="block truncate font-semibold text-forest hover:underline">
                        {m.name}
                      </Link>
                      <p className="truncate text-xs text-ink/55">{m.title || "—"}</p>
                    </div>
                    {m.is_active ? null : <StatusPill tone="hidden">Hidden</StatusPill>}
                    <form action={toggleMember}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="visible" value={m.is_active ? "0" : "1"} />
                      <button
                        type="submit"
                        className={iconBtn}
                        aria-label={m.is_active ? `Hide ${m.name} from the website` : `Show ${m.name} on the website`}
                        title={m.is_active ? "Hide from website" : "Show on website"}
                      >
                        {m.is_active ? <Icon.Eye className="h-4 w-4" /> : <Icon.EyeOff className="h-4 w-4" />}
                      </button>
                    </form>
                    <Link href={`/admin/team/${m.id}`} className={`${btnSecondary} px-3 py-1.5`}>
                      <Icon.Pencil className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
