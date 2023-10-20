import express from "express";
import postHandler from "./post.js";

const excelRouter = express.Router();
excelRouter.post("/", postHandler);

export default excelRouter;
