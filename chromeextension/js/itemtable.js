// A jQuery extension for containing search results and items table

(function($){
	$.fn.addItem = function(obj, tableItem){
		var date=obj.date, url=obj.url, color=obj.color,
			favUrl=obj.favUrl, name=obj.name;

		var item = $("<tr></tr>");
		item.append($("<td class='itemLeft'></td>")
			.append($("<button class='pivotBtn'>Pivot</button>").click(PivotManager.pivot))
			.append($("<div class='itemDate'></div>").text(Helper.formatTime(date, 12)))
		);
		item.append($("<td class='itemColor'></td>").css("background-color", Helper.createLighterColor(color, 1)));
		item.append($("<td class='itemName'></td>").append($("<a href='"+url+"' target='_blank'></a>").text(name)));
		item.data("item", tableItem);
		var icon = IconFactory.createIcon(favUrl, name);
		item.find(".itemName a").prepend(icon.addClass("itemIcon"));
		item.mouseover(function(){
			$(this).addClass("hover");
			$(this).css("background-color", Helper.createLighterColor(color, 2));
			$(".itemColor", this).css("background-color", color);
			showPivotButton($(this));
		});
		item.mouseout(function(){
			$(this).removeClass("hover");
			$(this).css("background-color", "transparent");
			$(".itemColor", this).css("background-color", Helper.createLighterColor(color, 1));
			hidePivotButton($(this));
		});

		var response = getTable(this, date);
		var table = response.table;
		if(!table){
			table = createTable(this, date, response.nextTable);
		}
		table.append(item);

		return this;
	}

	function showPivotButton(obj){
		$(".itemDate", obj).hide();
		$(".pivotBtn", obj).show();
	}
	function hidePivotButton(obj){
		$(".itemDate", obj).show();
		$(".pivotBtn", obj).hide();
	}

	function createTable(obj, date, nextTable){
		var header = $("<div class='contentHeader'></div>").text(Helper.formatDate(date));
		if(nextTable)
			nextTable.prev().before(header);
		else
			obj.append(header);
		var table = $("<table class='itemTable'></table>");
		header.after(table);

		var dates = obj.data("dates");
		if(!dates) dates = [];
		dates[dates.length] = {date: date, table: table};
		obj.data("dates", dates);
		return table;
	}

	function sortDates(a, b){
		return a.date>b.date;
	}

	function getTable(obj, date){
		var dates = obj.data("dates");
		if(!dates) dates = [];
		dates.sort(sortDates);
		for(var i in dates){
			if(compareDates(dates[i].date, date) == 0){
				return {table: dates[i].table};
			}
			if(compareDates(dates[i].date, date) == 1){
				return {nextTable: dates[i].table};
			}
		}
		return false;
	}

	function compareDates(date1, date2){
		date1 = new Date(date1), date2 = new Date(date2);
		if(date1.getFullYear() == date2.getFullYear()){
			if(date1.getMonth() == date2.getMonth()){
				if(date1.getDate() == date2.getDate()){
					return 0;
				}
				return (date1.getDate() > date2.getDate()) ? 1 : -1;
			}
			return (date1.getMonth() > date2.getMonth()) ? 1 : -1;
		}
		return (date1.getFullYear() > date2.getFullYear()) ? 1 : -1;
	}

})(jQuery);
