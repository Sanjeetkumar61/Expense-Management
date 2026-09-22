import { Router } from "express";
import { create } from "../controllers/user.controller.js";
import { validateCreateUser } from "../validations/user.validation.js";

const router = Router();

router.post("/", validateCreateUser, create);

export default router;