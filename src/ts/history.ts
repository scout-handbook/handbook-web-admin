/* global mainPageTab:true */
/* exported historySetup */

function popback(): void
{
	if(history.state)
	{
		if(sidePanelState)
		{
			sidePanelClose();
		}
		else if(history.state.id)
		{
			if(imageSelectorOpen)
			{
				prepareImageSelector();
			}
			else
			{
				metadataEvent.addCallback(function(): void
				{
					showLessonEditView(history.state.id, true);
				});
			}
		}
		else if(history.state.page)
		{
			mainPageTab = history.state.page;
			showMainView(true)
		}
		else
		{
			showMainView(false);
		}
	}
}

function historySetup(): void
{
	window.onpopstate = popback;
	if(window.location.pathname.substring(7))
	{
		mainPageTab = window.location.pathname.substring(7) as MainPageTab;
	}
	showMainView(false);
}
