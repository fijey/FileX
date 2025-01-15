-- CreateTable
CREATE TABLE `Folders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `parent_id` INTEGER NULL,

    UNIQUE INDEX `Folders_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Folders` ADD CONSTRAINT `Folders_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `Folders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
