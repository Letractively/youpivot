include("js/dateformatter.js");
include("js/utilities.js");

// Controller of itemTable, converts YouPivot type data into info shown in the table
var HistoryListItemFactory = new (function _HistoryListItemFactory(){
    var self = this;

	//Output date format: "April 1, 2011"
	self.createDate = function(item){
		var output = DateFormatter.formatDate(item.visitTime, "F j, Y");
		return output;
	}
	self.createHeader = function(item){
		//var sortBy = SortManager.getSortMethod();
		//if(sortBy=="date"){
			var output = DateFormatter.formatDate(item.visitTime);
			return {key: output, html: output};
		//}
		/*if(sortBy=="domain"){
			var key = item.domain.name;
			var icon = IconFactory.createTextIcon(item.domain.favUrl, item.domain.name, "wrap");
			var html = icon + key;
			return {key: key, html: html};
		}*/
	}
    self.createName = function(item){
		var icon = IconFactory.createTextIcon("chrome://favicon/"+item.url, item.title, "item_icon");
		var output = "<button class='edit deleteBtn' data-id='"+item.id+"'>Delete</button><a href='"+item.url+"' target='_blank'>"+icon+Utilities.htmlEntities(item.title)+"</a>";
		return output;
	}
	self.createLeft = function(item){
        var time = '<div class="item_time">'+DateFormatter.formatTime(item.visitTime, 12)+'</div>';
		return time;
	}
})();
