//document.ready is too early. CSS width is not calculated yet
$(window).load(function(){ 
	DomainManager.addDomain("http://www.google.com/");
	DomainManager.addDomain("http://www.google.com/");
	ItemManager.addDomain({
		color: "#FF0000", 
		favUrl: "http://www.google.com/favicon.ico", 
		name: "google.com", 
		items: [{title: "Google", url: "http://www.google.com/", keywords: ["Google", "rocks"], startTime: new Date().getTime(), importance: [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0], events: []}, 
			{title: "Google Docs", url: "http://docs.google.com/", keywords: ["Google", "docs"], startTime: new Date().getTime(), importance: [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0], events: []}
		]
	});
	ItemManager.addDomain({
		color: "#0000FF", 
		favUrl: "http://www.apple.com/favicon.ico", 
		name: "apple.com", 
		items: [{title: "Apple", url: "http://www.apple.com/", keywords: ["Apple", "rocks", "magical"], startTime: new Date().getTime()-86400000, importance: [0.5, 0.5, 0.7, 0.9, 1.2, 1.5, 1.8, 0, 1, 0, 1, 0], events: []}, 
			{title: "Apple - Mac", url: "http://www.apple.com/mac", keywords: ["Apple", "mac", "magical", "revolutionary"], startTime: new Date().getTime()-120000, importance: [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0], events: []}
		]
	});

	if($(window).width()==0){
		//to fix that weird CSS bug in webkit where the width is occasionally rendered wrongly at first
		setTimeout("drawGraphs()", 100);
	}else{
		drawGraphs();
	}
});

function drawGraphs(){
	GraphManager.drawTopGraph();
	GraphManager.drawSteamGraph();
}

//function to redraw the graphs. Used with onresize
function drawMaps(newWidth){
	$("#steamgraph").width(newWidth);
	baseWidth = newWidth;
	$("#visualgraphs").css("-webkit-transform", "scaleX(1)");
	drawGraphs();
}
