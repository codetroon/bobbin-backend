import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL as string },
  });

  if (!existingAdmin) {
    // Create default admin user
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASS as string,
      12,
    );

    await prisma.user.create({
      data: {
        name: "Admin User",
        email: process.env.ADMIN_EMAIL as string,
        password: hashedPassword,
        role: "super_admin",
      },
    });

    console.log("Default admin user created:");
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
      ],
    });
    console.log("Sample categories created");
  }

  // Create default hero settings if none exist
  const heroSettingsCount = await prisma.heroSettings.count();
  if (heroSettingsCount === 0) {
    await prisma.heroSettings.create({
      data: {
        title: "Elevate Your Style",
        subtitle:
          "Discover premium essentials crafted for the modern gentleman. Quality that speaks, comfort that lasts.",
        primaryBtnText: "Shop Now",
        primaryBtnLink: "/products",
        secondaryBtnText: "Learn More",
        secondaryBtnLink: "/about",
        isActive: true,
      },
    });
    console.log("Default hero settings created");
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
