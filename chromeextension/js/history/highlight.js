var HighlightManager = {};

(function(){
	var m = HighlightManager;

	var lvls = ["highbg", "lowbg"];
	m.highlightDomain = function(id, persistent){
		var domain = $("#item_"+id).data("item").domain.name;
		$("#textContent .item").each(function(){
			var item = $(this).data("item");
			if(item.domain.name == domain){
				var lvl = (item.id==id) ? 1 : 2;
				$(this).itemTable("highlight", {level: lvls[getMinLevel($(this), lvl-1)]});
				if(persistent){
					addToList($(this), lvl);
				}
			}
		});
	}

	m.lowlightDomain = function(id, clearPersistent){
		var domain = $("#item_"+id).data("item").domain.name;
		$("#textContent .item").each(function(){
			var item = $(this).data("item");
			if(item.domain.name == domain){
				var lvl = (item.id==id) ? 1 : 2;
				if(clearPersistent){
					removeFromList($(this), lvl);
				}
				if(getList($(this)).length===0)
					$(this).itemTable("lowlight", {});
				else
					$(this).itemTable("highlight", {level: lvls[getMinLevel($(this))]});
			}
		});
	}

	m.highlightItem = function(item, persistent){
		item.itemTable("highlight", {level: "highbg"});
		//$("#item_"+id).itemTable("highlight", {level: 2});
	}

	m.lowlightItem = function(item, clearPersistent){
		//var item = (typeof id == "object") ? id : $("#item_"+id);
		if(clearPersistent){
			removeFromList(item, 2);
		}
		if(getList(item).length===0)
			item.itemTable("lowlight", {});
		else
			item.itemTable("highlight", {level: lvls[getMinLevel(item)]});
	}

	var scrollEvents = {};
	m.scrollToItem = function(id, delay){
		scrollEvents[id] = setTimeout(function(){
			scrollToItem(id);
		}, delay);
	}
	m.cancelScroll = function(id){
		clearTimeout(scrollEvents[id]);
	}

	m.highlightLayer = function(id, persistent){
		var item = $("#item_"+id).data("item");
		if(item.importance && item.importance.length!=0){
			GraphManager.highlightLayer(id, persistent);
		}else{
			EventManager.highlight(id, persistent);
		}
	}

	m.lowlightLayer = function(id, clearPersistent){
		var item = $("#item_"+id).data("item");
		if(item.importance && item.importance.length!=0){
			GraphManager.lowlightLayer(id, clearPersistent);
		}else{
			EventManager.lowlight(id, clearPersistent);
		}
	}

	function scrollToItem(id){
		var range = [$("#graphShadow").height()+30, $(window).height()-60];
		var item = $("#item_"+id);
		var top = item.offset().top;
		var scrollTop = $("body").scrollTop();
		if(top-scrollTop<range[0]){
			var h = range[0];
			$("body").animate({scrollTop:top-h}, 50);
		}else if(top-scrollTop>range[1]){
			var h = range[1];
			$("body").animate({scrollTop:top-h}, 50);
		}
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
	function getMinLevel(obj, newLevel){
		var list = getList(obj);
		var min = 10;
		for(var i in list){
			if(list[i] < min && list[i]!=0) min = list[i];
		}
		if(!newLevel) newLevel = 0;
		if(newLevel<min && newLevel!=0) min = newLevel;
		return min;
	}
})();