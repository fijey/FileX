import type { FileAttributes } from "../types/file/file.types";

export class File implements FileAttributes {
    id!: number;
    name!: string;
    folder_id!: number | null;

    constructor(attributes: FileAttributes) {
        Object.assign(this, attributes);
    }
}