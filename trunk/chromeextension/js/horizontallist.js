//abstract class Horizontal List. Creates a clickable list of items with possible "more" dropdown

function HorizontalList(type, arr, callback){

	var className = "more"+type;
	var wrap = $("#more"+type+"BtnWrap");
	var btn = wrap.find(".dropdownBtn");
	var dropdown = wrap.find(".dropdown");
	init();

	function init(){
		loadItems();
		btn.click(function(){
			toggleMore();
			return false;
		});
		$(document).click(function(){
			dropdown.hide();
		});
	}

	function loadItems(){
		for(var i in arr){
			if(typeof arr[i] == "object"){
				loadMore(arr[i]);
			}else{
				displayItem(arr[i]);
			}
		}
	}
	function loadMore(items){
		btn.show();
		for(var i in items){
			displayMore(items[i]);
		}
	}
	function toggleMore(){
		dropdown.toggle();
	}
	function displayMore(name){
		var item = createPrimitiveItem(name, callback).addClass(className + " dropdownItem");
		dropdown.append(item);
	}
	function displayItem(name){
		displayPrimitiveItem(name, callback);
	}
	function displayPrimitiveItem(name, onclick){
		var item = createPrimitiveItem(name, onclick);
		wrap.before(item).before(" | "); //FIXME I don't want a bar after the last item (if there is no "more")
	}
	function createPrimitiveItem(name, onclick){
		var item = $("<a class='app' href='#'></a>").text(name);
		item.click(function(){ onclick($(this)); return false; });
		return item;
	}
}

