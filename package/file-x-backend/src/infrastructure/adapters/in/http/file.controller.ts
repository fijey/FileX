import { Elysia } from 'elysia';
import { CreateFile } from '../../../../application/usecases/file/create-file.usecase';
import type { GetFile } from '../../../../application/usecases/file/get-files.usecase';
import type { DeleteFile } from '../../../../application/usecases/file/delete-file.usecase';
import type { UpdateFile } from '../../../../application/usecases/file/update-file.usecase';
import type { CreateFileUsecase, DeleteFileUseCase, GetFileUsecase, UpdateFileUseCase } from '../../../../domain/ports/in/file.port';
import { ResponseFormatter } from '../../../utility/response.formatter';

// import type { CreateFolderUsecase, DeleteFolderUseCase, GetFolderUsecase, UpdateFolderUseCase } from '../../../../domain/ports/in/folder.port';
// import type { DeleteFolder } from '../../../../application/usecases/folder/delete-folder.usecase';
// import { ResponseFormatter } from '../../../utility/response.formatter';

export class FileController {
    constructor(
        private readonly getFilesUseCase: GetFile,
        private readonly createFileUseCase: CreateFile,
        private readonly deleteFileUseCase: DeleteFile,
        private readonly updateFileUseCase: UpdateFile
    ) {}

    register(app: Elysia) :  Elysia {
         app
            .get('/api/v1/files', async ({ query }) => {
                try {
                    const file : GetFileUsecase = {
                        folder_id: query.folder_id ? Number(query.folder_id) : null
                    }
    
                    const files = await this.getFilesUseCase.execute(file);

                    return ResponseFormatter.success(200, 'Files fetched successfully', files)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    return ResponseFormatter.error(500, 'Internal server error', errorMessage)
                }
            })
            .post('/api/v1/files', async ({ body }: { body: CreateFileUsecase }) => {
                try {
                    const folder = await this.createFileUseCase.execute(body)
                    return ResponseFormatter.success(201, 'Folder created successfully', folder)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    return ResponseFormatter.error(500, 'Internal server error', errorMessage)
                } 
            })
            .delete('/api/v1/files/:id', async ({params}) => {
                const folder: DeleteFileUseCase = {
                    id: Number(params.id)
                } 

                try {
                    const deleted = await this.deleteFileUseCase.execute(folder)
                    return ResponseFormatter.success(200, 'File deleted successfully', deleted)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    return ResponseFormatter.error(500, 'Internal server error', errorMessage)
                }

            })
            .put('api/v1/files/:id', async ({ params, body }: { params: { id: string }, body: UpdateFileUseCase }) => {
                const data: UpdateFileUseCase = {
                    ...body,
                    id: Number(params.id)
                };

                try {
                    const updated = await this.updateFileUseCase.execute(data);
                    return ResponseFormatter.success(200, 'File updated successfully', updated)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    return ResponseFormatter.error(500, 'Internal server error', errorMessage)
                }

            });

        return app
    }
}