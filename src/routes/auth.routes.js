import { Router } from "express";
import {
  register,
  login,
  getMe,
} from "../controllers/auth.controller.js";
import {
  validateRegister,
  validateLogin,
} from "../validations/auth.validation.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validateRegister, register);

router.post("/login", validateLogin, login);

router.get("/me", authenticate, getMe);

export default router;