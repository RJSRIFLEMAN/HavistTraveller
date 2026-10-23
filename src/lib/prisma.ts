import { PrismaClient } from "@prisma/client";

const prismaGlobal = globalThis as typeof globalThis & {
  havistPrisma?: PrismaClient;
};

export const prisma =
  prismaGlobal.havistPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.havistPrisma = prisma;
}
