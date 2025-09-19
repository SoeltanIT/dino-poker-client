import { ParsedUrlQueryInput } from "querystring";

export function queryString(
  query: string | null | ParsedUrlQueryInput | undefined
) {
  if (typeof query === "object") {
    for (let key in query) {
      if (query[key] === undefined) {
        delete query[key];
      }
    }
  }
  return query;
}
