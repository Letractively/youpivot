var ItemManager = {};

(function(){
	var m = ItemManager;

	m.addDomains = function(domains){
		for(var i in domains){
			m.addDomain(domains[i]);
		}
	}

	m.addDomain = function(domain){
		var color = domain.color;
		var favUrl = domain.favUrl;
		var name = domain.name;
		var items = domain.items;
		for(var i in items){
			addItem(items[i], domain);
		}
		addApplicationIcon(favUrl, name);
	}

	function addItem(item, domain){
		var title = item.title;
		var url = item.url;
		var keywords = item.keywords;
		var importance = item.importance;
		var events = item.events;
		var startTime = item.startTime;
		TermManager.addTerms(keywords);
		TableManager.addItem(startTime, title, domain.color, url, domain.favUrl);
		console.log("additem", item);
	}
})();

function addApplicationIcon(icon, name){
	var img = IconFactory.createIcon(icon, name).addClass("applicationIcon");
	$("#applications").append(img);
}
