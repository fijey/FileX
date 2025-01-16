import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { CreateFolderUseCase } from '../../../folder/create-folder.usecase';
import type { FolderRepository } from '../../../../../domain/ports/out/folder-repository.port';
import { Folder } from '../../../../../domain/entities/folder.entity';

describe('CreateFolderUseCase', () => {
    let useCase: CreateFolderUseCase;
    let mockRepository: jest.Mocked<FolderRepository>;

    beforeEach(() => {
        mockRepository = {
            create: jest.fn(),
            findByParentId: jest.fn(), 
            update: jest.fn(),
            delete: jest.fn()
        };
        useCase = new CreateFolderUseCase(mockRepository);
    });

    it('should create a folder successfully', async () => {
        const expectedFolder = new Folder({
            id: 1,
            name: 'folderku',
            parent_id: 1
        });

        mockRepository.create.mockResolvedValue(expectedFolder);

        const command = {
            name: 'folderku',
            parent_id: 1
        };

        
        const result = await useCase.execute(command);
        const {id, ...resultWithoutId} = result;

        expect(mockRepository.create).toHaveBeenCalledWith(command);
        expect(resultWithoutId).toEqual(command);
        expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
});