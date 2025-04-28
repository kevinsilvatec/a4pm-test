export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('MockType', () => {
  it('should create a mock type with jest mock functions', () => {
    type TestType = {
      method1: () => void;
      method2: (arg: string) => number;
    };

    const mock: MockType<TestType> = {
      method1: jest.fn(),
      method2: jest.fn(),
    };

    expect(mock.method1).toBeDefined();
    expect(mock.method2).toBeDefined();
    expect(typeof mock.method1).toBe('function');
    expect(typeof mock.method2).toBe('function');
  });
}); 