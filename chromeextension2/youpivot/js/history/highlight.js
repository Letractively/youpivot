//include_("GraphManager");
//include_("ItemManager");
//include_("EventManager");
//include_("SearchManager");
//include_("TableManager");
//include_("EventManager");

var HighlightManager = {};

(function(){
	var self = HighlightManager;
    var domainHighlightPool = {};
    var tableHighlightPool = {};
    var graphHighlightPool = {};


    /************* Highlight event handles (routing) *******************/

    self.mouseEnterGraph = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        self.highlightHistoryListDomain(domainId);
        self.highlightHistoryListItem(id);
        self.highlightLayer(id);
        self.scrollToItem(id, 500);
    }

    self.mouseLeaveGraph = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        self.lowlightHistoryListDomain(domainId);
        self.lowlightHistoryListItem(id);
        self.lowlightLayer(id);
        self.cancelScroll(id);
    }

    var graphToggleState = {};

    self.clickOnGraph = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        if(!graphToggleState[id]){
            self.highlightHistoryListDomain(domainId);
            self.highlightHistoryListItem(id);
            self.highlightLayer(id);
            self.cancelScroll(id);
            self.scrollToItem(id, 0);
            graphToggleState[id] = true;
        }else{
            self.lowlightHistoryListDomain(domainId);
            self.lowlightHistoryListItem(id);
            self.lowlightLayer(id);
            graphToggleState[id] = false;
        }
    }

    self.mouseEnterHistoryListItem = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        self.highlightHistoryListDomain(domainId);
        self.highlightHistoryListItem(id);
        self.highlightLayer(id);
    }

    self.mouseLeaveHistoryListItem = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        self.lowlightHistoryListDomain(domainId);
        self.lowlightHistoryListItem(id);
        self.lowlightLayer(id);
    }

    self.mouseEnterSearchTableItem = function(id){
        var domainId = SearchManager.results[id].domain.id;
        self.highlightSearchTableDomain(domainId);
        self.highlightSearchTableItem(id);
    }

    self.mouseLeaveSearchTableItem = function(id){
        var domainId = SearchManager.results[id].domain.id;
        self.lowlightSearchTableDomain(domainId);
        self.lowlightSearchTableItem(id);
    }

    /*********** Highlight implementations *************/

    // highlights the domain on the table that is currently visible to the user
    // domain ID cannot be used here because it's different for search results and normal history items
    self.highlightActiveTableDomain = function(title){
        var domainId, controller, list;

        if(SearchManager.getState()){
            domainId = SearchManager.getDomainId(title);
            controller = SearchManager;
            list = SearchManager.results;
        }else{
            domainId = ItemManager.getDomainId(title);
            controller = TableManager;
            list = ItemManager.list;
        }
        self.highlightDomain(domainId, controller, list);
    }

    // lowlights the domain on the table that is currently visible to the user
    // domain ID cannot be used here because it's different for search results and normal history items
    self.lowlightActiveTableDomain = function(title){
        var domainId, controller, list;

        if(SearchManager.getState()){
            domainId = SearchManager.getDomainId(title);
            controller = SearchManager;
            list = SearchManager.results;
        }else{
            domainId = ItemManager.getDomainId(title);
            controller = TableManager;
            list = ItemManager.list;
        }
        self.lowlightDomain(domainId, controller, list);
    }

    self.highlightHistoryListDomain = function(domainId){
        self.highlightDomain(domainId, TableManager, ItemManager.list);
    }

    self.lowlightHistoryListDomain = function(domainId){
        self.lowlightDomain(domainId, TableManager, ItemManager.list);
    }

    self.highlightSearchTableDomain = function(domainId){
        self.highlightDomain(domainId, SearchManager, SearchManager.results);
    }

    self.lowlightSearchTableDomain = function(domainId){
        self.lowlightDomain(domainId, SearchManager, SearchManager.results);
    }

    self.highlightDomain = function(domainId, controller, list){
        list.iterate(function(item){
            if(item && item.domain.id == domainId){
                addToHighlightPool(domainHighlightPool, item.id, 1);
                // domain must be highlighted here before the actual item
                controller.highlight(item.id, "related");
                if(tableHighlightPool[item.id] > 0){
                    controller.highlight(item.id, "highlight");
                }
            }
        });
    }

    self.lowlightDomain = function(domainId, controller, list){
        list.iterate(function(item){
            if(item && item.domain.id == domainId){
                addToHighlightPool(domainHighlightPool, item.id, -1);

                if(tableHighlightPool[item.id] > 0){
                    controller.highlight(item.id, "highlight");
                }else if(domainHighlightPool[item.id] > 0){
                    controller.highlight(item.id, "related");
                }else{
                    controller.lowlight(item.id);
                }
            }
        });
    }

    function addToHighlightPool(pool, id, delta){
        if(pool[id] === undefined) pool[id] = 0;
        pool[id] += delta;

        if(pool[id] < 0) pool[id] = 0;

        return pool[id];
    }
	
	self.clearHighlight = function(){
        domainHighlightPool = {};
        tableHighlightPool = {};
        graphHighlightPool = {};

		$("#textContent .item").each(function(){
            TableManager.lowlight($(this).data("id"));
		});
        $("#y-searchResults .item").each(function(){
            SearchManager.lowlight($(this).data("id"));
        });
	}

    self.highlightHistoryListItem = function(id){
        addToHighlightPool(tableHighlightPool, id, 1);
        TableManager.highlight(id, "highlight");
    }

    self.lowlightHistoryListItem = function(id){
        var list = ItemManager.list;
        if(addToHighlightPool(tableHighlightPool, id, -1) > 0){
            TableManager.highlight(id, "highlight");
        }else if(domainHighlightPool[list[id].id] > 0){
            TableManager.highlight(id, "highlight");
        }else{
            TableManager.lowlight(id);
        }
    }

    self.highlightSearchTableItem = function(id){
        addToHighlightPool(tableHighlightPool, id, 1);
        SearchManager.highlight(id, "highlight");
    }

    self.lowlightSearchTableItem = function(id){
        var list = ItemManager.list;
        if(addToHighlightPool(tableHighlightPool, id, -1) > 0){
            SearchManager.highlight(id, "highlight");
        }else if(domainHighlightPool[list[id].id] > 0){
            SearchManager.highlight(id, "highlight");
        }else{
            SearchManager.lowlight(id);
        }
    }

	var scrollEvents = {};
	self.scrollToItem = function(id, delay){
		scrollEvents[id] = setTimeout(function(){
			actualScrollToItem(id);
		}, delay);
	}
	self.cancelScroll = function(id){
		clearTimeout(scrollEvents[id]);
	}

    self.highlightLayer = function(id){
        addToHighlightPool(graphHighlightPool, id, 1);
        actualLayerHighlight(id);
    }

    self.lowlightLayer = function(id){
        if(addToHighlightPool(graphHighlightPool, id, -1) == 0)
            actualLayerLowlight(id);
    }

    function actualLayerHighlight(id){
		var item = ItemManager.getItem(id);
		if(item.importance && item.importance.length!=0){
			GraphManager.highlightLayer(id);
		}else{
			EventManager.highlight(id);
		}
    }

    function actualLayerLowlight(id){
		var item = ItemManager.getItem(id);
		if(item.importance && item.importance.length!=0){
			GraphManager.lowlightLayer(id);
		}else{
			EventManager.lowlight(id);
		}
    }

	function actualScrollToItem(id){
		var range = [$("#graphShadow").height() + $("#graphShadow").offset().top+30, $(window).height()-60];
		var item = $("#textContent #item_"+id);
		if(!item.is(":visible")) return;
		var top = item.offset().top;
		var scrollTop = $("body").scrollTop();
		if(top-scrollTop<range[0]){
			var h = range[0];
			$("body").animate({scrollTop:top-h}, 50);
		}else if(top-scrollTop>range[1]){
			var h = range[1];
			$("body").animate({scrollTop:top-h}, 50);
		}
	}
})();
