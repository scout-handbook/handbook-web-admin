/* exported getAttribute */

function getAttribute(event: MouseEvent, attribute: string): string
{
	var el = event.target as HTMLElement;
	while(!el.dataset.hasOwnProperty(attribute))
	{
		el = el.parentElement!;
	}
	return el.dataset[attribute]!;
}
