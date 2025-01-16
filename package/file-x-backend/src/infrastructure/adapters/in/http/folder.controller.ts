import { Elysia } from 'elysia';
import { GetFolder } from '../../../../application/usecases/folder/get-folders.usecase';
import { CreateFolder } from '../../../../application/usecases/folder/create-folder.usecase';
import type { CreateFolderUsecase, DeleteFolderUseCase, GetFolderUsecase, UpdateFolderUseCase } from '../../../../domain/ports/in/folder.port';
import type { DeleteFolder } from '../../../../application/usecases/folder/delete-folder.usecase';
import { ResponseFormatter } from '../../../utility/response.formatter';

export class FolderController {
    constructor(
        private readonly getFoldersUseCase: GetFolder,
        private readonly createFolderUseCase: CreateFolder,
        private readonly deleteFolderUseCase: DeleteFolder,
        private readonly updateFolderUseCase: any
    ) {}

    register(app: Elysia) :  Elysia {
         app
            .get('/api/v1/folders', async ({ query }) => {
                try {
                    const folder : GetFolderUsecase = {
                        parent_id: query.parent_id ? Number(query.parent_id) : null
                    }
    
                    const folders = await this.getFoldersUseCase.execute(folder);
                    console.log(folders);
                    return ResponseFormatter.success(200, 'Folders fetched successfully', folders)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    return ResponseFormatter.error(500, 'Internal server error', errorMessage)
                }
            })
            .post('/api/v1/folders', async ({ body }: { body: CreateFolderUsecase }) => {
                try {
                    const folder = await this.createFolderUseCase.execute(body)
                    return ResponseFormatter.success(201, 'Folder created successfully', folder)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    return ResponseFormatter.error(500, 'Internal server error', errorMessage)
                } 
            })
            .delete('/api/v1/folders/:id', async ({params}) => {
                const folder: DeleteFolderUseCase = {
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
            .put('api/v1/folders/:id', async ({ params, body }: { params: { id: string }, body: UpdateFolderUseCase }) => {
                const data: UpdateFolderUseCase = {
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