import healthzHandler from './healthz/index.js';
import nlpHandler from './nlp/index.js';

export default function registerRoutes(app) {
  const routes = [{ path: '/healthz', handler: healthzHandler }, { path: '/nlp', handler: nlpHandler}];

  routes.forEach(({ path, handler }) => app.use(path, handler));
}
