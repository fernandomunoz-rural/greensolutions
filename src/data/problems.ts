/**
 * Plant Doctor knowledge base.
 *
 * The diagnose tool matches the symptoms a grower selects against the
 * `symptoms` tags below and ranks the most likely problems. This is seed
 * data for the learning/testing phase — designed to be expanded into an
 * AI-supported tool later.
 */
export type Problem = {
  id: string;
  name: string;
  category: "Nutrient" | "Watering" | "Pest" | "Disease" | "Environment";
  emoji: string;
  symptoms: string[]; // symptom ids that point to this problem
  summary: string;
  causes: string[];
  fixes: string[];
  severity: "Low" | "Medium" | "High";
};

export type Symptom = { id: string; label: string };

/** The checklist a grower picks from. */
export const symptoms: Symptom[] = [
  { id: "yellow-leaves", label: "Yellowing leaves" },
  { id: "yellow-veins-green", label: "Yellow leaves with green veins" },
  { id: "brown-spots", label: "Brown or black spots" },
  { id: "wilting", label: "Wilting or drooping" },
  { id: "curling-leaves", label: "Curling or distorted leaves" },
  { id: "holes-leaves", label: "Holes chewed in leaves" },
  { id: "sticky-residue", label: "Sticky residue or sooty mould" },
  { id: "white-powder", label: "White powdery coating" },
  { id: "stunted", label: "Stunted or slow growth" },
  { id: "dropping-fruit", label: "Flowers or fruit dropping" },
  { id: "tiny-insects", label: "Tiny insects on leaves" },
  { id: "dry-crispy", label: "Dry, crispy leaf edges" },
];

export const problemsKb: Problem[] = [
  {
    id: "iron-chlorosis",
    name: "Iron / Micronutrient Chlorosis",
    category: "Nutrient",
    emoji: "🟡",
    severity: "Medium",
    symptoms: ["yellow-veins-green", "yellow-leaves", "stunted"],
    summary:
      "Very common in The Bahamas because alkaline limestone soil locks up iron and other micronutrients.",
    causes: [
      "High soil pH (above 7.5) from limestone",
      "Poor drainage or waterlogged roots",
      "Low organic matter in the soil",
    ],
    fixes: [
      "Apply a chelated iron or micronutrient feed.",
      "Spray a foliar iron solution for fast correction.",
      "Add compost and mulch to lower pH over time.",
      "Improve drainage in raised beds.",
    ],
  },
  {
    id: "overwatering",
    name: "Overwatering / Root Rot",
    category: "Watering",
    emoji: "💧",
    severity: "High",
    symptoms: ["yellow-leaves", "wilting", "brown-spots", "stunted"],
    summary:
      "Wilting plants are often over-watered, not under-watered. Soggy soil suffocates roots and invites rot.",
    causes: [
      "Watering too frequently",
      "Poorly draining soil or containers without holes",
      "Heavy rain with no runoff",
    ],
    fixes: [
      "Let the top inch of soil dry before watering again.",
      "Add drainage holes and coarse material to mixes.",
      "Water deeply but less often.",
      "Remove badly rotted plants to protect the rest.",
    ],
  },
  {
    id: "underwatering",
    name: "Underwatering / Heat Stress",
    category: "Watering",
    emoji: "🌵",
    severity: "Medium",
    symptoms: ["wilting", "dry-crispy", "dropping-fruit"],
    summary:
      "In our heat, containers and shallow beds dry out fast, scorching leaf edges and dropping blossoms.",
    causes: [
      "Infrequent or shallow watering",
      "No mulch to hold moisture",
      "Intense midday sun and wind",
    ],
    fixes: [
      "Water deeply in the early morning.",
      "Add a 2–3 inch mulch layer to retain moisture.",
      "Provide afternoon shade during peak summer.",
      "Group thirsty plants together for efficient watering.",
    ],
  },
  {
    id: "aphids",
    name: "Aphids",
    category: "Pest",
    emoji: "🐛",
    severity: "Medium",
    symptoms: ["tiny-insects", "curling-leaves", "sticky-residue", "stunted"],
    summary:
      "Small sap-sucking insects that cluster on new growth, distort leaves, and leave sticky honeydew.",
    causes: [
      "Soft new growth from over-fertilizing",
      "Warm weather and few natural predators",
    ],
    fixes: [
      "Blast them off with a strong spray of water.",
      "Apply insecticidal soap or neem oil.",
      "Encourage ladybugs and lacewings.",
      "Avoid excess nitrogen fertilizer.",
    ],
  },
  {
    id: "whitefly",
    name: "Whiteflies",
    category: "Pest",
    emoji: "🦟",
    severity: "Medium",
    symptoms: ["tiny-insects", "sticky-residue", "yellow-leaves"],
    summary:
      "Clouds of tiny white insects that fly up when disturbed and weaken plants by feeding on sap.",
    causes: ["Warm, sheltered conditions", "Dense, crowded planting"],
    fixes: [
      "Hang yellow sticky traps near affected plants.",
      "Spray neem oil on the undersides of leaves.",
      "Improve airflow by spacing plants out.",
      "Remove heavily infested leaves.",
    ],
  },
  {
    id: "caterpillars",
    name: "Caterpillars / Hornworms",
    category: "Pest",
    emoji: "🐛",
    severity: "High",
    symptoms: ["holes-leaves", "stunted"],
    summary:
      "Chewing caterpillars can strip a tomato or pepper plant overnight, leaving ragged holes.",
    causes: ["Moths laying eggs on leaf undersides", "Year-round warm weather"],
    fixes: [
      "Hand-pick caterpillars in the early morning.",
      "Apply Bt (Bacillus thuringiensis), safe for edibles.",
      "Check leaf undersides for eggs weekly.",
      "Encourage birds and parasitic wasps.",
    ],
  },
  {
    id: "powdery-mildew",
    name: "Powdery Mildew",
    category: "Disease",
    emoji: "⚪",
    severity: "Medium",
    symptoms: ["white-powder", "yellow-leaves", "curling-leaves"],
    summary:
      "A white powdery fungus that coats leaves, common when days are warm and nights are humid.",
    causes: [
      "Poor airflow and crowded plants",
      "Humid nights and wet foliage",
    ],
    fixes: [
      "Improve spacing and prune for airflow.",
      "Water at the base, not on the leaves.",
      "Spray a diluted potassium-bicarbonate or neem solution.",
      "Remove and discard affected leaves.",
    ],
  },
  {
    id: "fungal-leaf-spot",
    name: "Fungal Leaf Spot",
    category: "Disease",
    emoji: "🟤",
    severity: "Medium",
    symptoms: ["brown-spots", "yellow-leaves", "dry-crispy"],
    summary:
      "Brown or black spots, often ringed with yellow, that spread in warm wet conditions.",
    causes: ["Splashing water spreading spores", "Humid, rainy weather"],
    fixes: [
      "Remove affected leaves and clean up debris.",
      "Water at soil level to keep foliage dry.",
      "Mulch to stop soil splashing onto leaves.",
      "Rotate crops between seasons.",
    ],
  },
  {
    id: "salt-stress",
    name: "Salt Stress",
    category: "Environment",
    emoji: "🌊",
    severity: "Medium",
    symptoms: ["dry-crispy", "brown-spots", "wilting", "stunted"],
    summary:
      "Coastal gardens face salt spray and brackish water that burns leaf edges and stunts growth.",
    causes: [
      "Salt spray from sea winds",
      "Brackish irrigation water",
      "Storm surge after hurricanes",
    ],
    fixes: [
      "Rinse foliage with fresh water after storms.",
      "Choose salt-tolerant crops near the shore.",
      "Plant windbreaks to reduce salt spray.",
      "Flush soil occasionally with fresh water.",
    ],
  },
];
