# Database Schema Update Required

After removing the `estimatedHours` field, you need to update your database schema.

## Option 1: Using Prisma (Recommended)

If you have database access:

```bash
# Update the database schema
npx prisma db push

# Or if using migrations
npx prisma migrate dev --name remove_estimated_hours
```

## Option 2: Manual SQL Update

If you need to update the database manually, run this SQL:

```sql
-- Remove the estimatedHours column
ALTER TABLE homeworks DROP COLUMN IF EXISTS "estimatedHours";
```

## Option 3: Reset Database (Development Only)

⚠️ **WARNING: This will delete all data!**

```bash
# Reset and reseed
npx prisma migrate reset
npm run db:seed
```

## Verify the Update

After updating, verify the schema:

```bash
npx prisma studio
```

Or check the table structure in your database client.


