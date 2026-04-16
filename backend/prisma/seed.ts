import { PrismaClient, ExpenseCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Password@123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@expensetracker.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@expensetracker.com",
      password
    }
  });

  await prisma.expense.createMany({
    data: [
      {
        title: "Lunch",
        amount: "12.50",
        category: ExpenseCategory.FOOD,
        date: new Date(),
        userId: user.id
      },
      {
        title: "Bus Ticket",
        amount: "3.75",
        category: ExpenseCategory.TRANSPORT,
        date: new Date(),
        userId: user.id
      },
      {
        title: "Electricity Bill",
        amount: "85.20",
        category: ExpenseCategory.BILLS,
        date: new Date(),
        userId: user.id
      }
    ],
    skipDuplicates: true
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seeding failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
