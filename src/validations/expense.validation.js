export const validateCreateExpense = (req, res, next) => {
  const { userId, title, amount, category, description } = req.body;

  if (userId === undefined || userId === null) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  if (!Number.isInteger(Number(userId)) || Number(userId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "userId must be a valid positive integer",
    });
  }

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  if (amount === undefined || amount === null || amount === "") {
    return res.status(400).json({
      success: false,
      message: "Amount is required",
    });
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Amount must be greater than 0",
    });
  }

  if (!category || typeof category !== "string" || !category.trim()) {
    return res.status(400).json({
      success: false,
      message: "Category is required",
    });
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== "string") {
      return res.status(400).json({
        success: false,
        message: "Description must be a string",
      });
    }
  }

  next();
};

export const validateUpdateExpense = (req, res, next) => {
  const { title, amount, category, description } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one field is required for update",
    });
  }

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title must be a valid string",
      });
    }
  }

  if (amount !== undefined) {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }
  }

  if (category !== undefined) {
    if (typeof category !== "string" || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category must be a valid string",
      });
    }
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== "string") {
      return res.status(400).json({
        success: false,
        message: "Description must be a string",
      });
    }
  }

  next();
};


export const validateExpenseQuery = (req, res, next) => {
  const {
    page = "1",
    limit = "10",
    userId,
    category,
    fromDate,
    toDate,
  } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Page must be a positive integer",
    });
  }

  if (
    !Number.isInteger(limitNumber) ||
    limitNumber <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Limit must be a positive integer",
    });
  }

  if (limitNumber > 100) {
    return res.status(400).json({
      success: false,
      message: "Limit cannot be greater than 100",
    });
  }

  if (userId !== undefined) {
    const userIdNumber = Number(userId);

    if (
      !Number.isInteger(userIdNumber) ||
      userIdNumber <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "userId must be a valid positive integer",
      });
    }
  }

  if (category !== undefined) {
    if (
      typeof category !== "string" ||
      !category.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Category must be a valid string",
      });
    }
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (fromDate !== undefined && !dateRegex.test(fromDate)) {
    return res.status(400).json({
      success: false,
      message: "fromDate must use YYYY-MM-DD format",
    });
  }

  if (toDate !== undefined && !dateRegex.test(toDate)) {
    return res.status(400).json({
      success: false,
      message: "toDate must use YYYY-MM-DD format",
    });
  }

  if (fromDate && toDate) {
    const startDate = new Date(`${fromDate}T00:00:00.000Z`);
    const endDate = new Date(`${toDate}T00:00:00.000Z`);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range",
      });
    }

    if (startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "fromDate cannot be greater than toDate",
      });
    }
  }

  next();
};