import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, writeFile, mkdir, readdir, copyFile } from "fs/promises";
import { join } from "path";
import { pathToFileURL } from "url";
import { prerender } from "./prerender";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("rendering home shell...");
  await buildHomeShell();

  // Copy optimized images (if present) into the final dist public folder so
  // runtime can reference /attached_assets/generated_images/optimized/*.avif
  try {
    const srcDir = join(process.cwd(), "attached_assets", "generated_images", "optimized");
    const destDir = join(process.cwd(), "dist", "public", "attached_assets", "generated_images", "optimized");
    // ensure dest exists
    await mkdir(destDir, { recursive: true });
    const files = await readdir(srcDir);
    await Promise.all(files.map((f) => copyFile(join(srcDir, f), join(destDir, f))));
    console.log("Copied optimized images to dist/public/attached_assets/generated_images/optimized");
  } catch (e) {
    // no-op if folder doesn't exist
  }

  // Prerender route snapshots for SEO/GEO (non-fatal: build continues on failure)
  try {
    console.log("prerendering routes...");
    await prerender(join(process.cwd(), "dist", "public"));
  } catch (e) {
    console.warn("[build] prerender step failed (continuing):", e);
  }

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

// Gera dist/public/home.html: o index.html com o cabeçalho e o hero já dentro
// do #root. O servidor entrega este arquivo em "/", e as demais rotas seguem
// com o index.html vazio para não piscar o hero antes de outra página.
async function buildHomeShell() {
  const ssrDir = join(process.cwd(), "dist", "ssr");
  const result = await viteBuild({
    logLevel: "warn",
    publicDir: false,
    // Tudo no mesmo bundle: com parte das dependências externa, o React do
    // react-dom/server e o do wouter viram duas cópias e os hooks quebram.
    ssr: { noExternal: true },
    build: {
      ssr: join(process.cwd(), "client", "src", "home-shell.tsx"),
      outDir: ssrDir,
      emptyOutDir: true,
    },
  });
  const outputs = (Array.isArray(result) ? result : [result]) as Array<{
    output: Array<{ type: string; isEntry?: boolean; fileName: string }>;
  }>;
  const entry = outputs
    .flatMap((o) => o.output)
    .find((c) => c.type === "chunk" && c.isEntry);
  if (!entry) throw new Error("build do home shell sem arquivo de entrada");

  const { renderHomeShell } = await import(
    pathToFileURL(join(ssrDir, entry.fileName)).href
  );
  const shell: string = renderHomeShell();
  if (!shell.includes("<h1")) {
    throw new Error("home shell sem <h1>: o hero não foi renderizado");
  }

  const publicDir = join(process.cwd(), "dist", "public");
  const index = await readFile(join(publicDir, "index.html"), "utf-8");
  const root = '<div id="root"></div>';
  if (!index.includes(root)) {
    throw new Error(`index.html sem ${root}`);
  }
  await writeFile(
    join(publicDir, "home.html"),
    index.replace(root, () => `<div id="root" data-home-shell="1">${shell}</div>`),
    "utf-8",
  );
  await rm(ssrDir, { recursive: true, force: true });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
