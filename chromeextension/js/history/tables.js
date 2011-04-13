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

	m.showMoveLeftRow = function(){
		$("#moveLeftRow").show();
	}
	m.showMoveRightRow = function(){
		$("#moveRightRow").show();
	}
	m.hideMoveLeftRow = function(){
		$("#moveLeftRow").hide();
	}
	m.hideMoveRightRow = function(){
		$("#moveRightRow").hide();
	}

	/** scrolling methods **/
	var timer;
	var deltaSum = 0;
	var refractory = 0; // 0 - not refractory
						// 1 - prevent only page flip
						// 2 - prevent also normal scrolling
	$(document).mousewheel(function(e, delta){
		if(refractory){
			//prevent default scrolling if in refractory state 2
			if(refractory==2){
				e.preventDefault();
			}
			//don't do anything during refractory period
			return;
		}
		deltaSum += delta;
		setFinishTimer();
		if(Math.abs(deltaSum)<pref("deltaThreshold")) return;
		else finishTimer();
		setRefractoryPeriod(2);

		var b = $("body");
		var bottom = (b.scrollTop() + b.height() == b[0].scrollHeight);
		if(bottom && delta<0){
			scrollOlder();
		}else if(b.scrollTop()==0 && delta>0){
			scrollNewer();
		}
	}).scroll(function(e){
		setRefractoryPeriod(1);
	});
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
	function setRefractoryPeriod(rValue){
		refractory = rValue;
		setTimeout(function(){ refractory = 0; }, pref("wheelRefractory"));
	}
	function setFinishTimer(){
		if(typeof timer == "undefined")
			timer = setTimeout(finishTimer, pref("wheelTimer"));
	}
	function finishTimer(){
		deltaSum = 0;
		clearTimeout(timer);
		timer = undefined;
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
