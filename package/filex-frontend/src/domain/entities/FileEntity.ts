import type { FileModel } from "../../data/models/FileModel";

export class FileEntity {
    id!: number;
    name!: string;
    folderId!: number | null;
    isActive?: boolean = false;
    children!: FileModel[];
    hasChildren!: boolean;
    constructor(
        props: FileModel
    ) {
        Object.assign(this, {
            ...props
        });
    }
  }
  