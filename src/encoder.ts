import _ from 'lodash';
import { appendSeparator, isPrimitive, helper, getEncoder } from './utils';

interface Extra {
  page: number;
  size: number;
  include: boolean;
}

export const parse = (params: any = {}, encode = false) => {
  const encoder = getEncoder(encode);

  const { page, size, include, ...rest } = params;
  let parts = [];
  let str = '';

  // Handler Page, size and include
  let extras: Extra = { page, size, include };
  for (let extra of Object.keys(extras)) {
    const value = extras[extra as keyof Extra];
    if (!_.isUndefined(value) && !_.isNull(value))
      parts.push(`${extra}=${value}`);
  }

  // Here handle other sequelize filter and order only
  for (const type of Object.keys(rest)) {
    if (!['order', 'filter'].includes(type)) continue;
    const filter = rest[type];
    for (const name of Object.keys(filter)) {
      const value = filter[name];
      if (isPrimitive(value)) parts.push(encoder(`filter[${name}]=${value}`));
      else parts = [...parts, ...helper(name, value, encoder)];
    }
  }

  // Join all parts
  for (const part of parts) str = appendSeparator(str, part);
  return str;
};

export const encode = (baseUrl = '', params = {}, encode = true) => {
  const saparator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${saparator}${parse(params, encode)}`;
};
