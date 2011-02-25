var FilterManager = {};

(function(){
	var m = FilterManager;
	var filters = new Array();

	m.addFilter = function(type, value){
		if(getFilterIndex(type, value)!==false){
			console.log("Filter already exists");
			return false;
		}
		addFilterLabel(type, value);
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

	m.filter = function(){
		console.log(filters);
		$(".itemTable tr").show();
		$(".itemTable").prev().show();
		for(var i in filters){
			applyFilter(filters[i].type, filters[i].value);
		}
	}

	function applyFilter(type, value){
		switch(type){
			case "name":
				filterName(value);
				break;
		}
	}

	function filterName(value){
		$(".itemTable tr").each(function(){
			var item = $(this).data("item");
			if(!matchKeywords(value, item.keywords)){
				hideRow($(this));
			}
		});
	}
	function hideRow(obj){
		obj.hide();
		var somethingShown = false;
		obj.siblings().each(function(){
			console.log($(this).css("display"));
			if($(this).css("display") != "none"){
				somethingShown = true;
			}
		});
		if(!somethingShown){
			obj.parent().parent().prev().hide();
		}
	}
	function matchKeywords(needle, keywords){
		for(var i in keywords){
			if(keywords[i].indexOf(needle)!=-1){
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
	
	function getLabel(type, value){
		switch(type){
			case "name":
				return value;
				break;
		}
	}
	function addFilterLabel(type, value){
		var label = $("<div class='filterLabel app'></div>");
		label.click(function(){
			m.removeFilter(type, value);
			removeFilterLabel($(this));
		});
		label.html(getLabel(type, value));
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
