/**
 * @param {boolean} condition
 * @param {string} [failureMessage = Assertion failed]
 */
export const assert = (
  condition,
  failureMessage = 'Assertion failed',
) => {
  if (condition) return;
  throw new Error(failureMessage);
};
