import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.folders.deleteMany(); // Clear existing folders

  // Reset auto-increment (MySQL example, adjust for other databases)

  // Constants for folder generation
  const TOTAL_FOLDERS = 100000;
  let folderCount = 0;

  // Recursive function to create folders
  async function createFolders(parentId, level, prefix) {
    if (folderCount >= TOTAL_FOLDERS) return;

    const maxFoldersPerLevel = 10; // Adjust to control branching
    for (let i = 0; i < maxFoldersPerLevel; i++) {
      if (folderCount >= TOTAL_FOLDERS) break;

      const folderName = `${prefix}Folder ${((folderCount % maxFoldersPerLevel) + 1)}`;
      const newFolder = await prisma.folders.create({
        data: {
          name: folderName,
          parent_id: parentId
        }
      });

      folderCount++;
      console.log(`Created: ${newFolder.name}`);

      // Recursively create subfolders if under the folder limit
      if (level < 3) { // Limit depth to avoid performance issues
        await createFolders(newFolder.id, level + 1, `${folderName} > `);
      }
    }
  }

  // Create root-level folders and start recursion
  for (let i = 0; i < 10; i++) {
    if (folderCount >= TOTAL_FOLDERS) break;

    const rootFolderName = `Root Folder ${(i + 1)}`;
    const rootFolder = await prisma.folders.create({
      data: {
        name: rootFolderName
      }
    });

    folderCount++;
    console.log(`Created: ${rootFolder.name}`);

    await createFolders(rootFolder.id, 1, `${rootFolderName} > `);
  }

  console.log(`Seeding completed! Created ${folderCount} folders.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
