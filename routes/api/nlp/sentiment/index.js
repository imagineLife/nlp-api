import express from "express";
import postHandler from "./post/index.js";
import excelRouter from "./excel/index.js";
import expectTextInBody from "../../../../middleware/expectTextInBody.js";

const sentimentRouter = express.Router();

sentimentRouter.use("/excel", expectTextInBody, excelRouter);
sentimentRouter.post("/", expectTextInBody, postHandler);

export default sentimentRouter;
