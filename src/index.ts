import { encode, parse } from './encoder';

export const queryParser = parse;

export { decode } from './decoder';
export { encode } from './encoder';

const URLEncoder = encode;
export default URLEncoder;
