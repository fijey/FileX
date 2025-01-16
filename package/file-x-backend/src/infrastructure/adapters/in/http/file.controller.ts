import { Elysia } from 'elysia';
import { CreateFileUseCase } from '../../../../application/usecases/file/create-file.usecase';
import type { GetFileUseCase } from '../../../../application/usecases/file/get-files.usecase';
import type { DeleteFileUseCase } from '../../../../application/usecases/file/delete-file.usecase';
import type { UpdateFileUseCase } from '../../../../application/usecases/file/update-file.usecase';
import type { CreateFileCommand, DeleteFileCommand, GetFileQuery, UpdateFileCommand } from '../../../../domain/ports/in/file.port';
import { ResponseFormatter } from '../../../utility/response.formatter';

export class FileController {
    constructor(
        private readonly getFilesUseCase: GetFileUseCase,
        private readonly CreateFileCommand: CreateFileUseCase,
        private readonly DeleteFileCommand: DeleteFileUseCase,
        private readonly UpdateFileCommand: UpdateFileUseCase
    ) {}

    register(app: Elysia) :  Elysia {
         app
            .get('/api/v1/files', async ({ query }) => {
                try {
                    const file : GetFileQuery = {
                        folder_id: query.folder_id ? Number(query.folder_id) : null
                    }
    
                    const files = await this.getFilesUseCase.execute(file);

                    return ResponseFormatter.success(200, 'Files fetched successfully', files)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    return ResponseFormatter.error(500, 'Internal server error', errorMessage)
                }
            })
            .post('/api/v1/files', async ({ body }: { body: CreateFileCommand }) => {
                try {
                    const folder = await this.CreateFileCommand.execute(body)
                    return ResponseFormatter.success(201, 'Folder created successfully', folder)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    return ResponseFormatter.error(500, 'Internal server error', errorMessage)
                } 
            })
            .delete('/api/v1/files/:id', async ({params}) => {
                const folder: DeleteFileCommand = {
                    id: Number(params.id)
                } 

                try {
                    const deleted = await this.DeleteFileCommand.execute(folder)
                    return ResponseFormatter.success(200, 'File deleted successfully', deleted)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    return ResponseFormatter.error(500, 'Internal server error', errorMessage)
                }

            })
            .put('api/v1/files/:id', async ({ params, body }: { params: { id: string }, body: UpdateFileCommand }) => {
                const data: UpdateFileCommand = {
                    ...body,
                    id: Number(params.id)
                };

                try {
                    const updated = await this.UpdateFileCommand.execute(data);
                    return ResponseFormatter.success(200, 'File updated successfully', updated)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    return ResponseFormatter.error(500, 'Internal server error', errorMessage)
                }

            });

        return app
    }
}