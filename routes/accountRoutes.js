import express from "express";
import accountsController from "../controller/accountsController.js";

const router = express.Router();

router.get("/login", accountsController.login);
router.post("/login", accountsController.loginPost);
router.get("/register", accountsController.register);
router.post("/register", accountsController.registerPost);

export default router;
