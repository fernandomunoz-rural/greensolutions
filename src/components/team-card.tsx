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

/**
 * "Portrait as drop cap": the person's paragraph set large, their square
 * portrait floated at its start like a drop capital. Without a photo, their
 * initials on the leaf-green field take the same square.
 */
export function TeamProfile({ member, index = 0 }: { member: TeamMember; index?: number }) {
  const bio = (member.bio || "").split(/\n{2,}/).filter(Boolean);
  const facts = [
    member.title,
    member.email ? (
      <a key="e" href={`mailto:${member.email}`} className="text-ink underline decoration-1 underline-offset-4 hover:text-field">
        {member.email}
      </a>
    ) : null,
    member.linkedin_url ? (
      <a
        key="l"
        href={member.linkedin_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ink underline decoration-1 underline-offset-4 hover:text-field"
      >
        LinkedIn
      </a>
    ) : null,
  ].filter(Boolean);

  return (
    <article
      id={memberAnchor(member.name)}
      data-reveal
      style={{ ["--i" as string]: index % 3 }}
      className="grid scroll-mt-24 gap-6 py-[clamp(3rem,7vw,6rem)] lg:grid-cols-12"
    >
      <ul className="order-2 flex flex-wrap gap-x-6 gap-y-1 text-[length:var(--text-small)] text-ink-soft lg:order-1 lg:col-span-2 lg:flex-col">
        {facts.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <div className="order-1 text-[clamp(1.375rem,0.95rem+1.9vw,2.25rem)] leading-[1.22] lg:order-2 lg:col-span-10">
        <p className="text-ink-soft">
          {member.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- storage URL
            <img
              src={member.photo_url}
              alt={`Portrait of ${member.name}`}
              loading="lazy"
              className="float-left mr-[0.5em] mt-[0.16em] h-[3.6em] w-[3.6em] object-cover max-sm:h-[4.6em] max-sm:w-[4.6em]"
            />
          ) : (
            <span
              aria-hidden="true"
              className="display float-left mr-[0.5em] mt-[0.16em] flex h-[3.6em] w-[3.6em] items-center justify-center bg-field text-[1em] text-accent max-sm:h-[4.6em] max-sm:w-[4.6em]"
            >
              <span className="text-[1.6em]">{initials(member.name)}</span>
            </span>
          )}
          <span className="text-ink">{member.name}</span>
          {member.summary ? <>, {member.summary.charAt(0).toLowerCase() + member.summary.slice(1)}</> : "."}
        </p>
        {bio.map((p, i) => (
          <p key={i} className="mt-[1em] whitespace-pre-line text-ink-soft">
            {p}
          </p>
        ))}
        <div className="clear-both" />
      </div>
    </article>
  );
}
