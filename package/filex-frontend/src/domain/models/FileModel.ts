import type { IFileModel } from "../interfaces/IFileModel";

export class FileModel implements IFileModel {
  id: number;
  name: string;
  folderId: number | null;
  children: FileModel[];
  hasChildren: boolean;

  constructor(props: IFileModel) {
      this.id = props.id;
      this.name = props.name;
      this.folderId = props.folderId;
      this.children = props.children || [];
      this.hasChildren = props.hasChildren || false;
  }
}