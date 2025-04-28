import { Repository, ObjectLiteral } from 'typeorm';
import { MockType } from './types';

export const createMockRepository = <T extends ObjectLiteral>(): MockType<Repository<T>> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
});

describe('createMockRepository', () => {
  it('should create a mock repository with all required methods', () => {
    interface TestEntity {
      id: number;
      name: string;
    }

    const mockRepo = createMockRepository<TestEntity>();

    expect(mockRepo.findOne).toBeDefined();
    expect(mockRepo.find).toBeDefined();
    expect(mockRepo.create).toBeDefined();
    expect(mockRepo.save).toBeDefined();
    expect(mockRepo.merge).toBeDefined();
    expect(mockRepo.remove).toBeDefined();

    expect(typeof mockRepo.findOne).toBe('function');
    expect(typeof mockRepo.find).toBe('function');
    expect(typeof mockRepo.create).toBe('function');
    expect(typeof mockRepo.save).toBe('function');
    expect(typeof mockRepo.merge).toBe('function');
    expect(typeof mockRepo.remove).toBe('function');
  });
}); 