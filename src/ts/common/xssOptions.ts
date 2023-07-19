export function xssOptions(): XSS.IFilterXSSOptions {
  return {
    onIgnoreTagAttr: function (
      tag: string,
      name: string,
      value: string,
      isWhiteAttr: boolean,
    ): string {
      if (!isWhiteAttr) {
        if (tag === "a" && name === "rel" && value === "noopener noreferrer") {
          return name + '="' + value + '"';
        }
        if (tag === "div" && name === "class" && value === "table-container") {
          return name + '="' + value + '"';
        }
        if (
          ["td", "th"].includes(tag) &&
          name === "style" &&
          [
            "text-align:left;",
            "text-align:center;",
            "text-align:right;",
          ].includes(value)
        ) {
          return name + '="' + value + '"';
        }
      }
      return "";
    },
  };
}
