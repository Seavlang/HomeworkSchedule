# Homework Schedule Management Web Application

A modern, responsive web application designed for teachers to coordinate and assign homework without causing conflicts for students.

## Features

### Teacher View
- **Calendar View**: Monthly calendar with color-coded subjects
- **Create/Edit/Delete Homework**: Full CRUD operations for homework assignments
- **Conflict Detection**: Automatic warnings for:
  - Multiple homework deadlines on the same day
  - Total workload exceeding daily limit (4 hours)
- **Subject Filtering**: Toggle subjects on/off to focus on specific areas

### Student View
- **Dashboard**: Timeline view of upcoming homework
- **Grouped by Date**: Clear organization by due date
- **Priority Indicators**: Visual indicators for today and tomorrow
- **Workload Summary**: Total estimated hours per day

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM

## Getting Started

📖 **For detailed setup instructions, see [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)**

### Quick Start

**Option 1: Docker (Recommended)**
```bash
git clone <repository-url>
cd homeworksched
# Create .env file (see SETUP_INSTRUCTIONS.md)
docker-compose up -d --build
# Open http://localhost:3000
```

**Option 2: Local Development**
```bash
git clone <repository-url>
cd homeworksched
npm install
# Create .env file with DATABASE_URL
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
# Open http://localhost:3000
```

### Prerequisites

- Node.js 20+ (for local development)
- PostgreSQL 14+ (for local development)
- Docker & Docker Compose (for Docker setup)
- npm or yarn

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## Documentation

- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Complete setup guide for cloning and running the project
- **[DOCKER.md](./DOCKER.md)** - Docker deployment guide

## Subjects

The application supports the following predefined subjects:
- Web
- Java
- Spring
- Database
- Git
- UX/UI
- Deployment

## Database Schema

### Homework Model
- `id` (UUID, Primary Key)
- `subject` (String)
- `title` (String)
- `description` (String)
- `assignedDate` (DateTime)
- `dueDate` (DateTime)
- `estimatedHours` (Float)
- `createdBy` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## API Routes

- `GET /api/homeworks` - Get all homework assignments
- `POST /api/homeworks` - Create a new homework assignment
- `GET /api/homeworks/[id]` - Get a specific homework assignment
- `PUT /api/homeworks/[id]` - Update a homework assignment
- `DELETE /api/homeworks/[id]` - Delete a homework assignment
- `POST /api/homeworks/check-conflicts` - Check for scheduling conflicts

## Conflict Detection

The system automatically detects:
1. **Same-Day Conflicts**: Warns when multiple assignments are due on the same day
2. **Workload Exceeded**: Warns when total estimated hours exceed 4 hours per day

## Future Enhancements

- Teacher approval workflow
- AI-based workload recommendation
- Student feedback on workload
- Export schedule as PDF
- User authentication and authorization
- Multi-classroom support

## License

MIT
