// schema: 
//  toprow - only visible when it's the first row possessing that value
//  normal - normal row

(function($){
	$.fn.itemTable = function(action, params){
		switch(action){
			case "create":
				var schema = getOptions(params, "schema", []);
				createTable(this, schema);
				break;
			case "addItem":
				var item = getOptions(params, "item", {});
				var header = getOptions(params, "header", "");
				return addItem(this, item, header);
				break;
			case "show":
				var cls = getOptions(params, "class", "hidden");
				showItem(this, cls);
				break;
			case "hide":
				var cls = getOptions(params, "class", "hidden");
				hideItem(this, cls);
				break;
			case "hideAll":
				var cls = getOptions(params, "class", "hidden");
				hideAll(this, cls);
				break;
			case "highlight":
				var level = getOptions(params, "level", "highbg");
				highlight(this, level);
				break;
			case "lowlight":
				lowlight(this);
				break;
			case "clear":
				clear(this);
				break;
			case "destroy":
				destroy(this);
				break;
			case "refreshTopRows":
				refreshAllTopRows(this);
				break;
			default:
				throw "Undefined action "+action;
				break;
		}
	}

	function createTable(thiss, schema){
		var table = $("<table class='itemTable'></table>");
		table.data("schema", schema);
		thiss.html(table);
	}

	function addItem(thiss, item, headerInfo){
		var table = $(".itemTable", thiss);
		var schema = getSchema(table);
		if(!schema){ throw "Schema not defined"; return false; }
		//header creation
		var header;
		if(headerInfo){
			header = getCreateHeader(table, headerInfo, count(schema));
		}
		//row creation
		var row = createRow(item.id, schema, item, table);
		row.data("header", header); //store the header element into the item
		table.append(row);
		showItem(row, "hidden");
		return row;
	}

	function showItem(thiss, cls){
		//show row
		thiss.removeClass(cls);
		//show header
		var header = thiss.data("header");
		if(header){
			header.removeClass(cls);
		}else{ console.log("header is undefined"); }
		//show toprows
		//refreshTopRows(thiss, cls);
	}
	function hideItem(thiss, cls){
		//hide row
		thiss.addClass(cls);
		//hide header
		var header = thiss.data("header");
		if(header.nextUntil(".headerRow").filter(":visible").size()==0){
			header.addClass(cls);
		}
		//hide toprows
		//refreshTopRows(thiss);
	}

	function hideAll(table, cls){
		var schema = getSchema(table);
		table.find("tr").addClass(cls);
	}

	function highlight(obj, level){
		//obj.addClass("hover");
		var color = obj.data("item").domain.color;
		obj.css("background-color", Helper.createLighterColor(color, level));
		$(".item_color", obj).css("background-color", (level=="highbg") ? color : Helper.createLighterColor(color, "med"));
	}

	function lowlight(obj){
		//obj.removeClass("hover");
		var color = obj.data("item").domain.color;
		obj.css("background-color", "");
		$(".item_color", obj).css("background-color", Helper.createLighterColor(color, "low"));
	}

	function clear(wrap){
		if(wrap.children().first().hasClass("itemTable"))
			wrap.find(".itemTable").html("");
	}
	function destroy(wrap){
		if(wrap.children().first().hasClass("itemTable"))
			wrap.html("");
	}

	/*** secondary functions ***/
	function refreshTopRows(thiss){
		var schema = getSchema(thiss.parents(".itemTable"));
		for(var i in schema){
			if(schema[i]=="toprow"){
				var text = thiss.find(".item_"+i).text();
				var header = thiss.data("header");
				var grp = header.nextUntil(".headerRow").find(".item_"+i+" span:contains('"+text+"')");
				grp.removeClass("hidden");
				var first;
				var rawGrp = grp.get();
				for(var i in rawGrp){
					var item = $(rawGrp[i]);
					if(item.is(":visible")){
						first = item;
						break;
					}
				}
				if(first){
					grp.not(first).addClass("hidden");
				}else{
					grp.addClass("hidden");
				}
			}
		}
	}

	function refreshAllTopRows(table){
		var header = $(".headerRow:first", table);
		var batch = header.nextUntil(".headerRow");
		while(batch.size()>0){
			var lastText = "";
			batch.filter(":visible").each(function(){
				refreshTopRows($(this));
			});
			header = batch.last().next(".headerRow");
			batch = header.nextUntil(".headerRow");
		}
	}

	function getCreateHeader(table, headerInfo, width){
		var header;
		$(".headerRow", table).each(function(){
			if($(this).data("label")==headerInfo.label){
				header = $(this);
				return;
			}
		});
		if(!header){
			header = createHeader(headerInfo, width);
			table.append(header);
		}
		return header;
	}
	function createHeader(headerInfo, width){
		var header = $("<tr class='headerRow'><th colspan='"+width+"' class='contentHeader'>"+headerInfo.html+"</th></tr>");
		header.data("label", headerInfo.label);
		return header;
	}

	function createRow(id, schema, item, table){
		var row = $("<tr class='item' id='item_"+id+"'></tr>");
		for(var i in schema){
			var col;
			if(schema[i]=="toprow"){
				col = "<td class='item_"+i+"'><span class='hidden'>"+item[i]+"</span></td>";
			}else{
				col = "<td class='item_"+i+"'>"+item[i]+"</td>";
			}
			row.append(col);
		}
		//FIXME isolate this file, should not link to YouPivot specific objects/functions
		row.mouseenter(function(e){
			HighlightManager.highlightDomain(id, {persistent: false, parent: table});
			$(".item_time", this).hide();
			$(".pivotBtn", this).show();
		});
		row.mouseleave(function(){
			HighlightManager.lowlightDomain(id, {clearPersistent: false, parent: table});
			$(".item_time", this).show();
			$(".pivotBtn", this).hide();
		});
		return row;
	}

	function getSchema(table){
		if(!table) return false;
		var schema = table.data("schema");
		return schema;
	}

	/*** additonal functions ***/
	function getOptions(options, label, defaultValue){
		if(!options || options[label] == undefined){
			return defaultValue;
		}
		return options[label];
	}
	function count(obj){
		var counter = 0;
		for(var i in obj){ counter++; }
		return counter;
	}
})(jQuery);
