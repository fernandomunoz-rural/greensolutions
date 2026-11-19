import type { SiteContent } from "./schema";

// Today's live text. Used until something is published, and whenever the
// content tables can't be read, so the site never goes blank.
export const DEFAULT_CONTENT: SiteContent = {
  settings: {
    name: "Green Solutions",
    tagline: "Practical agriculture for The Bahamas",
    description:
      "Green Solutions makes agriculture easier to understand and plan for gardeners, new growers, and students across The Bahamas — through practical tools, clear guidance, and applied learning.",
    email: "hello@greensolutions.bs",
    location: "Nassau, The Bahamas",
    instagram: "https://instagram.com/greensolutions",
    facebook: "https://facebook.com/greensolutions",
    youtube: "https://youtube.com/@greensolutions",
  },
  hero: {
    title: "Practical tools for growing food *across the islands.*",
    intro:
      "Clear guidance and planning tools for gardeners, growers, and students — built for Bahamian soil, climate, and supply chains.",
    primaryLabel: "Create free account",
    primaryHref: "/signup",
    secondaryLabel: "Read the latest",
    secondaryHref: "/news",
  },
  stats: {
    items: [
      { value: "90%", label: "of the food on Bahamian tables is shipped in" },
      { value: "700+", label: "islands and cays, and most have room to grow something" },
      { value: "12", label: "months of growing weather, every year" },
      { value: "1", label: "free place to learn how, built for these islands" },
    ],
  },
  about: {
    title: "Guidance you can *act on*",
    intro:
      "We organize agricultural knowledge into clear, usable steps and tools — tuned to the realities of island growing.",
    image: "",
    items: [
      {
        title: "Reduce confusion",
        body: "We organize agricultural knowledge in clear, simple ways so anyone can follow it.",
      },
      {
        title: "Support decisions",
        body: "Practical tools help growers make better choices about what, when, and how to plant.",
      },
      {
        title: "Make it accessible",
        body: "Guidance is free, plain-language, and built for the realities of island growing.",
      },
      {
        title: "Fit Bahamian conditions",
        body: "Everything is tuned for our climate, soils, salt air, and short supply chains.",
      },
    ],
  },
  news: {
    title: "Latest updates",
    intro: "Guidance, announcements, and field notes from the team.",
  },
  team: {
    title: "The people behind *the guidance*",
    intro:
      "Each office owns a defined part of the work — from applied agriculture to technology and outreach.",
  },
  cta: {
    title: "Your first bed *starts this month.*",
    body: "Free while we build. Set up in under a minute.",
    primaryLabel: "Create free account",
    primaryHref: "/signup",
    secondaryLabel: "Log in",
    secondaryHref: "/login",
  },
  home: [
    { id: "stats", visible: true },
    { id: "news", visible: true },
    { id: "about", visible: true },
    { id: "team", visible: true },
    { id: "cta", visible: true },
  ],
};
