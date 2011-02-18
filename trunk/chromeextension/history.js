//document.ready is too early. CSS width is not calculated yet
$(window).load(function(){ 
	ItemManager.addItem(0, new Date().getTime(), "Google", "#FF0000", "http://www.google.com/");
	ItemManager.addItem(1, new Date().getTime()+180000, "Apple", "#0000FF", "http://www.apple.com/");
	addApplicationIcon("http://www.google.com/favicon.ico");
	addApplicationIcon("http://www.google.com/favicon.ico");
	TermManager.addTerm("Hahaha", 20);
	TermManager.addTerm("Hahaha", 20);
	TermManager.addTerm("Hahaha", 20);
	TermManager.addTerm("Hahaha", 20);
	TermManager.addTerm("Hahaha", 20);
	TermManager.addTerm("Hahaha", 20);
	TermManager.addTerm("Hahaha", 20);
	TermManager.addTerm("Hahaha", 20);
	TermManager.addTerm("Hahaha", 20);
	TermManager.addTerm("Hahaha", 20);
	TermManager.addTerm("Hahaha", 20);
	TermManager.addTerm("Hahaha", 20);
	TermManager.addTerm("Hahaha", 20);
	TermManager.addTerm("Hahaha", 20);
	TermManager.addTerm("Hahaha", 20);
	TermManager.addTerm("LOL", 55);
	TermManager.addTerm("LOL", 55);
	TermManager.addTerm("LOL", 55);
	TermManager.addTerm("LOL", 55);
	TermManager.addTerm("LOL", 55);
	TermManager.addTerm("LOL", 55);
	DomainManager.addDomain("http://www.google.com/");
	DomainManager.addDomain("http://www.google.com/");

	console.log("window", $(window).width());
	if($(window).width()==0){
		//to fix that weird CSS bug in webkit where the width is occasionally rendered wrongly at first
		setTimeout("drawGraphs()", 100);
	}else{
		drawGraphs();
	}

	//resize the graphs when the window is resized. Not stable. 
	
	baseWidth = $("#visualgraphs").width();
	var timeout;
	/*$(window).resize(function(e){
		$("#visualgraphs").width(10);
		var newWidth = $("#visualgraphs").parent().width();
		$("#visualgraphs").width(newWidth);
		var scale = newWidth/baseWidth;
		$("#visualgraphs").css("-webkit-transform", "scaleX("+scale+")");
		clearTimeout(timeout);
		timeout = setTimeout("drawMaps("+newWidth+")", 200);
	});*/
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

function addApplicationIcon(icon){
	var img = IconFactory.createIcon(icon).addClass("applicationIcon");
	$("#applications").append(img);
}
