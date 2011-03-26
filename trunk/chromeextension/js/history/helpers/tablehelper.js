var TableHelper = {};

(function(){
	var m = TableHelper;
	var dateSchema = {"left": "normal", "color": "normal", "name": "normal"};
	var typeSchema = {"date": "toprow", "left": "normal", "color": "normal", "name": "normal"};

	m.addItem = function(table, item){
		var obj = {};
		obj.left = createLeft(item);
		obj.color = "";
		obj.name = createName(item);
		obj.date = createDate(item);
		obj.id = item.id;
		var headerInfo = createHeader(item);
		var row = table.itemTable("addItem", {item: obj, header: headerInfo});
		row.find(".item_color").css("background-color", Helper.createLighterColor(item.domain.color, "low"));
		row.find(".pivotBtn").click(function(){
			PivotManager.pivot(item.startTime, false);
		});
		row.data("item", item);
		return row;
	}
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
			var icon = IconFactory.createTextIcon(item.domain.favUrl, item.domain.name);
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
