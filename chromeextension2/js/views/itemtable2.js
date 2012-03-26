include("/js/keytable.js");
style("/js/views/itemtable.css");

/***
A table that can easily be manipulated in javascript. It relies on a schema to add those items. 
A schema is the columns of the table, which is a JSON string in the form { (String) name : (ColumnType) type, name : type .. }

A column type is either "toprow" or "normal"

"toprow" means the column is only visible when it has different content from the one before it. 
The content is drawn from the text of the element with class "toprowonly" inside that cell. 
An element inside the cell with class "toprowhide" is shown only when it is not the top row
***/

(function($){
    $.fn.itemTable2 = function(schema){
        if(this.find(".itemTable").length == 0){
            if(!schema) throw "Schema is not provided";
            return new ItemTable2(this, schema);
        }else{
            throw "table already initialized";
        }
    }

    var ItemTable2 = function(element, _schema){
        var self = this;
        
        self.element = element;

        // private instance variables
        var schema = _schema;
        var table;
        var headers = {};
        var stringRows = new KeyTable();
        var callbacks = {};
        var filterIn = Infinity;
        var filterOut = [];

        // initializer
        (function init(){
            table = $("<table />").addClass("itemTable");
            self.element.html(table);
        })();

        function reinit(_schema){
            schema = _schema;
            headers = {};
            stringRows = new KeyTable();
            callbacks = {};
            filterIn = Infinity;
            filterOut = [];
        }

        // item is an object of { (String) name : (DOM) element, (String) name : (DOM) element, ...}
        // plus the field id and sortIndex
        self.addItem = function(item, headerInfo, onDisplay){
            var header = createTextHeader(headerInfo);
            var row = buildTextItem(item); // buildItem stores the created item into rows object as well
            stringRows[item.id] = {"sortIndex": item.sortIndex, "row": row, "headerId": headerInfo.key, "header": header};
            callbacks[item.id] = onDisplay;
        }

        function sortFunction(a, b){
            return (a.sortIndex < b.sortIndex) ? -1 : 1;
        }

        self.display = function(){
            var displayRows = makeDisplayRows();
            var arr = [];
            var k = 0;
            displayRows.sort(sortFunction);
            var lastHeader = "";
            displayRows.iterate(function(dRow){
                if(dRow.headerId != lastHeader){
                    arr[k++] = dRow.header;
                    lastHeader = dRow.headerId;
                }
                arr[k++] = dRow.row;
            });
            var html = arr.join("");
            table.html(html);
            self.refreshTopRows();

            // make the callbacks
            for(var i in callbacks){
                callbacks[i]($("#item_"+i));
            }
        }

        function makeDisplayRows(){
            var displayRows = new KeyTable();
            if(filterIn == Infinity){
                displayRows = stringRows.copy(); // create a copy of the array
            }else{
                for(var i in filterIn){
                    var id = filterIn[i];
                    if(stringRows[id])
                        displayRows[id] = stringRows[id];
                }
            }
            if(filterOut != Infinity){
                for(var i in filterOut){
                    var id = filterOut[i];
                    delete displayRows[id];
                }
            }
            return displayRows;
        }

        this.filter = function(includeIds, excludeIds){
            filterIn = includeIds;
            filterOut = excludeIds;
        }

        // Remove an item in the table from memory. 
        this.deleteItem = function(id, refresh){
            delete stringRows[id];

            if(refresh === undefined || refresh) self.display();
        }

        // returns DOM entry of the row. A more objective approach than simply $("#item_"+id)
        this.getDOM = function(id){
            return table.find("#item_"+id);
        }

        // refresh the top rows. "toprow" in the schema means it only shows the first occurence of that row for adjacent rows
        // i.e. If 10 consecutive rows have the same date, only the first date is shown (assuming date is a toprow)
        self.refreshTopRows = function(){
            self.element.find(".item_"+i+" span").addClass("hidden");
            for(var i in schema){
                if(schema[i] == "toprow"){
                    var lastText = "";
                    self.element.find(".itemTable tr").each(function(){ 
                        // this iteration includes the header row
                        // to trick the system into renewing lastText so the top row is shown

                        var item = $(this).find(".item_"+i);
                        var column = item.find(".toprowonly");
                        if(column.text() != lastText){
                            column.removeClass("hidden");
                        }else{
                            item.find(".toprowhide").removeClass("hidden");
                        }
                        lastText = column.text();
                    });
                }
            }
        }

        // clears everything in the table, returning to initial state
        self.clear = function(){
            self.element.find(".itemTable").html("");
            //rows = {};
            headers = {};
            stringRows = new KeyTable();
            callbacks = {};
            filterIn = Infinity;
            filterOut = [];
        }

        self.resetToSchema = function(_schema){
            reinit(_schema);
        }

        /*** secondary functions ***/
        function createTextHeader(headerInfo){
            var arr = [];
            var k = 0;
            arr[k++] = '<tr class="headerRow">';
            arr[k++] = '<th class="contentHeader" colspan="'+count(schema)+'">'+headerInfo.html+'</th>';
            arr[k++] = '</tr>';
            var html = arr.join("");
            return html;
        }

        function buildTextItem(item){
            var rowarr = new Array();
            var k = 0;
            rowarr[k++] = '<tr class="item" id="item_'+item.id+'">';
            for(var i in schema){
                var col = "<td class='item_"+i+"'>"+item[i]+"</td>";
                rowarr[k++] = col;
            }
            rowarr[k++] = '</tr>';
            var row = rowarr.join("");
            return row;
        }

        /*** additonal functions ***/
        function count(obj){
            var counter = 0;
            for(var i in obj){ counter++; }
            return counter;
        }
    }
})(jQuery);
