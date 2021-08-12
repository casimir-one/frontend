import { camelCase, paramCase } from '@deip/toolbox';

const defaultBreakpoints = ['sm', 'md', 'lg', 'xl'];

export const genBreakpointProps = (
  prop,
  propType = String,
  validator = () => true,
  breakpoints = defaultBreakpoints
) => {
  const propVal = () => ({
    type: propType,
    default: undefined,
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
