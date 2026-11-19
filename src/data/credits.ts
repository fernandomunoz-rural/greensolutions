// Pictures used on the site, listed in the footer. None shows Green
// Solutions' own people, land or produce.
import { PHOTOS } from "@/lib/photos";

const PLATES = [
  { title: "Callaloo", by: "F. M. Blanco", href: "https://commons.wikimedia.org/wiki/File:Amaranthus_viridis_Blanco2.262-cropped.jpg" },
  { title: "Okra (1735)", by: "Prospero Alpino", href: "https://commons.wikimedia.org/wiki/File:Bammia_Alpin_1735_alpha.png" },
  { title: "Pepper", by: "F. M. Blanco", href: "https://commons.wikimedia.org/wiki/File:Capsicum_tetragonum_Blanco1.142.jpg" },
  { title: "Tomato", by: "F. M. Blanco", href: "https://commons.wikimedia.org/wiki/File:Lycopersicum_philippinarum_Blanco1.43b.jpg" },
  { title: "Bean", by: "F. M. Blanco", href: "https://commons.wikimedia.org/wiki/File:Phaseolus_lunatus_Blanco2.369-cropped.jpg" },
  { title: "Basil", by: "F. M. Blanco", href: "https://commons.wikimedia.org/wiki/File:Ocimum_basilicum_Blanco2.407.jpg" },
];

/** Botanical plates: public domain. */
export const PLATE_CREDITS = PLATES;

/** Photographs, in the order they appear. */
export const PHOTO_CREDITS = Object.values(PHOTOS).map((p) => ({ title: p.alt, by: p.credit, href: p.href }));
