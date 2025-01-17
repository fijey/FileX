import { Elysia } from 'elysia';
import { GetFolderUseCase } from '../../../../application/usecases/folder/get-folders.usecase';
import { CreateFolderUseCase } from '../../../../application/usecases/folder/create-folder.usecase';
import type { CreateFolderCommand, DeleteFolderCommand, GetFolderQuery, UpdateFolderCommand } from '../../../../domain/ports/in/folder.port';
import type { DeleteFolderUseCase } from '../../../../application/usecases/folder/delete-folder.usecase';
import { ResponseFormatter } from '../../../utility/response.formatter';
import type { UpdateFolderUseCase } from '../../../../application/usecases/folder/update-folder.usecase';

export class FolderController {
    constructor(
        private readonly getFoldersUseCase: GetFolderUseCase,
        private readonly createFolderUseCase: CreateFolderUseCase,
        private readonly deleteFolderUseCase: DeleteFolderUseCase,
        private readonly updateFolderUseCase: UpdateFolderUseCase
    ) {}

    register(app: Elysia) :  Elysia {
         app
            .get('/api/v1/folders', async ({ query }) => {
                try {
                    const folder: GetFolderQuery = {
                        parent_id: query.parent_id ? Number(query.parent_id) : null
                    };

                    const pagination = query.page && query.limit ? {
                        page: Number(query.page),
                        limit: Number(query.limit)
                    } : { page: 1, limit: 10 };

                    const result = await this.getFoldersUseCase.execute(folder, pagination, query.search || '');
                    
                    return ResponseFormatter.success(200, 'Folders fetched successfully', {
                        data: result.data,
                        total: result.total,
                        hasMore: pagination ? 
                            (result.total || 0) > (pagination.page * pagination.limit) : 
                            false
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    return ResponseFormatter.error(500, 'Internal server error', errorMessage);
                }
            })
            .post('/api/v1/folders', async ({ body }: { body: CreateFolderCommand }) => {
                try {
                    const folder = await this.createFolderUseCase.execute(body)
                    return ResponseFormatter.success(201, 'Folder created successfully', folder)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    return ResponseFormatter.error(500, 'Internal server error', errorMessage)
                } 
            })
            .delete('/api/v1/folders/:id', async ({params}) => {
                const folder: DeleteFolderCommand = {
                    id: Number(params.id)
                } 

                try {
                    const deleted = await this.deleteFolderUseCase.execute(folder)
                    return ResponseFormatter.success(200, 'Folder deleted successfully', deleted)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    return ResponseFormatter.error(500, 'Internal server error', errorMessage)
                }

            })
            .put('api/v1/folders/:id', async ({ params, body }: { params: { id: string }, body: UpdateFolderCommand }) => {
                const data: UpdateFolderCommand = {
                    ...body,
                    id: Number(params.id)
                };

                try {
                    const updated = await this.updateFolderUseCase.execute(data);
                    return ResponseFormatter.success(200, 'Folder updated successfully', updated)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    return ResponseFormatter.error(500, 'Internal server error', errorMessage)
                }

            });

        return app
    }
}