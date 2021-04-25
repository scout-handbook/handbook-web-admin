/* exported parseBoolForm */

function parseBoolForm(): Array<string> {
  const ret = [];
  const nodes = document
    .getElementById("sidePanelForm")!
    .getElementsByTagName("input");
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].checked) {
      ret.push(nodes[i].dataset.id!);
    }
  }
  return ret;
}
