include("js/dateformatter.js");
include("js/utilities");

// Controller of itemTable, converts YouPivot type data into info shown in the table
var TableHelper = {};
var addItemCount = 0; // debug

(function(){
	var m = TableHelper;
	var dateSchema = {"left": "normal", "color": "normal", "name": "normal"};
	var typeSchema = {"date": "toprow", "left": "normal", "color": "normal", "name": "normal"};

    var initialized = false;

	//add an item to the specified itemTable (items list or search results)
    var mouseenterrow = function(e){
        HighlightManager.mouseEnterTableItem($(this).data("id"), e.data.table);
        $(".item_time", this).hide();
        $(".pivotBtn", this).show();
    };
    var mouseleaverow = function(e){
        //TODO: use related target to minimize calculation
        HighlightManager.mouseLeaveTableItem($(this).data("id"), e.data.table);
        $(".item_time", this).show();
        $(".pivotBtn", this).hide();
    };
    var pivotclick = function(e){
        PivotManager.pivotItem(e.data.eventId);
    };
    var deleteentry = function(obj){
        //var id = $(obj).data("id");
        //$(obj).itemTable("deleteItem", {id: id});
        /*Connector.send("delete", {eventid: ItemManager.list[id].eventId}, {
            onSuccess: function(data){
                console.log("item deleted -- ", data);
            }, 
            onError: function(data){
                console.log("item delete error -- ", data);
            }
        });
        ItemManager.deleteItem(id);*/
        throw "delete entry is not implemented yet";
    };
	m.addItem = function(itemTable, item){
        addItemCount++;
		var obj = {};
		obj.left = createLeft(item);
		obj.color = "";
		obj.name = createName(item);
		obj.date = createDate(item);
		obj.id = item.id;
		var headerInfo = createHeader(item);
        var row = itemTable.addItem(obj, headerInfo);
		//set link to pivot if it is a timemark
		if(item.domain.name == "timemark"){
			row.find(".item_name a").click(function(e){
				PivotManager.pivotItem(item.eventId);
				e.preventDefault();
			});
		}
		//add mouseover events
		//row.mouseenter({"table": table}, mouseenterrow);
		//row.mouseleave({"table": table}, mouseleaverow);
		var icon = IconFactory.createTextIcon(item.domain.favUrl, item.title, "item_icon");
		/*row.contextMenu("table_menu", {
			"Delete this entry": {
				click: deleteentry
			}
		}, 
		{ title: icon+"<div style='display: inline-block; max-width: 200px; line-height: 16px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; '>"+item.title+"</div>" });*/
		row.data("id", item.id); //store the item with the DOM object
		//row.addClass("item_domain_"+item.domain.id);
        var item = ItemManager.getItem(item.id);
        row.find(".item_color").css("background-color", Helper.createLighterColor(item.domain.color, PrefManager.getOption("lowlightFg")));
        row.find(".pivotBtn").click({"eventId": item.eventId}, pivotclick);
		return row;
	}

	//change the schema of the table. Requires complete rebuilding of the table
	//The operation takes time and freezes the tab during loading
	m.changeSchema = function(itemTable, sortBy, caller){
        console.log("change schema");
		var schema = dateSchema;
		if(sortBy=="by type") schema = typeSchema;
        else if(sortBy=="chronological") schema = dateSchema;
        itemTable.destroy();
        itemTable.create(schema);
        if(typeof caller.reload == "function")
            caller.reload();
	}

	//convenient wrapper function for DateFormatter.formatDate for specific use in this class
	//Output date format: "April 1, 2011"
	function createDate(item){
		var output = DateFormatter.formatDate(item.startTime, "F j, Y");
		return output;
	}
	function createHeader(item){
		var sortBy = SortManager.getSortMethod();
		if(sortBy=="date"){
			var output = DateFormatter.formatDate(item.startTime);
			return {label: output, html: output};
		}
		if(sortBy=="domain"){
			var label = item.domain.name;
			var icon = IconFactory.createTextIcon(item.domain.favUrl, item.domain.name, "wrap");
			var html = icon + label;
			return {label: label, html: html};
		}
	}
	function createName(item){
		var icon = IconFactory.createTextIcon(item.domain.favUrl, item.name, "item_icon");
		var output = "<a href='"+item.url+"' target='_blank'>"+icon+Utilities.htmlEntities(item.title)+"</a>";
		return output;
	}
	function createLeft(item){
        var button = '<button class="pivotBtn">Pivot</button>';
        var time = '<div class="item_time">'+DateFormatter.formatTime(item.startTime, 12)+'</div>';
		return button+time;
	}
})();
