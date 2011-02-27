var HighlightManager = {};

(function(){
	var m = HighlightManager;

	m.highlightDomain = function(id, persistent){
		var domain = $("#item_"+id).data("item").domain.name;
		$("#textContent tr").each(function(){
			var item = $(this).data("item");
			if(item.domain.name == domain){
				var lvl = (item.id==id) ? 2 : 3;
				$(this).itemTable("highlight", {level: lvl});
				if(persistent){
					addToList($(this), lvl);
				}
			}
		});
	}

	m.lowlightDomain = function(id, clearPersistent){
		var domain = $("#item_"+id).data("item").domain.name;
		$("#textContent tr").each(function(){
			var item = $(this).data("item");
			if(item.domain.name == domain){
				var lvl = (item.id==id) ? 2 : 3;
				if(clearPersistent){
					removeFromList($(this), lvl);
				}
				if(getList($(this)).length===0)
					$(this).itemTable("lowlight", {});
				else
					$(this).itemTable("highlight", {level: getMinLevel($(this))});
			}
		});
	}

	m.highlightItem = function(id, persistent){
		$("#item_"+id).itemTable("highlight", {level: 2});
	}

	m.lowlightItem = function(id, clearPersistent){
		var item = $("#item_"+id);
		if(clearPersistent){
			removeFromList(item, 2);
		}
		if(getList(item).length===0)
			item.itemTable("lowlight", {});
		else
			item.itemTable("highlight", {level: getMinLevel(item)});
	}

	m.highlightLayer = function(id, persistent){
		GraphManager.highlightLayer(id, persistent);
	}

	m.lowlightLayer = function(id, clearPersistent){
		GraphManager.lowlightLayer(id, clearPersistent);
	}

	function getList(obj){
		var list;
		try{
			list = obj.data("highlight");
		}catch(e){
			return [];
		}
		if(!list) return [];
		return list;
	}
	function addToList(obj, item){
		var list = getList(obj);
		list[list.length] = item;
		obj.data("highlight", list);
	}
	function removeFromList(obj, level){
		var list = getList(obj);
		for(var i in list){
			if(list[i] == level){
				list.splice(i, 1);
				break;
			}
		}
		obj.data("highlight", list);
		return list;
	}
	function getMinLevel(obj){
		var list = getList(obj);
		var min = 10;
		for(var i in list){
			if(list[i] < min && list[i]!=0) min = list[i];
		}
		return min;
	}
})();
