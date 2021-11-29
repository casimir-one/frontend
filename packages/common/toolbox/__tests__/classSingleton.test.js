import { classSingleton, createInstanceGetter, ClassSingletonError } from '../lib/classSingleton';

describe('class singleton creating', () => {
  const EXPECT_ARG = 'EXPECT_ARG';

  let instanceCount = 0;

  class TestClass {
    /** {string?} */
    arg;

    /** {number} */
    counter = 0;

    constructor(arg) {
      this.arg = arg;
      instanceCount += 1;
    }
  }

  it('should throw error "required argument"', () => {
    const t = () => classSingleton();
    expect(t).toThrow(ClassSingletonError);
    expect(t).toThrow('argument "Class" is required');
  });

  it('should throw error "not a constructor"', () => {
    const t = () => classSingleton('not a class');
    expect(t).toThrow(ClassSingletonError);
    expect(t).toThrow('argument "Class" is not a constructor');
  });

  it('should create class instance with arguments', () => {
    const instance = classSingleton(TestClass, EXPECT_ARG);
    expect(instance).toBeInstanceOf(TestClass);
    expect(instance.arg).toBe(EXPECT_ARG);
  });

  it('should create instance getter', () => {
    const getInstance = createInstanceGetter(TestClass);
    expect(getInstance()).toBeInstanceOf(TestClass);
    expect(getInstance().arg).toBe(EXPECT_ARG);
  });

  it('should be one instance', () => {
    for (let i = 0; i < 10; i++) {
      classSingleton(TestClass);
    }
    expect(instanceCount).toBe(1);
  });
});
