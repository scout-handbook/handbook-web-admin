export function getElementsByClassName(
  className: string,
  context: Document | Element = document
): HTMLCollection {
  if (context.getElementsByClassName) {
    return context.getElementsByClassName(className);
  }
  if (context.querySelectorAll) {
    return context.querySelectorAll(
      "." + className
    ) as unknown as HTMLCollection;
  }
  const all = context.getElementsByTagName("*");
  const ret = [];
  for (let i = 1; i < all.length; i++) {
    if (
      all[i].className &&
      (" " + all[i].className + " ").indexOf(" " + className + " ") >= 0 &&
      ret.indexOf(all[i]) < 0
    ) {
      ret.push(all[i]);
    }
  }
  return ret as unknown as HTMLCollection;
}
