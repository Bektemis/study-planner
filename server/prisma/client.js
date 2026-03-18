const { PrismaClient } = require('@prisma/client');

// Reuse the same Prisma instance across the whole app
const prisma = new PrismaClient();

module.exports = prisma;
