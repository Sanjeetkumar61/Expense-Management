import prisma from "../config/prisma.js";

export const createExpense = async ({
  userId,
  title,
  amount,
  category,
  description,
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.expense.create({
    data: {
      userId: Number(userId),
      title: title.trim(),
      amount: Number(amount),
      category: category.trim(),
      description: description?.trim() || null,
    },
  });
};

export const getExpenses = async ({
  page = 1,
  limit = 10,
  userId,
  category,
  fromDate,
  toDate,
}) => {
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber <= 0 ||
    !Number.isInteger(limitNumber) ||
    limitNumber <= 0
  ) {
    const error = new Error("Page and limit must be positive integers");
    error.statusCode = 400;
    throw error;
  }

  const skip = (pageNumber - 1) * limitNumber;

  const where = {};

  if (userId !== undefined) {
    where.userId = Number(userId);
  }

  if (category !== undefined) {
    where.category = {
      equals: category.trim(),
      mode: "insensitive",
    };
  }

  if (fromDate || toDate) {
    where.createdAt = {};

    if (fromDate) {
      where.createdAt.gte = new Date(
        `${fromDate}T00:00:00.000Z`
      );
    }

    if (toDate) {
      where.createdAt.lte = new Date(
        `${toDate}T23:59:59.999Z`
      );
    }
  }

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.expense.count({
      where,
    }),
  ]);

  return {
    data: expenses,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};


export const getExpenseById = async (id) => {
  const expenseId = Number(id);

  if (!Number.isInteger(expenseId) || expenseId <= 0) {
    const error = new Error("Invalid expense ID");
    error.statusCode = 400;
    throw error;
  }

  const expense = await prisma.expense.findUnique({
    where: {
      id: expenseId,
    },
  });

  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  return expense;
};


export const updateExpense = async (
  id,
  { title, amount, category, description }
) => {
  const expenseId = Number(id);

  if (!Number.isInteger(expenseId) || expenseId <= 0) {
    const error = new Error("Invalid expense ID");
    error.statusCode = 400;
    throw error;
  }

  const existingExpense = await prisma.expense.findUnique({
    where: {
      id: expenseId,
    },
  });

  if (!existingExpense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  const data = {};

  if (title !== undefined) {
    data.title = title.trim();
  }

  if (amount !== undefined) {
    data.amount = Number(amount);
  }

  if (category !== undefined) {
    data.category = category.trim();
  }

  if (description !== undefined) {
    data.description = description?.trim() || null;
  }

  return prisma.expense.update({
    where: {
      id: expenseId,
    },
    data,
  });
};


export const deleteExpense = async (id) => {
  const expenseId = Number(id);

  if (!Number.isInteger(expenseId) || expenseId <= 0) {
    const error = new Error("Invalid expense ID");
    error.statusCode = 400;
    throw error;
  }

  const existingExpense = await prisma.expense.findUnique({
    where: {
      id: expenseId,
    },
  });

  if (!existingExpense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.expense.delete({
    where: {
      id: expenseId,
    },
  });
};

export const getExpenseSummary = async ({
  userId,
  category,
  fromDate,
  toDate,
}) => {
  const where = {};

  if (userId !== undefined) {
    where.userId = Number(userId);
  }

  if (category !== undefined) {
    where.category = {
      equals: category.trim(),
      mode: "insensitive",
    };
  }

  if (fromDate || toDate) {
    where.createdAt = {};

    if (fromDate) {
      where.createdAt.gte = new Date(
        `${fromDate}T00:00:00.000Z`
      );
    }

    if (toDate) {
      where.createdAt.lte = new Date(
        `${toDate}T23:59:59.999Z`
      );
    }
  }

  const [aggregate, categorySummary] = await Promise.all([
    prisma.expense.aggregate({
      where,
      _count: {
        id: true,
      },
      _sum: {
        amount: true,
      },
      _avg: {
        amount: true,
      },
    }),

    prisma.expense.groupBy({
      by: ["category"],
      where,
      _sum: {
        amount: true,
      },
      orderBy: {
        category: "asc",
      },
    }),
  ]);

  return {
    totalExpenses: aggregate._count.id,
    totalAmount: aggregate._sum.amount || 0,
    averageExpense: aggregate._avg.amount || 0,
    byCategory: categorySummary.map((item) => ({
      category: item.category,
      totalAmount: item._sum.amount || 0,
    })),
  };
};