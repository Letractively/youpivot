var TableHelper = {};

(function(){
	var m = TableHelper;
	var dateSchema = {"left": "normal", "color": "normal", "name": "normal"};
	var typeSchema = {"date": "toprow", "left": "normal", "color": "normal", "name": "normal"};

	//add an item to the specified itemTable (items list or search results)
	m.addItem = function(table, item){
		var obj = {};
		obj.left = createLeft(item);
		obj.color = "";
		obj.name = createName(item);
		obj.date = createDate(item);
		obj.id = item.id;
		var headerInfo = createHeader(item);
		var row = table.itemTable("addItem", {item: obj, header: headerInfo});
		row.find(".item_color").css("background-color", Helper.createLighterColor(item.domain.color, PrefManager.getOption("lowlightFg")));
		row.find(".pivotBtn").click(function(){
			PivotManager.pivotItem(item.eventId);
		});
		//set link to pivot if it is a timemark
		if(item.domain.name == "timemark"){
			row.find(".item_name a").click(function(e){
				PivotManager.pivot(item.startTime, false);
				e.preventDefault();
			});
		}
		//add mouseover events
		row.mouseenter(function(e){
			HighlightManager.highlightDomain(item.id, {persistent: false, parent: table});
			$(".item_time", this).hide();
			$(".pivotBtn", this).show();
		});
		row.mouseleave(function(e){
			//TODO: use related target to minimize calculation
			HighlightManager.lowlightDomain(item.id, {clearPersistent: false, parent: table});
			$(".item_time", this).show();
			$(".pivotBtn", this).hide();
		});
		row.data("item", item); //store the item with the DOM object
		row.addClass("item_domain_"+item.domain.id);
		return row;
	}
	//change the schema of the table. Requires complete rebuilding of the table
	//The operation takes time and freezes the tab during loading
	m.changeSchema = function(table, sortBy){
		var schema;
		if(sortBy=="chronological") schema = dateSchema;
		else if(sortBy=="by type") schema = typeSchema;
		else schema = dateSchema;
		table.itemTable("destroy");
		table.itemTable("create", {schema: schema});
		TableManager.reload();
		SearchManager.reloadResult();
	}

	//convenient wrapper function for Helper.formatDate for specific use in this class
	//Output date format: "April 1, 2011"
	function createDate(item){
		var output = Helper.formatDate(item.startTime, "F j, Y");
		return output;
	}
	function createHeader(item){
		var sortBy = SortManager.getSortMethod();
		if(sortBy=="date"){
			var output = Helper.formatDate(item.startTime);
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
		var output = "<a href='"+item.url+"' target='_blank'>"+icon+Helper.htmlEntities(item.title)+"</a>";
		return output;
	}
	function createLeft(item){
		var button = $("<button class='pivotBtn'>Pivot</button>");
		var time = $("<div class='item_time'></div>").text(Helper.formatTime(item.startTime, 12));
		var output = $("<div></div>").append(button).append(time);
		return output.html();
	}
	$(function(){
		$("#textContent").itemTable("create", {schema: dateSchema});
		$("#searchResults").itemTable("create", {schema: dateSchema});
	});
})();
