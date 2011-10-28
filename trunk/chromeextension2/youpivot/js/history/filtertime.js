var FilterTimeManager = {};

(function(){
	var m = FilterTimeManager;

	var lastTime;
	m.filterTime = function(time){
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
		var tc = $("#textContent");
        tc.itemTable("detachAll");
        var items = ItemManager.list;


        for(var i=0; i<items.length; i++){
            var item = ItemManager.getItem(i);
			if(item.endTime>=startTime && item.startTime<=endTime+1000){
				showTimeRow(tc, item, item.id);
			}
        }

		//$(".itemTable", tc).itemTable("refreshTopRows");
		if(!SearchManager.getState()){
			TableManager.loadFilters();
		}
        FilterManager.filter();
	}

	function showTimeRow(tc, item, id){
        TableManager.addItem(item);
        tc.itemTable("attach", {"id": id});
	}

})();
