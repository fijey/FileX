import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting folder seeding...");

  await prisma.folders.deleteMany(); // Clear existing folders
  console.log("Existing folders cleared.");

  const TOTAL_FOLDERS = 1000; // Total folders to create
  let folderCount = 0;

  // Recursive function to create folders
  async function createFolders(parentId: number | null, level: number, prefix: string) {
    if (folderCount >= TOTAL_FOLDERS || level > 3) return;

    const maxFoldersPerLevel = 20; // Max folders per parent
    for (let i = 0; i < maxFoldersPerLevel; i++) {
      if (folderCount >= TOTAL_FOLDERS) break;

      const folderName = `${prefix}Folder ${(folderCount % maxFoldersPerLevel) + 1}`;
      const newFolder = await prisma.folders.create({
        data: {
          name: folderName,
          parent_id: parentId,
        },
      });

      folderCount++;
      console.log(`Created: ${newFolder.name} (ID: ${newFolder.id})`);

      // Recursively create subfolders
      if (level < 3) {
        await createFolders(newFolder.id, level + 1, `${folderName} > `);
      }
    }
  }

  // Create root-level folders
  for (let i = 0; i < 10; i++) {
    if (folderCount >= TOTAL_FOLDERS) break;

    const rootFolderName = `Root Folder ${(i + 1)}`;
    const rootFolder = await prisma.folders.create({
      data: {
        name: rootFolderName,
      },
    });

    folderCount++;
    console.log(`Created: ${rootFolder.name} (ID: ${rootFolder.id})`);

    await createFolders(rootFolder.id, 1, `${rootFolderName} > `);
  }

  console.log(`Seeding completed! Created ${folderCount} folders.`);
}

main()
  .catch((e) => {
    console.error("Error occurred during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
