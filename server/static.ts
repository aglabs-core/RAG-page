import express, { type Express } from "express";
import fs from "fs";
import path from "path";

// Caminhos que o cliente sabe renderizar (espelha as <Route> de
// client/src/App.tsx). Qualquer outro caminho não existe — e precisa dizer
// isso no status HTTP.
//
// Antes daqui, o `app.get("*")` abaixo respondia a home com 200 para
// literalmente qualquer URL: /pagina-inventada devolvia byte a byte o mesmo
// que /. Isso é um soft-404, e tem dois custos reais. O buscador indexa
// URLs inexistentes como se fossem páginas e dilui o site em duplicatas; e
// um link errado em produção nunca aparece como erro — foi assim que o link
// do App na bio ficou apontando para /app deste host sem ninguém notar.
const CLIENT_ROUTES = new Set(["/", "/app", "/aglabs", "/terms", "/privacy"]);

export function serveStatic(app: Express) {
  // Try a few candidate locations for the built client files. Depending on
  // how the project is built and deployed, __dirname may differ from
  // process.cwd(), so check both.
  const candidates = [
    path.resolve(__dirname, "public"),
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "public"),
  ];

  const distPath = candidates.find((p) => fs.existsSync(p));
  if (!distPath) {
    throw new Error(
      `Could not find the build directory. Checked: ${candidates.join(", ")}. Run \"npm run build\" and ensure the resulting dist/public folder is deployed alongside the server bundle.`,
    );
  }

  console.log(`serving static files from ${distPath}`);

  // Serve static assets but do not automatically serve index.html for every
  // request — we only want to return index.html for non-API GET requests so
  // API routes are not interfered with.
  app.use(express.static(distPath, { index: false }));

  const shellIndex = path.resolve(distPath, "index.html");
  // Home com o cabeçalho e o hero já no HTML (gerada no build por
  // script/build.ts). Só vale para "/".
  const homeShell = path.resolve(distPath, "home.html");
  const hasHomeShell = fs.existsSync(homeShell);

  app.get("*", (req, res, next) => {
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api") || req.path.startsWith("/api-docs")) return next();

    // Prefer a route-specific prerendered snapshot (better SEO/GEO) when one
    // exists, e.g. /terms -> dist/public/terms/index.html. Otherwise fall back
    // to the SPA shell which renders the route client-side.
    const safePath = req.path.replace(/\.\.+/g, "").replace(/^\/+/, "");
    const prerendered = safePath
      ? path.resolve(distPath, safePath, "index.html")
      : shellIndex;

    const hasSnapshot =
      prerendered.startsWith(distPath) && fs.existsSync(prerendered);
    const fileToSend =
      req.path === "/" && hasHomeShell
        ? homeShell
        : hasSnapshot
          ? prerendered
          : shellIndex;

    // Normaliza a barra final para que /terms e /terms/ contem como a mesma
    // rota conhecida.
    const normalized = req.path.length > 1 ? req.path.replace(/\/+$/, "") : "/";
    const conhecida = hasSnapshot || CLIENT_ROUTES.has(normalized);

    // O corpo continua sendo o shell: o cliente monta e a <Route
    // component={NotFound}> desenha a página de erro. O que muda é o status,
    // que é o único sinal que crawler e monitoramento realmente leem.
    if (!conhecida) res.status(404);

    res.sendFile(fileToSend, (err) => {
      if (err) return next(err);
    });
  });
}
