import { Elysia } from 'elysia'
import FolderController from '../../controllers/folder/folder.controller'
import type { CreateFolderInterface } from '../../types/folder/folder.types'

const routes = new Elysia();

routes.get('/folders', ({ query }) => {
    const parentId = query.parent_id ? Number(query.parent_id) : null;
    return FolderController.getFolder(parentId);
});
routes.post('/folders', ({ body }: { body: CreateFolderInterface }) => FolderController.createFolder(body));

export default routes