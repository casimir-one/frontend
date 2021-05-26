export const expandAttributes = (
  attrs,
  idKey = 'attributeId',
  valueKey = 'value'
) => attrs.reduce((acc, attr) => ({
  ...acc,
  ...{
    [attr[idKey]]: attr[valueKey]
  }
}), {});

export const compactAttributes = (
  attrs,
  idKey = 'attributeId',
  valueKey = 'value'
) => Object.keys(attrs)
  .map((id) => ({
    [idKey]: id,
    [valueKey]: attrs[id]
  }));
