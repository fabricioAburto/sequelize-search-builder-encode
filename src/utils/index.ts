import _ from 'lodash';

export const isPrimitive = (val: any) => {
  return (
    _.isString(val) || _.isNumber(val) || _.isNull(val) || _.isUndefined(val)
  );
};

export const appendSeparator = (str = '', part = '') => {
  if (_.isEmpty(str)) return part;
  return `${str}&${part}`;
};

type Callback = (a: any) => any;

export const helper = (
  parentName = '',
  parentValue = {},
  encoder?: Callback
): string[] => {
  let parts: string[] = [];
  const nodesName = Object.keys(parentValue);
  for (const name of nodesName) {
    const value = parentValue[name as keyof {}];
    if (isPrimitive(value)) {
      if (encoder) {
        parts.push(encoder(`filter[${parentName}][${name}]=${value}`));
      } else {
        parts.push(`filter[${parentName}][${name}]=${value}`);
      }
    } else parts = [...parts, ...helper(name, value)];
  }
  return parts;
};

export const getEncoder = (needed = false) => {
  return (value: any) => {
    if (needed) return encodeURIComponent(value);
    return value;
  };
};
