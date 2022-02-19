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
  parentName: string[],
  parentValue = {},
  encoder?: Callback
): string[] => {
  let parts: string[] = [];
  const nodesName = Object.keys(parentValue);
  for (const name of nodesName) {
    const value = parentValue[name as keyof {}];
    if (isPrimitive(value)) {
      let finalParentName = '';

      if (_.isArray(parentName)) {
        for (let n of parentName) finalParentName += `[${n}]`;
      }

      if (encoder) {
        parts.push(encoder(`filter${finalParentName}[${name}]=${value}`));
      } else {
        parts.push(`filter${finalParentName}[${name}]=${value}`);
      }
    } else parts = [...parts, ...helper([...parentName, name], value, encoder)];
  }
  return parts;
};

export const getEncoder = (needed = false) => {
  return (value: any) => {
    if (needed) return encodeURIComponent(value);
    return value;
  };
};
