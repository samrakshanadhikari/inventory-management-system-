import { PrismaClient, Role, AssetStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  await prisma.user.upsert({ 
    where: { email: "admin@example.com" }, 
    create: { email: "admin@example.com", name: "Admin", role: Role.ADMIN }, 
    update: {} 
  });
  
  await prisma.user.upsert({ 
    where: { email: "staff1@example.com" }, 
    create: { email: "staff1@example.com", name: "Staff One", role: Role.STAFF }, 
    update: {} 
  });
  
  await prisma.user.upsert({ 
    where: { email: "staff2@example.com" }, 
    create: { email: "staff2@example.com", name: "Staff Two", role: Role.STAFF }, 
    update: {} 
  });
  
  const v1 = await prisma.vendor.upsert({ 
    where: { name: "Dell" }, 
    create: { name: "Dell", contactEmail: "support@dell.com" }, 
    update: {} 
  });
  
  await prisma.asset.createMany({
    data: [
      { tag: "LT-001", name: "Latitude 5440", status: AssetStatus.AVAILABLE, vendorId: v1.id },
      { tag: "LT-002", name: "Latitude 5450", status: AssetStatus.CHECKED_OUT, vendorId: v1.id }
    ],
    skipDuplicates: true
  });
  
  console.log("Seed complete");
  await prisma.$disconnect();
}

run().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
