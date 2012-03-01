include("/js/keytable.js");
style("/js/views/itemtable.css");

// schema: 
//  toprow - only visible when it's the first row possessing that value
//  normal - normal row

(function($){
    $.fn.itemTable2 = function(schema){
        // schema is an object of { (String) name : (ItemTableType) type, name : type, name : type .... }
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

        // private ivars
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

        this.resetFilters = function(){
            filterIn = Infinity;
            filterOut = [];
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

                        var column = $(this).find(".item_"+i+">span");
                        if(column.text() != lastText){
                            column.removeClass("hidden");
                        }
                        lastText = column.text();
                    });
                }
            }
        }

        // clears everything in the table, returning to initial state
        this.clear = function(){
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

        // destroy the table, as if this itemTable has never been created
        this.destroy = function(){
            self.element.html("");
            console.log("destroy");
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
                // not top row
                var col = "<td class='item_"+i+"'>"+item[i]+"</td>";
                if(schema[i]=="toprow"){
                    col = "<td class='item_"+i+"'><span class='hidden'>"+item[i]+"</span></td>";
                }
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
