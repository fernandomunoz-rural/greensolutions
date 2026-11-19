// Photographs of the islands from open collections, with their credits.
// None shows Green Solutions' own people, land or produce.
import type { StaticImageData } from "next/image";
import stanielCay from "@/assets/places/flying-over-stanlel-cay-3425540229.jpg";
import produceStall from "@/assets/places/potters-cay-produce-stall-1988.jpg";
import harbour from "@/assets/places/potters-cay-harbour-1988.jpg";
import market from "@/assets/places/potters-cay-market-1988.jpg";
import dock from "@/assets/places/potters-cay-dock-2014.jpg";

export type Place = { image: StaticImageData; alt: string; caption: string; position?: string };

export const PLACES = {
  produceStall: {
    image: produceStall,
    alt: "A vendor under a parasol at a stall of bananas, tomatoes and citrus at Potter's Cay, Nassau",
    caption: "Potter's Cay, Nassau, 1988 · Rüdiger Stehn, CC BY-SA 2.0",
    position: "60% 50%",
  },
  harbour: {
    image: harbour,
    alt: "Boats moored at Potter's Cay under the Paradise Island bridge, Nassau",
    caption: "Potter's Cay harbour, 1988 · Rüdiger Stehn, CC BY-SA 2.0",
    position: "50% 55%",
  },
  market: {
    image: market,
    alt: "Market stalls and shoppers along the dock at Potter's Cay, Nassau",
    caption: "Potter's Cay market, 1988 · Rüdiger Stehn, CC BY-SA 2.0",
  },
  dock: {
    image: dock,
    alt: "Freight boats tied up at the Potter's Cay dock, seen from the bridge",
    caption: "Potter's Cay dock, 2014 · Bohao Zhao, CC BY 3.0",
  },
  stanielCay: {
    image: stanielCay,
    alt: "Aerial view of Staniel Cay in the Exumas",
    caption: "Staniel Cay, Exuma · cogdogblog, CC0",
    position: "50% 30%",
  },
} satisfies Record<string, Place>;
