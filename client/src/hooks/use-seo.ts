import { useEffect } from "react";

const SITE_URL = "https://rag.aglabs.ia.br";
const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.png`;

export interface SeoConfig {
  /** Page <title>. */
  title: string;
  /** Meta description (~150-160 chars). */
  description: string;
  /** Path of the current route, e.g. "/terms". Used for canonical + og:url. */
  path: string;
  /** Absolute OG/Twitter image URL. Defaults to the site opengraph image. */
  image?: string;
  /** Discourage indexing (e.g. legal pages). Defaults to false. */
  noindex?: boolean;
}

/** Create or update a <meta> tag, keyed by name or property. */
function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Per-route SEO. The SPA shares a single index.html, so without this every
 * route would inherit the home page's title/description/canonical (duplicate
 * titles + canonicals all pointing at the homepage). Because the build-time
 * prerender captures the rendered DOM, the values set here are baked into each
 * route's static HTML snapshot for crawlers and AI engines.
 */
export function useSeo({ title, description, path, image, noindex = false }: SeoConfig) {
  useEffect(() => {
    const url = `${SITE_URL}${path === "/" ? "" : path}`;
    const ogImage = image ?? DEFAULT_OG_IMAGE;

    document.title = title;
    setMeta("name", "description", description);
    setMeta(
      "name",
      "robots",
      noindex
        ? "noindex, follow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    );
    setCanonical(url);

    // Open Graph
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", ogImage);

    // Twitter
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);
  }, [title, description, path, image, noindex]);
}
