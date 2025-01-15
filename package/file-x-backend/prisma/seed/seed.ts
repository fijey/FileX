import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.folders.deleteMany()

  // Create root folders (level 1)
  const rootFolders = []
  for (let i = 0; i < 10; i++) {
    const root = await prisma.folders.create({
      data: {
        name: `Root Folder ${i + 1}`
      }
    })
    rootFolders.push(root)
  }

  // Create subfolders (level 2)
  for (const root of rootFolders) {
    for (let i = 0; i < 10; i++) {
      const subfolder = await prisma.folders.create({
        data: {
          name: `${root.name} - Subfolder ${i + 1}`,
          parent_id: root.id
        }
      })

      // Create deeper subfolders (level 3)
      for (let j = 0; j < 10; j++) {
        await prisma.folders.create({
          data: {
            name: `${subfolder.name} - Subfolder ${j + 1}`,
            parent_id: subfolder.id
          }
        })
      }
    }
  }

  console.log('Seeding completed! Created 1110 folders')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })