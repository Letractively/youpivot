include("/js/filter.js");

var FilterManager = new (function _FilterManager(){
    var self = this;

    $(function(){
        self.filter = new Filter($("#filtersWrap"), ItemManager.getList);
        self.filter.addTestType("name", nameTest);
        self.filter.addTestType("domain", domainTest);
        self.filter.addTestType("stream", streamTest);
    });

    self.clearFilters = function(){
        self.filter.clearFilters();
    }
    
    $("#filtersWrap").bind("filterChanged", function(e, ids){
        console.log("haha", ids);
        TableManager.itemTable.filter(ids.include, ids.exclude);
        TableManager.itemTable.display();
    });

	function nameTest(value, item){
		return matchKeywords(value, item.keywords) || matchKeywords(value, item.title.split(/[^a-zA-Z0-9]/g));
	}
	function domainTest(domain, item){
		return item.domain.name == domain;
	}
	function streamTest(stream, item){
		return item.stream == stream;
	}

	function matchKeywords(needle, keywords){
		for(var i in keywords){
			if(keywords[i].toLowerCase().indexOf(needle.toLowerCase())!=-1){
				return true;
			}
		}
		return false;
	}

})();

/*
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
		}else if(typeof type == "number"){
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
			activeTable().find(".itemTable .item").each(function(){
				showFilterRow($(this));
			});
			return;
		}
        activeTableManager().hideAll("filtered");
		if(filters.length==0){
			activeTable().find(".itemTable .item").each(function(){
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
        activeTableManager().refreshTopRows();
	}

	function applyOutcast(type, value){
		switch(type){
			case "name":
				filterGeneral(value, "negative", nameTest);
				break;
			case "domain":
				filterGeneral(value, "negative", domainTest);
				break;
			case "stream":
				filterGeneral(value, "negative", streamTest);
				break;
		}
	}
	function applyFilter(type, value){
		switch(type){
			case "name":
				filterGeneral(value, "positive", nameTest);
				break;
			case "domain":
				filterGeneral(value, "positive", domainTest);
				break;
			case "stream":
				filterGeneral(value, "positive", streamTest);
				break;
		}
	}

	function showFilterRow(obj){
		showRow(obj, "filtered");
	}
	function hideFilterRow(obj){
		hideRow(obj, "filtered");
	}

	function filterGeneral(value, dir, test){
		activeTable().find(".itemTable .item").each(function(){
			var item = activeTableManager().getItem($(this).data("id"));
			if(test(value, item)){
				if(dir == "positive")
					showFilterRow($(this));
				else if(dir == "negative")
					hideFilterRow($(this));
				else
					throw "Error: direction ["+dir+"] is not defined";
			}
		});
	}
	function nameTest(value, item){
		return matchKeywords(value, item.keywords);
	}
	function domainTest(domain, item){
		return item.domain.name == domain;
	}
	function streamTest(stream, item){
		return item.stream == stream;
	}

	function hideRow(obj, type){
        var id = obj.data("id");
        activeTableManager().hide(obj, type);
	}
	function showRow(obj, type){
        var id = obj.data("id");
        activeTableManager().show(obj, type);
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
		}else if(type=="domain" || type=="stream"){
			lbl = "<div class='outcastIcon'><div class='outcastCross'></div>"+lbl+"</div>";
		}
		return addFilterLabel(type, value, lbl, true);
	}
	function addFilterLabel(type, value, lbl, out){
		var label = $("<div class='filterLabel app' title='"+value+" (click to remove)'></div>");
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

    function activeTableManager(){
        if(SearchManager.getState())
            return SearchManager;
        else 
            return TableManager;
    }

    function activeTable(){
        if(SearchManager.getState())
            return $("#y-searchResults");
        else
            return $("#textContent");
    }

    // clear all the filters when changing from search results to history list
    $("#y-searchResults").bind("search", function(e, active){
        m.clearFilters();
    });
})();
*/
