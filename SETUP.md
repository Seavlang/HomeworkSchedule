# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Database**
   - Create a PostgreSQL database
   - Update `prisma.config.ts` with your database URL, or set `DATABASE_URL` environment variable
   - Example `.env` file:
     ```
     DATABASE_URL="postgresql://user:password@localhost:5432/homeworksched?schema=public"
     ```

3. **Initialize Database**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup Options

### Option 1: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database:
   ```sql
   CREATE DATABASE homeworksched;
   ```
3. Update `DATABASE_URL` in your environment

### Option 2: Cloud Database (Recommended for Development)
- **Supabase**: Free PostgreSQL hosting
- **Neon**: Serverless PostgreSQL
- **Railway**: Easy PostgreSQL setup
- **Vercel Postgres**: Integrated with Vercel deployments

## Troubleshooting

### Prisma Client Not Found
If you see errors about Prisma Client, run:
```bash
npm run db:generate
```

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running (if local)
- Check firewall settings (if cloud)

### Migration Issues
If you need to reset the database:
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or push schema again
npm run db:push
```

## Production Deployment

1. Set up production PostgreSQL database
2. Update `DATABASE_URL` environment variable
3. Run migrations:
   ```bash
   npm run db:migrate
   ```
4. Build and deploy:
   ```bash
   npm run build
   npm start
   ```

