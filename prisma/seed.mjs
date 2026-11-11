import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  const hashedPassword = await bcrypt.hash("123456", 12);

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "Anuphap Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "Administrator",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
    });
    console.log("✓ Default admin user seeded successfully in SQLite database (admin@example.com / 123456)");
  } else {
    // Update password hash just in case
    await prisma.user.update({
      where: { email: adminEmail },
      data: { password: hashedPassword },
    });
    console.log("✓ Admin user updated with secure bcrypt hash");
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
