var HighlightManager = {};

(function(){
	var m = HighlightManager;
    var domainHighlightPool = {};
    var tableHighlightPool = {};
    var graphHighlightPool = {};


    /************* Highlight event handles (routing) *******************/

    m.mouseEnterGraph = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        m.highlightDomain(domainId);
        m.highlightHistoryListItem(id);
        m.highlightLayer(id);
        m.scrollToItem(id, 500);
    }

    m.mouseLeaveGraph = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        m.lowlightDomain(domainId);
        m.lowlightHistoryListItem(id);
        m.lowlightLayer(id);
        m.cancelScroll(id);
    }

    var graphToggleState = {};

    m.clickOnGraph = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        if(!graphToggleState[id]){
            m.highlightDomain(domainId);
            m.highlightHistoryListItem(id);
            m.highlightLayer(id);
            m.cancelScroll(id);
            m.scrollToItem(id, 0);
            graphToggleState[id] = true;
        }else{
            m.lowlightDomain(domainId);
            m.lowlightHistoryListItem(id);
            m.lowlightLayer(id);
            graphToggleState[id] = false;
        }
    }

    m.mouseEnterHistoryListItem = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        m.highlightDomain(domainId);
        m.highlightHistoryListItem(id);
        m.highlightLayer(id);
    }

    m.mouseLeaveHistoryListItem = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        m.lowlightDomain(domainId);
        m.lowlightHistoryListItem(id);
        m.lowlightLayer(id);
    }

    m.mouseEnterSearchTableItem = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        m.highlightDomain(domainId);
        m.highlightSearchTableItem(id);
    }

    m.mouseLeaveSearchTableItem = function(id){
        var domainId = ItemManager.getItem(id).domain.id;
        m.lowlightDomain(domainId);
        m.lowlightSearchTableItem(id);
    }

    /*********** Highlight implementations *************/

    m.highlightDomain = function(domainId){
        var list = ItemManager.list;
        for(var i=0; i<list.length; i++){
            if(list[i].domain.id == domainId){
                addToHighlightPool(domainHighlightPool, list[i].id, 1);
                // domain must be highlighted here
                TableManager.highlight(list[i].id, "related");
                if(tableHighlightPool[list[i].id] > 0){
                    TableManager.highlight(list[i].id, "highlight");
                }
            }
        }
    }

    m.lowlightDomain = function(domainId){
        var list = ItemManager.list;
        for(var i=0; i<list.length; i++){
            if(list[i].domain.id == domainId){
                addToHighlightPool(domainHighlightPool, list[i].id, -1);

                if(tableHighlightPool[list[i].id] > 0){
                    TableManager.highlight(list[i].id, "highlight");
                }else if(domainHighlightPool[list[i].id] > 0){
                    TableManager.highlight(list[i].id, "related");
                }else{
                    TableManager.lowlight(list[i].id);
                }
            }
        }
    }

    function addToHighlightPool(pool, id, delta){
        if(pool[id] === undefined) pool[id] = 0;
        pool[id] += delta;

        if(pool[id] < 0) pool[id] = 0;

        return pool[id];
    }
	
	m.clearHighlight = function(){
		$(".item").each(function(){
            TableManager.lowlight($(this).data("id"));
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
        }else if(domainHighlightPool[list[i].id] > 0){
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
        }else if(domainHighlightPool[list[i].id] > 0){
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
