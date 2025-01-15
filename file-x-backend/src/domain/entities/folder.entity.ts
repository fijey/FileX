export class Folder {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly parent_id: number | null
    ) {}
}