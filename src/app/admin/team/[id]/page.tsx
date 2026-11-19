import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { AdminPage, btnDanger } from "@/components/admin/ui";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { MemberForm } from "@/components/admin/member-form";
import { requirePage } from "@/lib/admin/auth";
import type { TeamMember } from "@/lib/team";
import { deleteMember, saveMember } from "../actions";

export const metadata: Metadata = { title: "Edit person" };

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requirePage("admin", `/admin/team/${id}`);
  const [{ data }, { data: all }] = await Promise.all([
    supabase.from("team_members").select("*").eq("id", id).maybeSingle(),
    supabase.from("team_members").select("team_group"),
  ]);
  if (!data) notFound();
  const member = data as TeamMember;
  const groups = [...new Set((all ?? []).map((r) => r.team_group as string))];

  return (
    <AdminPage
      title={member.name}
      back={{ href: "/admin/team", label: "Team" }}
      actions={
        <form action={deleteMember}>
          <input type="hidden" name="id" value={member.id} />
          <ConfirmSubmit
            message={`Remove ${member.name} from the team? To keep them but take them off the website, use “Show on the website” instead.`}
            className={btnDanger}
            pendingLabel="Removing…"
          >
            <Icon.Trash className="h-4 w-4" /> Remove
          </ConfirmSubmit>
        </form>
      }
    >
      <MemberForm action={saveMember} member={member} groups={groups} />
    </AdminPage>
  );
}
