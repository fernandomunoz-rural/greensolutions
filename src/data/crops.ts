export type Crop = {
  slug: string;
  name: string;
  emoji: string;
  difficulty: "Easy" | "Moderate" | "Advanced";
  season: string;
  daysToHarvest: string;
  sun: string;
  spacing: string;
  summary: string;
  tips: string[];
};

export const crops: Crop[] = [
  {
    slug: "callaloo",
    name: "Callaloo",
    emoji: "🌿",
    difficulty: "Easy",
    season: "Year-round",
    daysToHarvest: "30–45 days",
    sun: "Full sun to part shade",
    spacing: '8–12"',
    summary:
      "A fast, forgiving leafy green that thrives in Bahamian heat and keeps producing as you pick.",
    tips: [
      "Harvest outer leaves so the plant keeps growing.",
      "Loves rich, moist soil and regular feeding.",
      "Bolts in extreme heat — give afternoon shade in peak summer.",
    ],
  },
  {
    slug: "okra",
    name: "Okra",
    emoji: "🌱",
    difficulty: "Easy",
    season: "Mar – Oct",
    daysToHarvest: "50–60 days",
    sun: "Full sun",
    spacing: '12–18"',
    summary:
      "A heat-loving staple that produces abundantly through the hottest months when little else will.",
    tips: [
      "Pick pods young (3–4 inches) every day or two.",
      "Wear gloves — the leaves and pods can irritate skin.",
      "Soak seeds overnight to speed up germination.",
    ],
  },
  {
    slug: "sweet-pepper",
    name: "Sweet Pepper",
    emoji: "🫑",
    difficulty: "Moderate",
    season: "Oct – May",
    daysToHarvest: "70–90 days",
    sun: "Full sun",
    spacing: '18"',
    summary:
      "Productive and rewarding through the cooler dry season, with months of continuous fruit.",
    tips: [
      "Stake plants once they begin to fruit heavily.",
      "Feed with potassium-rich fertilizer for bigger fruit.",
      "Mulch to keep roots cool and moisture steady.",
    ],
  },
  {
    slug: "cherry-tomato",
    name: "Cherry Tomato",
    emoji: "🍅",
    difficulty: "Moderate",
    season: "Oct – Apr",
    daysToHarvest: "60–75 days",
    sun: "Full sun",
    spacing: '24"',
    summary:
      "More heat-tolerant and disease-resistant than large tomatoes — the best tomato for island beginners.",
    tips: [
      "Grow on a trellis or cage for airflow and easy picking.",
      "Water evenly to prevent cracking and blossom-end rot.",
      "Pinch side shoots to focus energy on fruit.",
    ],
  },
  {
    slug: "bush-beans",
    name: "Bush Beans",
    emoji: "🫛",
    difficulty: "Easy",
    season: "Year-round",
    daysToHarvest: "45–55 days",
    sun: "Full sun",
    spacing: '4–6"',
    summary:
      "Quick, compact, and soil-improving — beans fix nitrogen and recover a garden fast after a setback.",
    tips: [
      "Sow directly; beans dislike being transplanted.",
      "Pick often to keep pods coming.",
      "Rotate beds each season to avoid soil disease.",
    ],
  },
  {
    slug: "basil",
    name: "Basil",
    emoji: "🌿",
    difficulty: "Easy",
    season: "Year-round",
    daysToHarvest: "30–40 days",
    sun: "Full sun to part shade",
    spacing: '10–12"',
    summary:
      "A fragrant, fast herb that repels pests, loves the heat, and earns a spot in every garden.",
    tips: [
      "Pinch the tops weekly to keep it bushy.",
      "Remove flower buds to extend leaf production.",
      "Pairs well planted beside tomatoes and peppers.",
    ],
  },
];

export function getCrop(slug: string) {
  return crops.find((c) => c.slug === slug);
}
