import healthzHandler from "./healthz/index.js";
import appHandler from "./app/index.js";
import apiRouter from "./api/index.js";
export default function registerRoutes(app) {
  const routes = [
    { path: "/healthz", handler: healthzHandler },
    { path: "/app", handler: appHandler },
    { path: "/api", handler: apiRouter },
  ];

  routes.forEach(({ path, handler }) => app.use(path, handler));
}
