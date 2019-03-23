(function() {
	if (!document.getElementsByClassName)
	{
		var indexOf = Array.prototype.indexOf || function(this: Array<Element>, prop)
		{
			for (var i = 0; i < this.length; i++)
			{
				if (this[i] === prop) return i;
			}
			return -1;
		};
		var getElementsByClassName = function(classNames: string, context: Document|Element): HTMLCollectionOf<Element>
		{
			var elems = document.querySelectorAll ? context.querySelectorAll("." + classNames) as unknown as HTMLCollectionOf<Element> : (function()
			{
				var all = context.getElementsByTagName("*"),
					elements = [],
					i = 0;
				for (; i < all.length; i++) {
					if (all[i].className && (" " + all[i].className + " ").indexOf(" " + classNames + " ") > -1 && indexOf.call(elements, all[i]) === -1) elements.push(all[i]);
				}
				return elements as unknown as HTMLCollectionOf<Element>;
			})();
			return elems;
		};
		document.getElementsByClassName = function(classNames)
		{
			return getElementsByClassName(classNames, document);
		};

		if(Element) {
			Element.prototype.getElementsByClassName = function(className)
			{
				return getElementsByClassName(className, this);
			};
		}
	}
})();
