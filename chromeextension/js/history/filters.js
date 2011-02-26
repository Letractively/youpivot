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

	m.filter = function(){
		if(filters.length==0){
			//show all items
			$(".itemTable tr").each(function(){
				showRow($(this));
			});
			return;
		}
		$(".itemTable tr").hide();
		$(".itemTable").prev().hide();
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

	function filterName(value){
		$(".itemTable tr").each(function(){
			var item = $(this).data("item");
			if(matchKeywords(value, item.keywords)){
				showRow($(this));
			}
		});
	}
	function filterDomain(domain){
		$(".itemTable tr").each(function(){
			var item = $(this).data("item");
			if(item.domain.name == domain){
				showRow($(this));
			}
			console.log(item);
		});
	}
	function showRow(obj){
		obj.show();
		obj.parent().parent().prev().show(); // hide the date label
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
