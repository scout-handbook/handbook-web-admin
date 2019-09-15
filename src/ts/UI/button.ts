/* exported getAttribute */

function getAttribute(event: MouseEvent, attribute: string): string
{
	let el = event.target as HTMLElement;
	while(!Object.prototype.hasOwnProperty.call(el.dataset, attribute))
	{
		el = el.parentElement!;
	}
	return el.dataset[attribute]!;
}
