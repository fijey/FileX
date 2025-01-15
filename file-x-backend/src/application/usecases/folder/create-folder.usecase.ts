// src/application/usecases/folder/create-folder.usecase.ts
import { Folder } from '../../../domain/entities/folder.entity';
import type { CreateFolderInterface } from '../../../domain/ports/in/folder.port';
import type { FolderRepositoryPort } from '../../../domain/ports/out/folder-repository.port';

export class CreateFolderUseCase {
    constructor(private folderRepository: FolderRepositoryPort) {}

    async execute(createFolderCommand: CreateFolderInterface): Promise<Folder> {
        return this.folderRepository.create(createFolderCommand);
    }
}