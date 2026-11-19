import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PublicOnly } from "@/components/public-only";
import { Reveal } from "@/components/reveal";
import { getSiteContent, getViewer, isPreviewing } from "@/lib/content/load";

// Sentient (Indian Type Foundry, Fontshare, free for commercial use): the
// one face of the public site. Self-hosted so no third-party request.
const sentient = localFont({
  variable: "--font-sentient",
  display: "swap",
  src: [
    { path: "../assets/fonts/Sentient-Light.woff2", weight: "300", style: "normal" },
    { path: "../assets/fonts/Sentient-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/Sentient-Italic.woff2", weight: "400", style: "italic" },
    { path: "../assets/fonts/Sentient-Medium.woff2", weight: "500", style: "normal" },
  ],
});

// General Sans (Fontshare): small interface text in the admin only.
const general = localFont({
  variable: "--font-general",
  display: "swap",
  src: [
    { path: "../assets/fonts/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
  ],
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
    <html
      lang="en"
      className={`${sentient.variable} ${general.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks that scripts run, so entrance animations may start hidden.
            Without it every [data-reveal] element simply stays visible. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-full flex-col bg-ground text-ink">
        <Reveal />
        {previewing ? (
          <PublicOnly>
            <div className="font-ui flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-accent px-4 py-2 text-center text-sm font-medium text-ink">
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
