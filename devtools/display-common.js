(function(global) {
	'use strict';

	global.displayBytes = function(bytes){
		var prefixes = ["","Ki","Mi","Gi","Ti","Pi","Ei"];
		var value    = parseInt(bytes);

		for (var prefix = 0; value >= 1023.995 && prefix < prefixes.length - 1; ++prefix) value /= 1024;

		if (0 !== prefix) value = value.toFixed(2);
		return value + " " + prefixes[prefix] + "B";
	};

	global.displayPercentChange = function(originalSize, transformedSize) {
		var originalSizeInt    = parseInt(originalSize);
		var transformedSizeInt = parseInt(transformedSize);

		var pctChange = (((transformedSizeInt/originalSizeInt) - 1) * 100).toFixed(2);

		if(transformedSizeInt == originalSizeInt) {
			return '<span class="warning">  ' + '0%' + '</td>';
		}
		else if(pctChange > 0) {
			return '<span class="error"> +' + Math.abs(pctChange).toString() + "%" + '</td>';
		}
		else if(pctChange < 0) {
			return '<span class="success"> -' + Math.abs(pctChange).toString() + "%" + '</td>';
		}
	};

	global.showSummaryTable = function(display_mode) {
			var summaryTable = document.getElementById('conversionSummary');
			summaryTable.style.display = 'block';
		if (display_mode === 'piezModeBrowserFormatCompare') {
			summaryTable.innerHTML =    '<div class="col-1-4-box"><h1 id="col-1-title">Generic</h1><h3 id="col-1-info">&nbsp</h3></div>' +
									    '<div class="col-1-4-box"><h1 id="col-2-title">Chrome</h1><h3 id="col-2-info">&nbsp;</h3></div>' +
									    '<div class="col-1-4-box"><h1 id="col-3-title">Safari</h1><h3 id="col-3-info">&nbsp;</h3></div>' +
									    '<div class="col-1-4-box"><h1 id="col-4-title">IE</h1><h3 id="col-4-info">&nbsp;</h3></div>';
		}
		else if (display_mode == 'piezModeA2') {
			summaryTable.innerHTML =    '<div class="col-1-4-box"><h1 id="col-1-title">Policy Version</h1><h3 id="col-1-info">&nbsp</h3></div>' +
									    '<div class="col-1-4-box"><h1 id="col-2-title">Preconnects</h1><h3 id="col-2-info">&nbsp</h3></div>' +
									    '<div class="col-1-4-box"><h1 id="col-3-title">Pushed Resources</h1><h3 id="col-3-info">&nbsp</h3></div>' +
									    '<div class="col-1-4-box"><h1 id="col-4-title">Page Load Time (ms)</h1><h3 id="col-4-info">&nbsp</h3></div>';
		}
		else if (display_mode == 'piezModeRoSimple' || display_mode == 'piezModeRoAdvanced') {
			summaryTable.innerHTML =    '<div class="col-1-4-box"><h1 id="col-1-title">Not Optimized</h1><h3 id="col-1-info">&nbsp</h3></div>' +
									    '<div class="col-1-4-box"><h1 id="col-2-title">Optimized</h1><h3 id="col-2-info">&nbsp;</h3></div>' +
									    '<div class="col-1-4-box"><h1 id="col-3-title">Total Saved Bytes</h1><h3 id="col-3-info">&nbsp;</h3></div>' +
									    '<div class="col-1-4-box"><h1 id="col-4-title">% Bytes Change</h1><h3 id="col-4-info">&nbsp;</h3></div>';
		}
		else {
			summaryTable.innerHTML =    '<div class="col-1-4-box"><h1 id="col-1-title">Optimized Realtime</h1><h3 id="col-1-info">&nbsp</h3></div>' +
									    '<div class="col-1-4-box"><h1 id="col-2-title">Optimized Offline</h1><h3 id="col-2-info">&nbsp;</h3></div>' +
									    '<div class="col-1-4-box"><h1 id="col-3-title">Total Saved Bytes</h1><h3 id="col-3-info">&nbsp;</h3></div>' +
									    '<div class="col-1-4-box"><h1 id="col-4-title">% Bytes Change</h1><h3 id="col-4-info">&nbsp;</h3></div>';
		}
	};

	global.updateSummaryTable = function(page, display_mode) {
		if  (display_mode === 'piezModeBrowserFormatCompare') {
			document.getElementById('col-1-info').textContent = displayBytes(page.genericFormatTotal);
			document.getElementById('col-2-info').textContent = displayBytes(page.chromeFormatTotal);
			document.getElementById('col-3-info').textContent = displayBytes(page.safariFormatTotal);
			document.getElementById('col-4-info').innerHTML   = displayBytes(page.ieFormatTotal);
		}
		else if (display_mode === 'piezModeA2')  {
			document.getElementById('col-1-info').textContent = (page.A2Policy) ? ('Version: ' + page.A2Policy) : 'None';
			var total = page.preconnects.common.length + page.preconnects.unique.length;
			document.getElementById('col-2-info').textContent = (total - page.preconnects.notUsed.length) +  '/' + total;
			total = page.resourcesPushed.common.length + page.resourcesPushed.unique.length;
			document.getElementById('col-3-info').textContent = (total - page.resourcesPushed.notUsed.length) +  '/' + total;
			if (page.pageLoaded) {
				document.getElementById('col-4-info').textContent = page.pageLoadTime;
			} else {
				document.getElementById('col-4-info').textContent = '\u00A0';
			}
		}
		else if(display_mode === 'piezModeRoSimple'|| display_mode == 'piezModeRoAdvanced') {
			document.getElementById('col-1-info').textContent = page.totalNonRoResources.toString();
			document.getElementById('col-2-info').textContent = page.totalRoOfflineTransforms.toString();
			document.getElementById('col-3-info').textContent = displayBytes(page.totalRoOriginalSize - (page.totalRoOfflineTransformSize));
			document.getElementById('col-4-info').innerHTML   = displayPercentChange(page.totalRoOriginalSize, (page.totalRoOfflineTransformSize));
		}
		else {
			document.getElementById('col-1-info').textContent = page.totalICImagesTransformed.toString();
			document.getElementById('col-2-info').textContent = page.totalIMImagesTransformed.toString();
			document.getElementById('col-3-info').textContent = displayBytes(page.totalImIcOriginalSize - (page.totalImTransformSize + page.totalIcTransformSize));
			document.getElementById('col-4-info').innerHTML   = displayPercentChange(page.totalImIcOriginalSize, (page.totalImTransformSize + page.totalIcTransformSize));
		}
	};

	global.showDetailsTable = function(display_mode) {
		document.getElementById('conversionDetails').style.display = 'block';
		if (display_mode === 'piezModeA2') {
			document.getElementById('detailsBox1Title').textContent = 'Preconnected Resources';
			document.getElementById('detailsBox2Title').textContent = 'Pushed Resources';
		}
		 else if(display_mode === 'piezModeRoSimple' || display_mode == 'piezModeRoAdvanced') {
			document.getElementById('detailsBox1Title').textContent = 'Optimized Details';
		 	document.getElementById('detailsBox3Title').textContent = 'Not Optimized';
		}
		else {
			document.getElementById('detailsBox1Title').textContent = 'Optimized Offline Details';
			document.getElementById('detailsBox2Title').textContent = 'Optimized Realtime Details';
			document.getElementById('detailsBox3Title').textContent = 'Non Image Manager Images';
		}
	};

	global.hidePiezNotEnabledTable = function() {
		document.getElementById('notEnabled').style.display = 'none';
	};

	global.showPiezNotEnabledTable = function(message_header, message_steps) {
		document.getElementById('conversionSummary').style.display = 'none';
		document.getElementById('conversionDetails').style.display = 'none';
		document.getElementById('notEnabled').style.display        = 'block';
		document.getElementById('notEnabled').innerHTML            = "<div class='piezConfigMessageHeader'>" + message_header + '</div>' + "<div class='piezConfigMessageSteps'>" + message_steps + '</div>';
	};

	global.fileSizeDiff = function(originalSize, transformedSize) {
		if(parseInt(originalSize) > parseInt(transformedSize)) {
			return '<td class="success">' + displayBytes(transformedSize) + '</td>';
		}
		else if (parseInt(originalSize) < parseInt(transformedSize)){
			return '<td class="error">' + displayBytes(transformedSize) + '</td>';
		}
		else {
			return '<td class="warning">' + displayBytes(transformedSize) + '</td>';
		}
	};

	global.hideDetails = function(display_mode) {
		//insert blank space to keep box height
		document.getElementById('col-1-info').textContent        = '\u00A0';
		document.getElementById('col-2-info').textContent        = '\u00A0';
		document.getElementById('col-3-info').textContent        = '\u00A0';
		document.getElementById('col-4-info').textContent        = '\u00A0';
		document.getElementById('imageBox').style.display        = 'none';
		document.getElementById('detailsBox1').style.display = 'none';
		document.getElementById('detailsBox2').style.display = 'none';
		document.getElementById('detailsBox3').style.display = 'none';
	};
})(this);