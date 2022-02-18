/**
 * ### Query Object Parser
 * Given an `object` as params return a `HTTP query string`.
 *
 * - `encode`: By the is false, and if you pass true, every query will be encoded.
 */
export const queryParser: (params: any, encode: boolean) => string;

/**
 * ### URL ENCODER
 * Given an url and query object returns an encoded query url.
 * - `encode`: By default is true. But if pass false, this function will return raw `HTTP query string`
 */
export default function URLEncoder(baseUrl: string, params: any, encode: boolean): string;
