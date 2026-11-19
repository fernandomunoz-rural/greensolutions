import Link from "next/link";
import { memberAnchor, type TeamMember } from "@/lib/team";
import { Arrow } from "./ui";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Without a portrait: the initials as a serif monogram, alternating two calm tones.
const MONO = ["bg-ground-2 text-field", "bg-field text-accent"];

function Portrait({ member, index }: { member: TeamMember; index: number }) {
  return (
    <div data-reveal="clip" style={{ ["--i" as string]: index % 4 }} className="relative aspect-[4/5] overflow-hidden rounded-[20px]">
      {member.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- storage URL
        <img
          src={member.photo_url}
          alt={`Portrait of ${member.name}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.05]"
        />
      ) : (
        <span
          aria-hidden="true"
          data-ui=""
          className={`flex h-full w-full items-center justify-center font-serif text-[clamp(4rem,3rem+4vw,7rem)] italic transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.05] ${MONO[index % MONO.length]}`}
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
    <Link href={`/team#${memberAnchor(member.name)}`} className="group block">
      <Portrait member={member} index={index} />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-medium leading-tight tracking-[-0.01em] text-ink">
            <span className="line-link">{member.name}</span>
          </p>
          <p className="mt-1 text-[length:var(--text-small)] text-ink-soft">{member.title}</p>
        </div>
        <Arrow className="mt-1 shrink-0 text-ink-soft" />
      </div>
    </Link>
  );
}

/** Team page: the full profile. */
export function TeamProfile({ member, index = 0 }: { member: TeamMember; index?: number }) {
  const bio = (member.bio || "").split(/\n{2,}/).filter(Boolean);
  return (
    <article id={memberAnchor(member.name)} className="group scroll-mt-28">
      <Portrait member={member} index={index} />
      <div data-reveal style={{ ["--i" as string]: index % 4 }} className="mt-5">
        <h3 className="text-[length:var(--text-lead)] font-medium leading-tight tracking-[-0.03em] text-ink">{member.name}</h3>
        <p className="mt-1 text-[length:var(--text-small)] text-ink-soft">{member.title}</p>
        {member.summary ? <p className="mt-4 text-ink">{member.summary}</p> : null}
        {bio.map((p, i) => (
          <p key={i} className="mt-3 whitespace-pre-line text-ink-soft">
            {p}
          </p>
        ))}
        {member.email || member.linkedin_url ? (
          <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[length:var(--text-small)] font-medium">
            {member.email ? (
              <a href={`mailto:${member.email}`} className="line-link text-field">
                {member.email}
              </a>
            ) : null}
            {member.linkedin_url ? (
              <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="line-link text-field">
                LinkedIn
              </a>
            ) : null}
          </p>
        ) : null}
      </div>
    </article>
  );
}
