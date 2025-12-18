import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

// Load environment variables
config();

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set in environment variables");
  console.error("Please ensure your .env file contains DATABASE_URL or it's set in your environment");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.homework.deleteMany();

  // Create sample homeworks
  const homeworks = [
    {
      subject: "Web",
      title: "React Component Library",
      description: "Build a reusable component library with 10 components",
      assignedDate: new Date("2024-01-15"),
      dueDate: new Date("2024-01-22"),
      createdBy: "Prof. Smith",
    },
    {
      subject: "Java",
      title: "Spring Boot REST API",
      description: "Create a RESTful API with CRUD operations",
      assignedDate: new Date("2024-01-16"),
      dueDate: new Date("2024-01-25"),
      createdBy: "Prof. Johnson",
    },
    {
      subject: "Database",
      title: "SQL Query Optimization",
      description: "Optimize 5 complex queries and write a report",
      assignedDate: new Date("2024-01-17"),
      dueDate: new Date("2024-01-24"),
      createdBy: "Prof. Williams",
    },
    {
      subject: "Spring",
      title: "Dependency Injection Practice",
      description: "Implement DI patterns in a sample application",
      assignedDate: new Date("2024-01-18"),
      dueDate: new Date("2024-01-26"),
      createdBy: "Prof. Johnson",
    },
    {
      subject: "Git",
      title: "Version Control Workflow",
      description: "Create a branching strategy document",
      assignedDate: new Date("2024-01-19"),
      dueDate: new Date("2024-01-23"),
      createdBy: "Prof. Davis",
    },
    {
      subject: "UX/UI",
      title: "Design System Creation",
      description: "Design a complete design system with components",
      assignedDate: new Date("2024-01-20"),
      dueDate: new Date("2024-01-27"),
      createdBy: "Prof. Martinez",
    },
    {
      subject: "Deployment",
      title: "CI/CD Pipeline Setup",
      description: "Set up automated deployment pipeline",
      assignedDate: new Date("2024-01-21"),
      dueDate: new Date("2024-01-28"),
      createdBy: "Prof. Anderson",
    },
  ];

  for (const homework of homeworks) {
    await prisma.homework.create({
      data: homework,
    });
  }

  console.log(`Created ${homeworks.length} homework assignments`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

