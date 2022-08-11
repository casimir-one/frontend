import { camelCase, paramCase } from '@casimir/toolbox';

/**
 * Default screen breakpoints
 */
export const defaultBreakpoints = ['sm', 'md', 'lg', 'xl'];

/**
 * Generat component props for all breakpoints
 * @param {string} prop
 * @param {*} [propType=String]
 * @param {Function} [validator = () => true]
 * @param {*} defaultValue
 * @param {Array.<string>} [breakpoints=['sm', 'md', 'lg', 'xl']]
 * @returns {Array.<Object>} result
 * @returns {*} result.type
 * @returns {*} result.default
 * @returns {Function} result.validator
 */
export const genBreakpointProps = (
  prop,
  propType = String,
  validator = () => true,
  defaultValue = undefined,
  breakpoints = defaultBreakpoints
) => {
  const propVal = () => ({
    type: propType,
    default: defaultValue,
    validator
  });

  const bpProps = breakpoints
    .reduce((acc, bp) => ({
      ...acc,
      [camelCase(`${prop}-${bp}`)]: propVal()
    }), {});

  return {
    [prop]: propVal(),
    ...bpProps
  };
};

/**
 * Generate CSS styles for all breakpoints
 * @param {string} prop
 * @param {Function} [transformer=(val)=>val]
 * @param {string} [varKey]
 * @param {Array.<string>} breakpoints
 * @param {sting} [varPrefix=this]
 * @returns
 */
export function genBreakpointCssVarsStyles(
  prop,
  transformer = (val) => val,
  varKey = prop,
  breakpoints = defaultBreakpoints,
  varPrefix = 'this'
) {
  const basePropName = camelCase(prop);
  const baseVarName = `--${varPrefix}-${paramCase(varKey)}`;

  const styles = this[prop]
    ? { [baseVarName]: transformer(this[basePropName]) }
    : {};

  const bpStyles = breakpoints
    .reduce((acc, bp) => {
      const propName = camelCase(`${prop}-${bp}`);
      const varName = `--${varPrefix}-${paramCase(`${varKey}-${bp}`)}`;
      return {
        ...acc,
        ...(this[propName]
          ? { [varName]: transformer(this[propName]) }
          : {}
        )
      };
    }, {});

  return {
    ...styles,
    ...bpStyles
  };
}
