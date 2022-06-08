import qs from 'qs';
import { hasValue, wrapInArray } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';

/**
 * Convert array attributes from model to object
 * @param {Object} obj
 * @param {string} [idKey=attributeId]
 * @param [valueKey=value]
 * @return {Object}
 */
export const expandAttributes = (
  obj,
  idKey = 'attributeId',
  valueKey = 'value'
) => {
  const { attributes = [] } = obj;

  return {
    ...obj,
    ...{
      attributes: (attributes).reduce((acc, attr) => ({
        ...acc,
        ...{
          [attr[idKey]]: attr[valueKey]
        }
      }), {})
    }
  };
};

/**
 * Convert object attributes from model to array
 * @param obj
 * @param {string} [idKey=attributeId]
 * @param [valueKey=value]
 * @return {Object}
 */
export const compactAttributes = (
  obj,
  idKey = 'attributeId',
  valueKey = 'value'
) => {
  const { attributes = {} } = obj;

  return {
    ...obj,
    ...{
      attributes: Object.keys(attributes)
        .map((id) => ({
          [idKey]: id,
          [valueKey]: attributes[id]
        }))
    }
  };
};

/**
 * Map attributes value to main model object keys
 * @param {Object} model
 * @param {Object} attributes
 * @param {Array} map
 * @param {Array} mapInfo
 * @return {Object}
 */
export const mapAttributesToModel = (model, attributes, map, mapInfo) => map.reduce((acc, i) => {
  const { isMultiple } = mapInfo.find((a) => a.key === i.key);
  const res = {
    [i.key]: isMultiple ? wrapInArray(attributes[i.value]) : attributes[i.value]
  };
  return { ...acc, ...res };
}, model);

/**
 * Map main model object keys to attributes
 * @param {Object} model
 * @param {Object} attributes
 * @param {Array} map
 * @return {Object}
 */
export const mapModelToAttributes = (model, attributes, map) => map.reduce((acc, i) => {
  const res = model[i.key] && attributes[i.value] !== model[i.key]
    ? { [i.value]: model[i.key] }
    : {};
  return { ...acc, ...res };
}, attributes);

/**
 * Build file url string
 * @param {Object} opts
 * @return {string|null}
 */
export const getAttributeFileSrc = (opts = {}) => {
  const {
    serverUrl,
    scope,
    scopeId,
    attributeId,
    filename,

    width,
    height,
    round,
    noCache,
    image,
    download
  } = opts;

  if (!filename) return null;

  const url = [
    serverUrl,
    'api',
    'attribute',
    'file',
    scope,
    scopeId,
    attributeId,
    filename
  ].join('/');

  const query = qs.stringify({
    ...(width ? { width: width * 2 } : {}),
    ...(width || height ? { height: height ? height * 2 : width * 2 } : {}),
    ...(round ? { round } : {}),
    ...(noCache ? { noCache } : {}),
    ...(image ? { image } : {}),
    ...(download ? { download } : {})
  });

  return [url, ...(query ? [query] : [])].join('?');
};

/**
 * Create helpers for attributes operations
 * @param {Object} data
 * @param {Object} scopeData
 * @return {Object}
 */
export const attributeMethodsFactory = (data, scopeData = {}) => {
  const { DEIP_SERVER_URL } = proxydi.get('env');

  return {
    data,

    // attrValue
    getAttributeValue(id) {
      return data?.attributes?.[id]?.value;
    },

    // attrHasValue
    attributeHasValue(id) {
      return hasValue(data?.attributes?.[id]);
    },

    // attrFileSrc
    getAttributeFileSrc(attributeId, file) {
      const filename = file || data?.attributes?.[attributeId];

      const hasFileName = !!filename && filename !== 'null' && filename !== 'undefined';

      const { scopeName: scope, scopeId } = scopeData;
      if (!(scope && scopeId && hasFileName && attributeId)) {
        return '';
      }

      return getAttributeFileSrc({
        serverUrl: DEIP_SERVER_URL,
        scope,
        scopeId,
        attributeId,
        filename
      });
    }
  };
};
