// Photographs used on the public site, with their credits. The atmosphere
// photos (Unsplash licence) are not of Green Solutions' own land or people;
// the Little Exuma and Staniel Cay photos are real places in The Bahamas.
import type { StaticImageData } from "next/image";
import leaves from "@/assets/photos/leaves-buds-john-french.jpg";
import cropRows from "@/assets/photos/crop-rows-aerial-matt-benson.jpg";
import hands from "@/assets/photos/hands-greens-jean-lakosnyk.jpg";
import orangeTree from "@/assets/photos/orange-tree-brian-jimenez.jpg";
import leafRain from "@/assets/photos/leaf-rain-buzo-jesus.jpg";
import leafDrop from "@/assets/photos/leaf-drop-belle-ng.jpg";
import exuma from "@/assets/photos/little-exuma-tropic-of-cancer.jpg";
import stanielCay from "@/assets/places/flying-over-stanlel-cay-3425540229.jpg";

export type Photo = { image: StaticImageData; alt: string; credit: string; href: string; position?: string };

export const PHOTOS = {
  leaves: {
    image: leaves,
    alt: "Young green shoots and flower buds, close up",
    credit: "John French",
    href: "https://unsplash.com/photos/SNW4DWZEy8I",
    position: "50% 45%",
  },
  cropRows: {
    image: cropRows,
    alt: "Rows of green crops seen from the air",
    credit: "Matt Benson",
    href: "https://unsplash.com/photos/rHbob_bEsSs",
  },
  hands: {
    image: hands,
    alt: "Two cupped hands holding fresh green shoots",
    credit: "Jean Lakosnyk",
    href: "https://unsplash.com/photos/N9yFjkDc0vA",
  },
  orangeTree: {
    image: orangeTree,
    alt: "An orange tree heavy with ripe fruit under a clear sky",
    credit: "Brian Jimenez",
    href: "https://unsplash.com/photos/ch-mPpglKjQ",
    position: "30% 50%",
  },
  leafRain: {
    image: leafRain,
    alt: "Rain drops on a broad green leaf",
    credit: "Buzo Jesús",
    href: "https://unsplash.com/photos/pHM4a_RZSLE",
  },
  leafDrop: {
    image: leafDrop,
    alt: "A single drop of water on a bright green leaf",
    credit: "贝莉儿 NG",
    href: "https://unsplash.com/photos/C_-DQF-x-N0",
  },
  exuma: {
    image: exuma,
    alt: "Turquoise water and white sand at the Tropic of Cancer beach, Little Exuma",
    credit: "Venture Minimalists, public domain",
    href: "https://commons.wikimedia.org/wiki/File:Tropic_of_Cancer,_Little_Exuma,_Bahamas.jpg",
    position: "50% 60%",
  },
  stanielCay: {
    image: stanielCay,
    alt: "Aerial view of Staniel Cay in the Exumas",
    credit: "cogdogblog, CC0",
    href: "https://commons.wikimedia.org/wiki/File:Flying_over_Stanlel_Cay_(3425540229).jpg",
    position: "50% 30%",
  },
} satisfies Record<string, Photo>;
