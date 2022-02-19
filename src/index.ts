import { encode, parse } from './encoder';
import { decode as decoder } from './decoder';

const URLEncoder = encode;

export const queryParser = parse;
export const decode = decoder;
export default URLEncoder;
