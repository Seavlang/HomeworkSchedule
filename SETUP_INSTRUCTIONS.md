# Setup Instructions

This guide will help you set up and run the Homework Schedule Manager project after cloning the repository.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 20 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** (version 14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

## Option 1: Local Development Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd homeworksched
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Or create a new `.env` file with the following content:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/homeworksched?schema=public"
```

**Replace the following:**
- `username` - Your PostgreSQL username (default: `postgres`)
- `password` - Your PostgreSQL password
- `localhost:5432` - Your PostgreSQL host and port
- `homeworksched` - Your database name

### Step 4: Set Up the Database

1. **Create the database:**
   ```bash
   # Using psql
   psql -U postgres
   CREATE DATABASE homeworksched;
   \q
   ```

   Or use your preferred PostgreSQL client to create a database named `homeworksched`.

2. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

3. **Run database migrations:**
   ```bash
   npm run db:push
   ```
   
   Or if you prefer migrations:
   ```bash
   npm run db:migrate
   ```

4. **Seed the database (optional):**
   ```bash
   npm run db:seed
   ```

### Step 5: Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Option 2: Docker Setup (Recommended)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd homeworksched
```

### Step 2: Create Environment File

Create a `.env` file in the root directory:

```env
POSTGRES_USER=homeworkuser
POSTGRES_PASSWORD=homeworkpass
POSTGRES_DB=homeworksched
POSTGRES_PORT=5432
APP_PORT=3000
DATABASE_URL=postgresql://homeworkuser:homeworkpass@postgres:5432/homeworksched?schema=public
```

**Note:** Change the passwords for production use!

### Step 3: Build and Start with Docker

```bash
docker-compose up -d --build
```

This will:
- Build the Next.js application
- Start PostgreSQL database
- Run database migrations
- Seed the database
- Start the application

### Step 4: Access the Application

Open your browser and navigate to: `http://localhost:3000`

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes database)
docker-compose down -v

# Rebuild after code changes
docker-compose up -d --build
```

For more Docker commands, see [DOCKER.md](./DOCKER.md)

## Troubleshooting

### Database Connection Issues

**Local Setup:**
- Verify PostgreSQL is running: `pg_isready` or check your PostgreSQL service
- Check your `DATABASE_URL` in `.env` matches your PostgreSQL credentials
- Ensure the database exists: `psql -U postgres -l` to list databases

**Docker Setup:**
- Check if database container is running: `docker-compose ps`
- View database logs: `docker-compose logs postgres`
- Verify environment variables in `.env` file

### Port Already in Use

If port 3000 is already in use:

**Local Setup:**
- Change the port in `package.json` scripts or use: `PORT=3001 npm run dev`

**Docker Setup:**
- Change `APP_PORT` in `.env` file to a different port (e.g., `3001`)

### Prisma Issues

If you encounter Prisma-related errors:

```bash
# Regenerate Prisma Client
npm run db:generate

# Reset database (⚠️ deletes all data)
npm run db:push -- --force-reset

# Or with migrations
npm run db:migrate -- --name reset
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
homeworksched/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── page.tsx           # Main page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...               # Feature components
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   └── prisma.ts        # Prisma client
├── prisma/               # Prisma files
│   ├── schema.prisma    # Database schema
│   └── seed.ts         # Database seed file
├── types/               # TypeScript types
├── docker-compose.yml   # Docker configuration
├── Dockerfile          # Docker image definition
└── package.json        # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database

## Next Steps

After setup:

1. **Explore the application:**
   - Switch between Teacher and Student views
   - Create homework assignments
   - Filter by subjects
   - View homework on the calendar

2. **Customize:**
   - Modify subjects in `types/index.ts`
   - Adjust colors in `types/index.ts` (SUBJECT_COLORS)
   - Update seed data in `prisma/seed.ts`

3. **Development:**
   - Make changes to components
   - The dev server will hot-reload automatically
   - Check browser console for errors

## Need Help?

- Check the [DOCKER.md](./DOCKER.md) for Docker-specific help
- Review the [README.md](./README.md) for project overview
- Check Prisma documentation: https://www.prisma.io/docs
- Check Next.js documentation: https://nextjs.org/docs

## Production Deployment

For production deployment, see [DOCKER.md](./DOCKER.md) for Docker setup or follow your hosting provider's instructions for Next.js applications.

**Important:** Always change default passwords and use secure environment variables in production!
