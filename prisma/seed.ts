import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@bobbin.com" },
  });

  if (!existingAdmin) {
    // Create default admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);

    await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@bobbin.com",
        password: hashedPassword,
        role: "super_admin",
      },
    });

    console.log("Default admin user created:");
    console.log("Email: admin@bobbin.com");
    console.log("Password: admin123");
  } else {
    console.log("Admin user already exists");
  }

  // Create sample categories if none exist
  const categoryCount = await prisma.category.count();
  if (categoryCount === 0) {
    await prisma.category.createMany({
      data: [
        { name: "T-Shirts" },
        { name: "Punjabi" },
        { name: "Joggers" },
        { name: "Hoodies" },
        { name: "Casual Wear" },
        { name: "Formal Wear" },
      ],
    });
    console.log("Sample categories created");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
