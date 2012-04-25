include_("KeyTable");
include_("Color");
include_("Helper");
include_("GraphManager");
include_("PrefManager");

var ItemManager = new (function _ItemManager(){
	var self = this;
	self.list = new KeyTable();
	var counter = 0;

    self.init = function(){
        TableManager.init();
        SearchManager.init();
        FilterTimeManager.init(self);
    }

	self.addItems = function(items){
                //var ttt = new Date().getTime();
                //console.log("time to sort: ", new Date().getTime() - ttt);
		for(var i in items){
            if(!pref("showLog") && items[i].stream == "analytics") continue;
			var id = counter++;
			addItem(id, items[i]);
			self.list[id] = items[i];
		}
		SortManager.sortItems(self.list);
                //console.log("time to create item: ", new Date().getTime() - ttt);
		//DomainManager.display();
		//TermManager.display();
		//StreamManager.display();
                //console.log("time to display item: ", new Date().getTime() - ttt);
		$(window).trigger("itemsLoaded");
	}

	self.clear = function(){
		counter = 0;
		self.list = new KeyTable();
		TableManager.clearItems();
		GraphManager.clear();
        $(window).trigger("clearFilters");
        domains = [];
	}

    self.getItem = function(id){
        return self.list[id];
    }

    self.getItemByEventId = function(eventId){
        for(var i in self.list){
            if(self.list[i].eventId == eventId)
                return self.list[i];
        }
    }

    self.getDomain = function(itemId){
        var item = self.list[itemId];
        if(!item)
            return null;
        var id = item.domain.id;
        return domains[id];
    }

	var domains = new Array();
	function addToDomainList(domain, color, data){
		for(var i=0; i<domains.length; i++){
			if(domains[i].name == domain){
                //addToDomainData(domains[i], data);
				return i;
			}
		}
		var output = domains.length;
        var newDomain = {name: domain};

        var graphColor = Helper.createLighterColor(color, pref("normalGraph"), "array");
        newDomain.graphColor = graphColor;

        domains[output] = newDomain;
		return output;
	}

	self.getDomainId = function(domain){
		for(var i in domains){
			if(domains[i].name == domain){
				return i;
			}
		}
	}

    self.deleteItem = function(id){
        self.list.remove(id);
    }

    self.getList = function(){
        return self.list;
    }

	function addItem(id, item){
		var domain = item.domain;
		item.id = id;
        // no need to add to table because they will be added when filterTime is called
        item.domain.id = addToDomainList(domain.name, domain.color);
		var importance = item.importance;
		if(importance && importance.length>0){ 
			GraphManager.loadData(domains[domain.id].graphColor, item.importance, item.id, item.startTime, domain.id);
		}else{
            GraphManager.addEvent(item.startTime, domain.favUrl, domain.color, item.title, item.id);
		}
	}
})();
