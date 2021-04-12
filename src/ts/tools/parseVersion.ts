/* exported parseVersion */

function parseVersion(version: number): string
{
	const d = new Date(version);
	return d.getDate().toString() + ". " + (d.getMonth() + 1).toString() + ". " + d.getFullYear().toString() + " " + d.getHours().toString() + ":" + ("0" + d.getMinutes().toString()).slice(-2) + ":" + ("0" + d.getSeconds().toString()).slice(-2);
}
