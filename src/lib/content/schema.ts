// Site content: the shape of everything the admin can edit on the public
// site, described once so the editor, the validator and the pages agree.
// Pure module — safe to import from Client Components.

export type TextField = {
  kind: "text" | "longtext" | "url" | "email" | "image";
  key: string;
  label: string;
  max: number;
  required?: boolean;
  help?: string;
};

export type ListField = {
  kind: "list";
  key: string;
  label: string;
  /** Max number of items. */
  max: number;
  min?: number;
  itemLabel: string;
  item: TextField[];
};

export type Field = TextField | ListField;

export type SectionDef = {
  id: SectionId;
  label: string;
  description: string;
  fields: Field[];
};

export type ListItem = Record<string, string>;
export type SectionValue = Record<string, string | ListItem[]>;

export const HOME_SECTION_IDS = ["stats", "news", "about", "team", "cta"] as const;
export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];
export type HomeLayoutItem = { id: HomeSectionId; visible: boolean };

export type SectionId =
  | "settings"
  | "hero"
  | "calendar"
  | "stats"
  | "about"
  | "news"
  | "team"
  | "cta";

export type SiteContent = {
  settings: {
    name: string;
    tagline: string;
    description: string;
    email: string;
    location: string;
    instagram: string;
    facebook: string;
    youtube: string;
    footerTitle: string;
  };
  hero: {
    title: string;
    intro: string;
    image: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  calendar: { title: string; intro: string };
  stats: { items: { value: string; label: string }[] };
  about: {
    title: string;
    intro: string;
    items: { title: string; body: string; image: string }[];
  };
  news: { title: string; intro: string; pageTitle: string; pageIntro: string };
  team: { title: string; intro: string; image: string; joinTitle: string };
  cta: {
    title: string;
    body: string;
    image: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  home: HomeLayoutItem[];
};

const t = (
  key: string,
  label: string,
  max: number,
  extra: Partial<TextField> = {},
): TextField => ({ kind: "text", key, label, max, ...extra });
const long = (key: string, label: string, max: number, extra: Partial<TextField> = {}): TextField => ({
  kind: "longtext",
  key,
  label,
  max,
  ...extra,
});
const link = (key: string, label: string): TextField => ({
  kind: "url",
  key,
  label,
  max: 300,
  help: "A page on this site like /news or /#team, or a full https:// address.",
});
const img = (key: string, label: string, help: string): TextField => ({ kind: "image", key, label, max: 500, help });

export const SECTIONS: SectionDef[] = [
  {
    id: "settings",
    label: "Site settings",
    description: "Name, description and contact details used across the whole site.",
    fields: [
      t("name", "Site name", 60, { required: true }),
      t("tagline", "Tagline", 100, { help: "Shown in the browser tab title." }),
      long("description", "Description", 300, {
        required: true,
        help: "Used in the footer and by search engines.",
      }),
      { kind: "email", key: "email", label: "Contact email", max: 120 },
      t("location", "Location", 80),
      { kind: "url", key: "instagram", label: "Instagram link", max: 300 },
      { kind: "url", key: "facebook", label: "Facebook link", max: 300 },
      { kind: "url", key: "youtube", label: "YouTube link", max: 300 },
      t("footerTitle", "Footer headline", 60, { help: "The big line at the top of every page's footer. Wrap words in *asterisks* for italic." }),
    ],
  },
  {
    id: "hero",
    label: "Home · Hero",
    description:
      "The top of the home page: the big headline over a full-screen photo, with the intro and two buttons.",
    fields: [
      long("title", "Main sentence", 120, { required: true, help: "One sentence. Wrap words in *asterisks* to set them in italic." }),
      long("intro", "Intro", 300),
      img("image", "Background photo", "Full-screen photo behind the headline. Leave empty for the close-up of green shoots."),
      t("primaryLabel", "Main button text", 40),
      link("primaryHref", "Main button link"),
      t("secondaryLabel", "Second button text", 40),
      link("secondaryHref", "Second button link"),
    ],
  },
  {
    id: "calendar",
    label: "Home · Planting calendar",
    description:
      "The dark green section under the hero. The month is added to the end of the title by itself, in italic; the crops come from the crop guides.",
    fields: [
      t("title", "Title", 60, { required: true, help: "Shown before the month, e.g. “What to plant in” November." }),
      long("intro", "Intro", 240),
    ],
  },
  {
    id: "stats",
    label: "Home · Numbers",
    description: "Key figures, shown in a row under the site description. Numbers count up as they scroll into view.",
    fields: [
      {
        kind: "list",
        key: "items",
        label: "Figures",
        itemLabel: "Figure",
        max: 6,
        item: [t("value", "Number", 12, { required: true }), t("label", "Label", 80, { required: true })],
      },
    ],
  },
  {
    id: "about",
    label: "Home · What we do",
    description: "What Green Solutions does. The points light up one at a time as visitors scroll, beside a changing photo.",
    fields: [
      t("title", "Title", 60, { required: true, help: "Short. Wrap words in *asterisks* to set them in italic." }),
      long("intro", "Intro", 300),
      {
        kind: "list",
        key: "items",
        label: "Points",
        itemLabel: "Point",
        max: 8,
        item: [
          t("title", "Title", 60, { required: true }),
          long("body", "Text", 240),
          img("image", "Photo", "Shown while this point is lit. Leave empty for one of the built-in photos."),
        ],
      },
    ],
  },
  {
    id: "news",
    label: "News",
    description:
      "The heading over the latest articles on the home page (it only shows once an article is published), and the top of the News page.",
    fields: [
      t("title", "Home heading", 100, { required: true }),
      long("intro", "Home intro", 300),
      t("pageTitle", "News page title", 60, { required: true, help: "Wrap words in *asterisks* to set them in italic." }),
      long("pageIntro", "News page intro", 300),
    ],
  },
  {
    id: "team",
    label: "Team",
    description: "The heading over the team on the home page and the top of the Team page. People are edited under Team.",
    fields: [
      t("title", "Title", 100, { required: true, help: "Used on the home page and the Team page. Wrap words in *asterisks* for italic." }),
      long("intro", "Intro", 300),
      img("image", "Team page photo", "The wide photo under the Team page title. Leave empty for the aerial of Staniel Cay."),
      t("joinTitle", "Join line", 60, { help: "The green band at the end of the Team page, above the email button." }),
    ],
  },
  {
    id: "cta",
    label: "Home · Call to action",
    description: "The full-width photo band at the bottom of the home page. Wrap words in *asterisks* to set them in italic.",
    fields: [
      t("title", "Title", 100, { required: true }),
      long("body", "Text", 240),
      img("image", "Background photo", "The full-width photo. Leave empty for Little Exuma."),
      t("primaryLabel", "Main button text", 40),
      link("primaryHref", "Main button link"),
      t("secondaryLabel", "Second button text", 40),
      link("secondaryHref", "Second button link"),
    ],
  },
];

export const HOME_SECTION_LABELS: Record<HomeSectionId, string> = {
  stats: "Numbers",
  news: "Latest news",
  about: "What we do",
  team: "Team",
  cta: "Call to action",
};

export function sectionDef(id: string): SectionDef | undefined {
  return SECTIONS.find((s) => s.id === id);
}
