import { createEnum } from '../src';

describe('createEnum', () => {
  describe('from object', () => {
    const STATUS = createEnum({
      PENDING: 1,
      APPROVED: 2,
      REJECTED: 3
    });

    it('should create enum', () => {
      const expectedResult = {
        PENDING: 1,
        APPROVED: 2,
        REJECTED: 3,
        1: 'PENDING',
        2: 'APPROVED',
        3: 'REJECTED',
        keys: jest.fn(),
        values: jest.fn()
      };
      expect(STATUS).toMatchObject({
        ...expectedResult,
        keys: expect.any(Function),
        values: expect.any(Function)
      });
    });

    it('should return correct keys', () => {
      expect(STATUS.keys()).toEqual(['PENDING', 'APPROVED', 'REJECTED']);
    });

    it('should return correct values', () => {
      expect(STATUS.values()).toEqual([1, 2, 3]);
    });
  });

  describe('from array', () => {
    const STATUS = createEnum(['PENDING', 'APPROVED', 'REJECTED']);

    it('should create enum', () => {
      const expectedResult = {
        PENDING: 0,
        APPROVED: 1,
        REJECTED: 2,
        0: 'PENDING',
        1: 'APPROVED',
        2: 'REJECTED',
        keys: jest.fn(),
        values: jest.fn()
      };
      expect(STATUS).toMatchObject({
        ...expectedResult,
        keys: expect.any(Function),
        values: expect.any(Function)
      });
    });

    it('should return correct keys', () => {
      expect(STATUS.keys()).toEqual(['PENDING', 'APPROVED', 'REJECTED']);
    });

    it('should return correct values', () => {
      expect(STATUS.values()).toEqual([0, 1, 2]);
    });
  });
});
