var Filter = function(activeFilter, getList){
    var self = this;

    var filters = [];
    var outcasts = [];

    var filterWrap = activeFilter;
    var filterContainer = activeFilter.find(".activeFilterContainer");

    (function init(){
    })();

	self.addFilter = function(type, value, label){
		if(getFilterIndex(type, value)!==false){
			console.log("Filter already exists");
			return false;
		}
		var index = filters.length;
		var element = addFilterLabel(type, value, label, false);
		filters[index] = {type: type, value: value, element: element};
        self.triggerFilter();
		return index;
	}

	self.addOutcast = function(type, value, label){
		if(getOutcastIndex(type, value)!==false){ //FIXME
			console.log("Filter already exists");
			return false;
		}
		var index = outcasts.length;
		var element = addOutcastLabel(type, value, label);
		outcasts[index] = {type: type, value: value, element: element};
        self.triggerFilter();
		return index;
	}

	self.removeFilter = function(type, value){
		var id;
		if(typeof type == "string"){
			id = getFilterIndex(type, value);
			if(id===false) return;
		}else if(typeof type == "number"){
			id = type;
		}
		removeFilterLabel(id);
		filters.splice(id, 1); //splice last to avoid shifting issues
        self.triggerFilter();
        saveToAnalytics(type, value);
	}

    function saveToAnalytics(type, value){
        var section = "Traditional History";
        if(filterWrap.parents("#m-tabView_youpivot").length > 0)
            section = "YouPivot";
        analytics(section, "Unfilter: "+type+": "+value, {action: "Unfilter", type: type, value: value});
    }

    self.triggerFilter = function(){
        var ids = self.getFilterIds();
        filterWrap.trigger("filterChanged", [ids]);
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
        self.triggerFilter();
	}

	self.clearFilters = function(){
		filters = [];
		//self.filter();
        //self.triggerFilter();
		filterContainer.html("");
		filterWrap.hide();
	}

    $(window).bind("clearFilters", function(){
        console.log("clear filters");
        self.clearFilters();
    });

    var tests = {};

    self.addTestType = function(type, test){
        tests[type] = test;
    }
    //var tests = {"name": nameTest, "domain": domainTest, "stream": streamTest};

    self.getFilterIds = function(){
        var includeIds = [];
        var excludeIds = [];
        var list = getList();
        if(filters.length == 0){
            includeIds = Infinity;
        }else{
            for(var i in filters){
                for(var k in list){
                    var item = list[k];
                    var filter = filters[i];
                    if(tests[filter.type](filter.value, item)){
                        // include
                        includeIds.push(item.id);
                    }
                }
            }
        }
        for(var i in outcasts){
            for(var k in list){
                var item = list[k];
                var outcast = outcasts[i];
                if(tests[outcast.type](outcast.value, item)){
                    excludeIds.push(item.id);
                }
            }
        }
        return {"include": includeIds, "exclude": excludeIds};
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
		if(type=="name" || type=="term"){
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
				self.removeFilter(type, value);
			}
		});
		label.html(lbl);
		filterWrap.show();
		filterContainer.append(label);
		return label;
	}
	function removeOutcastLabel(id){
		outcasts[id].element.remove();
		if(filterContainer.html()==""){
			filterWrap.hide();
		}
	}
	function removeFilterLabel(id){
		filters[id].element.remove();
		if(filterContainer.html()==""){
			filterWrap.hide();
		}
	}

}
