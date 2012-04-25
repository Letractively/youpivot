include_("ItemTable");
include_("TableRowFactory");
include_("Helper");
//include_("PivotManager");

(function($){

    $.fn.pivotTable = function(){
        var pivotTable = new PivotTable(this);
        return pivotTable;
    }

    var PivotTable = function(element){
        var dateSchema = {"left": "toprow", "color": "normal", "name": "normal"};
        var typeSchema = {"date": "toprow", "left": "normal", "color": "normal", "name": "normal"};

        var self = this;

        var itemTable = element.itemTable2(dateSchema);

        // inherit all functions from itemTable
        for(var i in itemTable)
            this[i] = itemTable[i];

        self.element = element;

        (function init(){
            itemTable.element.on("mouseenter", "tr.item", function(){
                $(".item_time", this).hide();
                $(".pivotBtn", this).show();
            }).on("mouseleave", "tr.item", function(){
                $(".item_time", this).show();
                $(".pivotBtn", this).hide();
            }).on("click", "tr.item .pivotBtn", function(){
                var eventId = $(this).attr("data-eventid");
                PivotManager.pivotItem(eventId);
            });
        })();

        this.highlight = function(id, color, level){
            var row = self.element.find("#item_"+id);
            if(row.length == 0) return;

            row.css("background-color", Helper.createLighterColor(color, PrefManager.getOption(level+"Bg")));
            var fgColor = Helper.createLighterColor(color, PrefManager.getOption(level+"Fg")); //foreground color
            $(".item_color", row).css("background-color", fgColor);
        }

        this.lowlight = function(id, color){
            var row = self.element.find("#item_"+id);
            if(row.length == 0) return;

            row.css("background-color", "");
            $(".item_color", row).css("background-color", Helper.createLighterColor(color, PrefManager.getOption("lowlightFg")));
        }

        this.resetToSortMode = function(sortBy){
            //console.log("change schema");
            var schema = dateSchema;
            if(sortBy=="by type") schema = typeSchema;
            else if(sortBy=="chronological") schema = dateSchema;
            itemTable.resetToSchema(schema);
        }

        this.addItem = function(item, _onDisplay){
            var obj = {
                left        : TableRowFactory.createLeft(item),
                color       : "",
                name        : TableRowFactory.createName(item),
                date        : TableRowFactory.createDate(item),
                sortIndex   : TableRowFactory.getSortIndex(item),
                id          : item.id
            }
            var headerInfo = TableRowFactory.createHeader(item);
            var row = itemTable.addItem(obj, headerInfo, onDisplay);

            function onDisplay(row){
                //set link to pivot if it is a timemark
                if(item.domain.name == "timemark"){
                    row.find(".item_name>a").click(function(e){
                        PivotManager.pivotItem(item.eventId);
                        e.preventDefault();
                    });
                }
                //add mouseover events
                row.data("id", item.id); //store the item with the DOM object

                row.find(".item_color").css("background-color", Helper.createLighterColor(item.domain.color, pref("lowlightFg")));
                row.find(".pivotBtn").attr("data-eventid", item.eventId);
                _onDisplay(row);
            }
        }
    }

})(jQuery);
