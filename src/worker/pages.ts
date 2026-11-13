/**
 * What crawlers and link previews see. The SPA renders in the browser, so the
 * Worker writes the sitemap and fills in each entity page's title and
 * description before the shell goes out. Reads with the anon key, so row-level
 * security limits it to published entities.
 */
import { createClient } from "@supabase/supabase-js";
import { siteFor } from "../sites";
import type { SiteDatabase } from "../lib/site-tables";

/** The Workers runtime global; not in the DOM lib the SPA compiles against. */
declare class HTMLRewriter {
  on(selector: string, handlers: { element(element: RewriterElement): void }): HTMLRewriter;
  transform(response: Response): Response;
}
interface RewriterElement {
  setInnerContent(content: string): void;
  setAttribute(name: string, value: string): void;
  append(content: string, options: { html: boolean }): void;
}

export interface PagesEnv {
  SITE: string;
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

const STATIC_PATHS = ["/", "/compare", "/methodology"];

function connect(env: PagesEnv) {
  if (!env.SUPABASE_ANON_KEY) throw new Error("SUPABASE_ANON_KEY is not set on the Worker");
  return createClient<SiteDatabase, "site">(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: siteFor(env.SITE).schema as "site" },
  });
}

function entityUrl(env: PagesEnv, slug: string): string {
  return `${siteFor(env.SITE).brand.origin}/entity/${encodeURIComponent(slug)}`;
}

export async function sitemap(env: PagesEnv): Promise<Response> {
  const { data, error } = await connect(env)
    .from("entities")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("slug");
  if (error) throw new Error(`sitemap: ${error.message}`);

  const urls = [
    ...STATIC_PATHS.map((path) => `  <url><loc>${siteFor(env.SITE).brand.origin}${path}</loc></url>`),
    ...data.map((e) => `  <url><loc>${entityUrl(env, e.slug)}</loc><lastmod>${e.updated_at.slice(0, 10)}</lastmod></url>`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

/** The SPA shell for /entity/:slug, titled for that entity; a 404 when no published entity has the slug. */
export async function entityPage(request: Request, env: PagesEnv, slug: string): Promise<Response> {
  const [shell, { data: entity, error }] = await Promise.all([
    env.ASSETS.fetch(new Request(new URL("/", request.url))),
    connect(env).from("entities").select("name, description").eq("slug", slug).eq("status", "published").maybeSingle(),
  ]);
  if (error) throw new Error(`entity page "${slug}": ${error.message}`);

  const site = siteFor(env.SITE);
  const title = `${entity ? entity.name : site.copy.entity.notFound} — ${site.brand.name}`;
  let rewriter = new HTMLRewriter()
    .on("title", { element: (el) => el.setInnerContent(title) })
    .on('meta[property="og:title"]', { element: (el) => el.setAttribute("content", title) });

  if (entity) {
    rewriter = rewriter
      .on('meta[name="description"], meta[property="og:description"]', {
        element: (el) => el.setAttribute("content", entity.description),
      })
      .on("head", {
        element: (el) =>
          el.append(
            `<link rel="canonical" href="${entityUrl(env, slug)}" /><meta property="og:url" content="${entityUrl(env, slug)}" />`,
            { html: true },
          ),
      });
  } else {
    rewriter = rewriter.on("head", {
      element: (el) => el.append(`<meta name="robots" content="noindex" />`, { html: true }),
    });
  }

  const headers = new Headers(shell.headers);
  headers.delete("ETag");
  return new Response(rewriter.transform(shell).body, { status: entity ? 200 : 404, headers });
}
