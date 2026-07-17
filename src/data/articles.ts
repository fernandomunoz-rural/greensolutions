export type Article = {
  slug: string;
  title: string;
  category: "Getting Started" | "Soil & Water" | "Pests & Disease" | "Climate" | "Harvest";
  excerpt: string;
  readMinutes: number;
  author: string;
  date: string;
  /** Tailwind gradient used for the cover when no photo is supplied */
  cover: string;
  /** Optional YouTube id to embed at the top of the article */
  video?: string;
  body: string; // simple HTML
};

export const articles: Article[] = [
  {
    slug: "start-a-garden-in-the-bahamas",
    title: "How to Start a Garden in The Bahamas",
    category: "Getting Started",
    excerpt:
      "A beginner-friendly roadmap for your first garden — choosing a spot, working with island soil, and picking crops that thrive in our climate.",
    readMinutes: 7,
    author: "Maurice Curry",
    date: "2026-05-12",
    cover: "from-leaf to-forest",
    body: `
<p>Starting a garden in The Bahamas is easier than most people think. Our long, warm growing season means you can plant something almost every month of the year. The trick is working <strong>with</strong> island conditions instead of against them.</p>
<h2>1. Choose the right spot</h2>
<p>Look for a place that gets at least <strong>6 hours of direct sun</strong>, has some shelter from strong salt winds, and drains well after heavy rain. A raised bed or large container is perfect if your yard is mostly rock or thin soil.</p>
<h2>2. Build your soil</h2>
<p>Much of our native ground is shallow over limestone. Don't fight it — bring soil to the surface:</p>
<ul>
<li>Mix compost, aged manure, and coconut coir to hold moisture.</li>
<li>Use raised beds 8–12 inches deep for root crops.</li>
<li>Mulch heavily to keep roots cool and reduce watering.</li>
</ul>
<h2>3. Pick beginner-friendly crops</h2>
<p>Start with crops that reward you quickly: <strong>callaloo, okra, sweet pepper, cherry tomato, bush beans, and herbs</strong> like basil and thyme. They handle heat well and produce within weeks.</p>
<h2>4. Water smart</h2>
<p>Water early in the morning, deeply and less often, to encourage strong roots. Container gardens may need daily watering in peak summer.</p>
<p>Once your first crop comes in, you'll have the confidence to expand. Every successful harvest teaches you something the next one builds on.</p>
`,
  },
  {
    slug: "understanding-bahamian-soil",
    title: "Understanding Bahamian Soil & Limestone",
    category: "Soil & Water",
    excerpt:
      "Why our soil is thin and alkaline, what that means for your plants, and simple ways to fix nutrient lock-out.",
    readMinutes: 6,
    author: "Michelle Outten",
    date: "2026-04-28",
    cover: "from-ochre to-forest",
    body: `
<p>Bahamian soils are young, shallow, and sit on top of limestone bedrock. That gives us a <strong>high pH (alkaline) soil</strong>, which changes how plants take up nutrients.</p>
<h2>The alkaline challenge</h2>
<p>When soil pH climbs above 7.5, iron, manganese, and zinc become harder for plants to absorb — even when they're present. This shows up as <strong>yellowing leaves with green veins</strong> on younger growth.</p>
<h2>Practical fixes</h2>
<ul>
<li>Add plenty of compost and organic matter to buffer the soil.</li>
<li>Use chelated micronutrients or a foliar iron spray for quick correction.</li>
<li>Mulch with leaves and grass clippings to slowly acidify the topsoil.</li>
<li>Grow in raised beds where you fully control the soil mix.</li>
</ul>
<h2>Test before you guess</h2>
<p>A simple pH test kit costs little and removes the guesswork. Aim for a range of <strong>6.0–7.0</strong> for most vegetables.</p>
`,
  },
  {
    slug: "watering-in-a-dry-climate",
    title: "Watering Wisely in a Dry, Salty Climate",
    category: "Soil & Water",
    excerpt:
      "Make every drop count. Mulching, timing, and rain capture techniques that keep gardens alive through the dry season.",
    readMinutes: 5,
    author: "Maurice Curry",
    date: "2026-03-19",
    cover: "from-mint to-leaf",
    body: `
<p>Fresh water is precious on the islands. A productive garden doesn't need more water — it needs <strong>smarter</strong> water.</p>
<h2>Mulch is your best friend</h2>
<p>A 2–3 inch layer of mulch can cut watering needs by up to half. It keeps soil cool, slows evaporation, and feeds soil life as it breaks down.</p>
<h2>Water deep, not often</h2>
<p>Shallow daily sprinkles train roots to stay near the surface where they dry out fast. Instead, water deeply two or three times a week so roots grow down.</p>
<h2>Capture the rain</h2>
<ul>
<li>Set up a simple rain barrel under a downspout.</li>
<li>Shape beds slightly concave to hold rainfall.</li>
<li>Group thirsty plants together so you irrigate efficiently.</li>
</ul>
<h2>Watch the salt</h2>
<p>In coastal areas, salt spray and brackish water stress plants. Rinse foliage with fresh water after storms and choose salt-tolerant crops near the shore.</p>
`,
  },
  {
    slug: "common-garden-pests",
    title: "Common Garden Pests & Natural Controls",
    category: "Pests & Disease",
    excerpt:
      "Identify aphids, whiteflies, and hornworms early — and stop them with low-cost, organic methods that are safe for food crops.",
    readMinutes: 8,
    author: "Michelle Outten",
    date: "2026-02-08",
    cover: "from-forest to-ochre",
    video: "vwSRqaZGsPw",
    body: `
<p>Warm weather year-round means pests stay active year-round too. The goal isn't a pest-free garden — it's a <strong>balanced</strong> one where natural predators keep problems small.</p>
<h2>Know the usual suspects</h2>
<h3>Aphids</h3>
<p>Tiny green, black, or white insects clustered on new growth. They suck sap and spread disease. Knock them off with a strong spray of water or insecticidal soap.</p>
<h3>Whiteflies</h3>
<p>Clouds of tiny white insects that lift off when you disturb a plant. Use yellow sticky traps and encourage ladybugs.</p>
<h3>Hornworms</h3>
<p>Large green caterpillars that strip tomato and pepper leaves overnight. Hand-pick them in the early morning.</p>
<h2>Natural controls that work</h2>
<ul>
<li><strong>Neem oil</strong> — disrupts feeding and breeding for many soft-bodied pests.</li>
<li><strong>Insecticidal soap</strong> — cheap, effective, safe to spray on edibles.</li>
<li><strong>Companion planting</strong> — marigolds, basil, and onions confuse pests.</li>
<li><strong>Beneficial insects</strong> — ladybugs and lacewings eat aphids by the hundreds.</li>
</ul>
<p>Scout your plants twice a week. Catching an outbreak at ten bugs is far easier than at ten thousand.</p>
`,
  },
  {
    slug: "growing-through-hurricane-season",
    title: "Growing Through Hurricane Season",
    category: "Climate",
    excerpt:
      "Protect your garden from storms and bounce back fast. Timing, anchoring, and quick-recovery crops for the wet season.",
    readMinutes: 6,
    author: "Cody Dean",
    date: "2026-01-22",
    cover: "from-forest to-leaf",
    body: `
<p>Hurricane season runs June through November. Smart growers plan around it rather than getting caught off guard.</p>
<h2>Before a storm</h2>
<ul>
<li>Harvest anything close to ready — don't lose it to wind.</li>
<li>Move containers indoors or to a sheltered wall.</li>
<li>Stake tall plants and remove loose trellises.</li>
<li>Hold off on planting tender seedlings during peak storm windows.</li>
</ul>
<h2>After a storm</h2>
<p>Rinse salt off foliage with fresh water, clear debris, and let waterlogged beds drain before replanting. Flooded soil loses nitrogen, so feed lightly once things dry out.</p>
<h2>Fast-recovery crops</h2>
<p>Quick growers like <strong>callaloo, lettuce, radish, and bush beans</strong> let you rebuild a harvest within weeks of a setback.</p>
`,
  },
  {
    slug: "when-and-how-to-harvest",
    title: "When & How to Harvest for Best Flavour",
    category: "Harvest",
    excerpt:
      "Picking at the right moment makes all the difference. A crop-by-crop guide to timing, technique, and storage.",
    readMinutes: 5,
    author: "Maurice Curry",
    date: "2025-12-15",
    cover: "from-ochre to-leaf",
    body: `
<p>Harvesting at the right time is where flavour, nutrition, and yield all come together. Pick too early and crops are bland; too late and they turn tough or bitter.</p>
<h2>Read the signs</h2>
<ul>
<li><strong>Tomatoes</strong> — pick when fully coloured but still firm.</li>
<li><strong>Okra</strong> — harvest young, 3–4 inches, every day or two.</li>
<li><strong>Peppers</strong> — green is fine, but full colour means more sweetness.</li>
<li><strong>Leafy greens</strong> — take outer leaves and let the centre keep growing.</li>
</ul>
<h2>Harvest in the cool</h2>
<p>Pick in the early morning when crops are crisp and full of moisture. Use clean, sharp scissors to avoid tearing stems.</p>
<h2>Keep it coming</h2>
<p>Frequent picking tells the plant to keep producing. The more you harvest beans, okra, and greens, the more they give.</p>
`,
  },
];

export const articleCategories = [
  "All",
  "Getting Started",
  "Soil & Water",
  "Pests & Disease",
  "Climate",
  "Harvest",
] as const;

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
