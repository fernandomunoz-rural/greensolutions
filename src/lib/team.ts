// Team member type + the fallback list. Pure module (client-safe).

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  team_group: string;
  summary: string;
  bio: string;
  photo_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export const TEAM_LIMITS = {
  name: 80,
  title: 100,
  team_group: 60,
  summary: 280,
  bio: 2000,
  email: 120,
  linkedin_url: 300,
} as const;

/** Shown only when the team table can't be read (e.g. before admin.sql runs). */
export const FALLBACK_TEAM: TeamMember[] = [
  ["Cody Dean", "Strategy & Planning Office", "Project direction, planning, coordination, and documentation."],
  ["Maurice Curry", "Agriculture Office", "Applied agriculture, growing guidance, and practical agricultural support."],
  ["Fatma Adem", "Finance & Resources Office", "Budgeting, funding coordination, and resource management."],
  ["Fernando Muñoz", "Technology & Systems Office", "Software development, AI tools, data systems, and workflows."],
  ["Luis Torres", "Outreach & Education Office", "Communication, education, design, and community engagement."],
  ["Michelle Outten", "Research & Development Office", "Research, testing, refinement, and product development."],
].map(([name, title, summary], i) => ({
  id: `fallback-${i}`,
  name,
  title,
  team_group: "Leadership",
  summary,
  bio: "",
  photo_url: null,
  email: null,
  linkedin_url: null,
  sort_order: i + 1,
  is_active: true,
}));

/**
 * Group members by `team_group`. Groups come in the order they were started
 * (the group whose oldest member was added first leads); inside a group,
 * members follow `sort_order`. Without timestamps, first-seen order is kept.
 */
export function groupTeam(members: TeamMember[]): { group: string; members: TeamMember[] }[] {
  const groups = new Map<string, { members: TeamMember[]; first: string }>();
  for (const m of members) {
    const g = groups.get(m.team_group) ?? { members: [], first: m.created_at ?? "" };
    g.members.push(m);
    if (m.created_at && (!g.first || m.created_at < g.first)) g.first = m.created_at;
    groups.set(m.team_group, g);
  }
  return [...groups.entries()]
    .map(([group, g], index) => ({ group, g, index }))
    .sort((a, b) => (a.g.first && b.g.first ? a.g.first.localeCompare(b.g.first) : 0) || a.index - b.index)
    .map(({ group, g }) => ({ group, members: g.members.sort((a, b) => a.sort_order - b.sort_order) }));
}

/** Everyone in display order: group by group, then by position. */
export function orderTeam(members: TeamMember[]): TeamMember[] {
  return groupTeam(members).flatMap((g) => g.members);
}

/** Stable slug for anchors, e.g. "maurice-curry". */
export function memberAnchor(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
