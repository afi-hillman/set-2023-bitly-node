import express from "express";
import getRoot from "../controllers/root/getRoot";
import postRoot from "../controllers/root/postRoot";
import linkController from "../controllers/link";

const root = express.Router();

root.get("/", getRoot);
root.post("/", postRoot);
root.get("/:slug", linkController.redirect);

export default root;
