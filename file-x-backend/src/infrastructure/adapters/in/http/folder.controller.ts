import { Elysia } from 'elysia';
import { GetFolderUseCase } from '../../../../application/usecases/folder/get-folders.usecase';
import { CreateFolderUseCase } from '../../../../application/usecases/folder/create-folder.usecase';
import type { CreateFolderInterface } from '../../../../domain/ports/in/folder.port';

export class FolderController {
    constructor(
        private readonly getFoldersUseCase: GetFolderUseCase,
        private readonly createFolderUseCase: CreateFolderUseCase
    ) {}

    register(app: Elysia) :  Elysia {
         app
            .get('/api/v1/folders', ({ query }) => {
                const parentId = query.parent_id ? Number(query.parent_id) : null;
                return this.getFoldersUseCase.execute(parentId);
            })
            .post('/api/v1/folders', ({ body }: { body: CreateFolderInterface }) => 
                this.createFolderUseCase.execute(body)
            );

        return app
    }
}