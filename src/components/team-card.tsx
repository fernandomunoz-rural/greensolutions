import { Icon } from "./icons";
import { memberAnchor, type TeamMember } from "@/lib/team";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TeamPhoto({ member, className = "" }: { member: TeamMember; className?: string }) {
  return member.photo_url ? (
    // eslint-disable-next-line @next/next/no-img-element -- storage URL
    <img src={member.photo_url} alt={`Photo of ${member.name}`} loading="lazy" className={`object-cover ${className}`} />
  ) : (
    <span
      aria-hidden="true"
      className={`font-display flex items-center justify-center bg-gradient-to-br from-forest to-forest-700 font-semibold text-mint ${className}`}
    >
      {initials(member.name)}
    </span>
  );
}

/** Compact card for the home page grid. Links to the person on /team. */
export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <a
      href={`/team#${memberAnchor(member.name)}`}
      className="group flex flex-col rounded-xl border border-line bg-white p-5 transition-colors hover:border-forest/25"
    >
      <div className="flex items-center gap-4">
        <TeamPhoto member={member} className="h-14 w-14 shrink-0 rounded-full text-base" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-forest">{member.name}</p>
          {member.title ? <p className="truncate text-xs text-ink/55">{member.title}</p> : null}
        </div>
      </div>
      {member.summary ? <p className="mt-4 text-sm leading-relaxed text-ink/60">{member.summary}</p> : null}
    </a>
  );
}

/** Full profile for the /team page. */
export function TeamProfile({ member }: { member: TeamMember }) {
  const paragraphs = (member.bio || "").split(/\n{2,}/).filter(Boolean);
  return (
    <article id={memberAnchor(member.name)} className="scroll-mt-24 overflow-hidden rounded-xl border border-line bg-white">
      <TeamPhoto member={member} className="aspect-[4/3] w-full text-4xl" />
      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-forest">{member.name}</h3>
        {member.title ? <p className="mt-0.5 text-sm font-medium text-leaf">{member.title}</p> : null}
        {member.summary ? <p className="mt-3 text-sm leading-relaxed text-ink/70">{member.summary}</p> : null}
        {paragraphs.map((p, i) => (
          <p key={i} className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/60">
            {p}
          </p>
        ))}
        {member.email || member.linkedin_url ? (
          <div className="mt-5 flex gap-2 border-t border-line pt-4">
            {member.email ? (
              <a
                href={`mailto:${member.email}`}
                aria-label={`Email ${member.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/55 ring-1 ring-line hover:text-forest"
              >
                <Icon.Mail className="h-4 w-4" />
              </a>
            ) : null}
            {member.linkedin_url ? (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/55 ring-1 ring-line hover:text-forest"
              >
                <Icon.Linkedin className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
