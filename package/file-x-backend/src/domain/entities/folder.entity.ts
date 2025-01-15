import type { FolderAttributes } from "../types/folder/folder.types";

export class Folder implements FolderAttributes {
    id!: number;
    name!: string; 
    parent_id!: number | null;

    constructor(attributes: FolderAttributes) {
        Object.assign(this, attributes);
    }

}