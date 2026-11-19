import { describe, expect, it } from "vitest";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { changedKeys, describeKey, isSafeHref, normalizeContent } from "@/lib/content/validate";
import { SECTIONS } from "@/lib/content/schema";
import { groupTeam, memberAnchor, orderTeam, FALLBACK_TEAM } from "@/lib/team";
import { slugify } from "@/lib/posts";

describe("content defaults", () => {
  it("pass strict validation (installing the CMS changes nothing)", () => {
    const { content, errors } = normalizeContent(DEFAULT_CONTENT, { strict: true });
    expect(errors).toEqual({});
    expect(content).toEqual(DEFAULT_CONTENT);
  });

  it("cover every schema field", () => {
    const d = DEFAULT_CONTENT as unknown as Record<string, Record<string, unknown>>;
    for (const s of SECTIONS) for (const f of s.fields) expect(d[s.id][f.key], `${s.id}.${f.key}`).toBeDefined();
  });
});

describe("normalizeContent", () => {
  it("falls back to defaults for missing or junk input", () => {
    expect(normalizeContent(null, { strict: false }).content).toEqual(DEFAULT_CONTENT);
    expect(normalizeContent("x", { strict: false }).content).toEqual(DEFAULT_CONTENT);
    expect(normalizeContent({ hero: 5 }, { strict: false }).content).toEqual(DEFAULT_CONTENT);
  });

  it("keeps valid edits and drops unknown keys", () => {
    const { content } = normalizeContent(
      { hero: { title: "  New title  ", evil: "x" }, bogus: { a: 1 } },
      { strict: false },
    );
    expect(content.hero.title).toBe("New title");
    expect((content.hero as Record<string, unknown>).evil).toBeUndefined();
    expect((content as Record<string, unknown>).bogus).toBeUndefined();
  });

  it("reports length, required, email and link errors in strict mode", () => {
    const { errors } = normalizeContent(
      {
        hero: { title: "", primaryHref: "javascript:alert(1)" },
        settings: { email: "nope", name: "x".repeat(61) },
      },
      { strict: true },
    );
    expect(errors["hero.title"]).toMatch(/Required/);
    expect(errors["hero.primaryHref"]).toBeDefined();
    expect(errors["settings.email"]).toBeDefined();
    expect(errors["settings.name"]).toMatch(/60/);
  });

  it("lenient mode replaces bad values with defaults instead of failing", () => {
    const { content } = normalizeContent({ hero: { primaryHref: "javascript:alert(1)" } }, { strict: false });
    expect(content.hero.primaryHref).toBe(DEFAULT_CONTENT.hero.primaryHref);
  });

  it("validates list items, drops empty rows, caps length", () => {
    const items = Array.from({ length: 9 }, (_, i) => ({ value: String(i), label: `L${i}` }));
    const { content, errors } = normalizeContent(
      { stats: { items: [{ value: "", label: "" }, ...items] } },
      { strict: true },
    );
    expect(content.stats.items).toHaveLength(6);
    expect(errors["stats.items"]).toMatch(/At most 6/);

    const r = normalizeContent({ stats: { items: [{ value: "5", label: "" }] } }, { strict: true });
    expect(r.errors["stats.items.0.label"]).toMatch(/Required/);
  });

  it("normalises home layout: known ids only, no duplicates, missing ones appended", () => {
    const { content } = normalizeContent(
      { home: [{ id: "team", visible: false }, { id: "team" }, { id: "nope" }, { id: "cta" }] },
      { strict: false },
    );
    expect(content.home[0]).toEqual({ id: "team", visible: false });
    expect(content.home[1]).toEqual({ id: "cta", visible: true });
    expect(content.home.map((h) => h.id).sort()).toEqual(["about", "cta", "news", "stats", "team"]);
  });
});

describe("changedKeys / describeKey", () => {
  it("lists exactly the fields that changed", () => {
    const after = structuredClone(DEFAULT_CONTENT);
    after.hero.title = "Changed";
    after.home = [...after.home].reverse();
    expect(changedKeys(DEFAULT_CONTENT, after)).toEqual(["hero.title", "home"]);
    expect(describeKey("hero.title")).toBe("Home · Hero → Title");
  });
});

describe("isSafeHref", () => {
  it.each([
    ["/news", true],
    ["#team", true],
    ["https://x.com", true],
    ["mailto:a@b.co", true],
    ["", true],
    ["//evil.com", false],
    ["javascript:alert(1)", false],
    ["data:text/html,x", false],
  ])("%s → %s", (href, ok) => expect(isSafeHref(href)).toBe(ok));
});

describe("team helpers", () => {
  it("groups in first-seen order and sorts inside groups", () => {
    const m = (name: string, team_group: string, sort_order: number) => ({
      ...FALLBACK_TEAM[0],
      id: name,
      name,
      team_group,
      sort_order,
    });
    const groups = groupTeam([m("b", "Leads", 2), m("x", "Advisors", 1), m("a", "Leads", 1)]);
    expect(groups.map((g) => g.group)).toEqual(["Leads", "Advisors"]);
    expect(groups[0].members.map((x) => x.name)).toEqual(["a", "b"]);
  });

  it("orders groups by when they were started, not by per-group position", () => {
    const m = (name: string, team_group: string, sort_order: number, created_at: string) => ({
      ...FALLBACK_TEAM[0],
      id: name,
      name,
      team_group,
      sort_order,
      created_at,
    });
    // Volunteers' first member has sort_order 1, like Leadership's, but the
    // group was started later, so it must come after all of Leadership.
    const list = [
      m("vol", "Volunteers", 1, "2026-11-02"),
      m("lead1", "Leadership", 1, "2026-01-01"),
      m("lead2", "Leadership", 2, "2026-01-01"),
    ];
    expect(orderTeam(list).map((x) => x.name)).toEqual(["lead1", "lead2", "vol"]);
  });

  it("makes ascii anchors", () => {
    expect(memberAnchor("Fernando Muñoz")).toBe("fernando-munoz");
  });
});

describe("slugify", () => {
  it("is url safe", () => {
    expect(slugify("Hello, World! It's 2026")).toBe("hello-world-its-2026");
  });
});
