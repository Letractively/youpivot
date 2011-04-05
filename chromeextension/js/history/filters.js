var FilterManager = {};

(function(){
	var m = FilterManager;
	var filters = new Array();
	var outcasts = new Array();

	m.addFilter = function(type, value, label){
		if(getFilterIndex(type, value)!==false){
			console.log("Filter already exists");
			return false;
		}
		var index = filters.length;
		var element = addFilterLabel(type, value, label, false);
		filters[index] = {type: type, value: value, element: element};
		m.filter();
		return index;
	}

	m.addOutcast = function(type, value, label){
		if(getOutcastIndex(type, value)!==false){ //FIXME
			console.log("Filter already exists");
			return false;
		}
		var index = outcasts.length;
		var element = addOutcastLabel(type, value, label);
		outcasts[index] = {type: type, value: value, element: element};
		m.filter();
		return index;
	}

	m.removeFilter = function(type, value){
		var id;
		if(typeof type == "string"){
			id = getFilterIndex(type, value);
			if(id===false) return;
		}else if(typeof type = "number"){
			id = type;
		}
		removeFilterLabel(id);
		filters.splice(id, 1); //splice last to avoid shifting issues
		m.filter();
	}
	function removeOutcast(type, value){
		var id;
		if(typeof type == "string"){
			id = getOutcastIndex(type, value);
			if(id===false) return;
		}else if(typeof type = "number"){
			id = type;
		}
		removeOutcastLabel(id);
		outcasts.splice(id, 1); //splice last to avoid shifting issues
		m.filter();
	}

	m.clearFilters = function(){
		filters = [];
		m.filter();
		$("#filters").html("");
		$("#filtersWrap").hide();
	}

	m.filter = function(){
		if(filters.length==0 && outcasts.length==0){
			//show all items
			$(".itemTable .item").each(function(){
				showFilterRow($(this));
			});
			return;
		}
		$(".itemTable").each(function(){ // do on both search results and pivot table
			$(this).itemTable("hideAll", {"class": "filtered"});
		});
		if(filters.length==0){
			$(".itemTable .item").each(function(){
				showFilterRow($(this));
			});
		}else{
			for(var i in filters){
				applyFilter(filters[i].type, filters[i].value);
			}
		}
		for(var i in outcasts){
			applyOutcast(outcasts[i].type, outcasts[i].value);
		}
		$(".itemTable").each(function(){
			$(this).itemTable("refreshTopRows");
		});
	}

	function applyOutcast(type, value){
		switch(type){
			case "name":
				filterName(value, "negative");
				break;
			case "domain":
				filterDomain(value, "negative");
				break;
		}
	}
	function applyFilter(type, value){
		switch(type){
			case "name":
				filterName(value, "positive");
				break;
			case "domain":
				filterDomain(value, "positive");
				break;
		}
	}

	function showFilterRow(obj){
		showRow(obj, "filtered");
	}
	function hideFilterRow(obj){
		hideRow(obj, "filtered");
	}
	function filterName(value, dir){
		$(".itemTable .item").each(function(){
			var item = $(this).data("item");
			if(matchKeywords(value, item.keywords)){
				if(dir == "positive")
					showFilterRow($(this));
				else if(dir == "negative")
					hideFilterRow($(this));
				else
					throw "Error: direction "+dir+" is not defined";
			}
		});
	}
	function filterDomain(domain, dir){
		$(".itemTable .item").each(function(){
			var item = $(this).data("item");
			if(item.domain.name == domain){
				if(dir == "positive")
					showFilterRow($(this));
				else if(dir == "negative")
					hideFilterRow($(this));
				else
					throw "Error: direction "+dir+" is not defined";
			}
		});
	}
	var lastTime;
	m.filterTime = function(time){
		if(typeof time == "undefined" && lastTime){
			time = lastTime;
		}else if(time){
			lastTime = time;
		}else{ 
			console.log("Time is not defined. Filtering aborted. ");
			return; 
		}
		//m.clearFilters();
		var startTime = time[0];
		var endTime = time[1];
		var tc = $("#textContent");
		tc.itemTable("hideAll", {"class": "out"});
		$(".itemTable .item", tc).each(function(){
			var item = $(this).data("item");
			if(item.endTime>=startTime && item.startTime<=endTime+1000){
				showTimeRow($(this));
			}else{
				//hideTimeRow($(this));
			}
		});
		//$(".itemTable", tc).itemTable("refreshTopRows");
		if(!SearchManager.getState()){
			TableManager.loadFilters();
		}
	}
	function showTimeRow(obj){
		showRow(obj, "out");
	}
	function hideTimeRow(obj){
		hideRow(obj, "out");
	}
	function hideRow(obj, type){
		obj.itemTable("hide", {"class": type});
	}
	function showRow(obj, type){
		obj.itemTable("show", {"class": type});
	}

	function matchKeywords(needle, keywords){
		for(var i in keywords){
			if(keywords[i].toLowerCase().indexOf(needle.toLowerCase())!=-1){
				return true;
			}
		}
		return false;
	}

	function getFilterIndex(type, value){
		for(var i in filters){
			if(filters[i].type==type && filters[i].value==value){
				return i;
			}
		}
		return false;
	}
	function getOutcastIndex(type, value){
		for(var i in outcasts){
			if(outcasts[i].type==type && outcasts[i].value==value){
				return i;
			}
		}
		return false;
	}

	function addOutcastLabel(type, value, lbl){
		if(type=="name"){
			lbl = "<div class='outcastText'>"+lbl+"</div>";
		}else if(type=="domain"){
			lbl = "<div class='outcastIcon'><div class='outcastCross'></div>"+lbl+"</div>";
		}
		return addFilterLabel(type, value, lbl, true);
	}
	function addFilterLabel(type, value, lbl, out){
		var label = $("<div class='filterLabel app' title='click to remove'></div>");
		label.click(function(){
			if(out){
				removeOutcast(type, value);
			}else{
				m.removeFilter(type, value);
			}
		});
		label.html(lbl);
		$("#filtersWrap").show();
		$("#filters").append(label);
		return label;
	}
	function removeOutcastLabel(id){
		outcasts[id].element.remove();
		if($("#filters").html()==""){
			$("#filtersWrap").hide();
		}
	}
	function removeFilterLabel(id){
		console.log(id);
		filters[id].element.remove();
		if($("#filters").html()==""){
			$("#filtersWrap").hide();
		}
	}
})();
