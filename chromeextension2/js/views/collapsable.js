// abstract class to make a collapsable list

(function($){
    $(function(){
        $.Collapsable(".view_Collapsable");
    });

    $.Collapsable = function(options){
        if(typeof options == "string"){
            $(options).each(function(){
                var handleSelector = $(this).attr("data-handle");
                var handle = $(handleSelector);
                var indicator = ($(this).attr("data-indicator") == "true");
                var collapsable = $(this).collapsable("create", {"handle": handle, "indicator": indicator});
                $(this).data("view_collapsable", collapsable);
            });
            return this;
        }
    }

	$.fn.collapsable = function(action, options){
        var existing = this.data("view_collapsable");
        if(existing){
            return existing;
        }else{
            return new Collapsable(this, options);
        }
	}

    var Collapsable = function(obj, options){
        $.extend({handle: false, indicator: false}, options);

        var self = this;
        self.element = obj;

        var indicator = options.indicator;
        var handle = options.handle;

        (function init(){
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
                console.log("Collapsable: handle type unknown");
            }
        })();
    };
})(jQuery);
