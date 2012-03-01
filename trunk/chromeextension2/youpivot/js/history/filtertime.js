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
        //TableManager.detachAll();
        TableManager.itemTable.clear();

        var timeList = {};
        ItemManager.list.iterate(function(item){
			if(item.endTime>=startTime && item.startTime<=endTime+1000){
                timeList[item.id] = item;
                TableManager.addItem(item);
			}
        });

		if(!SearchManager.getState()){
			TableManager.loadFilters(timeList);
		}
        if(TableManager.itemTable)
            TableManager.itemTable.display();
	}

})();
