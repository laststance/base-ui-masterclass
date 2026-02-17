import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

/**
 * Singleton Prisma client instance.
 * In development, reuses the same instance across hot reloads to prevent
 * exhausting database connections.
 *
 * @example
 * import { prisma } from "@base-ui-masterclass/database";
 * const users = await prisma.user.findMany();
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "@prisma/client";
