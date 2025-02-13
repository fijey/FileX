import { Elysia } from "elysia";
import { FolderController } from "./src/infrastructure/adapters/in/http/folder.controller";
import { PrismaFolderRepository } from "./src/infrastructure/adapters/out/persistence/prisma-folder.repository";
import { GetFolderUseCase} from "./src/application/usecases/folder/get-folders.usecase";
import { CreateFolderUseCase } from "./src/application/usecases/folder/create-folder.usecase";
import { DeleteFolderUseCase } from "./src/application/usecases/folder/delete-folder.usecase";
import { UpdateFolderUseCase } from "./src/application/usecases/folder/update-folder.usecase";
import { CreateFileUseCase } from "./src/application/usecases/file/create-file.usecase";
import { DeleteFileUseCase } from "./src/application/usecases/file/delete-file.usecase";
import { UpdateFileUseCase } from "./src/application/usecases/file/update-file.usecase";
import { GetFileUseCase } from "./src/application/usecases/file/get-files.usecase";
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
                getFoldersUseCase: new GetFolderUseCase(infrastructure.folderRepository),
                createFolderUseCase: new CreateFolderUseCase(infrastructure.folderRepository),
                deleteFolderUseCase: new DeleteFolderUseCase(infrastructure.folderRepository),
                updateFolderUsecase: new UpdateFolderUseCase(infrastructure.folderRepository)
            },
            files: {
                getFilesUseCase: new GetFileUseCase(infrastructure.filesRepository),
                CreateFileCommand: new CreateFileUseCase(infrastructure.filesRepository),
                DeleteFileCommand: new DeleteFileUseCase(infrastructure.filesRepository),
                UpdateFileCommand: new UpdateFileUseCase(infrastructure.filesRepository)
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
                useCases.files.CreateFileCommand,
                useCases.files.DeleteFileCommand,
                useCases.files.UpdateFileCommand
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
