// A jQuery extension for containing search results and items table

(function($){
	$.fn.addItem = function(obj, options){
		var date=obj.date, url=obj.url, color=obj.color,
			favUrl=obj.favUrl, name=obj.name;

		var item = $("<tr></tr>");
		item.append($("<td class='itemDate'></td>").text(formatTime(date)));
		item.append($("<td class='itemColor'></td>").css("background-color", color));
		item.append($("<td class='itemName'></td>").append($("<a href='"+url+"' target='_blank'></a>").text(name)));
		var icon = IconFactory.createIcon(favUrl, name);
		item.find(".itemName a").prepend(icon.addClass("itemIcon"));
		item.mouseover(function(){
			$(this).css("background-color", createLighterColor(color));
		});
		item.mouseout(function(){
			$(this).css("background-color", "transparent");
		});

		var response = getTable(this, date);
		var table = response.table;
		console.log("response", response, response.table);
		if(!table){
			table = createTable(this, date, response.nextTable);
		}
		table.append(item);

		return this;
	}

	function createTable(obj, date, nextTable){
		var header = $("<div class='contentHeader'></div>").text(formatDate(date));
		if(nextTable)
			nextTable.prev().before(header);
		else
			obj.append(header);
		var table = $("<table class='itemTable'></table>");
		header.after(table);

		var dates = obj.data("dates");
		if(!dates) dates = [];
		console.log("table", table);
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
		console.log("dates", dates);
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

	function formatDate(date){
		var d = new Date(date);
		var string = d.toLocaleDateString();
		return string;
	}

	function formatTime(date){
		var d = new Date(date);
		var string = d.toLocaleTimeString();
		return string;
	}

	function createLighterColor(color){
		var r = parseInt(color.substr(1,2),16);
		var g = parseInt(color.substr(3,2),16);
		var b = parseInt(color.substr(5,2),16);
		var cb = (r+g+b)/3; var db = 300-cb;
		r+=db; g+=db; b+=db;
		if(r>255) r = 255;
		if(g>255) g = 255;
		if(b>255) b = 255;
		return "#"+pad(r.toString(16))+pad(g.toString(16))+pad(b.toString(16));
	}
	function pad(string){
		return (string.length>=2) ? string : "0"+string;
	}
})(jQuery);
