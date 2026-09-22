import { Router } from "express";
import {
  create,
  getAll,
  getById,
  update,
  remove,
  getSummary,
} from "../controllers/expense.controller.js";
import {
  validateCreateExpense,
  validateUpdateExpense,
  validateExpenseQuery,
} from "../validations/expense.validation.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  validateCreateExpense,
  create
);

router.get(
  "/",
  authenticate,
  getAll
);

router.get(
  "/summary",
  authenticate,
  validateExpenseQuery,
  getSummary
);

router.get(
  "/:id",
  authenticate,
  getById
);

router.put(
  "/:id",
  authenticate,
  validateUpdateExpense,
  update
);

router.delete(
  "/:id",
  authenticate,
  remove
);

export default router;