import healthzHandler from './healthz/index.js'

export default function registerRoutes(app) {
  const routes = [{ path: '/healthz', handler: healthzHandler }];

  routes.forEach(({path, handler}) => app.use(path, handler))
}