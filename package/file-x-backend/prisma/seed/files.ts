import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clear existing files
    await prisma.files.deleteMany();

    // Get all folder IDs to randomly assign files to folders
    const folders = await prisma.folders.findMany({
        select: { id: true }
    });
    const folderIds = folders.map(folder => folder.id);

    // Constants for file generation
    const TOTAL_FILES = 100000;
    let fileCount = 0;

    // Create files
    const files = [];
    while (fileCount < TOTAL_FILES) {
        // Randomly decide if file should have a parent folder (70% chance)
        const hasParent = Math.random() < 0.7;
        const folder_id = hasParent ? folderIds[Math.floor(Math.random() * folderIds.length)] : null;

        // Make file name unique by including the file count
        const fileName = `File ${fileCount + 1}${hasParent ? ' (In Folder)' : ' (Root)'}`;
        const file = await prisma.files.create({
            data: {
                name: fileName,
                folder_id: folder_id
            }
        });

        files.push(file);
        fileCount++;
        console.log(`Created: ${file.name}`);
    }

    console.log(`Seeding completed! Created ${files.length} files`);
    // Log statistics
    const rootFiles = files.filter(f => !f.folder_id).length;
    console.log(`- Root files: ${rootFiles}`);
    console.log(`- Files in folders: ${files.length - rootFiles}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
