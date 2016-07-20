function report(page, display_mode) {
	if(page.localCacheEnabled == true) {
		showPiezNotEnabledTable("<p>In order for Piez to work properly, you must disable cache while devtools is open. The following steps are required:</p><ol><li>Click on the dev tools settings (3 vertical dots in the top right corner of this pane) to open up the General Settings pane, then, select the 'Disable cache (while DevTools is open)' checkbox</li>.<li>Then, click and hold the Chrome browser re-load button and select 'Empty Cache and Hard Reload'</li></ol>");
	}
	else if(display_mode == 'piezModeOff') {
		showPiezNotEnabledTable("<p>Piez Is Not Currently Enabled. The following steps are required:</p><ol><li>Enable Piez by clicking the Piez button in the top right of the browser and selecting enable.</li><li>Click the Chrome browser refresh button</li></ol>");
	}
	else {
		hidePiezNotEnabledTable();
		showSummaryTable();
		showDetailsTable()
		updateSummaryTable(page);
		updateImDetailsTable(page, display_mode);
		updateIcDetailsTable(page);
	}
	bindRowHighlightingListener();
	bindImageCompareListener();
}