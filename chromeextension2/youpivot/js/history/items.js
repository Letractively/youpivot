include("js/keytable.js");
include("js/color.js");

var ItemManager = {};

(function(){
	var m = ItemManager;
	m.list = new KeyTable();
	var counter = 0;

    m.init = function(){
        TableManager.init();
        SearchManager.init();
    }

	m.addItems = function(items){
                //var ttt = new Date().getTime();
                //console.log("time to sort: ", new Date().getTime() - ttt);
		for(var i in items){
			var id = counter++;
			addItem(id, items[i]);
			m.list[id] = items[i];
		}
		SortManager.sortItems(m.list);
                //console.log("time to create item: ", new Date().getTime() - ttt);
		DomainManager.display();
		TermManager.display();
		StreamManager.display();
                //console.log("time to display item: ", new Date().getTime() - ttt);
		$(window).trigger("itemsLoaded");
	}

	m.clear = function(){
        console.log("clear");
		counter = 0;
		m.list = new KeyTable();
		TableManager.clearItems();
		GraphManager.clear();
		EventManager.clear();
		DomainManager.clearDomains();
		TermManager.clearTerms();
	}

    m.getItem = function(id){
        return m.list[id];
    }

    m.getItemByEventId = function(eventId){
        for(var i in m.list){
            if(m.list[i].eventId == eventId)
                return m.list[i];
        }
    }

    m.getDomain = function(itemId){
        var item = m.list[itemId];
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

        //var graphHighlightColor = Helper.createLighterColor(color, pref("highlightGraph"));
        //newDomain.graphHighlightColor = [1, 255].concat(Color.toRGBArray(graphHighlightColor));

        //addToDomainData(newDomain, data);
        domains[output] = newDomain;
		return output;
	}

    /*function addToDomainData(domain, data){
        var size = data.length;
        if(size == 0) return; // return if data is empty
        if(!domain.data) domain.data = [];
        for(var i=0; i<size; i++){
            if(typeof domain.data[i] == "undefined")
                domain.data[i] = data[i];
            else
                domain.data[i] += data[i];
        }
    }*/

	m.getDomainId = function(domain){
		for(var i in domains){
			if(domains[i].name == domain){
				return i;
			}
		}
	}

    m.deleteItem = function(id){
        delete m.list[id];
    }

    m.getList = function(){
        return m.list;
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
