import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/authentication.middelware.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/getCurrentUser").get(verifyJwt, getCurrentUser);

export default router;