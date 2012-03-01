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
        var scaleStyle = {};
        var menuTitle = function(html, title, value){ return title; };
        var type = "item";

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

        self.setTypeName = function(typename){
            type = typename;
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
            var label = $(html);
            var handle = label.find(".filterHandle");
            if(handle.length == 0)
                handle = label;

            var val = Utilities.decay(rating, 1, best);
            for(var i in scaleStyle){
                label.css(i, scaleStyle[i](val));
            }
            if(onAttached != undefined){
                onAttached(label, val);
            }
            self.element.append(label);
            handle.mouseover(onmouseover).mouseout(onmouseout);
            handle.data("value", value);
            handle.click(function(e){
                if(e.which!==3){ // not right click
                    oninclude(handle);
                    e.preventDefault();
                }
            });
            var menuItems = {};
            menuItems["Include this "+type] = {"click": oninclude};
            menuItems["Exclude this "+type] = {"click": onexclude};
            handle.contextMenu("filtermenu_"+id, menuItems, { title: menuTitle(html, title, value) });
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

        var onAttached;

        self.onAttached = function(func){
            onAttached = func;
        }

        self.addScaleStyle = function(style, scaleFunction){
            if(scaleFunction === undefined){
                scaleStyle[style] = function(s) {return s;};
            }else{
                scaleStyle[style] = scaleFunction;
            }
        }

        self.setMenuTitle = function(func){
            menuTitle = func;
        }
    }

})(jQuery);
