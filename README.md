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

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd homeworksched
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/homeworksched?schema=public"
```

4. Set up the database:
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (or use migrations)
npm run db:push

# Seed the database with sample data
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

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
