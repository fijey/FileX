import type { FolderModel } from "../../data/models/FolderModel";

export class FolderEntity {
    id!: number;
	name!: string;
	parentId!: number | null;
	isActive?: boolean = false;
	children!: FolderModel[];
	hasChildren!: boolean;
    constructor(
		props: FolderModel
    ) {
		Object.assign(this, {
			...props
		});
	}
  }
  