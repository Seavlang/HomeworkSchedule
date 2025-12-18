#!/bin/sh

# Set database connection variables
DB_USER="${POSTGRES_USER:-homeworkuser}"
DB_PASS="${POSTGRES_PASSWORD:-homeworkpass}"
DB_NAME="${POSTGRES_DB:-homeworksched}"
DB_HOST="postgres"

# Wait for database to be ready
echo "Waiting for database to be ready..."
export PGPASSWORD="$DB_PASS"
until pg_isready -h "$DB_HOST" -U "$DB_USER" 2>/dev/null; do
  echo "Database is not ready yet. Waiting..."
  sleep 2
done
echo "Database is ready!"

# Run Prisma migrations first
echo "Running database migrations..."
export DATABASE_URL="postgresql://$DB_USER:$DB_PASS@$DB_HOST:5432/$DB_NAME?schema=public"
echo "DATABASE_URL is set: ${DATABASE_URL:0:30}..."

# Check if homeworks table exists, if not create it using SQL
TABLE_EXISTS=$(psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'homeworks');" 2>/dev/null | tr -d '[:space:]')

if [ "$TABLE_EXISTS" != "t" ]; then
  echo "Table 'homeworks' does not exist. Creating schema..."
  psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" <<EOF
CREATE TABLE IF NOT EXISTS "homeworks" (
  "id" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "assignedDate" TIMESTAMP(3) NOT NULL,
  "dueDate" TIMESTAMP(3) NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "homeworks_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "homeworks_dueDate_idx" ON "homeworks"("dueDate");
CREATE INDEX IF NOT EXISTS "homeworks_subject_idx" ON "homeworks"("subject");
EOF
  echo "Schema created successfully!"
else
  echo "Table 'homeworks' already exists. Running migrations..."
  # Try to run migrations if table exists
  npx prisma migrate deploy 2>&1 || true
fi

# Fix schema mismatch - ALWAYS remove estimatedHours column if it exists
# This is a safety measure in case the migration didn't run or the column was recreated
echo "Fixing schema mismatch (removing estimatedHours column if exists)..."
echo "Executing: ALTER TABLE homeworks DROP COLUMN IF EXISTS \"estimatedHours\";"

# Use psql directly (most reliable method)
if command -v psql > /dev/null 2>&1; then
  echo "Using psql to fix schema..."
  psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c 'ALTER TABLE homeworks DROP COLUMN IF EXISTS "estimatedHours";' 2>&1
  if [ $? -eq 0 ]; then
    echo "✓ Schema fix completed successfully via psql"
  else
    echo "⚠ psql command had issues, but continuing..."
  fi
else
  echo "⚠ psql not found, trying alternative methods..."
fi

# Also try Node.js script as backup (with DATABASE_URL set)
if [ -f "scripts/fix-schema.js" ]; then
  echo "Trying Node.js script as backup..."
  DATABASE_URL="postgresql://$DB_USER:$DB_PASS@$DB_HOST:5432/$DB_NAME?schema=public" node scripts/fix-schema.js 2>&1 || true
fi

# Verify the fix worked (only if psql is available)
if command -v psql > /dev/null 2>&1; then
  echo "Verifying schema fix..."
  RESULT=$(psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT column_name FROM information_schema.columns WHERE table_name='homeworks' AND column_name='estimatedHours';" 2>/dev/null | tr -d '[:space:]')
  if [ -z "$RESULT" ]; then
    echo "✓ Verified: estimatedHours column does not exist"
  else
    echo "⚠ Warning: estimatedHours column may still exist"
  fi
fi

# Start the application
echo "Starting application..."
exec node server.js
