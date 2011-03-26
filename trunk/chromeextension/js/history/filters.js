var FilterManager = {};

(function(){
	var m = FilterManager;
	var filters = new Array();

	m.addFilter = function(type, value, label){
		if(getFilterIndex(type, value)!==false){
			console.log("Filter already exists");
			return false;
		}
		addFilterLabel(type, value, label);
		var index = filters.length;
		filters[index] = {type: type, value: value};
		m.filter();
		return index;
	}

	m.removeFilter = function(type, value){
		if(typeof type == "string"){
			var index = getFilterIndex(type, value);
			if(index===false) return;
			filters.splice(index, 1);
		}else if(typeof type = "number"){
			filters.splice(type, 1);
		}
		m.filter();
	}

	m.clearFilters = function(){
		filters = [];
		m.filter();
		$("#filters").html("");
		$("#filtersWrap").hide();
	}

	m.filter = function(){
		if(filters.length==0){
			//show all items
			$(".itemTable .item").each(function(){
				showFilterRow($(this));
			});
			return;
		}
		$(".itemTable").each(function(){
			$(this).itemTable("hideAll", {"class": "filtered"});
		});
		for(var i in filters){
			applyFilter(filters[i].type, filters[i].value);
		}
	}

	function applyFilter(type, value){
		switch(type){
			case "name":
				filterName(value);
				break;
			case "domain":
				filterDomain(value);
				break;
		}
	}

	function showFilterRow(obj){
		showRow(obj, "filtered");
	}
	function hideFilterRow(obj){
		hideRow(obj, "filtered");
	}
	function filterName(value){
		//$(".itemTable .item:not(.out)").each(function(){
		$(".itemTable .item").each(function(){
			var item = $(this).data("item");
			if(matchKeywords(value, item.keywords)){
				showFilterRow($(this));
			}
		});
	}
	function filterDomain(domain){
		$(".itemTable .item").each(function(){
			var item = $(this).data("item");
			if(item.domain.name == domain){
				showFilterRow($(this));
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
		$(".itemTable .item", tc).each(function(){ hideTimeRow($(this)); })
		.each(function(){
			var item = $(this).data("item");
			if(item.endTime>=startTime && item.startTime<=endTime+1000){
				showTimeRow($(this));
			}else{
				//hideTimeRow($(this));
			}
		});
		TableManager.loadFilters();
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

	function addFilterLabel(type, value, lbl){
		var label = $("<div class='filterLabel app'></div>");
		label.click(function(){
			m.removeFilter(type, value);
			removeFilterLabel($(this));
		});
		label.html(lbl);
		$("#filtersWrap").show();
		$("#filters").append(label);
	}
	function removeFilterLabel(obj){
		obj.remove();
		if($("#filters").html()==""){
			$("#filtersWrap").hide();
		}
	}
})();
