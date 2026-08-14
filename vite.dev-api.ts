import type { Plugin, Connect } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";

/**
 * Dev-only Vite middleware that runs api/*.ts handlers in-process, mimicking
 * Vercel's serverless function routing so `npm run dev` can exercise them
 * without needing the Vercel CLI's interactive login. Production deploys
 * still go through Vercel's real function runtime - this never runs there.
 */
export function devApiPlugin(): Plugin {
  return {
    name: "dev-api-routes",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        const url = req.url ?? "";
        if (!url.startsWith("/api/")) {
          next();
          return;
        }

        const routeName = url.split("?")[0]?.replace("/api/", "");
        if (!routeName) {
          next();
          return;
        }

        try {
          const modulePath = `/api/${routeName}.ts`;
          const mod = await server.ssrLoadModule(modulePath);
          const handler = mod.default;

          if (typeof handler !== "function") {
            next();
            return;
          }

          const body = await readJsonBody(req);
          const vercelReq = Object.assign(req, { body }) as IncomingMessage & { body: unknown };
          const vercelRes = Object.assign(res, {
            status(code: number) {
              res.statusCode = code;
              return vercelRes;
            },
            json(payload: unknown) {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(payload));
              return vercelRes;
            },
          });

          await handler(vercelReq, vercelRes);
        } catch (error) {
          console.error(`[dev-api] ${url} failed:`, error);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Internal error running dev API handler" }));
          }
        }
      });
    },
  };
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    if (req.method !== "POST" && req.method !== "PUT" && req.method !== "PATCH") {
      resolve(undefined);
      return;
    }

    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf-8");
      if (!raw) {
        resolve(undefined);
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}
