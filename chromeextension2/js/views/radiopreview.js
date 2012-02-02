(function($){
    $(function(){
        $(".view_RadioPreview").each(function(){
            var radioPreview = $(this).RadioPreview();
            $(this).data("view", radioPreview);
        });
    });

    $.fn.RadioPreview = function(){
        return new RadioPreview(this);
    }

    var RadioPreview = function(obj){
        var self = this;

        self.element = obj;

        var radioSet;

        (function init(){
            var radioSetId = obj.attr("data-radiosetid");
            radioSet = $("#"+radioSetId);

            // initialize the value if radioSet is already initialized
            if(radioSet.view())
                itemSelected(radioSet.view().getValue());

            radioSet.bind("selectionChanged", function(e, value){
                itemSelected(value);
            });
        })();

        function itemSelected(value){
            var url = radioSet.attr("data-imageurl");
            url = url.replace("%s", value);
            self.element.attr("src", url);
        }

    }

})(jQuery);
