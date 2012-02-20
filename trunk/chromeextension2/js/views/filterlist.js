include("/js/utilities.js");

(function($){
    $(function(){
        $(".view_FilterList").each(function(){
            var filterList = $(this).FilterList();
            $(this).data("view", filterList);
        });
    });

    $.fn.FilterList = function(){
        var view = this.data("view");
        if(view == undefined){
            return new FilterList(this);
        }else{
            return view;
        }
    }

    var FilterList = function(obj){
        var self = this;

        self.element = obj;
        var filters = [];
        var best = 1;
        var id;
        var scaleStyle = {"opacity": function(scale){ return scale; }};
        var menuTitle = function(html, title, value){ return title; };

        (function init(){
            id = self.element.attr("id");
            if(!id)
                throw "ID must be defined for filterList";
        })();

        self.addItem = function(html, title, value, batch){
            var index = getFilterIndex(value);
            if(index == -1){
                filters[filters.length] = {html: html, title: title, value: value, rating: 1};
            }else{
                var filter = filters[index];
                filters[index].rating += 1;
                //filters[index] = {url: url, name: name, rating: filter.rating+1};
                if(filter.rating+1 > best) best = filter.rating+1;
            }

            if(!batch)
                self.display();
        }

        self.display = function(){
            filters.sort(sortFunction);
            self.element.html("");
            for(var i in filters){
                displayFilter(filters[i].html, filters[i].title, filters[i].value, filters[i].rating);
            }
        }

        function sortFunction(a, b){
            return b.rating-a.rating;
        }

        function getFilterIndex(value){
            for(var i in filters){
                if(filters[i].value == value){
                    return i;
                }
            }
            return -1;
        }

        function displayFilter(html, title, value, rating){
            var img = $(html);
            for(var i in scaleStyle){
                img.css(i, scaleStyle[i](Utilities.decay(rating, 1, best)));
            }
            self.element.append(img);
            img.mouseover(onmouseover).mouseout(onmouseout);
            img.data("value", value);
            img.click(function(e){
                if(e.which!==3){ // not right click
                    oninclude(img);
                }
            });
            img.contextMenu("filtermenu_"+id, {
                "Include this domain": {
                    click: oninclude
                },
                "Exclude this domain": {
                    click: onexclude
                }
            }, 
            { title: menuTitle(html, title, value) });
        }

        self.clearFilters = function(retainOrder){
            if(!retainOrder){
                filters = [];
            }else{
                for(var i in filters){
                    filters[i].rating = 0;
                }
            }
            best = 1;
            self.element.html("");
        }

        function onmouseover(obj){
            obj = $(obj);
            var value = obj.data("value");
            self.element.trigger("mouseoverfilter", [obj, value]);
        }

        function onmouseout(obj){
            obj = $(obj);
            var value = obj.data("value");
            self.element.trigger("mouseoutfilter", [obj, value]);
        }

        function oninclude(obj){
            obj = $(obj);
            var value = obj.data("value");
            self.element.trigger("includefilter", [obj, value]);
        }

        function onexclude(obj){
            obj = $(obj);
            var value = obj.data("value");
            self.element.trigger("excludefilter", [obj, value]);
        }

        self.addScaleStyle = function(style, scaleFunction){
            scaleStyle[style] = scaleFunction;
        }

        self.setMenuTitle = function(func){
            menuTitle = func;
        }
    }

})(jQuery);