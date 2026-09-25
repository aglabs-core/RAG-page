import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

// Permitir trust proxy para subdomínio e headers corretos
app.set('trust proxy', 1);

// CORS para subdomínio (ajuste conforme necessário)
import cors from 'cors';
app.use(cors({
  origin: [
    'https://rag.aglabs.ia.br',
    'https://www.rag.aglabs.ia.br'
  ],
  credentials: true
}));

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Log all incoming requests (helps debugging in production)
app.use((req, _res, next) => {
  log(`${req.method} ${req.path}`, "request");
  next();
});

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the error for diagnostics and respond if headers not sent.
    console.error(err);
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // Try a small range of fallback ports if the desired port is in use to avoid
  // crashing (helpful during development or when a process unexpectedly
  // occupies the port on the host).
  const basePort = parseInt(process.env.PORT || "5000", 10);

  async function tryListen(startPort: number, attempts = 5) {
    for (let i = 0; i < attempts; i++) {
      const p = startPort + i;
      try {
        await new Promise<void>((resolve, reject) => {
          const onError = (err: any) => {
            httpServer.removeListener("listening", onListen);
            reject(err);
          };
          const onListen = () => {
            httpServer.removeListener("error", onError);
            resolve();
          };
          httpServer.once("error", onError);
          httpServer.once("listening", onListen);
          httpServer.listen(p);
        });
        log(`serving on port ${p}`);
        return;
      } catch (err: any) {
        if (err && err.code === "EADDRINUSE") {
          log(`port ${startPort + i} in use, trying next port...`, "server");
          // continue loop to try next port
          continue;
        }
        // unknown error, rethrow
        throw err;
      }
    }
    throw new Error(`Unable to bind to ports ${startPort}-${startPort + attempts - 1}`);
  }

  try {
    await tryListen(basePort, 6);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
