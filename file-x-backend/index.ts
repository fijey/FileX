import { PrismaClient } from "@prisma/client";
import { Elysia } from "elysia";
import FolderRoutes from "./src/routes/v1/folder.routes";

const prisma = new PrismaClient();
const app = new Elysia();

app.group("/api/v1", app => {
    app.use(FolderRoutes);
    return app;
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
