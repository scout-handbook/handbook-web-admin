/* exported renderPagination */

function renderPagination(total: number, current: number): string
{
	if(total < 2)
	{
		return "";
	}
	let ret = "<div id=\"pagination\">";
	if(current > 3)
	{
		ret += "<div class=\"paginationButton\" data-page=\"1\">1</div> ... ";
	}
	if(current > 2)
	{
		ret += "<div class=\"paginationButton\" data-page=\"" + (current - 2).toString() + "\">" + (current - 2).toString() + "</div>";
	}
	if(current > 1)
	{
		ret += "<div class=\"paginationButton\" data-page=\"" + (current - 1).toString() + "\">" + (current - 1).toString() + "</div>";
	}
	ret += "<div class=\"paginationButton activePaginationButton\">" + current.toString() + "</div>";
	if(current < total)
	{
		ret += "<div class=\"paginationButton\" data-page=\"" + (current + 1).toString() + "\">" + (current + 1).toString() + "</div>";
	}
	if(current < total - 1)
	{
		ret += "<div class=\"paginationButton\" data-page=\"" + (current + 2).toString() + "\">" + (current + 2).toString() + "</div>";
	}
	if(current < total - 2)
	{
		ret += " ... <div class=\"paginationButton\" data-page=\"" + total.toString() + "\">" + total.toString() + "</div>";
	}
	ret += "</div>";
	return ret;
}
