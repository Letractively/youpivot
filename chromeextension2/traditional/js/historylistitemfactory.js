include_("DateFormatter");
include_("Utilities");

// Controller of itemTable, converts YouPivot type data into info shown in the table
var HistoryListItemFactory = new (function _HistoryListItemFactory(){
    var self = this;

	//Output date format: "April 1, 2011"
	self.createDate = function(item){
		var output = DateFormatter.formatDate(item.visitTime, "F j, Y");
		return output;
	}
	self.createHeader = function(item){
        var output = DateFormatter.formatDate(item.visitTime);
        return {key: output, html: output};
	}
    self.createName = function(item){
		var icon = IconFactory.createTextIcon("chrome://favicon/"+item.url, item.title, "item_icon");
		var output = "<button class='edit deleteBtn' data-id='"+item.id+"'>Delete</button><a href='"+item.url+"' target='_blank' onclick='analytics(\"select\", \"Select history item\", \""+item.url+"\")'>"+icon+Utilities.htmlEntities(item.title)+"</a>";
		return output;
	}
	self.createLeft = function(item){
        var time = '<div class="item_time hidden toprowonly">'+DateFormatter.formatTime(item.visitTime, 12)+'</div><div class="item_time hidden toprowhide">|</div>';
		return time;
	}
})();
