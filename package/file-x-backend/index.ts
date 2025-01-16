import { Elysia } from "elysia";
import { FolderController } from "./src/infrastructure/adapters/in/http/folder.controller";
import { PrismaFolderRepository } from "./src/infrastructure/adapters/out/persistence/prisma-folder.repository";
import { GetFolder} from "./src/application/usecases/folder/get-folders.usecase";
import { CreateFolder } from "./src/application/usecases/folder/create-folder.usecase";
import { DeleteFolder } from "./src/application/usecases/folder/delete-folder.usecase";
import { UpdateFolder } from "./src/application/usecases/folder/update-folder.usecase";
import { CreateFile } from "./src/application/usecases/file/create-file.usecase";
import { DeleteFile } from "./src/application/usecases/file/delete-file.usecase";
import { UpdateFile } from "./src/application/usecases/file/update-file.usecase";
import { GetFile } from "./src/application/usecases/file/get-files.usecase";
import { PrismaFileRepository } from "./src/infrastructure/adapters/out/persistence/prisma-file.repository";
import { FileController } from "./src/infrastructure/adapters/in/http/file.controller";

class Application {
    private setupInfrastructure() {
        return {
            folderRepository: new PrismaFolderRepository(),
            filesRepository: new PrismaFileRepository()
        };
    }

    private setupUseCases(infrastructure: ReturnType<typeof this.setupInfrastructure>) {
        return {
            folder: {
                getFoldersUseCase: new GetFolder(infrastructure.folderRepository),
                createFolderUseCase: new CreateFolder(infrastructure.folderRepository),
                deleteFolderUseCase: new DeleteFolder(infrastructure.folderRepository),
                updateFolderUsecase: new UpdateFolder(infrastructure.folderRepository)
            },
            files: {
                getFilesUseCase: new GetFile(infrastructure.filesRepository),
                createFileUseCase: new CreateFile(infrastructure.filesRepository),
                deleteFileUseCase: new DeleteFile(infrastructure.filesRepository),
                updateFileUsecase: new UpdateFile(infrastructure.filesRepository)
            }
        };
    }

    private setupAdapters(useCases: ReturnType<typeof this.setupUseCases>) {
        return {
            folderController: new FolderController(
                useCases.folder.getFoldersUseCase,
                useCases.folder.createFolderUseCase,
                useCases.folder.deleteFolderUseCase,
                useCases.folder.updateFolderUsecase
            ),
            fileController: new FileController(
                useCases.files.getFilesUseCase,
                useCases.files.createFileUseCase,
                useCases.files.deleteFileUseCase,
                useCases.files.updateFileUsecase
            )
        };
    }

    async start() {
        const app = new Elysia();
        
        const infrastructure = this.setupInfrastructure();
        const useCases = this.setupUseCases(infrastructure);
        const adapters = this.setupAdapters(useCases);

        adapters.folderController.register(app);
        adapters.fileController.register(app);

        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    }
}

const application = new Application();
application.start().catch(console.error);
