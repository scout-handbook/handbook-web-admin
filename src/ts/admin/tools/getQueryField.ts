export function getQueryField(search: string, key: string): string | null {
  const keyValuePair = new RegExp("[?&]" + key + "(=([^&#]*)|&|#|$)").exec(
    search
  );
  if (!keyValuePair?.[2]) {
    return null;
  }
  return decodeURIComponent(keyValuePair[2].replace(/\+/g, " "));
}
