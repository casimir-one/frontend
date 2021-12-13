export function getBindableProps(props) {
  return Object.keys(props)
    .reduce((props, key) => ({ ...props, ...(this[key] ? { [key]: this[key] } : {}) }), {});
};
