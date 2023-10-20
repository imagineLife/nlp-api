import { Router } from "express";
import byIdRouter from "./byId/index.js";
import postASpeech from "./post.js";
import { get } from "./../../../state.js";
import { failOnUnwatendFields } from "./middleware.js";
async function getSpeeches(req, res) {
  let data = await get("Speeches")
    .find({})
    .project({ _id: 1, author: 1, date: 1 })
    .toArray();
  return res.status(200).json(data);
}

const speechesRouter = Router();

speechesRouter.use("/:SpeechId", failOnUnwatendFields, byIdRouter);

speechesRouter
  .get("/", failOnUnwatendFields, getSpeeches)
  .post("/", failOnUnwatendFields, postASpeech);
export default speechesRouter;
