import { Router } from "express";
import nlpRouter from "./nlp/index.js";
import speechesRouter from "./speeches/index.js";
import usersRouter from "./users/index.js";

const routes = [
  { path: "/speeches", handler: speechesRouter },
  { path: "/nlp", handler: nlpRouter },
  { path: "/users", handler: usersRouter },
];

const apiRouter = Router();

routes.forEach((r) => apiRouter.use(r.path, r.handler));

export default apiRouter;
