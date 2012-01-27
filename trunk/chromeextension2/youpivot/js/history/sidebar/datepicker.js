var DatePicker = {};

(function(){
	var m = DatePicker;
	var dateValues = ["now", "today", "yesterday"];
	var def = "now";

	m.pickDate = function(date){
		var label = (typeof date == "string") ? date : "";
		$("#datePickers").hList("select", {name: label});
		pickDate(date);
	}

    m.setDateDisplay = function(startDate, endDate){
        var label = "";
        var todayNoon = noonDay(new Date()).getTime();
        if(Math.abs(endDate - new Date().getTime()) < 30000){
            label = "now";
        }else if(startDate == todayNoon - 43200000 && endDate == todayNoon + 43199999){
            label = "today";
        }else if(startDate == todayNoon - 129600000 && endDate == todayNoon - 43200001){
            label = "yesterday";
        }
        $("#datePickers").hList("select", {name: label});
    }

	function pickDate(date){
		var now = date == "now";
		var callback = false;
		if(typeof date == "string"){
			date = translateDate(date);
		}else{
			date.setHours(12); // set to noon so it will show the whole day
		}
		var time = date.getTime();
		var tTime = time+12*3600000;
		var pInterval = pref("pivotInterval");
		var selection = [time-pInterval/2, time+pInterval/2];
		if(now) selection = [tTime-pInterval, tTime]
		PivotManager.pivot(time, {"forceReload": true, "selection": selection});
		return true;
	}
	function translateDate(name){
		var d = new Date();
		switch(name){
			case "now":
				//now is the end point instead of the center
				return new Date(d.getTime()-12*3600000); //FIXME change back to end point
				break;
			case "today":
				return noonDay(d);
				break;
			case "yesterday":
				d.setDate(d.getDate()-1);
				return noonDay(d);
				break;
		}
	}
	function noonDay(d){
		d.setHours(12);
		d.setMinutes(0);
		d.setSeconds(0);
		d.setMilliseconds(0);
		return d;
	}
	function toggleCalendar(){
		if($("#calendar").is(":visible")){
			$("#calendar").slideUp(100);
		}else{
			$("#calendar").slideDown(100);
		}
	}
	function hideCalendar(){
		$("#calendar").slideUp(100);
	}

	$("#m-tabView_youpivot").bind("tabready", function(){
        $("#y-searchResults").bind("search", function(e, active){
            if(active){
                $("#datePickers").addClass("dim");
                $("#datePickers a").addClass("disabled");
            }else{
                $("#datePickers").removeClass("dim");
                $("#datePickers a").removeClass("disabled");
            }
        });

		$("#datePickers").hList("loadArray", {items: dateValues, callback: pickDate});
		m.pickDate(def);
	});

})();
