include("youpivot/js/history/helpers/tablerowfactory.js");

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
        console.log("refresh top rows");
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
        var row = $("#textContent #item_"+id);
        if(row.length == 0) return;
        var item = ItemManager.getItem(id);
        if(!item) return;
        var color = item.domain.color;
        row.css("background-color", Helper.createLighterColor(color, PrefManager.getOption(level+"Bg")));
        var fgColor = Helper.createLighterColor(color, PrefManager.getOption(level+"Fg")); //foreground color
        $(".item_color", row).css("background-color", fgColor);
    }
    m.lowlight = function(id){
        var row = $("#textContent #item_"+id);
        if(row.length == 0) return;
        var item = ItemManager.getItem(id);
        if(!item) return;
        var color = item.domain.color;
        row.css("background-color", "");
        $(".item_color", row).css("background-color", Helper.createLighterColor(color, PrefManager.getOption("lowlightFg")));
    }

    /********* end transitional functions ***********/

	var dateSchema = {"left": "normal", "color": "normal", "name": "normal"};
	var typeSchema = {"date": "toprow", "left": "normal", "color": "normal", "name": "normal"};

    var mouseenterrow = function(){
        HighlightManager.mouseEnterHistoryListItem($(this).data("id"));
        $(".item_time", this).hide();
        $(".pivotBtn", this).show();
    };
    var mouseleaverow = function(){
        //TODO: use related target to minimize calculation
        HighlightManager.mouseLeaveHistoryListItem($(this).data("id"));
        $(".item_time", this).show();
        $(".pivotBtn", this).hide();
    };
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

    m.init = function(){
        itemTable = $("#textContent").itemTable(dateSchema);
    }

	//reload the items in the table. Basically clearing all the items and add it back. 
	//This operation takes time
	m.reload = function(){
		m.clearItems();
		SortManager.sortItems(ItemManager.list);
        FilterTimeManager.filterTime();
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

	//add an item to the table
	m.addItem = function(item){
		var obj = {};
		obj.left = TableRowFactory.createLeft(item);
		obj.color = "";
		obj.name = TableRowFactory.createName(item);
		obj.date = TableRowFactory.createDate(item);
		obj.id = item.id;
		var headerInfo = TableRowFactory.createHeader(item);
        var row = itemTable.addItem(obj, headerInfo);

        // don't add mouse event listeners if already added
        if(row === null) return;

        //console.log("addi2");
		//set link to pivot if it is a timemark
		if(item.domain.name == "timemark"){
			row.find(".item_name a").click(function(e){
				PivotManager.pivotItem(item.eventId);
				e.preventDefault();
			});
		}
		//add mouseover events
		row.mouseenter(mouseenterrow);
		row.mouseleave(mouseleaverow);
		var icon = IconFactory.createTextIcon(item.domain.favUrl, item.title, "item_icon");
		row.contextMenu("table_menu", {
			"Delete this entry": {
				click: deleteentry
			}
		}, 
		{ title: icon+"<div style='display: inline-block; max-width: 200px; line-height: 16px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; '>"+item.title+"</div>" });
		row.data("id", item.id); //store the item with the DOM object
		//row.addClass("item_domain_"+item.domain.id);
        var item = ItemManager.getItem(item.id);
        row.find(".item_color").css("background-color", Helper.createLighterColor(item.domain.color, PrefManager.getOption("lowlightFg")));
        row.find(".pivotBtn").click(function(){
            PivotManager.pivotItem(item.eventId);
        });
	}

	//clear all items from the table
	m.clearItems = function(){
        if(itemTable)
            itemTable.clear();
	}

	//change the schema of the table. Requires complete rebuilding of the table
	//The operation takes time and freezes the tab during loading
	m.changeSchema = function(sortBy){
        console.log("change schema");
		var schema = dateSchema;
		if(sortBy=="by type") schema = typeSchema;
        else if(sortBy=="chronological") schema = dateSchema;
        itemTable.destroy();
        itemTable = $("#textContent").itemTable(schema);
        m.reload();
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
