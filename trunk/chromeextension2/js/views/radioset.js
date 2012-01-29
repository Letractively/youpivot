(function($){
    $(function(){
        $(".view_RadioSet").each(function(){
            var radioSet = $(this).RadioSet();
            $(this).data("view", radioSet);
        });
    });

    $.fn.RadioSet = function(){
        return new RadioSet(this);
    }

    var RadioSet = function(obj){
        var self = this;

        self.element = obj;

        var imageurl;
        var value;

        (function init(){
            imageurl = obj.attr("data-imageurl");
            $(".item", self.element).each(function(){
                var color = $(this).attr("data-value");
                var url = imageurl.replace("%s", color);
                $(this).html('<img src="'+url+'" />').click(function(){
                    selectItem($(this));
                    return false;
                });
            });

            // mock select the designated "selected" element
            selectItem($(".item.selected", self.element));
        })();

        self.getValue = function(){
            return value;
        }

        function selectItem(obj){
            $(".item.selected", self.element).removeClass("selected");
            obj.addClass("selected");
            value = obj.attr("data-value");
            self.element.trigger("selectionChanged", [value]);
        }
    }

})(jQuery);
