// Month maths for the planting calendar. Pure, no imports (unit-tested).

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const ABBR = MONTHS.map((m) => m.slice(0, 3).toLowerCase());

/** Month indexes (0–11) covered by a season string like "Oct – May" or "Year-round". */
export function seasonMonths(season: string): number[] {
  if (/year/i.test(season)) return MONTHS.map((_, i) => i);
  const m = season.toLowerCase().match(/([a-z]{3})[a-z]*\s*[–-]\s*([a-z]{3})/);
  if (!m) return [];
  const from = ABBR.indexOf(m[1]);
  const to = ABBR.indexOf(m[2]);
  if (from < 0 || to < 0) return [];
  const out: number[] = [];
  for (let i = from; ; i = (i + 1) % 12) {
    out.push(i);
    if (i === to) break;
  }
  return out;
}
