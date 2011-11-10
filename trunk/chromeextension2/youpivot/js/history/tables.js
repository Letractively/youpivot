include("/youpivot/js/history/helpers/pivottable.js");

var TableManager = {};
/**
 *	TableManager manages the items list on the main content, below the visualizations. 
 *	It uses itemTable jQuery plugin (itemtable.js) as backbone
 *		Search results table also uses itemtable.js
 *	table.js implements only features specific to the items list
 */

(function(){
	var m = TableManager;
    var itemTable;

    /********* Transitional functions **************/

    m.hideAll = function(className){
        itemTable.hideAll(className);
    }

    m.refreshTopRows = function(){
        itemTable.refreshTopRows();
    }

    m.hide = function(obj, className){
        itemTable.hide(obj, className);
    }
    m.show = function(obj, className){
        itemTable.show(obj, className);
    }

    m.detachAll = function(){
        itemTable.detachAll();
    }

    m.highlight = function(id, level){
        var item = ItemManager.getItem(id);
        if(!item) return;
        itemTable.highlight(id, item.domain.color, level);
    }
    m.lowlight = function(id){
        var item = ItemManager.getItem(id);
        if(!item) return;
        itemTable.lowlight(id, item.domain.color);
    }

    /********* end transitional functions ***********/

    m.init = function(){
        itemTable = $("#textContent").pivotTable();
    }

	//reload the items in the table. Basically clearing all the items and add it back. 
	//This operation takes time
	m.reload = function(){
		m.clearItems();
		SortManager.sortItems(ItemManager.list);
        FilterTimeManager.filterTime();
	}

    var deleteentry = function(obj){
        var id = $(obj).data("id");
        itemTable.deleteItem(id);
        Connector.send("delete", {eventid: ItemManager.list[id].eventId}, {
            onSuccess: function(data){
                console.log("item deleted -- ", data);
            }, 
            onError: function(data){
                console.log("item delete error -- ", data);
            }
        });
        ItemManager.deleteItem(id);
        //throw "delete entry is not implemented yet";
    };

	//add an item to the table
	m.addItem = function(item){
        var row = itemTable.addItem(item);
        if(row === null) return;
        row.mouseenter(function(){
            HighlightManager.mouseEnterHistoryListItem(item.id);
        });
        row.mouseleave(function(){
            HighlightManager.mouseLeaveHistoryListItem(item.id);
        });
        var icon = IconFactory.createTextIcon(item.domain.favUrl, item.title, "item_icon");
        row.contextMenu("table_menu", {
            "Delete this entry": {
                click: deleteentry
            }
        }, 
        { title: icon+"<div style='display: inline-block; max-width: 200px; line-height: 16px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; '>"+item.title+"</div>" });
	}

	//clear all items from the table
	m.clearItems = function(){
        if(itemTable)
            itemTable.clear();
	}

	//change the schema of the table. Requires complete rebuilding of the table
	//The operation takes time and freezes the tab during loading
	m.changeSchema = function(sortBy){
        itemTable.resetToSortMode(sortBy);
        m.reload();
	}

	//load the filters back from this items list. Called when switching back from search results. 
	m.loadFilters = function(){
		// load back filters from pivot view
		DomainManager.clearDomains();
		TermManager.clearTerms();
		StreamManager.clearStreams();
		$("#textContent .itemTable .item").each(function(){
            var id = $(this).data("id");
            var item = ItemManager.getItem(id);
            if(!item)
                console.log(item, id, $(this), $(this).data("id"));
			DomainManager.addDomain(item.domain.favUrl, item.domain.name);
			TermManager.addTerms(item.keywords);
			StreamManager.addStream(item.stream);
		});
		DomainManager.display();
		TermManager.display();
		StreamManager.display();
	}

    $(function(){
        $("#y-searchResults").bind("search", function(e, active){
            if(active){
                $("#textContent").hide();
            }else{
                $("#textContent").show();
                m.loadFilters();
            }
        });
    });
})();
