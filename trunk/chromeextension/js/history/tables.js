var TableManager = {};
/**
 *	TableManager manages the items list on the main content, below the visualizations. 
 *	It uses itemTable jQuery plugin (itemtable.js) as backbone
 *		Search results table also uses itemtable.js
 *	table.js implements only features specific to the items list
 */

(function(){
	var m = TableManager;

	//reload the items in the table. Basically clearing all the items and add it back. 
	//This operation takes time
	m.reload = function(){
		m.clearItems();
		var list = ItemManager.list;
		SortManager.sortItems(list);
		for(var i in list){
			m.addItem(list[i]);
		}
	}

	//load the filters back from this items list. Called when switching back from search results. 
	m.loadFilters = function(){
		// load back filters from pivot view
		DomainManager.clearDomains();
		TermManager.clearTerms();
		StreamManager.clearStreams();
		$("#textContent .itemTable .item:not(.out)").each(function(){
			var item = $(this).data("item");
			DomainManager.addDomain(item.domain.favUrl, item.domain.name);
			TermManager.addTerms(item.keywords);
			StreamManager.addStream(item.stream);
		});
		DomainManager.display();
		TermManager.display();
		StreamManager.display();
	}

	//add an item to the table
	m.addItem = function(item){
		var row = TableHelper.addItem($("#textContent"), item);
		//add additional listener functions only for this table
		row.mouseenter(function(e){
			HighlightManager.highlightLayer(item.id, false);
		});
		row.mouseleave(function(e){
			HighlightManager.lowlightLayer(item.id, false);
		});
	}

	//clear all items from the table
	m.clearItems = function(){
		$("#textContent").itemTable("clear");
	}

	m.changeSchema = function(sortBy){
		TableHelper.changeSchema($("#textContent"), sortBy);
	}

	$("#searchResults").bind("search", function(e, active){
		if(active){
			$("#textContent").hide();
		}else{
			$("#textContent").show();
			m.loadFilters();
		}
	});
})();
