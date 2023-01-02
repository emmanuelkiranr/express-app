import express from "express";
import movieController from "../controller/movieController.js";

const router = express.Router();

router.get("/", movieController.index);
router.get("/create", movieController.create);
router.post("/create", movieController.createPost);
router.get("/update/:id", movieController.update);
router.post("/update/:id", movieController.updatePost);
router.get("/delete/:id", movieController._delete);

export default router;
