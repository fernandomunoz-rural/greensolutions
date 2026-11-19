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
  };
  hero: {
    title: string;
    intro: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  stats: { items: { value: string; label: string }[] };
  about: {
    title: string;
    intro: string;
    image: string;
    items: { title: string; body: string }[];
  };
  news: { title: string; intro: string };
  team: { title: string; intro: string };
  cta: {
    title: string;
    body: string;
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
    ],
  },
  {
    id: "hero",
    label: "Home · Hero",
    description:
      "The top of the home page. The big line is the planting calendar (what to plant this month); these texts sit under it.",
    fields: [
      long("title", "Main sentence", 120, { required: true, help: "The page title for search engines too. One sentence." }),
      long("intro", "Intro", 300),
      t("primaryLabel", "Main button text", 40),
      link("primaryHref", "Main button link"),
      t("secondaryLabel", "Second button text", 40),
      link("secondaryHref", "Second button link"),
    ],
  },
  {
    id: "stats",
    label: "Home · Numbers",
    description: "Key figures, written into one paragraph. Each label should finish the sentence its number starts.",
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
    description: "What Green Solutions does. The picture zooms in once per point as visitors scroll.",
    fields: [
      t("title", "Title", 60, { required: true, help: "Short: it is split around the picture." }),
      long("intro", "Intro", 300),
      {
        kind: "image",
        key: "image",
        label: "Picture (optional)",
        max: 500,
        help: "A photo of the islands. Without one, an aerial of Staniel Cay, Exuma is used.",
      },
      {
        kind: "list",
        key: "items",
        label: "Points",
        itemLabel: "Point",
        max: 8,
        item: [t("title", "Title", 60, { required: true }), long("body", "Text", 240)],
      },
    ],
  },
  {
    id: "news",
    label: "Home · Latest news",
    description: "Heading over the latest articles. The section only shows once an article is published.",
    fields: [t("title", "Title", 100, { required: true }), long("intro", "Intro", 300)],
  },
  {
    id: "team",
    label: "Home · Team",
    description: "Heading over the team. People are edited under Team.",
    fields: [t("title", "Title", 100, { required: true }), long("intro", "Intro", 300)],
  },
  {
    id: "cta",
    label: "Home · Call to action",
    description: "The dark band at the bottom of the home page.",
    fields: [
      t("title", "Title", 100, { required: true }),
      long("body", "Text", 240),
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
