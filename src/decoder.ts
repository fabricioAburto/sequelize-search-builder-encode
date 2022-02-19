import _ from 'lodash';

const KNOWN_PARAMS = ['page', 'size', 'include'];

export const handleSimpleParams = (param = '') => {
  let paramName = '';
  let paramValue: any = '';
  let paramParts = param.split('=');

  if (!paramParts || paramParts.length < 2) return {};
  if (paramParts) paramName = paramParts[0];
  if (paramParts) paramValue = paramParts[1];

  if (KNOWN_PARAMS.includes(paramName)) {
    if (paramName === 'include') {
      paramValue = paramValue === 'true';
    } else paramValue = parseFloat(paramValue);
    return { [paramName]: paramValue };
  }

  return {};
};

const handleOrder = (param = '') => {
  let p = param
    .replace('filter', '')
    .replace('[', '')
    .replace(']', '')
    .split('=');

  if (p.length < 2) return {};
  return { [p[0]]: p[1] };
};

const handleFilters = (param = '', parent = {}) => {
  let filter = param.replace('filter', '').split('=');

  if (filter.length < 2) return {};

  let paramsName = filter[0]
    .replace('[', '')
    .replace(']', '.')
    .replace('[', '')
    .replace(']', '');

  if (paramsName.slice(-1) === '.') {
    paramsName = paramsName.slice(0, -1);
  }

  let paramsValue = filter[1];
  _.set(parent, paramsName, paramsValue);
  return parent;
};

export const decode = (url = '') => {
  let decoded = decodeURIComponent(url).split('?');

  decoded = decoded[1].split('&');

  let obj = {},
    order = {},
    filter = {};

  for (let part of decoded) {
    if (part.match(/[a-zA-Z]+=/)) {
      const simpleParams = handleSimpleParams(part);
      obj = { ...obj, ...simpleParams };
    } else if (part.includes('desc') || part.includes('asc')) {
      order = { ...order, ...handleOrder(part) };
    } else handleFilters(part, filter);
  }

  if (!_.isEmpty(filter)) obj = { ...obj, filter };
  if (!_.isEmpty(order)) obj = { ...obj, order };

  return obj;
};
