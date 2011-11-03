// abstract class to make a collapsable list

(function($){
	$.fn.collapsable = function(action, options){
		switch(action){
			case "create":
				$.extend({handle: false, indicator: false}, options);
				createList(this, options.handle, options.indicator);
				break;
			default: 
				throw "Action is not defined: "+action;
				break;
		}
		return this;
	}

	function createList(obj, handle, indicator){
		if(!handle){
			console.log("Handle is not defined");
			return;
		}
		if(typeof handle == "object"){
			handle.click(function(){
				$(this).parent().find(".collapsable_indicator").toggleClass("active", !obj.is(":visible"));
				obj.slideToggle(50);
			});
			if(indicator){
				//create the indicator triangle
				var active = (obj.is(":visible")) ? "active" : "";
				handle.prepend("<span class='collapsable_indicator active'></span>");
			}
		}else{
			console.log("Collapsable: type unknown");
		}
	}
})(jQuery);
