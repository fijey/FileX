import { Prisma, PrismaClient } from '@prisma/client';
import { Folder } from '../../../../domain/entities/folder.entity';
import type { CreateFolderRepository, DeleteFolderRepository, FolderRepository, GetFolderRepository, UpdateFolderRepository } from '../../../../domain/ports/out/folder-repository.port';
import { PaginationOptions } from '../../../../domain/types/pagination-options';

export class PrismaFolderRepository implements FolderRepository {
	private prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	async findByParentId(folder: GetFolderRepository, pagination?: PaginationOptions, searchQuery?: string): Promise<{ data: Folder[], total?: number }> {
		// Raw SQL for recursive CTE to get all descendant folders
		const recursiveQuery = `
			WITH RECURSIVE FolderHierarchy AS (
				-- Base case: start with folders at specified parent_id
				SELECT id, name, parent_id, 0 as level
				FROM Folders 
				WHERE parent_id = ${folder.parent_id}
				
				UNION ALL
				
				-- Recursive case: get all children
				SELECT f.id, f.name, f.parent_id, fh.level + 1
				FROM Folders f
				INNER JOIN FolderHierarchy fh ON f.parent_id = fh.id
			)
		`;

		const baseQuery = {
			include: {
				_count: {
					select: {
						children: true
					}
				}
			}
		};

		// If search query is provided, add it to the conditions
		if (searchQuery) {
			const descendantFolders = await this.prisma.$queryRaw<(Folder & { hasChildren: number })[]>`
				${Prisma.raw(recursiveQuery)}
				SELECT DISTINCT f.*, 
					(SELECT COUNT(*) > 0 FROM Folders child WHERE child.parent_id = f.id) as hasChildren
				FROM FolderHierarchy fh
				JOIN Folders f ON f.id = fh.id
				WHERE f.name LIKE ${`%${searchQuery}%`}
				ORDER BY f.name ASC
				${pagination ? Prisma.raw(`LIMIT ${pagination.limit} OFFSET ${((pagination.page || 1) - 1) * (pagination.limit || 1)}`) : Prisma.empty}
			`;

			const total = await this.prisma.$queryRaw<[{ count: number }]>`
				${Prisma.raw(recursiveQuery)}
				SELECT COUNT(DISTINCT f.id) as count
				FROM FolderHierarchy fh
				JOIN Folders f ON f.id = fh.id
				WHERE f.name LIKE ${`%${searchQuery}%`}
			`;

			return {
				data: descendantFolders.map(folder => ({
					...folder,
					hasChildren: Boolean(folder.hasChildren)
				})),
				total: Number(total[0].count)
			};
		}

		// If no search query, use regular pagination
		if (pagination?.page && pagination?.limit) {
			const skip = (pagination.page - 1) * pagination.limit;
			
			const [total, folders] = await Promise.all([
				this.prisma.folders.count({
					where: { parent_id: folder.parent_id }
				}),
				this.prisma.folders.findMany({
					...baseQuery,
					where: { parent_id: folder.parent_id },
					skip,
					take: pagination.limit,
					orderBy: {
						name: 'asc'
					}
				})
			]);

			return {
				data: folders.map(folder => ({
					...folder,
					hasChildren: folder._count.children > 0
				})),
				total
			};
		}

		// If no pagination and no search, return all results
		const folders = await this.prisma.folders.findMany({
			...baseQuery,
			where: { parent_id: folder.parent_id }
		});
		
		return {
			data: folders.map(folder => {
				const { _count, ...rest } = folder;
				return {
					...rest,
					hasChildren: folder._count.children > 0
				};
			})
		};
	}

	async create(command: CreateFolderRepository): Promise<Folder> {
		const folder = await this.prisma.folders.create({
			data: command
		});
		return new Folder(folder);
	}

	async delete(folder: DeleteFolderRepository): Promise<string> {
		await this.prisma.folders.delete({
			where: { id: folder.id }
		});
		return 'Folder deleted successfully';
	}

	async update(folder: UpdateFolderRepository): Promise<Folder> {
		const updatedFolder = await this.prisma.folders.update({
			where: { id: folder.id },
			data: folder
		});
		return new Folder(updatedFolder);
	}
}