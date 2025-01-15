import { Elysia } from 'elysia';
import { GetFolder } from '../../../../application/usecases/folder/get-folders.usecase';
import { CreateFolder } from '../../../../application/usecases/folder/create-folder.usecase';
import type { CreateFolderUsecase, GetFolderUsecase } from '../../../../domain/ports/in/folder.port';

export class FolderController {
    constructor(
        private readonly getFoldersUseCase: GetFolder,
        private readonly createFolderUseCase: CreateFolder
    ) {}

    register(app: Elysia) :  Elysia {
         app
            .get('/api/v1/folders', ({ query }) => {
                const folder : GetFolderUsecase = {
                    parent_id: query.parent_id ? Number(query.parent_id) : null
                }

                return this.getFoldersUseCase.execute(folder);
            })
            .post('/api/v1/folders', ({ body }: { body: CreateFolderUsecase }) => 
                this.createFolderUseCase.execute(body)
            );

        return app
    }
}