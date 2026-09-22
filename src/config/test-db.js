import "dotenv/config";
import prisma from "./prisma.js";

try {
  await prisma.$connect();

  console.log("Database connected successfully");
} catch (error) {
  console.error("Database connection failed:", error.message);
} finally {
  await prisma.$disconnect();
}