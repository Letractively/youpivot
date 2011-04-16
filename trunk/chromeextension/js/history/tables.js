var TableManager = {};
/**
 *	TableManager manages the items list on the main content, below the visualizations. 
 *	It uses itemTable jQuery plugin (itemtable.js) as backbone
 *		Search results table also uses itemtable.js
 *	table.js implements only features specific to the items list
 */

(function(){
	var m = TableManager;

	//reload the items in the table. Basically clearing all the items and add it back. 
	//This operation takes time
	m.reload = function(){
		m.clearItems();
		var list = ItemManager.list;
		SortManager.sortItems(list);
		for(var i in list){
			m.addItem(list[i]);
		}
	}

	//load the filters back from this items list. Called when switching back from search results. 
	m.loadFilters = function(){
		// load back filters from pivot view
		DomainManager.clearDomains();
		TermManager.clearTerms();
		$("#textContent .itemTable .item:not(.out)").each(function(){
			var item = $(this).data("item");
			DomainManager.addDomain(item.domain.favUrl, item.domain.name);
			TermManager.addTerms(item.keywords);
		});
		DomainManager.display();
		TermManager.display();
	}

	//add an item to the table
	m.addItem = function(item){
		var row = TableHelper.addItem($("#textContent"), item);
		//add additional listener functions only for this table
		row.mouseenter(function(e){
			HighlightManager.highlightLayer(item.id, false);
		});
		row.mouseleave(function(e){
			HighlightManager.lowlightLayer(item.id, false);
		});
	}

	//clear all items from the table
	m.clearItems = function(){
		$("#textContent").itemTable("clear");
	}

	m.changeSchema = function(sortBy){
		TableHelper.changeSchema($("#textContent"), sortBy);
	}

	/** scrolling methods **/
	$(function(){
		$(document).scrollTop($("#topPageFlipper").height());
		//initialize the timer bars
		$("#topPageFlipper .flip").timerBar("create", {complete: doScrollNew, speed: 100, number: 20});
		$("#bottomPageFlipper .flip").timerBar("create", {complete: doScrollOld, speed: 100, number: 20});
	});
	$(window).resize(onresize);
	$("#graphShadow").bind("resize", onresize);
	function onresize(e){
		var mHeight = window.innerHeight - $("#graphShadow").height();
		$("#textContent").css("min-height", mHeight);
	}
	$(document).mouseenter(function(e){
		stopFlip("all");
		scrollHideFlipper(100);
	});
	$("#topPageFlipper").mouseenter(function(e){
		pauseFlip("top");
	}).mouseleave(function(e){
		resumeFlip("top", doScrollNew);
	}).click(function(e){
		stopFlip("top");
		scrollHideFlipper(100);
	});
	$("#bottomPageFlipper").mouseenter(function(e){
		pauseFlip("bottom");
	}).mouseleave(function(e){
		resumeFlip("bottom", doScrollOld);
	}).click(function(e){
		stopFlip("bottom");
		scrollHideFlipper(100);
	});
	$(document).mousewheel(function(e, delta){
		if(atTop(1) && delta<0){
			stopFlip("top");
			scrollHideFlipper(100);
			e.preventDefault();
		}
		if(atBottom(1) && delta>0){
			stopFlip("bottom");
			scrollHideFlipper(100);
			e.preventDefault();
		}
	});
	$(document).scroll(function(e){
		if(atTop(2)){
			startFlip("top");
		}else{
			stopFlip("top");
		}
		if(atBottom(2)){
			startFlip("bottom");
		}else{
			stopFlip("bottom");
		}
	});
	function doScrollNew(){
		var topItem = $("#textContent tr.item:visible").first();
		scrollNewer();
		resetFlipButton($("#topPageFlipper"));
		$("#topPageFlipper .flip").timerBar("reset");
		$(document).scrollTop(topItem.offset().top - $("#graphShadow").height() - 107);
		scrollHideFlipper(500);
	}
	function doScrollOld(){
		scrollOlder();
		resetFlipButton($("#bottomPageFlipper"));
		$("#bottomPageFlipper .flip").timerBar("reset");
		scrollHideFlipper(500);
	}
	function scrollHideFlipper(duration){
		var flipperHeight = $("#topPageFlipper").outerHeight()+6;
		if(atTop(1)){
			$("body").animate({"scrollTop": flipperHeight}, duration);
		}else if(atBottom(1)){
			$("body").animate({"scrollTop": $("body")[0].scrollHeight - $("body").height() - flipperHeight}, duration);
		}
	}
	function resetFlipButton(button){
		button.removeClass("active");
		button.find(".label").text("Load more items");
		$(".cancelLabel", button).remove();
	}
	function startFlip(dir){
		var flipper = $("#"+dir+"PageFlipper");
		$(".flip", flipper).timerBar("reset");
		$(".flip", flipper).timerBar("start");
		flipper.addClass("active");
		$(".label", flipper).text("Loading more items....");
		$(".flip", flipper).after("<div class='cancelLabel'>Click to cancel</div>");
	}
	function stopFlip(dir){
		if(dir=="all"){
			stopFlip("top");
			stopFlip("bottom");
			return;
		}
		var flipper = $("#"+dir+"PageFlipper");
		$(".flip", flipper).timerBar("options", {speed: 100}).timerBar("reset");
		resetFlipButton(flipper);
	}
	function pauseFlip(dir){
		$("#"+dir+"PageFlipper .flip").timerBar("options", {speed: 750});
	}
	function resumeFlip(dir, callback){
		$("#"+dir+"PageFlipper .flip").timerBar("options", {speed: 100});
	}
	// level 1 - page flipper is visible; 2 - at the very top of document
	function atTop(level){
		var scrollTop = $(document).scrollTop();
		if(level==1){
			var flipperHeight = $("#topPageFlipper").outerHeight();
			return scrollTop < flipperHeight;
		}else if(level==2){
			return scrollTop == 0;
		}
	}
	function atBottom(level){
		var scrollTop = $(document).scrollTop();
		var maxScrollTop = $("body")[0].scrollHeight - $("body").height();
		if(level==1){
			var flipperHeight = $("#bottomPageFlipper").outerHeight();
			return scrollTop > maxScrollTop - flipperHeight;
		}else if(level==2){
			return scrollTop == maxScrollTop;
		}
	}
	function scrollOlder(){
		var graphPos = GraphManager.getGraphPos();
		if(graphPos.offset<=0) return;
		var scrollScale = pref("scrollScale");
		var scrollMethod = pref("scrollMethod");
		if(scrollMethod == "expand"){
			GraphManager.setSelectionScale(graphPos.offset-scrollScale, graphPos.scale+scrollScale);
		}else if(scrollMethod == "move"){
			GraphManager.setSelectionScale(graphPos.offset-scrollScale, graphPos.scale);
		}else{
			console.log("scrolling method in preferences not recognized. ");
		}
		$("#textContent").itemTable("refreshTopRows");
	}
	function scrollNewer(){
		var graphPos = GraphManager.getGraphPos();
		if(graphPos.offset + graphPos.scale >= 1) return;
		var scrollScale = pref("scrollScale");
		var scrollMethod = pref("scrollMethod");
		if(scrollMethod == "expand"){
			GraphManager.setSelectionScale(graphPos.offset, graphPos.scale+scrollScale);
		}else if(scrollMethod == "move"){
			GraphManager.setSelectionScale(graphPos.offset+scrollScale, graphPos.scale);
		}else{
			console.log("scrolling method in preferences not recognized. ");
		}
		$("#textContent").itemTable("refreshTopRows");
	}
	/** end scrolling methods **/

	$("#searchResults").bind("search", function(e, active){
		if(active){
			$("#textContent").hide();
		}else{
			$("#textContent").show();
			m.loadFilters();
		}
	});
})();
