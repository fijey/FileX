import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { CreateFileUseCase } from '../create-file.usecase';
import type { FileRepository } from '../../../../domain/ports/out/file-repository.port';
import { File } from '../../../../domain/entities/file.entity';

describe('CreateFileUseCase', () => {
	let useCase: CreateFileUseCase;
	let mockRepository: jest.Mocked<FileRepository>;

	beforeEach(() => {
		mockRepository = {
			create: jest.fn(),
			findByFolderId: jest.fn(), 
			update: jest.fn(),
			delete: jest.fn()
		};
		useCase = new CreateFileUseCase(mockRepository);
	});

	it('should create a file successfully', async () => {
		const expectedFile = new File({
			id: 1,
			name: 'test.txt',
			folder_id: 1
		});

		mockRepository.create.mockResolvedValue(expectedFile);

		const command = {
			name: 'test.txt',
			folder_id: 1
		};

		const result = await useCase.execute(command);

		expect(mockRepository.create).toHaveBeenCalledWith(command);
		expect(result).toEqual(expectedFile);
		expect(mockRepository.create).toHaveBeenCalledTimes(1);
	});
});