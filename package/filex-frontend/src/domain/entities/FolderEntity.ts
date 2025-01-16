export class FolderEntity {
    constructor(
		public id: string,
		public name: string,
		public parentId: string | null,
		public children: FolderEntity[] = [],
    ) {}
  }
  