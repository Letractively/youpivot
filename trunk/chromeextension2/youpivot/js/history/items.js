include("js/keytable.js");
include("js/color.js");

var ItemManager = new (function _ItemManager(){
	var self = this;
	self.list = new KeyTable();
	var counter = 0;

    self.init = function(){
        TableManager.init();
        SearchManager.init();
    }

	self.addItems = function(items){
                //var ttt = new Date().getTime();
                //console.log("time to sort: ", new Date().getTime() - ttt);
		for(var i in items){
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
		EventManager.clear();
		DomainManager.clearDomains();
		TermManager.clearTerms();
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
		for(var i in domains){
			if(domains[i].name == domain){
                //addToDomainData(domains[i], data);
				return i;
			}
		}
		var output = domains.length;
        var newDomain = {name: domain};

        var graphColor = Helper.createLighterColor(color, pref("normalGraph"));
        newDomain.graphColor = Color.toRGBArray(graphColor);

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
			EventManager.add(item.startTime, domain.favUrl, domain.color, item.title, item.id);
		}
	}
})();
