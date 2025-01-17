import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting file seeding...");

  // Clear existing files
  await prisma.files.deleteMany();
  console.log("Existing files cleared.");

  // Get all folder IDs to assign files
  const folders = await prisma.folders.findMany({
    select: { id: true },
  });
  const folderIds = folders.map((folder) => folder.id);

  if (folderIds.length === 0) {
    console.error("No folders found! Ensure folders are seeded before running this script.");
    return;
  }

  // Constants for file generation
  const TOTAL_FILES = 1000; // Total files to create
  let fileCount = 0;

  // Create files
  while (fileCount < TOTAL_FILES) {
    // Randomly assign a folder
    const folder_id = folderIds[Math.floor(Math.random() * folderIds.length)];

    // Create a unique file name
    const fileName = `File ${fileCount + 1}`;
    const file = await prisma.files.create({
      data: {
        name: fileName,
        folder_id: folder_id, // File must belong to a folder
      },
    });

    fileCount++;
    console.log(`Created: ${file.name} in Folder ID: ${folder_id}`);
  }

  console.log(`Seeding completed! Created ${fileCount} files.`);
}

main()
  .catch((e) => {
    console.error("Error occurred during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
