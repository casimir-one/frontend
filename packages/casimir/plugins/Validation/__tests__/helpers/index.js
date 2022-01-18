/**
 * This function is used every time you want to test function with one parameter
 * @param {Function} checkedFn
 * @param {Array.<any>} parametersForFalse
 * @param {Array.<any>} parametersForTrue
 */
export const checkFunction = (checkedFn, parametersForFalse, parametersForTrue) => {
  it.each(parametersForFalse)('should return false for %s', (initial) => {
    expect(checkedFn(initial)).toEqual(false);
  });

  it.each(parametersForTrue)('should return true for %s', (initial) => {
    expect(checkedFn(initial)).toEqual(true);
  });
};

/**
 * This function is used every time you want to test function with two parameters
 * @param {Function} checkedFn
 * @param {Array.<[any, any]>} parametersForFalse
 * @param {Array.<[any, any]>} parametersForTrue
 */
export const checkTwoParamsFunction = (checkedFn, parametersForFalse, parametersForTrue) => {
  it.each(parametersForFalse)('should return false for %s', (value, params) => {
    expect(checkedFn(value, params)).toEqual(false);
  });

  it.each(parametersForTrue)('should return true for %s', (value, params) => {
    expect(checkedFn(value, params)).toEqual(true);
  });
};
