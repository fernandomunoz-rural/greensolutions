import type { CSSProperties, ReactNode } from "react";

type Part = { text: string; accent: boolean };

/** "Grow *more* food" → parts, with *asterisk* runs marked as accent. */
export function parseAccent(text: string): Part[] {
  const parts: Part[] = [];
  const re = /\*([^*]+)\*/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), accent: false });
    parts.push({ text: m[1], accent: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), accent: false });
  return parts;
}

/** The text without the asterisks, for metadata and screen readers. */
export function plain(text: string) {
  return text.replace(/\*([^*]+)\*/g, "$1");
}

/** Text with *asterisk* runs set in the serif italic. No animation. */
export function Accent({ text }: { text: string }) {
  return (
    <>
      {parseAccent(text).map((p, i) => (p.accent ? <em key={i}>{p.text}</em> : <span key={i}>{p.text}</span>))}
    </>
  );
}

/**
 * A headline that rises word by word out of a mask as it enters the view
 * (CSS in globals.css, triggered by components/reveal.tsx). Screen readers
 * get the sentence once, in plain text.
 */
export function Split({
  text,
  as: As = "h2",
  className = "",
  delay = 0,
  id,
  style,
  immediate = false,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** ms before the first word moves */
  delay?: number;
  id?: string;
  style?: CSSProperties;
  /** Play on first paint with CSS alone (for the headline at the top of a page). */
  immediate?: boolean;
}) {
  let n = 0;
  const words: ReactNode[] = [];
  for (const [pi, p] of parseAccent(text).entries()) {
    const list = p.text.split(/(\s+)/);
    for (const [wi, w] of list.entries()) {
      if (!w) continue;
      if (/^\s+$/.test(w)) {
        words.push(" ");
        continue;
      }
      const inner = p.accent ? <em>{w}</em> : w;
      words.push(
        <span key={`${pi}-${wi}`} className="w" aria-hidden="true">
          <span style={{ ["--w" as string]: n++ }}>{inner}</span>
        </span>,
      );
    }
  }
  return (
    <As
      id={id}
      data-reveal={immediate ? undefined : ""}
      className={`split ${immediate ? "split-now" : ""} ${className}`} style={{ ...style, ["--d" as string]: `${delay}ms` }}>
      <span className="sr-only">{plain(text)}</span>
      {words}
    </As>
  );
}
