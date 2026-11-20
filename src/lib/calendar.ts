// Planting calendar: which crops from src/data/crops.ts can go in the ground
// in a given month in The Bahamas, plus the botanical plate that pictures
// each one. Pure module (client-safe).
import type { StaticImageData } from "next/image";
import { crops } from "@/data/crops";
import { MONTHS, seasonMonths } from "./season";
import amaranth from "@/assets/plates/amaranthus-viridis-blanco2-262-cropped.jpg";
import okra from "@/assets/plates/bammia-alpin-1735-alpha.png";
import pepper from "@/assets/plates/capsicum-tetragonum-blanco1-142.jpg";
import tomato from "@/assets/plates/lycopersicum-philippinarum-blanco1-43b.jpg";
import bean from "@/assets/plates/phaseolus-lunatus-blanco2-369-cropped.jpg";
import basil from "@/assets/plates/ocimum-basilicum-blanco2-407.jpg";

export type Plate = {
  image: StaticImageData;
  /** What the plate really shows, for alt text and the caption. */
  caption: string;
  /** CSS object-position that frames the plant, past the plate's margins. */
  focus: string;
};

export const PLATES: Record<string, Plate> = {
  callaloo: { image: amaranth, caption: "Amaranthus viridis, F. M. Blanco, Flora de Filipinas (1880s)", focus: "50% 40%" },
  okra: { image: okra, caption: "Okra, Prospero Alpino, 1735 engraving", focus: "50% 45%" },
  "sweet-pepper": { image: pepper, caption: "Capsicum tetragonum, F. M. Blanco, Flora de Filipinas (1880s)", focus: "50% 50%" },
  "cherry-tomato": { image: tomato, caption: "Solanum lycopersicum, F. M. Blanco, Flora de Filipinas (1880s)", focus: "45% 48%" },
  "bush-beans": { image: bean, caption: "A bean plant (Phaseolus lunatus), F. M. Blanco, Flora de Filipinas (1880s)", focus: "50% 40%" },
  basil: { image: basil, caption: "Ocimum basilicum, F. M. Blanco, Flora de Filipinas (1880s)", focus: "50% 42%" },
};

/** Short names that fit inside the sentence. */
const SHORT: Record<string, string> = {
  callaloo: "callaloo",
  okra: "okra",
  "sweet-pepper": "peppers",
  "cherry-tomato": "tomatoes",
  "bush-beans": "beans",
  basil: "basil",
};

export type CalendarCrop = {
  slug: string;
  name: string;
  short: string;
  season: string;
  daysToHarvest: string;
  summary: string;
  plate: Plate;
  /** True when the crop only goes in during part of the year. */
  seasonal: boolean;
};

const ALL: CalendarCrop[] = crops
  .filter((c) => PLATES[c.slug])
  .map((c) => ({
    slug: c.slug,
    name: c.name,
    short: SHORT[c.slug] ?? c.name.toLowerCase(),
    season: c.season,
    daysToHarvest: c.daysToHarvest,
    summary: c.summary,
    plate: PLATES[c.slug],
    seasonal: seasonMonths(c.season).length < 12,
  }));

/** Crops to plant in a month, seasonal ones first (they are the news). */
export function cropsFor(month: number): CalendarCrop[] {
  return ALL.filter((c) => seasonMonths(c.season).includes(month)).sort(
    (a, b) => Number(b.seasonal) - Number(a.seasonal),
  );
}

export const ALL_PLATES = ALL.map((c) => c.plate);
export const ALL_CROPS = ALL;
export { MONTHS };
