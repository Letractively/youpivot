//abstract class Horizontal List. Creates a clickable list of items with possible "more" dropdown

(function($){
	$.fn.hList = function(action, options){
		switch(action){
			case "loadArray":
				var arr = getOptions(options, "items", []);
				var callback = getOptions(options, "callback", function(){});
				loadArray(this, arr, callback);
				break;
			case "select":
				var obj = getOptions(options, "object", this);
				selectObj(obj, options);
				break;
			default:
				throw "Action is not defined: "+action;
				break;
		}
	}
	function loadArray(obj, arr, callback){
		obj.html("");
		obj.addClass("hList");
		for(var i in arr){
			if(typeof arr[i] == "object"){
				loadMore(obj, arr[i], callback);
			}else{
				obj.append(createItem(arr[i], callback));
				if(i!=arr.length-1) obj.append(" | ");
			}
		}
	}
	function createItem(name, onclick){
		var item = $("<a class='app hItem_"+name+"' href='#'></a>").text(name);
		item.click(function(){ clickEvent($(this), onclick); return false; });
		return item;
	}
	function clickEvent(obj, onclick){
		if(!obj.parent().hasClass("dropdownWrap")){
			selectObj(obj);
		}
		$(".dropdown").hide();
		onclick(obj.text());
	}
	function loadMore(obj, items, callback){
		var drop = createDropdown();
		for(var i in items){
			var item = createItem(items[i], callback).css("display", "block");
			drop.find(".dropdown").append(item);
		}
		obj.append(drop);

		$(document).click(function(){
			$(".dropdown").hide();
		});
		//$(".hList>a").click(function(){ $(".dropdown").hide(); });
	}
	function createDropdown(){
		var drop = $("<div class='dropdownWrap'></div>");
		drop.append(createItem("more", displayMore))
			.append("<div class='dropdown'></div>");
		return drop;
	}
	function displayMore(obj){
		obj.siblings().toggle();
	}
	function getOptions(options, label, defaultValue){
		if(!options || typeof options[label] == "undefined"){
			return defaultValue;
		}
		return options[label];
	}
	function selectObj(obj, options){
		var name = getOptions(options, "name", "");
		if(name){
			obj = obj.find(".hItem_"+name);
		}
		var wrap = obj.closest(".hList");
		wrap.find(".active").removeClass("active");
		obj.addClass("active");
		if(obj.parent().hasClass("dropdown")){
			obj.parent().siblings().addClass("active");
		}
	}
})(jQuery);
