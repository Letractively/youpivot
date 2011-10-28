// schema: 
//  toprow - only visible when it's the first row possessing that value
//  normal - normal row

(function($){
	$.fn.itemTable = function(action, params){
        lastObj = this;
		switch(action){
			case "create":
                // $(wrapDiv).itemTable("create", {"schema": someSchema});
				var schema = getOptions(params, "schema", []);
				createTable(this, schema);
				break;
			case "addItem":
				var item = getOptions(params, "item", {});
				var header = getOptions(params, "header", "");
				return addItem(this, item, header);
				break;
            case "deleteItem":
				var id = getOptions(params, "id", -1);
                deleteItem(this, id);
                break;
            case "attach":
                // $(wrapDiv).itemTable("attach", {id: itemId});
				var id = getOptions(params, "id", -1);
                attachItem(this, id);
                break;
            case "detach":
				var id = getOptions(params, "id", -1);
                detachItem(this, id);
                break;
            case "detachAll":
                detachAll(this);
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

    // for accessing instance variables
    var instances = [];
    var lastObj;

    function getObj(){
        if(lastObj.children(".itemTable").size() !== 0)
            return lastObj;
        if(lastObj.hasClass("itemTable"))
            return lastObj.parent();
        return lastObj.parents(".itemTable", ".itemTable").parent();
    }

    function instance(){
        var obj = getObj();
        if(obj.data("instance") === undefined)
            console.log(obj);
        return instances[obj.data("instance")];
    }

    function newInstance(obj){
        var obj = getObj();
        var newId = instances.length;
        if(obj.data("instance") === undefined){
            obj.data("instance", newId);
        }
        instances[newId] = {};
        return instances[newId];
    }

	function createTable(thiss, schema){
		var table = $("<table />").addClass("itemTable");
		table.data("schema", schema);
		thiss.html(table);
        newInstance(thiss).rows = {};
        instance().rawRows = {};
        instance().headers = [];
	}

    // gathers necessary information to create row
	function addItem(thiss, item, headerInfo){
		var table = $(".itemTable", thiss);
		var schema = getSchema(table);
		if(!schema){ throw "Schema not defined"; return false; }
		//header creation
		var headerId;
		if(headerInfo){
			headerId = getCreateHeader(table, headerInfo, count(schema));
		}

        instance().rawRows[item.id] = {schema: schema, item: item, table: table};
        var row = createEmptyRow(item.id);
        instance().rows[item.id] = row;

		row.data("header", headerId); //store the header id into the item
		return row;
	}

    function deleteItem(item, id){
        // maybe want to trigger an event here (detach?)
        console.log(item);

		//hide header
		var header = item.data("header");
		if(header && header.nextUntil(".headerRow").filter(":visible").size()==0){
			header.addClass("hidden");
		}

        item.remove();
        delete instance().rows[id];
        delete instance().rawRows[id];
    }

    // actually builds the DOM item to prepare showing on screen
    function buildItem(raw){
        var item = raw.item;
        var schema = raw.schema;
        var table = raw.table;
		populateRow(item.id, schema, item, table);
    }

    // attach (put into DOM) an item with info previously added to the table
    function attachItem(wrap, id){
        var table = $(".itemTable", wrap);

        if(!instance().rows[id] || instance().rows[id].is(":empty")){
            buildItem(instance().rawRows[id]);
        }

		//show header
		var headerId = instance().rows[id].data("header");
        if(!instance().headers[headerId].visible){
            table.append(instance().headers[headerId].obj);
            instance().headers[headerId].visible = true;
        }

        table.append(instance().rows[id]);
        wrap.trigger("attachItem", [instance().rows[id]]);

    }

    function detachItem(wrap, id){
        var item = wrap.find("#item_"+id);
        item.detach();
        wrap.trigger("detachItem", item);

		//hide header
		var headerId = item.data("header");
        var header = instance().headers[headerId].obj;
		if(header && header.nextUntil(".headerRow").filter(":visible").size()==0){
			header.detach();
            instance().headers[headerId].visible = false;
		}
    }

    function detachAll(wrap){
        // FIXME not very efficient
        if(instance()){
            for(var i in instance().headers){
                instance().headers[i].visible = false;
            }
        }
        $(".itemTable .item", wrap).detach();
        $(".itemTable .headerRow", wrap).detach();
    }

	function showItem(thiss, cls){
		//show row
		thiss.removeClass(cls);
		//show header
		var headerId = thiss.data("header");
		if(headerId !== undefined){
            instance().headers[headerId].obj.removeClass("hidden");
		}else{
            console.log("header is undefined"); 
        }
		//show toprows
		//refreshTopRows(thiss, cls);
	}

    // a better way to show/hide headers is to count the number of descendants
	function hideItem(thiss, cls){
		//hide row
		thiss.addClass(cls);
		//hide header
		var headerId = thiss.data("header");
        var header = instance().headers[headerId].obj;
        console.log(header.nextUntil(".headerRow"));
		if(header.nextUntil(".headerRow").filter(":visible").size()==0){
			header.addClass("hidden");
		}
		//hide toprows
		//refreshTopRows(thiss);
	}

	function hideAll(table, cls){
		//var schema = getSchema(table);
		table.find("tr:not(.headerRow)").addClass(cls);
        table.find("tr.headerRow").addClass("hidden");
	}

	function highlight(obj, level){
		//obj.addClass("hover");
        var item = ItemManager.getItem(obj.data("id"));
        if(!item){
            return;
        }
        var color = item.domain.color;
		obj.css("background-color", Helper.createLighterColor(color, PrefManager.getOption(level+"Bg")));
		var fgColor = Helper.createLighterColor(color, PrefManager.getOption(level+"Fg")); //foreground color
		$(".item_color", obj).css("background-color", fgColor);
	}

	function lowlight(obj){
		//obj.removeClass("hover");
        var item = ItemManager.getItem(obj.data("id"));
        if(!item){
            return;
        }
        var color = item.domain.color;
		obj.css("background-color", "");
		$(".item_color", obj).css("background-color", Helper.createLighterColor(color, PrefManager.getOption("lowlightFg")));
	}

	function clear(wrap){
		if(wrap.children().first().hasClass("itemTable")){
			wrap.find(".itemTable").html("");
            instance().rows = {};
            instance().rawRows = {};
        }
	}

	function destroy(wrap){
		if(wrap.children().first().hasClass("itemTable"))
			wrap.html("");
        if(instance()){
            instance().rows = {};
            instance().rawRows = {};
        }
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
        for(var i in instance().headers){
            if(instance().headers[i].label == headerInfo.label){
                return i;
            }
        }
        
        var id = createHeader(headerInfo, width);
        return id;
	}
	function createHeader(headerInfo, width){
        var header = $("<tr/>").addClass("headerRow");
        var th = $("<th/>").addClass("contentHeader").attr("colspan", width).html(headerInfo.html);
        header.append(th);
        var id = instance().headers.length;
        instance().headers[id] = {label: headerInfo.label, obj: header};
		header.data("id", id);
		return id;
	}


    function createEmptyRow(id){
        var tr = $("<tr />").addClass("item").attr("id", "item_"+id);
		return tr;
    }

    function populateRow(id, schema, item, table){
        var rowarr = new Array();
        var k = 0;
		for(var i in schema){
			var col;
			if(schema[i]=="toprow"){
				col = "<td class='item_"+i+"'><span class='hidden'>"+item[i]+"</span></td>";
			}else{
				col = "<td class='item_"+i+"'>"+item[i]+"</td>";
			}
			rowarr[k++] = col;
		}
        var row = rowarr.join();
        var item = instance().rows[id];
        item.append(row);
		return item;
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
