import type { Metadata } from "next";
import Link from "next/link";
import { Schibsted_Grotesk, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PublicOnly } from "@/components/public-only";
import { getSiteContent, getViewer, isPreviewing } from "@/lib/content/load";

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

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  const full = settings.tagline ? `${settings.name} — ${settings.tagline}` : settings.name;
  return {
    metadataBase: new URL("https://greensolutions.bs"),
    title: { default: full, template: `%s · ${settings.name}` },
    description: settings.description,
    keywords: [
      "Bahamas agriculture",
      "gardening",
      "plant health",
      "growing guides",
      "food security",
      settings.name,
    ],
    openGraph: {
      title: full,
      description: settings.description,
      type: "website",
      locale: "en_BS",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // All three are cached per request and tolerate missing tables, so the
  // shell never crashes before the database setup has been run.
  const [viewer, content, previewing] = await Promise.all([getViewer(), getSiteContent(), isPreviewing()]);

  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        {previewing ? (
          <PublicOnly>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-amber-400 px-4 py-2 text-center text-sm font-semibold text-amber-950">
              <span>Preview mode: you’re seeing the saved draft, not the live site.</span>
              <span className="flex gap-3">
                <Link href="/admin/content" className="underline underline-offset-2">
                  Back to editor
                </Link>
                <a href="/admin/preview?off=1" className="underline underline-offset-2">
                  Exit preview
                </a>
              </span>
            </div>
          </PublicOnly>
        ) : null}
        <PublicOnly>
          <SiteHeader
            isAuthed={!!viewer.userId}
            isStaff={viewer.isStaff}
            avatarUrl={viewer.avatarUrl}
            fullName={viewer.fullName}
          />
        </PublicOnly>
        <main className="flex-1">{children}</main>
        <PublicOnly>
          <SiteFooter settings={content.settings} />
        </PublicOnly>
      </body>
    </html>
  );
}
