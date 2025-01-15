-- CreateTable
CREATE TABLE `Files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `folder_id` INTEGER NULL,

    UNIQUE INDEX `Files_name_key`(`name`),
    INDEX `Files_folder_id_name_idx`(`folder_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Folders_parent_id_name_idx` ON `Folders`(`parent_id`, `name`);

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_folder_id_fkey` FOREIGN KEY (`folder_id`) REFERENCES `Folders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
