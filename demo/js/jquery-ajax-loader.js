function loadeData(selector, html) {

	$(selector).each(function (index, el) {
		$(el).html(html);
		/*$(el).toggle("fade", { direction: "right" }, 700, function () {
			$(el).html(html);
			//$(el).css("height", "100%");
			$(el).toggle("fade", { direction: "right" }, 700);
			$("body").scrollTop(0);
		});*/
	});
}

$(document).ready(function () {

	window.onpopstate = function (event) {

		if (event.state != null) {			
			loadeData(lastTargetElement, event.state.html);
			updateTitle(event.state.href, event.state.html);

			ajaxLoadUrl(event.state.href, lastTargetElement, function (el, bodyHtml) {				
				event.state.html = bodyHtml;
			});
		}
	};
});

var lastTargetElement = null;

function updateTitle(href, bodyHtml) {
	var doc = $('<output>').append($.parseHTML(bodyHtml, document, true));
	document.title = doc.find("title").text();
}

function pushHistory(href, bodyHtml) {
	try {
		window.history.pushState({ href: href, html: bodyHtml }, document.title, href);

	} catch (error) {
		window.title = document.title;
	}
}


function _loadData(href, el, bodyHtml, callBackFunction) {
	if (callBackFunction != undefined && callBackFunction != "" && callBackFunction != null) {
		callBackFunction($(el), bodyHtml);
	}
	else {
		updateTitle(href, bodyHtml);
		pushHistory(href, bodyHtml);

		loadeData($(el), bodyHtml);
	}
}

function ajaxLoadUrl(href, targetElement, callBackFunction) {
	lastTargetElement = targetElement;

	var el = targetElement;

	$.get(href, function (data) {
		var bodyHtml = data;

		_loadData(href, el, bodyHtml, callBackFunction);
	});	
}