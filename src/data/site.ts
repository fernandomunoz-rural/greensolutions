export const site = {
  name: "Green Solutions",
  tagline: "Practical agriculture for The Bahamas",
  motto: "Cultivate with care, sow with love, and harvest life.",
  description:
    "Green Solutions makes agriculture easier to understand and plan for gardeners, new growers, and students across The Bahamas — through practical tools, clear guidance, and applied learning.",
  email: "hello@greensolutions.bs",
  location: "Nassau, The Bahamas",
  social: {
    instagram: "https://instagram.com/greensolutions",
    facebook: "https://facebook.com/greensolutions",
    youtube: "https://youtube.com/@greensolutions",
  },
};

export type NavItem = { label: string; href: string };

// Primary navigation. While the tools (Learn, Crops, Plant Doctor, Resources)
// are disabled, the nav points to sections of the home page only.
export const primaryNav: NavItem[] = [
  { label: "News", href: "/news" },
  { label: "About", href: "/#about" },
  { label: "Team", href: "/team" },
];

export const authNav = {
  login: { label: "Log in", href: "/login" },
  signup: { label: "Sign up", href: "/signup" },
};

export const stats = [
  { value: "90%", label: "of Bahamian food is imported" },
  { value: "700+", label: "islands & cays with growing potential" },
  { value: "12", label: "months of warm growing season" },
  { value: "1", label: "clear place to start learning" },
];

export type Office = {
  name: string;
  role: string;
  lead: string;
};

export const offices: Office[] = [
  {
    name: "Strategy & Planning Office",
    role: "Project direction, planning, coordination, and documentation.",
    lead: "Cody Dean",
  },
  {
    name: "Agriculture Office",
    role: "Applied agriculture, growing guidance, and practical agricultural support.",
    lead: "Maurice Curry",
  },
  {
    name: "Finance & Resources Office",
    role: "Budgeting, funding coordination, and resource management.",
    lead: "Fatma Adem",
  },
  {
    name: "Technology & Systems Office",
    role: "Software development, AI tools, data systems, and workflows.",
    lead: "Fernando Muñoz",
  },
  {
    name: "Outreach & Education Office",
    role: "Communication, education, design, and community engagement.",
    lead: "Luis Torres",
  },
  {
    name: "Research & Development Office",
    role: "Research, testing, refinement, and product development.",
    lead: "Michelle Outten",
  },
];

export const problems = [
  "Heavy reliance on imported food",
  "High costs of production",
  "Climate and environmental pressure",
  "Limited land",
  "Limited access to clear, locally relevant guidance",
];

export const values = [
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
];
