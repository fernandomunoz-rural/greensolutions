import { DEFAULT_CONTENT } from "./defaults";
import {
  HOME_SECTION_IDS,
  SECTIONS,
  type HomeLayoutItem,
  type HomeSectionId,
  type ListItem,
  type SectionValue,
  type SiteContent,
  type TextField,
} from "./schema";

export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Links may point inside the site or to http(s)/mailto — never javascript: etc. */
export function isSafeHref(value: string): boolean {
  if (value === "") return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  if (value.startsWith("#")) return true;
  return /^(https?:\/\/|mailto:)[^\s]+$/i.test(value);
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Returns an error message, or null when the value is acceptable. */
function checkText(field: TextField, value: string): string | null {
  if (field.required && value === "") return "Required.";
  if (value.length > field.max) return `Keep it under ${field.max} characters (now ${value.length}).`;
  if (field.kind === "email" && value !== "" && !EMAIL_RE.test(value)) return "Not a valid email address.";
  if (field.kind === "url" && !isSafeHref(value))
    return "Use a page on this site (starting with /) or a full https:// address.";
  if (field.kind === "image" && value !== "" && !/^https?:\/\/[^\s]+$/i.test(value))
    return "Upload an image instead of typing an address.";
  return null;
}

function normText(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  return v.replace(/\r\n/g, "\n").trim();
}

function normalizeLayout(input: unknown): HomeLayoutItem[] {
  const seen = new Set<HomeSectionId>();
  const out: HomeLayoutItem[] = [];
  if (Array.isArray(input)) {
    for (const row of input) {
      if (!isRecord(row)) continue;
      const id = row.id as HomeSectionId;
      if (!HOME_SECTION_IDS.includes(id) || seen.has(id)) continue;
      seen.add(id);
      out.push({ id, visible: row.visible !== false });
    }
  }
  // Sections added to the code later show up, visible, at the end.
  for (const d of DEFAULT_CONTENT.home) if (!seen.has(d.id)) out.push({ ...d });
  return out;
}

/**
 * Validate and normalise a content document.
 *
 * - strict (saving / publishing): any problem is reported in `errors`.
 * - lenient (reading for the site): bad or missing values silently fall back
 *   to the defaults, so a broken row can never break a page.
 *
 * Unknown sections and fields are always dropped.
 */
export function normalizeContent(
  input: unknown,
  { strict }: { strict: boolean },
): { content: SiteContent; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const src = isRecord(input) ? input : {};
  const defaults = DEFAULT_CONTENT as unknown as Record<string, SectionValue>;
  const out: Record<string, unknown> = {};

  for (const section of SECTIONS) {
    const raw = isRecord(src[section.id]) ? (src[section.id] as Record<string, unknown>) : {};
    const def = defaults[section.id];
    const value: SectionValue = {};

    for (const field of section.fields) {
      const path = `${section.id}.${field.key}`;
      if (field.kind === "list") {
        const defItems = def[field.key] as ListItem[];
        const rawItems = raw[field.key];
        if (!Array.isArray(rawItems)) {
          value[field.key] = defItems.map((i) => ({ ...i }));
          continue;
        }
        const items: ListItem[] = [];
        rawItems.forEach((rawItem) => {
          const r = isRecord(rawItem) ? rawItem : {};
          const item: ListItem = {};
          for (const sub of field.item) item[sub.key] = normText(r[sub.key]) ?? "";
          // Fully empty rows are dropped rather than reported.
          if (field.item.every((sub) => item[sub.key] === "")) return;
          let ok = true;
          for (const sub of field.item) {
            const err = checkText(sub, item[sub.key]);
            if (err) {
              ok = false;
              if (strict) errors[`${path}.${items.length}.${sub.key}`] = err;
            }
          }
          if (ok || strict) items.push(item);
        });
        if (items.length > field.max) {
          if (strict) errors[path] = `At most ${field.max} ${field.itemLabel.toLowerCase()}s.`;
          items.length = field.max;
        }
        if (field.min && items.length < field.min && strict)
          errors[path] = `Add at least ${field.min}.`;
        value[field.key] = items;
        continue;
      }

      const text = normText(raw[field.key]);
      if (text === undefined) {
        value[field.key] = def[field.key] as string;
        if (strict) {
          const err = checkText(field, def[field.key] as string);
          if (err) errors[path] = err;
        }
        continue;
      }
      const err = checkText(field, text);
      if (err) {
        if (strict) {
          errors[path] = err;
          value[field.key] = text;
        } else {
          value[field.key] = def[field.key] as string;
        }
      } else {
        value[field.key] = text;
      }
    }
    out[section.id] = value;
  }

  out.home = normalizeLayout(src.home);
  return { content: out as SiteContent, errors };
}

/** Field paths that differ between two documents, e.g. ["hero.title", "home"]. */
export function changedKeys(before: SiteContent, after: SiteContent): string[] {
  const keys: string[] = [];
  const a = before as unknown as Record<string, Record<string, unknown>>;
  const b = after as unknown as Record<string, Record<string, unknown>>;
  for (const section of SECTIONS) {
    for (const field of section.fields) {
      if (JSON.stringify(a[section.id]?.[field.key]) !== JSON.stringify(b[section.id]?.[field.key]))
        keys.push(`${section.id}.${field.key}`);
    }
  }
  if (JSON.stringify(before.home) !== JSON.stringify(after.home)) keys.push("home");
  return keys;
}

/** Human label for a changed key, e.g. "Home · Hero → Title". */
export function describeKey(key: string): string {
  if (key === "home") return "Home page order & visibility";
  const [sectionId, fieldKey] = key.split(".");
  const section = SECTIONS.find((s) => s.id === sectionId);
  const field = section?.fields.find((f) => f.key === fieldKey);
  return section && field ? `${section.label} → ${field.label}` : key;
}
