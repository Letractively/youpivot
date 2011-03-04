// A jQuery extension for containing search results and items table

(function($){
	$.fn.itemTable = function(action, obj, tableItem){
		switch(action){
			case "addItem":
				return addItem(obj, tableItem, this);
				break;
			case "highlight":
				var level = getOptions(obj, "level", 2);
				highlight(this, level);
				break;
			case "lowlight":
				lowlight(this);
				break;
			default: 
				throw "Action "+action+" is not defined";
				break;
		}

		return this;
	}

	function getOptions(options, label, defaultValue){
		if(!options || options[label] == undefined){
			return defaultValue;
		}
		return options[label];
	}

	var lastAdded = "";
	function addItem(obj, tableItem, wrap){
		var id=obj.id, date=obj.date, url=obj.url, color=obj.color,
			favUrl=obj.favUrl, name=obj.name;
		var sortBy = SortManager.getSortMethod();

		var table = wrap.find(".itemTable");
		if(table.size()==0){
			table = $("<table class='itemTable'></table>");
			wrap.append(table);
		}

		var label = obj[sortBy];
		if(sortBy=="date"){
			label = Helper.formatDate(label);
		}
		if(lastAdded != label){
			table.append(createHeader(label));
			lastAdded = label;
		}

		var item = $("<tr class='item' id='item_"+id+"'></tr>");
		item.append($("<td class='itemLeft'></td>")
			.append($("<button class='pivotBtn'>Pivot</button>").click(function(){
				//pivot around start time/end time or center?
				PivotManager.pivot(date);
			}))
			.append($("<div class='itemDate'></div>").text(Helper.formatTime(date, 12)))
		);
		item.append($("<td class='itemColor'></td>").css("background-color", Helper.createLighterColor(color, 1)));
		item.append($("<td class='itemName'></td>").append($("<a href='"+url+"' target='_blank'></a>").text(name)));
		item.data("item", tableItem);
		var icon = IconFactory.createIcon(favUrl, name);
		item.find(".itemName a").prepend(icon.addClass("itemIcon"));
		item.mouseover(function(){
			HighlightManager.highlightItem($(this), false);
			showPivotButton($(this));
		});
		item.mouseout(function(){
			HighlightManager.lowlightItem($(this), false);
			hidePivotButton($(this));
		});

		table.append(item);
		return item;
	}

	function highlight(obj, level){
		obj.addClass("hover");
		var color = obj.data("item").domain.color;
		obj.css("background-color", Helper.createLighterColor(color, level));
		$(".itemColor", obj).css("background-color", color);
	}

	function lowlight(obj){
		obj.removeClass("hover");
		var color = obj.data("item").domain.color;
		obj.css("background-color", "transparent");
		$(".itemColor", obj).css("background-color", Helper.createLighterColor(color, 1));
	}

	function showPivotButton(obj){
		$(".itemDate", obj).hide();
		$(".pivotBtn", obj).show();
	}
	function hidePivotButton(obj){
		$(".itemDate", obj).show();
		$(".pivotBtn", obj).hide();
	}

	function createHeader(label){
		var header = $("<tr></tr>").html(
				$("<th class='contentHeader'></th>").text(label)
			);
		return header;
	}

})(jQuery);
