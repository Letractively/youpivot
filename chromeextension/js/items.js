var ItemManager = {};

(function(){
	var master = ItemManager;
	/*** public methods ***/

	master.addItem = function(id, date, name, color, url){
		$("#items").append("<tr id='item_"+id+"'></tr>");
		var item = $("#item_"+id);
		item.append($("<td class='itemDate'></td>").text(formatDate(date)));
		item.append($("<td class='itemColor'></td>").css("background-color", color));
		item.append($("<td class='itemName'></td>").text(name));
		var icon = IconFactory.createFavicon(url, url);
		item.find(".itemName").prepend(icon.addClass("itemIcon"));
	}

	master.clearItems = function(){
		$("#items").html("");
	}

	/*** private methods ***/

	function formatDate(date){
		var d = new Date(date);
		var string = d.toLocaleTimeString();
		return string;
	}
})()
