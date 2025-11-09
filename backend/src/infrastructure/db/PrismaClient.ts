import { PrismaClient } from '@prisma/client';

// Export a single, shared instance
export const prisma = new PrismaClient();