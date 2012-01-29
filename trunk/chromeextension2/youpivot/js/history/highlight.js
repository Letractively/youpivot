var HighlightManager = {};

(function(){
	var m = HighlightManager;
    var domainHighlightPool = {};
    var tableHighlightPool = {};
    var graphHighlightPool = {};


    /************* Highlight event handles (routing) *******************/

    m.mouseEnterGraph = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        m.highlightHistoryListDomain(domainId);
        m.highlightHistoryListItem(id);
        m.highlightLayer(id);
        m.scrollToItem(id, 500);
    }

    m.mouseLeaveGraph = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        m.lowlightHistoryListDomain(domainId);
        m.lowlightHistoryListItem(id);
        m.lowlightLayer(id);
        m.cancelScroll(id);
    }

    var graphToggleState = {};

    m.clickOnGraph = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        if(!graphToggleState[id]){
            m.highlightHistoryListDomain(domainId);
            m.highlightHistoryListItem(id);
            m.highlightLayer(id);
            m.cancelScroll(id);
            m.scrollToItem(id, 0);
            graphToggleState[id] = true;
        }else{
            m.lowlightHistoryListDomain(domainId);
            m.lowlightHistoryListItem(id);
            m.lowlightLayer(id);
            graphToggleState[id] = false;
        }
    }

    m.mouseEnterHistoryListItem = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        m.highlightHistoryListDomain(domainId);
        m.highlightHistoryListItem(id);
        m.highlightLayer(id);
    }

    m.mouseLeaveHistoryListItem = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        m.lowlightHistoryListDomain(domainId);
        m.lowlightHistoryListItem(id);
        m.lowlightLayer(id);
    }

    m.mouseEnterSearchTableItem = function(id){
        var domainId = SearchManager.results[id].domain.id;
        m.highlightSearchTableDomain(domainId);
        m.highlightSearchTableItem(id);
    }

    m.mouseLeaveSearchTableItem = function(id){
        var domainId = SearchManager.results[id].domain.id;
        m.lowlightSearchTableDomain(domainId);
        m.lowlightSearchTableItem(id);
    }

    /*********** Highlight implementations *************/

    // highlights the domain on the table that is currently visible to the user
    // domain ID cannot be used here because it's different for search results and normal history items
    m.highlightActiveTableDomain = function(title){
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
        m.highlightDomain(domainId, controller, list);
    }

    // lowlights the domain on the table that is currently visible to the user
    // domain ID cannot be used here because it's different for search results and normal history items
    m.lowlightActiveTableDomain = function(title){
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
        m.lowlightDomain(domainId, controller, list);
    }

    m.highlightHistoryListDomain = function(domainId){
        m.highlightDomain(domainId, TableManager, ItemManager.list);
    }

    m.lowlightHistoryListDomain = function(domainId){
        m.lowlightDomain(domainId, TableManager, ItemManager.list);
    }

    m.highlightSearchTableDomain = function(domainId){
        m.highlightDomain(domainId, SearchManager, SearchManager.results);
    }

    m.lowlightSearchTableDomain = function(domainId){
        m.lowlightDomain(domainId, SearchManager, SearchManager.results);
    }

    m.highlightDomain = function(domainId, controller, list){
        list.iterate(function(item){
            if(item.domain.id == domainId){
                addToHighlightPool(domainHighlightPool, item.id, 1);
                // domain must be highlighted here before the actual item
                controller.highlight(item.id, "related");
                if(tableHighlightPool[item.id] > 0){
                    controller.highlight(item.id, "highlight");
                }
            }
        });
    }

    m.lowlightDomain = function(domainId, controller, list){
        list.iterate(function(item){
            if(item.domain.id == domainId){
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
	
	m.clearHighlight = function(){
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

    m.highlightHistoryListItem = function(id){
        addToHighlightPool(tableHighlightPool, id, 1);
        TableManager.highlight(id, "highlight");
    }

    m.lowlightHistoryListItem = function(id){
        var list = ItemManager.list;
        if(addToHighlightPool(tableHighlightPool, id, -1) > 0){
            TableManager.highlight(id, "highlight");
        }else if(domainHighlightPool[list[id].id] > 0){
            TableManager.highlight(id, "highlight");
        }else{
            TableManager.lowlight(id);
        }
    }

    m.highlightSearchTableItem = function(id){
        addToHighlightPool(tableHighlightPool, id, 1);
        SearchManager.highlight(id, "highlight");
    }

    m.lowlightSearchTableItem = function(id){
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
	m.scrollToItem = function(id, delay){
		scrollEvents[id] = setTimeout(function(){
			actualScrollToItem(id);
		}, delay);
	}
	m.cancelScroll = function(id){
		clearTimeout(scrollEvents[id]);
	}

    m.highlightLayer = function(id){
        addToHighlightPool(graphHighlightPool, id, 1);
        actualLayerHighlight(id);
    }

    m.lowlightLayer = function(id){
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
