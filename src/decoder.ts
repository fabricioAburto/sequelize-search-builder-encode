import _ from 'lodash';

const KNOWN_PARAMS = ['page', 'size', 'include'];

interface QueryObject {
  filter?: any;
  order?: any;
  page?: number;
  size?: number;
  include?: boolean;
}
interface Resource {
  url: string;
  user_params: any;
  query: QueryObject;
}

type KeyValue = {
  isValid: boolean;
  key: string;
  value: any;
};

const getKeyValue = (param = '') => {
  let res: KeyValue = { key: '', value: '', isValid: false };
  let paramParts = param.split('=');
  if (!paramParts || paramParts.length < 2) return res;

  res.isValid = true;
  res.key = paramParts[0];
  res.value = paramParts[1];
  return res;
};

const parseQueryParams = (k = '', v: any = '') => {
  if (k === 'include') return v === 'true';
  else return parseFloat(v);
};

export const handleSimpleParams = (param = '') => {
  let { isValid, key, value } = getKeyValue(param);
  if (isValid && KNOWN_PARAMS.includes(key))
    return { [key]: parseQueryParams(key, value) };
  return {};
};

export const handleUserParams = (param = '', resource: Resource) => {
  let { isValid, key, value } = getKeyValue(param);
  if (!isValid) return resource;
  if (!KNOWN_PARAMS.includes(key)) {
    resource.user_params[key] = value;
    const sep = resource.url.includes('?') ? '&' : '?';
    resource.url += `${sep}${key}=${value}`;
  }
  return resource;
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

export const decode = (url = ''): Resource => {
  let decoded = decodeURIComponent(url).split('?');
  let basicUrl = decoded[0];
  decoded = decoded[1].split('&');

  let obj = {},
    order = {},
    filter = {},
    resource = {
      base_url: basicUrl,
      url: basicUrl,
      user_params: {},
      query: {},
    };

  for (let part of decoded) {
    if (part.match(/[a-zA-Z]+=/)) {
      const simpleParams = handleSimpleParams(part);
      obj = { ...obj, ...simpleParams };
      resource = { ...resource, ...handleUserParams(part, resource) };
    } else if (part.includes('desc') || part.includes('asc')) {
      order = { ...order, ...handleOrder(part) };
    } else handleFilters(part, filter);
  }

  if (!_.isEmpty(filter)) obj = { ...obj, filter };
  if (!_.isEmpty(order)) obj = { ...obj, order };

  resource.query = obj;
  return resource;
};
