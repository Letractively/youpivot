var TableManager = {};

//This class is using the structure itemtable.js as backbone
(function(){
	var m = TableManager;

	m.reload = function(){
		m.clearItems();
		var list = ItemManager.list;
		SortManager.sortItems(list);
		for(var i in list){
			m.addItem(list[i]);
		}
	}

	m.loadFilters = function(){
		// load back filters from pivot view
		DomainManager.clearDomains();
		TermManager.clearTerms();
		$("#textContent .itemTable .item:not(.out)").each(function(){
			var item = $(this).data("item");
			DomainManager.addDomain(item.domain.favUrl, item.domain.name);
			TermManager.addTerms(item.keywords);
		});
		DomainManager.display();
		TermManager.display();
	}

	m.addItem = function(item){
		var row = TableHelper.addItem($("#textContent"), item);
		row.mouseenter(function(e){
			HighlightManager.highlightLayer(item.id, false);
		});
		row.mouseleave(function(e){
			HighlightManager.lowlightLayer(item.id, false);
		});
	}

	m.clearItems = function(){
		$("#textContent").itemTable("clear");
	}

	m.changeSchema = function(sortBy){
		TableHelper.changeSchema($("#textContent"), sortBy);
	}

	$(document).mousewheel(function(e, delta){
		console.log(delta);
		var b = $("body");
		var bottom = (b.scrollTop() + b.height() == b[0].scrollHeight);
		if(bottom && delta<0){
			var graphPos = GraphManager.getGraphPos();
			GraphManager.setSelectionScale(graphPos.offset-0.01, graphPos.scale+0.01);
			b.scrollTop(b[0].scrollHeight);
		}else if(b.scrollTop()==0 && delta>0){
			var graphPos = GraphManager.getGraphPos();
			GraphManager.setSelectionScale(graphPos.offset, graphPos.scale+0.01);
		}
	});

	$("#searchResults").bind("search", function(e, active){
		if(active){
			$("#textContent").hide();
		}else{
			$("#textContent").show();
			m.loadFilters();
		}
	});
})();
