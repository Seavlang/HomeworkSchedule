// Fix database schema by removing estimatedHours column
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixSchema() {
  try {
    console.log('Fixing database schema - removing estimatedHours column if exists...');
    
    // Remove estimatedHours column if it exists
    await prisma.$executeRawUnsafe(`
      ALTER TABLE homeworks DROP COLUMN IF EXISTS "estimatedHours";
    `);
    
    console.log('Schema fix completed successfully');
  } catch (error) {
    console.error('Error fixing schema:', error?.message || error);
    // Don't throw - allow app to start even if fix fails
  } finally {
    await prisma.$disconnect();
  }
}

fixSchema().catch(console.error);
