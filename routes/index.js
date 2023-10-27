import healthzHandler from './healthz/index.js';
import appHandler from './app/index.js';
import apiRouter from './api/index.js';

function requireRegisteredClient(req, res, next) {
  // skip for test env
  if (process?.env?.NODE_ENV === 'test') {
    return next();
  }

  // TODO: require a registered client in req.session
  return next();
}

export default function registerRoutes(app) {
  const routes = [
    { path: '/healthz', handlers: [healthzHandler] },
    { path: '/app', handlers: [appHandler] },
    { path: '/api', handlers: [requireRegisteredClient, apiRouter] },
  ];

  routes.forEach(({ path, handlers }) => app.use(path, [...handlers]));
}
