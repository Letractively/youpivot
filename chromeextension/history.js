//document.ready is too early. CSS width is not calculated yet
$(window).load(function(){ 
	PivotManager.pivot(new Date().getTime()); //FIXME back to middle of the day

	var google = {color: "#FF0000", favUrl: "http://www.google.com/favicon.ico", name: "google.com"};
	var apple = {color: "#0000FF", favUrl: "http://www.apple.com/favicon.ico", name: "apple.com"};
	var debugItems = [{title: "Google", url: "http://www.google.com/", keywords: ["Google", "rocks"], startTime: new Date().getTime()-36000000, endTime: new Date().getTime()-26000000, importance: [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0], events: [], domain: google}, {title: "Google Docs", url: "http://docs.google.com/", keywords: ["Google", "docs"], startTime: new Date().getTime(), endTime: new Date().getTime()+1, importance: [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0], events: [], domain: google}, {title: "Apple", url: "http://www.apple.com/", keywords: ["Apple", "rocks", "magical"], startTime: new Date().getTime()-86400000, endTime: new Date().getTime()-86400000+3600000, importance: [0.5, 0.5, 0.7, 0.9, 1.2, 1.5, 1.8, 0, 1, 0, 1, 0], events: [], domain: apple}, {title: "Apple - Mac", url: "http://www.apple.com/mac", keywords: ["Apple", "mac", "magical", "revolutionary"], startTime: new Date().getTime()-120000, endTime: new Date().getTime()-60000, importance: [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0], events: [], domain: apple}];
	for(var j=0; j<80; j++){
		var r = {};
		$.extend(r, debugItems[j%4]); //deep copy
		debugItems[debugItems.length] = r;
	}
	var crap = {color: "#000000", favUrl: "images/hide.png", name: "Crap"}
	debugItems[debugItems.length] = {title: "Hide", url: "", keywords: ["Crap"], startTime: new Date().getTime(), endTime: new Date().getTime()+1, events: [], domain: crap};
	debugItems[debugItems.length] = {title: "Holy Crap", url: "", keywords: ["Holy", "Crap"], startTime: new Date().getTime()-22*60*60000, endTime: new Date().getTime()-22*60*60000+1, events: [], domain: crap};

	ItemManager.addItems(debugItems);

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
