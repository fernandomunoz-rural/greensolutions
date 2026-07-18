import type { Metadata } from "next";
import { Schibsted_Grotesk, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/data/site";

const display = Schibsted_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const body = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://greensolutions.bs"),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Bahamas agriculture",
    "gardening",
    "plant health",
    "growing guides",
    "food security",
    "Green Solutions",
  ],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    type: "website",
    locale: "en_BS",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Pull the header's profile bits in the same request. Tolerate a missing
  // `profiles` row / table (e.g. before content.sql is run) so the shell never
  // crashes.
  let avatarUrl: string | null = null;
  let fullName: string | null = null;
  let isStaff = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, role")
      .eq("id", user.id)
      .single();
    avatarUrl = profile?.avatar_url ?? null;
    fullName = profile?.full_name ?? null;
    isStaff = profile?.role === "admin" || profile?.role === "editor";
  }

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <SiteHeader
          isAuthed={!!user}
          isStaff={isStaff}
          avatarUrl={avatarUrl}
          fullName={fullName}
        />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
