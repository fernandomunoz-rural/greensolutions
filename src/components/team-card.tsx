import Link from "next/link";
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

// Tiles without a portrait take one of these in turn, so a row of
// initials reads as a set of colours, not a row of blanks.
const TINTS = ["bg-field text-accent", "bg-sea text-on-sea-soft", "bg-accent text-field", "bg-ink text-accent"];

function Portrait({ member, index }: { member: TeamMember; index: number }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden" data-ui={member.photo_url ? undefined : ""}>
      {member.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- storage URL
        <img
          src={member.photo_url}
          alt={`Portrait of ${member.name}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
        />
      ) : (
        <span
          aria-hidden="true"
          className={`display flex h-full w-full items-end p-6 text-[clamp(3rem,2rem+3vw,5rem)] ${TINTS[index % TINTS.length]}`}
        >
          {initials(member.name)}
        </span>
      )}
    </div>
  );
}

/** Home page: portrait, name and office; links to the full profile. */
export function MemberTile({ member, index = 0 }: { member: TeamMember; index?: number }) {
  return (
    <Link
      href={`/team#${memberAnchor(member.name)}`}
      data-reveal
      style={{ ["--i" as string]: index % 4 }}
      className="group flex flex-col overflow-hidden rounded-[8px] bg-ground-2 transition-colors hover:bg-ground-3"
    >
      <Portrait member={member} index={index} />
      <div className="p-5">
        <p className="font-semibold leading-tight text-ink">{member.name}</p>
        <p className="mt-1 text-[length:var(--text-small)] text-ink-soft">{member.title}</p>
      </div>
    </Link>
  );
}

/** Team page: the full profile as one tile. */
export function TeamProfile({ member, index = 0 }: { member: TeamMember; index?: number }) {
  const bio = (member.bio || "").split(/\n{2,}/).filter(Boolean);
  return (
    <article
      id={memberAnchor(member.name)}
      data-reveal
      style={{ ["--i" as string]: index % 3 }}
      className="group flex scroll-mt-24 flex-col overflow-hidden rounded-[8px] bg-ground-2"
    >
      <Portrait member={member} index={index} />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[length:var(--text-lead)] font-semibold leading-tight tracking-[-0.01em] text-ink">{member.name}</h3>
        <p className="mt-1 text-[length:var(--text-small)] text-ink-soft">{member.title}</p>
        {member.summary ? <p className="mt-4 text-ink">{member.summary}</p> : null}
        {bio.map((p, i) => (
          <p key={i} className="mt-3 whitespace-pre-line text-ink">
            {p}
          </p>
        ))}
        {member.email || member.linkedin_url ? (
          <p className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-6 text-[length:var(--text-small)] font-medium">
            {member.email ? (
              <a href={`mailto:${member.email}`} className="text-field underline decoration-1 underline-offset-4 hover:text-ink">
                {member.email}
              </a>
            ) : null}
            {member.linkedin_url ? (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-field underline decoration-1 underline-offset-4 hover:text-ink"
              >
                LinkedIn
              </a>
            ) : null}
          </p>
        ) : null}
      </div>
    </article>
  );
}
