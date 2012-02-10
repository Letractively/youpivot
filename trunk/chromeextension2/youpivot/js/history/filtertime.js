var FilterTimeManager = new (function _FilterTimeManager(){
    var self = this;

	var lastTime;
	self.filterTime = function(time){
		if(typeof time == "undefined" && lastTime){
			time = lastTime;
		}else if(time){
			lastTime = time;
		}else{ 
			console.log("Time is not defined. Filtering aborted. ");
			return; 
		}
		var startTime = time[0];
		var endTime = time[1];
        TableManager.detachAll();
        var items = ItemManager.list;

		var tc = $("#textContent");

        ItemManager.list.iterate(function(item){
			if(item.endTime>=startTime && item.startTime<=endTime+1000){
				showTimeRow(item);
			}
        });

		if(!SearchManager.getState()){
			TableManager.loadFilters();
		}
        FilterManager.filter();
	}

	function showTimeRow(item){
        TableManager.addItem(item);
	}

})();
