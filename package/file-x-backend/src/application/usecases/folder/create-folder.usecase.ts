import { Folder } from '../../../domain/entities/folder.entity';
import type { CreateFolderCommand } from '../../../domain/ports/in/folder.port';
import type { FolderRepository } from '../../../domain/ports/out/folder-repository.port';

export class CreateFolderUseCase {
    constructor(private folderRepository: FolderRepository) {}

    async execute(createFolderCommand: CreateFolderCommand): Promise<Folder> {
        return this.folderRepository.create(createFolderCommand);
    }
}