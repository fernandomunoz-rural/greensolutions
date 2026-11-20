import type { Metadata } from "next";
import { AdminPage, SetupNotice } from "@/components/admin/ui";
import { MemberForm } from "@/components/admin/member-form";
import { requirePage, isMissingTable } from "@/lib/admin/auth";
import { saveMember } from "../actions";

export const metadata: Metadata = { title: "Add person" };

export default async function NewMemberPage() {
  const { supabase } = await requirePage("admin", "/admin/team/new");
  const { data, error } = await supabase.from("team_members").select("team_group");
  const groups = [...new Set((data ?? []).map((r) => r.team_group as string))];
  return (
    <AdminPage title="Add person" back={{ href: "/admin/team", label: "Team" }}>
      {isMissingTable(error) ? <SetupNotice /> : <MemberForm action={saveMember} groups={groups} />}
    </AdminPage>
  );
}
