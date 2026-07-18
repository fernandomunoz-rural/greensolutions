import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { Container, Eyebrow, Badge } from "@/components/ui";
import { Icon } from "@/components/icons";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Your account",
  description: "Manage your Green Solutions account.",
};

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth: the proxy redirects too, but never trust it alone.
  if (!user) redirect("/login?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bio, avatar_url, role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "user";
  const isStaff = role === "admin" || role === "editor";
  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <>
      {/* Header band */}
      <section className="border-b border-forest-700/40 bg-forest text-mint-100">
        <Container className="py-14 sm:py-16">
          <Eyebrow>Your account</Eyebrow>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Welcome{firstName ? `, ${firstName}` : ""}
            </h1>
            <span className="rounded-md bg-white/10 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-mint-100 ring-1 ring-white/15">
              {role}
            </span>
          </div>
          <p className="mt-3 max-w-xl text-mint-100/75">
            Manage your profile, photo, and account details.
          </p>
        </Container>
      </section>

      <Container className="max-w-3xl py-12 sm:py-14">
        {/* Staff CTA into the CMS */}
        {isStaff ? (
          <Link
            href="/studio"
            className="group flex items-center justify-between rounded-2xl border border-forest/15 bg-gradient-to-br from-mint/25 to-mint/[0.08] px-6 py-5 transition-colors hover:border-forest/30"
          >
            <span className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest text-mint">
                <Icon.Newspaper className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display font-semibold text-forest">
                  Content Studio
                </span>
                <span className="block text-sm text-ink/60">
                  Write and publish posts to the news feed.
                </span>
              </span>
            </span>
            <Icon.ArrowRight className="h-5 w-5 text-forest transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : null}

        {/* Editable profile */}
        <section
          className={`rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8 ${
            isStaff ? "mt-6" : ""
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Icon.User className="h-5 w-5 text-leaf" />
            <h2 className="font-display text-lg font-semibold text-forest">
              Profile
            </h2>
          </div>
          <p className="mt-1 text-sm text-ink/55">
            This is how you appear across Green Solutions.
          </p>
          <ProfileForm
            userId={user.id}
            initialName={profile?.full_name ?? ""}
            initialBio={profile?.bio ?? ""}
            initialAvatar={profile?.avatar_url ?? null}
          />
        </section>

        {/* Account facts */}
        <section className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="flex items-center gap-2.5">
            <Icon.Shield className="h-5 w-5 text-leaf" />
            <h2 className="font-display text-lg font-semibold text-forest">
              Account
            </h2>
          </div>
          <dl className="mt-5 divide-y divide-line rounded-xl border border-line">
            <div className="flex items-center justify-between px-5 py-4">
              <dt className="text-sm font-semibold text-forest">Email</dt>
              <dd className="text-ink/70">{user.email}</dd>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <dt className="text-sm font-semibold text-forest">Role</dt>
              <dd>
                <Badge tone={isStaff ? "leaf" : "neutral"}>{role}</Badge>
              </dd>
            </div>
          </dl>

          <form action={signOut} className="mt-6">
            <button
              type="submit"
              className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-forest/[0.05]"
            >
              Log out
            </button>
          </form>
        </section>
      </Container>
    </>
  );
}
