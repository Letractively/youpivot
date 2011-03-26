// A jQuery extension for containing search results and items table

(function($){
	$.fn.itemTable = function(action, obj, tableItem){
		switch(action){
			case "addItem":
				return addItem(obj, tableItem, this);
				break;
			case "show":
				showItem(this);
				break;
			case "hide":
				hideItem(this);
				break;
			case "highlight":
				var level = getOptions(obj, "level", "highbg");
				highlight(this, level);
				break;
			case "lowlight":
				lowlight(this);
				break;
			case "clear":
				clear(this);
				break;
			default: 
				throw "Action "+action+" is not defined";
				break;
		}

		return this;
	}

	/*** Direct itemTable functions ***/
	function clear(obj){
		obj.html("");
	}

	var catCounter = 0;
	function addItem(obj, tableItem, wrap){
		var id=obj.id, date=obj.date, url=obj.url, color=obj.color,
			favUrl=obj.favUrl, name=obj.name;
		var sortBy = SortManager.getSortMethod();

		var table = getTable(wrap); //get or create the table if it doesn't already exist

		var headerInfo = getHeaderLabel(obj, sortBy);
		var label = headerInfo.label; //label of the header
		if(!findHeader(label, wrap)){
			var head = createHeader(++catCounter, label, headerInfo.html);
			table.append(head);
		}
		var catId = catCounter; //ID assigned to header of current item

		var item = $("<tr class='item' id='item_"+id+"'></tr>");
		item.data("header", catId); //remember the header ID in the item
		item.append($("<td class='itemDate'></td>").html("<span>"+Helper.formatDate(date, "F j, Y")+"</span>"));
		/*if(lastDateShown != Helper.formatDate(date)){
			lastDateShown = Helper.formatDate(date);
			if(sortBy!="date"){
				$(".itemDate span", item).removeClass("hidden");
			}
		}*/
		item.append($("<td class='itemLeft'></td>")
			.append($("<button class='pivotBtn'>Pivot</button>").click(function(){
				//pivot around start time/end time or center?
				PivotManager.pivot(date, false);
			}))
			.append($("<div class='itemTime'></div>").text(Helper.formatTime(date, 12)))
		);
		item.append($("<td class='itemColor'></td>").css("background-color", Helper.createLighterColor(color, "low")));
		item.append($("<td class='itemName'></td>").append($("<a href='"+url+"' target='_blank'></a>").text(name)));
		item.data("item", tableItem);
		var icon = IconFactory.createIcon(favUrl, name);
		item.find(".itemName a").prepend(icon.addClass("itemIcon"));
		item.mouseover(function(){
			HighlightManager.highlightDomain(id, false, wrap);
			showPivotButton($(this));
		});
		item.mouseout(function(){
			HighlightManager.lowlightDomain(id, false, wrap);
			hidePivotButton($(this));
		});

		table.append(item);
		showItem(item);
		return item;
	}

	function showItem(obj){
		obj.removeClass("hidden");
		var headerId = obj.data("header");
		$("#header_"+headerId).parent().removeClass("hidden");
	}

	function hideItem(item){
		item.addClass("hidden");
	}

	function highlight(obj, level){
		obj.addClass("hover");
		var color = obj.data("item").domain.color;
		obj.css("background-color", Helper.createLighterColor(color, level));
		$(".itemColor", obj).css("background-color", (level=="highbg") ? color : Helper.createLighterColor(color, "med"));
	}

	function lowlight(obj){
		obj.removeClass("hover");
		var color = obj.data("item").domain.color;
		obj.css("background-color", "transparent");
		$(".itemColor", obj).css("background-color", Helper.createLighterColor(color, "low"));
	}

	/*** end itemTable direct functions ***/

	function showPivotButton(obj){
		$(".itemTime", obj).hide();
		$(".pivotBtn", obj).show();
	}
	function hidePivotButton(obj){
		$(".itemTime", obj).show();
		$(".pivotBtn", obj).hide();
	}

	function getTable(wrap){
		var table = wrap.find(".itemTable");
		if(table.size()==0){
			table = $("<table class='itemTable'></table>");
			wrap.append(table);
		}
		return table
	}

	function getHeaderLabel(obj, sortBy){
		var label = obj[sortBy], html;
		if(sortBy=="date"){
			label = Helper.formatDate(label);
			html = label;
		}else if(sortBy=="domain"){
			html = "<img src='"+favUrl+"' class='favicon' />" + label;
		}
		return {label: label, html: html};
	}

	function createHeader(id, label, html){
		var header = $("<tr class='headerRow'><th colspan='4' id='header_"+id+"' class='contentHeader'>"+html+"</th></tr>");
		header.find(".contentHeader").data("label", label);
		return header;
	}

	function getOptions(options, label, defaultValue){
		if(!options || options[label] == undefined){
			return defaultValue;
		}
		return options[label];
	}

	function findHeader(label, wrap){
		var exist = false;
		$($(".contentHeader", wrap).get().reverse()).each(function(){
			if($(this).data("label")==label){
			   exist = true;
			   return;
			}
		});
		return exist;
	}

})(jQuery);
