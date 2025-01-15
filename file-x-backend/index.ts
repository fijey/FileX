import { Elysia } from "elysia";
import { FolderController } from "./src/infrastructure/adapters/in/http/folder.controller";
import { PrismaFolderRepository } from "./src/infrastructure/adapters/out/persistence/prisma-folder.repository";
import { GetFolderUseCase } from "./src/application/usecases/folder/get-folders.usecase";
import { CreateFolderUseCase } from "./src/application/usecases/folder/create-folder.usecase";

class Application {
    private setupInfrastructure() {
        return {
            folderRepository: new PrismaFolderRepository()
        };
    }

    private setupUseCases(infrastructure: ReturnType<typeof this.setupInfrastructure>) {
        return {
            getFoldersUseCase: new GetFolderUseCase(infrastructure.folderRepository),
            createFolderUseCase: new CreateFolderUseCase(infrastructure.folderRepository)
        };
    }

    private setupAdapters(useCases: ReturnType<typeof this.setupUseCases>) {
        return {
            folderController: new FolderController(
                useCases.getFoldersUseCase,
                useCases.createFolderUseCase
            )
        };
    }

    async start() {
        const app = new Elysia();
        
        const infrastructure = this.setupInfrastructure();
        const useCases = this.setupUseCases(infrastructure);
        const adapters = this.setupAdapters(useCases);

        adapters.folderController.register(app);

        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    }
}

const application = new Application();
application.start().catch(console.error);
