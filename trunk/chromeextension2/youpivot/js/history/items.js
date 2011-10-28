include("js/color.js");

var ItemManager = {};

(function(){
	var m = ItemManager;
	m.list = new Array();
	var counter = 0;

	m.addItems = function(items){
        var ttt = new Date().getTime();
		SortManager.sortItems(items);
        console.log("time to sort: ", new Date().getTime() - ttt);
		for(var i in items){
			var id = counter++;
			addItem(id, items[i]);
			m.list[id] = items[i];
		}
        console.log("time to create item: ", new Date().getTime() - ttt);
		DomainManager.display();
		TermManager.display();
		StreamManager.display();
        TableHelper.initTables();
        console.log("time to display item: ", new Date().getTime() - ttt);
		$(window).trigger("itemsLoaded");
	}

	m.clear = function(){
		counter = 0;
		m.list = [];
		TableManager.clearItems();
		GraphManager.clear();
		EventManager.clear();
		DomainManager.clearDomains();
		TermManager.clearTerms();
	}

    m.getItem = function(id){
        return m.list[id];
    }

	/*m.getDomainItemsById = function(id){
		var domain = m.list[id].domain.name;
		m.getDomainItems(domain);
	}

	m.getDomainItems = function(domain){
		var output = [];
		for(var i in m.list){
			if(m.list[i].domain.name == domain){
				output[output.length] = m.list[i];
			}
		}
		return output;
	}*/

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

	function addItem(id, item){
		var domain = item.domain;
		item.id = id;
		//TableManager.addItem(item);
		var importance = item.importance;
        item.domain.id = addToDomainList(domain.name, domain.color);
		if(importance && importance.length>0){ 
			GraphManager.loadData(domains[domain.id].graphColor, item.importance, item.id, item.startTime, domain.id);
		}else{
			EventManager.add(item.startTime, domain.favUrl, domain.color, item.title, item.id);
		}
	}
})();
