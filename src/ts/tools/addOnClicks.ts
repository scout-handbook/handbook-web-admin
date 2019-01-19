"use strict";
/* exported addOnClicks */

function addOnClicks(id: string, onclick: (event: MouseEvent) => void)
{
	var nodes = document.getElementsByTagName("main")[0].getElementsByClassName(id);
	for(var l = 0; l < nodes.length; l++)
	{
		(nodes[l] as HTMLElement).onclick = onclick;
	}
}
