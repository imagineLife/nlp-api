import healthzHandler from './healthz/index.js';
import appHandler from './app/index.js';
import apiRouter from './api/index.js';
import requireRegisteredApp from '../middleware/requireRegisteredApp/index.js';

export default function registerRoutes(app) {
  const routes = [
    { path: '/healthz', handlers: [healthzHandler] },
    { path: '/app', handlers: [appHandler] },
    { path: '/api', handlers: [requireRegisteredApp, apiRouter] },
  ];

  routes.forEach(({ path, handlers }) => app.use(path, [...handlers]));
}
