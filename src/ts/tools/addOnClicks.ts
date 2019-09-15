/* exported addOnClicks */

function addOnClicks(id: string, onclick: (event: MouseEvent) => void): void
{
	const nodes = getElementsByClassName(id, document.getElementsByTagName("main")[0]);
	for(let l = 0; l < nodes.length; l++)
	{
		(nodes[l] as HTMLElement).onclick = onclick;
	}
}
