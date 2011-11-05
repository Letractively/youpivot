// schema: 
//  toprow - only visible when it's the first row possessing that value
//  normal - normal row

(function($){
    $.fn.itemTable = function(schema){
        // schema is an object of { (String) name : (ItemTableType) type, name : type, name : type .... }
        if(this.find(".itemTable").length == 0){
            if(!schema) throw "Schema is not provided";
            return new ItemTable(this, schema);
        }else{
            throw "table already initialized";
        }
    }

    var ItemTable = function(obj, _schema){
        var self = this;
        
        self.element = obj;

        // private ivars
        var schema = _schema;
        var table;
        var rows = {};
        var headers = {};

        // initializer
        (function init(){
            table = $("<table />").addClass("itemTable");
            self.element.html(table);
        })();

        // item is an object of { (String) name : (DOM) element, (String) name : (DOM) element, ...}
        // header is a DOM element
        this.addItem = function(item, headerInfo, refresh){
            var row = rows[item.id];
            var returnValue = null; // return null if merely attaching
            if(!row){
                row = buildItem(item); // buildItem stores the created item into rows object as well
                returnValue = row;
            }

            //header creation
            if(headerInfo){
                headerKey = getCreateHeader(headerInfo);
                row.data("header", headerKey); //store the header id into the item
            }

            // attach item
            var nextHeader = headers[headerKey].element.nextAll(".headerRow").first();
            if(nextHeader.length == 0)
                table.append(row);
            nextHeader.before(row); // attach below the right header

            rows[item.id] = row;

            if(refresh == undefined || refresh) self.refreshTopRows();

            return returnValue;
        }

        // this will not remove the item from memory. 
        // If an item with the same ID is added using addItem() function, this DOM element will be reused
        this.detachItem = function(id, refresh){
            var item = self.element.find("#item_"+id);
            item.detach();
            self.element.trigger("detachItem", item);

            //hide header
            headers[item.data("header")].release();

            if(refresh === undefined || refresh) self.refreshTopRows();
        }

        // note: refresh will always be performed
        this.detachAll = function(){
            // FIXME not very efficient
            for(var i in headers){
                headers[i].resetRetainCount();
            }
            $(".itemTable .item", self.element).detach();

            self.refreshTopRows();
        }

        // Remove an item in the table from memory. 
        this.deleteItem = function(id, refresh){
            // maybe want to trigger an event here (detach?)

            //hide header
            headers[item.data("header")].release();

            item.remove();
            delete rows[id];

            if(refresh === undefined || refresh) self.refreshTopRows();
        }

        // note: refresh will always be performed
        // is it same as clear?
        this.deleteAll = function(){}

        this.show = function(obj, cls){
            //show row
            obj.removeClass(cls);
            //show header
            headers[obj.data("header")].retain();

            self.refreshTopRows();
        }

        this.hide = function(obj, cls){
            //hide row
            obj.addClass(cls);
            //hide header
            headers[obj.data("header")].release();

            self.refreshTopRows();
        }

        this.hideAll = function(cls){
            table.find("tr:not(.headerRow)").addClass(cls);
            for(var i in headers){
                headers[i].resetRetainCount();
            }
        }

        // use for hiding / showing
        this.addClass = function(id, className, refresh){
            var obj = self.getDOM(id);
            //hide row
            obj.addClass(className);
            //hide header
            headers[obj.data("header")].release();

            if(refresh === undefined || refresh) self.refreshTopRows();
        }
        this.removeClass = function(id, className, refresh){
            var obj = self.getDOM(id);
            //show row
            obj.removeClass(className);
            //show header
            headers[obj.data("header")].retain();

            if(refresh === undefined || refresh) self.refreshTopRows();
        }

        // returns number of 
        this.getDOM = function(id){
            return table.find("#item_"+id);
        }

        // refresh the top rows
        this.refreshTopRows = function(){
        }

        this.clear = function(){
            self.element.find(".itemTable").html("");
            rows = {};
            headers = {};
        }

        this.destroy = function(){
            self.element.html("");
            rows = {};
            headers = {};
        }

        /*** secondary functions ***/
        function refreshTopRows(thiss){
            for(var i in schema){
                if(schema[i]=="toprow"){
                    var text = thiss.find(".item_"+i).text();
                    var header = thiss.data("header");
                    var grp = header.nextUntil(".headerRow").find(".item_"+i+" span:contains('"+text+"')");
                    grp.removeClass("hidden");
                    var first;
                    var rawGrp = grp.get();
                    for(var i in rawGrp){
                        var item = $(rawGrp[i]);
                        if(item.is(":visible")){
                            first = item;
                            break;
                        }
                    }
                    if(first){
                        grp.not(first).addClass("hidden");
                    }else{
                        grp.addClass("hidden");
                    }
                }
            }
        }

        function refreshAllTopRows(table){
            var header = $(".headerRow:first", table);
            var batch = header.nextUntil(".headerRow");
            while(batch.size()>0){
                var lastText = "";
                batch.filter(":visible").each(function(){
                    refreshTopRows($(this));
                });
                header = batch.last().next(".headerRow");
                batch = header.nextUntil(".headerRow");
            }
        }

        function getCreateHeader(headerInfo){
            var key = headerInfo.key;
            if(headers[key]){
                headers[key].retain();
                return key;
            }

            createHeader(headerInfo);
            return key;
        }
        function createHeader(headerInfo){
            var key = headerInfo.key;
            var header = $("<tr/>").addClass("headerRow");
            var th = $("<th/>").addClass("contentHeader").attr("colspan", count(schema)).html(headerInfo.html);
            header.append(th);

            headers[key] = new HeaderItem(header, table);
        }

        // actually builds the DOM item to prepare showing on screen
        function buildItem(item){
            console.log(schema);
            var tr = $("<tr />").addClass("item").attr("id", "item_"+item.id);

            var rowarr = new Array();
            var k = 0;
            for(var i in schema){
                // not top row
                var col = "<td class='item_"+i+"'>"+item[i]+"</td>";
                if(schema[i]=="toprow"){
                    col = "<td class='item_"+i+"'><span class='hidden'>"+item[i]+"</span></td>";
                }
                rowarr[k++] = col;
            }
            var row = rowarr.join();
            tr.append(row);
            return tr;
        }

        /*** additonal functions ***/
        function count(obj){
            var counter = 0;
            for(var i in obj){ counter++; }
            return counter;
        }
    }
})(jQuery);

var HeaderItem = function(element, table){
    var self = this;

    self.element = element;
    var table = table;
    var retainCount = 1; 

    (function init(){
        console.log("append header");
        table.append(self.element);
    })();

    this.release = function(){
        retainCount--;
        if(retainCount <= 0){
            self.element.hide();
            retainCount = 0;
        }
    }

    this.retain = function(){
        retainCount++;
        if(retainCount > 0)
            self.element.show();
    }

    this.resetRetainCount = function(){
        self.element.hide();
        retainCount = 0;
    }
}
