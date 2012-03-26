include("/js/iconfactory.js");
include("js/dateformatter.js");
include("js/utilities.js");

// Controller of itemTable, converts YouPivot type data into info shown in the table
var TableRowFactory = new (function _TableRowFactory(){
    var self = this;

	//convenient wrapper function for DateFormatter.formatDate for specific use in this class
	//Output date format: "April 1, 2011"
	self.createDate = function(item){
		var output = '<div class="item_date hidden toprowonly">'+DateFormatter.formatDate(item.startTime, "F j, Y")+'</div><div class="item_date"';
		return output;
	}
	self.createHeader = function(item){
		var sortBy = SortManager.getSortMethod();
		if(sortBy=="date"){
			var output = DateFormatter.formatDate(item.startTime);
			return {key: output, html: output};
		}
		if(sortBy=="domain"){
			var key = item.domain.name;
			var icon = IconFactory.createTextIcon(item.domain.favUrl, item.domain.name, "wrap");
			var html = icon + key;
			return {key: key, html: html};
		}
	}
    self.createName = function(item){
		var icon = IconFactory.createTextIcon(item.domain.favUrl, item.name, "item_icon");
		var output = "<button class='edit deleteBtn' data-id='"+item.id+"'>Delete</button><a href='"+item.url+"' target='_blank'>"+icon+Utilities.htmlEntities(item.title)+"</a>";
		return output;
	}
	self.createLeft = function(item){
		var sortBy = SortManager.getSortMethod();
        var button = '<button class="pivotBtn">Pivot</button>';
        var topClass = "";
        if(sortBy == "date")
            topClass = " hidden toprowonly";
        var time = '<div class="item_time '+topClass+'">'+DateFormatter.formatTime(item.startTime, 12)+'</div><div class="item_time hidden toprowhide">|</div>';
		return button+time;
	}

    self.getSortIndex = function(item){
        var MAXINT = Math.pow(2, 50);
		var sortBy = SortManager.getSortMethod();
        var sortIndex = "";
        if(sortBy == "domain"){
            sortIndex = item.domain.name + "_";
        }
        sortIndex += (MAXINT - item.startTime);
        return sortIndex;
    }
})();
