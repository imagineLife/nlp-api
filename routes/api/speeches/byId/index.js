import { Router } from "express";
import { getById } from "./get.js";
const speechByIdRouter = Router({ mergeParams: true });

// function putById(req, res) {
//   return res.status(200).json({ put: 'putById' });
// }

speechByIdRouter.get("/", getById);
// .put('/', putById)

export default speechByIdRouter;
