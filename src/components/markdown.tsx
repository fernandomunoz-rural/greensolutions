import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

// Article bodies are Markdown. Raw HTML is dropped (skipHtml) and unsafe link
// protocols are stripped by react-markdown's default urlTransform, so authored
// content can never inject markup or scripts. Older plain-text posts render as
// before: blank line = paragraph, single newline = line break.

const components: Components = {
  a: ({ href, children }) => {
    const external = !!href && /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt }) =>
    typeof src === "string" && src ? (
      // eslint-disable-next-line @next/next/no-img-element -- user-uploaded storage URL
      <img src={src} alt={alt ?? ""} loading="lazy" />
    ) : null,
  // Keep the page's single <h1> (the article title): demote body headings.
  h1: ({ children }) => <h2 data-reveal>{children}</h2>,
  // Each block rises in as it is reached (see components/reveal.tsx).
  h2: ({ children }) => <h2 data-reveal>{children}</h2>,
  p: ({ children }) => <p data-reveal>{children}</p>,
  ul: ({ children }) => <ul data-reveal>{children}</ul>,
  ol: ({ children }) => <ol data-reveal>{children}</ol>,
  blockquote: ({ children }) => <blockquote data-reveal>{children}</blockquote>,
};

export function Markdown({ source, className = "" }: { source: string; className?: string }) {
  return (
    <div className={`prose-gs ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} skipHtml components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
