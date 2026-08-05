export interface PageMetadata {
  title: string | null;
  description: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  canonical: string | null;
  language: string | null;
  author: string | null;
  publishedAt: string | null;
  url: string;
  statusCode: number;
  fetchedAt: string;
}

export interface ExtractedPage {
  markdown: string;
  html: string;
  text: string;
  links: string[];
  metadata: PageMetadata;
}

const BLOCK_TAGS = new Set([
  "p", "div", "section", "article", "main", "header", "footer",
  "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li",
  "blockquote", "pre", "table", "tr", "td", "th", "br", "hr",
]);

const SKIP_TAGS = new Set([
  "script", "style", "noscript", "iframe", "object", "embed",
  "nav", "aside", "footer", "header", "form", "button", "input",
  "select", "textarea", "meta", "link", "head",
]);

function getMeta(doc: string, name: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, "i"),
    new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${name}["']`, "i"),
  ];
  for (const p of patterns) {
    const m = doc.match(p);
    if (m) return m[1].trim();
  }
  return null;
}

function getTag(doc: string, tag: string): string | null {
  const m = doc.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "i"));
  return m ? m[1].trim() : null;
}

function extractLinks(html: string, baseUrl: string): string[] {
  const links: string[] = [];
  const hrefs = html.matchAll(/href=["']([^"'#]+)["']/gi);
  const base = new URL(baseUrl);

  for (const match of hrefs) {
    try {
      const resolved = new URL(match[1], base);
      if (resolved.protocol === "http:" || resolved.protocol === "https:") {
        links.push(resolved.href);
      }
    } catch {
      // skip invalid URLs
    }
  }

  return [...new Set(links)];
}

function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function htmlToMarkdown(html: string): string {
  let md = html;

  // Remove skip tags with content
  for (const tag of SKIP_TAGS) {
    md = md.replace(new RegExp(`<${tag}[^>]*>[\\s\\S]*?</${tag}>`, "gi"), "");
  }

  // Headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, c) => `\n# ${stripTags(c).trim()}\n`);
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, c) => `\n## ${stripTags(c).trim()}\n`);
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, c) => `\n### ${stripTags(c).trim()}\n`);
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, c) => `\n#### ${stripTags(c).trim()}\n`);
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, c) => `\n##### ${stripTags(c).trim()}\n`);
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, (_, c) => `\n###### ${stripTags(c).trim()}\n`);

  // Bold / italic
  md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, (_, _t, c) => `**${stripTags(c).trim()}**`);
  md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, (_, _t, c) => `*${stripTags(c).trim()}*`);

  // Code
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, c) => `\`${stripTags(c)}\``);
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, c) => `\n\`\`\`\n${stripTags(c).trim()}\n\`\`\`\n`);

  // Links
  md = md.replace(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const label = stripTags(text).trim();
    return label ? `[${label}](${href})` : href;
  });

  // Images
  md = md.replace(/<img[^>]+src=["']([^"']+)["'][^>]+alt=["']([^"']*)["'][^>]*>/gi, (_, src, alt) => `![${alt}](${src})`);
  md = md.replace(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi, (_, src) => `![image](${src})`);

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, c) => `\n${c}\n`);
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, c) => `\n${c}\n`);
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, c) => `- ${stripTags(c).trim()}\n`);

  // Blockquote
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, c) =>
    c.split("\n").map((l: string) => `> ${stripTags(l).trim()}`).join("\n") + "\n"
  );

  // Paragraphs & breaks
  md = md.replace(/<br\s*\/?>/gi, "\n");
  md = md.replace(/<\/p>/gi, "\n\n");
  md = md.replace(/<hr\s*\/?>/gi, "\n---\n");

  // Strip remaining tags
  md = md.replace(/<[^>]+>/g, "");

  // Decode entities
  md = md
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Clean up whitespace
  md = md.replace(/\n{4,}/g, "\n\n\n").trim();

  return md;
}

function extractBody(html: string): string {
  // Try to get <main>, <article>, or <body>
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) return mainMatch[1];

  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) return articleMatch[1];

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1];

  return html;
}

export function extractPage(
  html: string,
  url: string,
  statusCode: number,
): ExtractedPage {
  const body = extractBody(html);
  const markdown = htmlToMarkdown(body);
  const text = stripTags(body);
  const links = extractLinks(html, url);

  const metadata: PageMetadata = {
    title: getTag(html, "title") || getMeta(html, "og:title"),
    description: getMeta(html, "description") || getMeta(html, "og:description"),
    ogTitle: getMeta(html, "og:title"),
    ogDescription: getMeta(html, "og:description"),
    ogImage: getMeta(html, "og:image"),
    canonical: (() => {
      const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
      return m ? m[1] : null;
    })(),
    language: (() => {
      const m = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
      return m ? m[1] : null;
    })(),
    author: getMeta(html, "author"),
    publishedAt: getMeta(html, "article:published_time") || getMeta(html, "datePublished"),
    url,
    statusCode,
    fetchedAt: new Date().toISOString(),
  };

  return { markdown, html: body, text, links, metadata };
}
