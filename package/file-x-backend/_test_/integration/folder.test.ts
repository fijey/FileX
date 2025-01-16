import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { Elysia } from 'elysia';
import { FolderController } from '../../src/infrastructure/adapters/in/http/folder.controller';
import { PrismaFolderRepository } from '../../src/infrastructure/adapters/out/persistence/prisma-folder.repository';
import { GetFolderUseCase } from '../../src/application/usecases/folder/get-folders.usecase';
import { DeleteFolderUseCase } from '../../src/application/usecases/folder/delete-folder.usecase';
import { UpdateFolderUseCase } from '../../src/application/usecases/folder/update-folder.usecase';
import { CreateFolderUseCase } from '../../src/application/usecases/folder/create-folder.usecase';
import { ApiResponse } from '../../src/domain/types/response/response.types';

describe('Folder Integration Tests', () => {
  const uniqueName = `Test Folder ${Date.now()}`;
  let folderId = 0;
  let app: Elysia;
  let folderRepository: PrismaFolderRepository;

  beforeAll(async () => {
    // Setup
    app = new Elysia();
    folderRepository = new PrismaFolderRepository();
    
    const getFoldersUseCase = new GetFolderUseCase(folderRepository);
    const createFolderUseCase = new CreateFolderUseCase(folderRepository);
    const deleteFolderUseCase = new DeleteFolderUseCase(folderRepository);
    const updateFolderUseCase = new UpdateFolderUseCase(folderRepository);

    const folderController = new FolderController(
      getFoldersUseCase,
      createFolderUseCase,
      deleteFolderUseCase,
      updateFolderUseCase
    );

    folderController.register(app);
  });

  afterAll(async () => {
    // Cleanup test data
    // await folderRepository.delete({ id: 1 });
  });

  it('should create and retrieve a folder', async () => {
    // Create folder
    const createResponse = await app.handle(
      new Request('http://localhost:3000/api/v1/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: uniqueName,
          parent_id: null
        })
      })
    );

    const createResult = await createResponse.json() as ApiResponse<{ name: string, id: number }>;

    expect(createResult.status).toBe(201);
    expect(createResult.message).toBe('Folder created successfully');
    expect(createResult.data?.name).toBe(uniqueName);

    folderId = createResult.data?.id as number;

    // Get folders
    const getResponse = await app.handle(
      new Request('http://localhost:3000/api/v1/folders?parent_id=null')
    );

    const getResult = await getResponse.json() as ApiResponse<{ name: string }[]>;
    expect(getResult.status).toBe(200);
    expect(getResult.message).toBe('Folders fetched successfully');
    expect(getResult.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: uniqueName
        })
      ])
    );
  });

  it('should update a folder', async () => {
    const updateResponse = await app.handle(
      new Request(`http://localhost:3000/api/v1/folders/${folderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Updated Test Folder kebangsaan',
          parent_id: null
        })
      })
    );

    const updateResult = await updateResponse.json() as ApiResponse<{ name: string }>;

    expect(updateResult.status).toBe(200);
    expect(updateResult.message).toBe('Folder updated successfully');
    expect(updateResult.data?.name).toBe('Updated Test Folder kebangsaan');
  });

  it('should delete a folder', async () => {
    const deleteResponse = await app.handle(
      new Request(`http://localhost:3000/api/v1/folders/${folderId}`, {
        method: 'DELETE'
      })
    );

    const deleteResult = await deleteResponse.json() as ApiResponse<string>;
    expect(deleteResult.status).toBe(200);
    expect(deleteResult.message).toBe('Folder deleted successfully');
  });
});