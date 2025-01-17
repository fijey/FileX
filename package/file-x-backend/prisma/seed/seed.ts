import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("\n🌱 Starting seeding process...\n");

  await prisma.$transaction([
    prisma.files.deleteMany(),
    prisma.folders.deleteMany()
  ]);

  const TOTAL_ROOT_FOLDERS = 1;
  const FOLDERS_PER_LEVEL = 100;
  const FILES_PER_FOLDER = 100;
  const MAX_DEPTH = 2;
  const BATCH_SIZE = 1000;
  let folderCount = 0;
  let fileCount = 0;

  async function createFolderBatch(folders: { name: string; parent_id: number | null }[]) {
    await prisma.folders.createMany({
      data: folders,
      skipDuplicates: true,
    });
    folderCount += folders.length;
    console.log(`📂 Created ${folders.length} folders (Total: ${folderCount})`);
  }

  async function createFileBatch(files: { name: string; folder_id: number }[]) {
    await prisma.files.createMany({
      data: files,
      skipDuplicates: true,
    });
    fileCount += files.length;
    console.log(`📄 Created ${files.length} files (Total: ${fileCount})`);
  }

  async function createHierarchy(parentId: number, level: number, prefix: string) {
    if (level > MAX_DEPTH) return;

    // Create folders in batches
    const folderBatches = [];
    for (let i = 0; i < FOLDERS_PER_LEVEL; i += BATCH_SIZE) {
      const batch = Array.from({ length: Math.min(BATCH_SIZE, FOLDERS_PER_LEVEL - i) })
        .map((_, index) => ({
          name: `${prefix}Folder ${i + index + 1}`,
          parent_id: parentId
        }));
      folderBatches.push(batch);
    }

    for (const batch of folderBatches) {
      await createFolderBatch(batch);
      
      // Get created folders
      const createdFolders = await prisma.folders.findMany({
        where: {
          parent_id: parentId,
          name: { in: batch.map(f => f.name) }
        }
      });

      // Create files for each folder in batch
      for (const folder of createdFolders) {
        const fileBatches = [];
        for (let j = 0; j < FILES_PER_FOLDER; j += BATCH_SIZE) {
          const fileBatch = Array.from({ length: Math.min(BATCH_SIZE, FILES_PER_FOLDER - j) })
            .map((_, index) => ({
              name: `${folder.name} - File ${j + index + 1}`,
              folder_id: folder.id
            }));
          fileBatches.push(fileBatch);
        }

        await Promise.all(fileBatches.map(createFileBatch));

        if (level < MAX_DEPTH) {
          await createHierarchy(folder.id, level + 1, `${folder.name}/`);
        }
      }
    }
  }

  // Create root folders in batch
  const rootFolders = Array.from({ length: TOTAL_ROOT_FOLDERS })
    .map((_, i) => ({
      name: `Root ${i + 1}`,
      parent_id: null
    }));
  
  await createFolderBatch(rootFolders);

  const createdRoots = await prisma.folders.findMany({
    where: { parent_id: null }
  });

  for (const root of createdRoots) {
    console.log(`\n🌳 Processing Root ${root.name}`);
    await createHierarchy(root.id, 1, `${root.name}/`);
  }

  console.log(`\n🎉 Seeding completed!`);
  console.log(`📊 Final counts:`);
  console.log(`- Total folders: ${folderCount}`);
  console.log(`- Total files: ${fileCount}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });