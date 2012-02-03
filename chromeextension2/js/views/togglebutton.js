(function($){
    $(function(){
        $(".view_ToggleButton").each(function(){
            var toggleBtn = $(this).ToggleButton();
            $(this).data("view", toggleBtn);
        });
    });

    $.fn.ToggleButton = function(){
        return new ToggleButton(this);
    }

    var ToggleButton = function(obj){
        var self = this;

        self.element = obj;
        var pressed = false;

        (function init(){
            refreshButton();

            self.element.click(function(){
                pressed = !pressed;
                refreshButton();
                self.element.trigger("togglechanged", [pressed]);
            });
        })();

        self.setState = function(p){
            pressed = p;
            refreshButton();
            self.element.trigger("togglechanged", [pressed]);
        }

        self.getState = function(){
            return pressed;
        }

        function refreshButton(){
            var src;
            if(!pressed){
                src = self.element.attr("data-normalimage");
            }else{
                src = self.element.attr("data-depressedimage");
            }
            self.element.attr("src", src);
        }
    }

})(jQuery);
