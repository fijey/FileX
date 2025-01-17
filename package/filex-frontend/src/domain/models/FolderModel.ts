import type { IFolderModel } from "../interfaces/IFolderModel";

export class FolderModel implements IFolderModel {
  id: number;
  name: string;
  parentId: number | null;
  isActive: boolean;
  children: FolderModel[];
  hasChildren: boolean;

  constructor(props: IFolderModel) {
      this.id = props.id;
      this.name = props.name;
      this.parentId = props.parentId;
      this.isActive = props.isActive || false;
      this.children = props.children || [];
      this.hasChildren = props.hasChildren || false;
  }

  toggleActive(): void {
      this.isActive = !this.isActive;
  }
}