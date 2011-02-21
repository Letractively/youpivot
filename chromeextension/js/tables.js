var TableManager = {};

(function(){
	var master = TableManager;
	/*** public methods ***/

	master.addItem = function(date, name, color, url, favUrl){
		var item = $("<tr></tr>");
		item.append($("<td class='itemDate'></td>").text(formatDate(date)));
		item.append($("<td class='itemColor'></td>").css("background-color", color));
		item.append($("<td class='itemName'></td>").text(name));
		$("#items").append(item);
		var icon = IconFactory.createIcon(favUrl, name);
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
