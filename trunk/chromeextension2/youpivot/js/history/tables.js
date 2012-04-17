include_("PivotTable");
include_("jQuery_contextmenu");
include_("IconFactory");
include_("Connector");
//include_("FilterTimeManager");

/**
 *	TableManager manages the items list on the main content, below the visualizations. 
 *	It uses itemTable jQuery plugin (itemtable.js) as backbone
 *		Search results table also uses itemtable.js
 *	table.js implements only features specific to the items list
 */
var TableManager = new (function _TableManager(){
    var self = this;
    var itemTable;
    self.itemTable = itemTable;

    self.refreshTopRows = function(){
        itemTable.refreshTopRows();
    }

    self.highlight = function(id, level){
        var item = ItemManager.getItem(id);
        if(!item) return;
        itemTable.highlight(id, item.domain.color, level);
    }
    self.lowlight = function(id){
        var item = ItemManager.getItem(id);
        if(!item) return;
        itemTable.lowlight(id, item.domain.color);
    }

    self.init = function(){
        $("#y-searchResults").bind("search", function(e, active){
            if(active){
                $("#textContent").hide();
            }else{
                $("#textContent").show();
                self.loadFilters(ItemManager.list);
            }
            $("#yp-editButton").ToggleButton().setState(false);
        });

        itemTable = $("#textContent").pivotTable();
        self.itemTable = itemTable;

        $("#yp-editButton").bind("togglechanged", function(e, state){
            if(!SearchManager.getState()){
                if(state){
                    $("head").append('<style id="tableEditStyle">#textContent .edit { display: inline-block !important; }</style>');
                    //$("#textContent .edit").show();
                }else{
                    $("#tableEditStyle").remove();
                    //$("#textContent .edit").hide();
                }
            }
        });
    }

    self.getItem = function(id){
        return ItemManager.getItem(id);
    }

    //reload the items in the table. Basically clearing all the items and add it back. 
    //This operation takes time
    self.reload = function(){
        //self.clearItems();
        SortManager.sortItems(ItemManager.list);
        FilterTimeManager.filterTime();
    }

    var deleteentry = function(obj){
        var id = $(obj).data("id"); // for context menu
        if(id === undefined)
            id = $(this).attr("data-id"); // for edit mode
        itemTable.deleteItem(id);
        var eventId = ItemManager.list[id].eventId;
        Connector.send("delete", {eventid: eventId}, {
            onSuccess: function(data){
                console.log("item deleted -- ", data);
                analytics("delete", "delete youpivot", eventId);
            }, 
            onError: function(data){
                console.log("item delete error -- ", data);
            }
        });
        ItemManager.deleteItem(id);
        itemTable.display();
    };

    //add an item to the table
    self.addItem = function(item){
        itemTable.addItem(item, function(row){
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
            row.find(".deleteBtn").click(deleteentry);
        });
    }

    //clear all items from the table
    self.clearItems = function(){
        if(itemTable)
            itemTable.clear();
    }

    //change the schema of the table. Requires complete rebuilding of the table
    //The operation takes time and freezes the tab during loading
    self.changeSchema = function(sortBy){
        itemTable.resetToSortMode(sortBy);
        self.reload();
    }

    //load the filters back from this items list. Called when switching back from search results. 
    self.loadFilters = function(timeList){
        // load back filters from pivot view
        $(window).trigger("clearFilters");
        for(var id in timeList){
            var item = timeList[id];
            if(!item)
                console.log(item, id, $(this), $(this).data("id"));
            DomainManager.addDomain(item.domain.favUrl, item.domain.name);
            TermManager.addTerms(item.keywords);
            StreamManager.addStream(item.stream);
        }
        DomainManager.display();
        TermManager.display();
        StreamManager.display();
    }
})();
