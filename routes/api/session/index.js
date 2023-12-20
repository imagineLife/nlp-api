import { Router } from 'express';

const SessionRouter = new Router();

function getUserAuthFromSession(req, res) {
  if (req?.session?.authenticatedEmail) {
    return res.status(200).json({ email: req.session.authenticatedEmail });
  }
  return res.status(422).end();
}
SessionRouter.get('/', getUserAuthFromSession);
export default SessionRouter;
