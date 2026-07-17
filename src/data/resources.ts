export type Video = {
  id: string; // YouTube id
  title: string;
  description: string;
  duration: string;
  category: string;
};

export const videos: Video[] = [
  {
    id: "vwSRqaZGsPw",
    title: "Welcome to Green Solutions",
    description:
      "An introduction to who we are and why we're building practical agriculture tools for The Bahamas.",
    duration: "3:24",
    category: "Introduction",
  },
  {
    id: "vwSRqaZGsPw",
    title: "Building Your First Raised Bed",
    description:
      "A step-by-step walkthrough of building a raised bed that works with thin, rocky island soil.",
    duration: "8:10",
    category: "Getting Started",
  },
  {
    id: "vwSRqaZGsPw",
    title: "Spotting Pests Before They Spread",
    description:
      "Learn to scout your garden and catch aphids, whiteflies, and caterpillars early.",
    duration: "6:45",
    category: "Pests & Disease",
  },
  {
    id: "vwSRqaZGsPw",
    title: "Watering Through the Dry Season",
    description:
      "Mulching, timing, and rain capture techniques that keep your garden alive with less water.",
    duration: "5:30",
    category: "Soil & Water",
  },
];

export type Download = {
  title: string;
  description: string;
  type: "PDF" | "Checklist" | "Calendar";
  size: string;
};

export const downloads: Download[] = [
  {
    title: "Bahamas Planting Calendar",
    description:
      "A month-by-month guide to what to sow and harvest across the islands.",
    type: "Calendar",
    size: "1.2 MB",
  },
  {
    title: "Beginner Garden Checklist",
    description:
      "Everything you need to plan, build, and plant your first garden bed.",
    type: "Checklist",
    size: "320 KB",
  },
  {
    title: "Plant Health Quick-Reference",
    description:
      "A printable card of common symptoms and their most likely causes.",
    type: "PDF",
    size: "640 KB",
  },
  {
    title: "Soil & Compost Starter Guide",
    description:
      "How to build healthy soil over limestone using compost and mulch.",
    type: "PDF",
    size: "880 KB",
  },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Do I need a big yard to start?",
    a: "Not at all. Many of our crops grow well in containers or a single raised bed on a patio or balcony. Start small and expand as you learn.",
  },
  {
    q: "Is Green Solutions only for experienced growers?",
    a: "No — our guidance is written for complete beginners, students, and anyone curious about growing food, while still being useful to experienced gardeners.",
  },
  {
    q: "Does the Plant Doctor replace expert advice?",
    a: "It's a learning and testing tool that points you toward likely causes and practical fixes. For serious or commercial crop issues, confirm with a local agricultural officer.",
  },
  {
    q: "How much does it cost to use?",
    a: "All of our learning content and tools are free to use. Green Solutions exists to make agricultural knowledge more accessible across The Bahamas.",
  },
];
