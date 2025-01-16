import { Folder } from '../../../domain/entities/folder.entity';
import type { CreateFolderUsecase } from '../../../domain/ports/in/folder.port';
import type { FolderRepository } from '../../../domain/ports/out/folder-repository.port';

export class CreateFolder {
    constructor(private folderRepository: FolderRepository) {}

    async execute(createFolderCommand: CreateFolderUsecase): Promise<Folder> {
        return this.folderRepository.create(createFolderCommand);
    }
}