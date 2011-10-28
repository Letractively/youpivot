// an arrowBox view component which is made up of a left button, a right button and a middle section to display information

style("js/views/arrowbox/arrowbox.css");

(function($){
	$.fn.arrowBox = function(){
        return new ArrowBox(this);
	}

    var ArrowBox = function(obj){
        var self = this;

        // instance variables
        this.element = obj;
        
        // initializer
        (function init(){
            var div = $("<div />").attr("class", "arrowBox ABContainer");
            div.append('<button class="ABLeftBtn ABButton"></button>');
            div.append('<div class="ABDisplay"></div>');
            div.append('<button class="ABRightBtn ABButton"></button>');
            self.element.append(div);
        })();

        // public methods

        this.pressLeft = function(func){
            $(".ABLeftBtn", self.element).click(func);
        }

        this.pressRight = function(func){
            $(".ABRightBtn", self.element).click(func);
        }

        this.setText = function(text){
            $(".ABDisplay", self.element).text(text);
        }

        this.pressDisplay = function(func){
            $(".ABDisplay", self.element).click(func);
        }
    }

})(jQuery);
