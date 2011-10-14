// UI widget to load a progress-bar like timer bar based on the time elasped. 

(function($){
	$.fn.timerBar = function(action, options){
		switch(action){
			case undefined:
				action = "create";
			case "create":
				var number = getOptions(options, "number", 5);
				var speed = getOptions(options, "speed", 500);
				var complete = getOptions(options, "complete", function(){});
				createBar($(this), number, speed, complete);
				break;
			case "start":
				startLoading($(this));
				break;
			case "reset":
				resetBar($(this));
				break;
			case "pause":
				pauseBar($(this).find(".timerBar"));
				break;
			case "resume":
				resumeBar($(this).find(".timerBar"));
				break;
			case "options":
				changeOptions($(this), options);
				break;
			case "isActive":
				return isActive($(this));
		}
		return this;
	}
	/*** primary functions ***/
	function createBar(obj, number, speed, complete){
		var html = "<div class='timerBar'>";
		for(var i=0; i<number; i++){
			html += "<span class='timer timer_"+i+"' style='color: #E5E5E5'>&#x220e;</span>";
		}
		html += "</div>";
		obj.html(html);
		var bar = $(".timerBar", obj);
		bar.data("timerBar_number", number);
		bar.data("timerBar_speed", speed);
		bar.data("timerBar_complete", complete);
		bar.data("timerBar_count", 0);
		bar.data("timerBar_running", false);
	}
	function startLoading(obj){
		var bar = $(".timerBar", obj);
		var number = bar.data("timerBar_number");
		var timer = setInterval(timerFn, bar.data("timerBar_speed"));
		bar.data("timerBar_timer", timer);
		bar.data("timerBar_running", true);

		function timerFn(){
			addOne(bar);
		}
	}
	function addOne(bar){
		var count = bar.data("timerBar_count");
		bar.find(".timer_"+(count)).css("color", "#749BC6");
		var number = bar.data("timerBar_number");
		bar.data("timerBar_count", count+1);
		if(count+1 >= number){
			bar.data("timerBar_running", false);
			clearInterval(bar.data("timerBar_timer"));
			var complete = bar.data("timerBar_complete");
			complete();
		}
	}
	function resetBar(obj){
		var bar = obj.find(".timerBar");
		clearInterval(bar.data("timerBar_timer"));
		bar.find(".timer").css("color", "#CCCCCC");
		bar.data("timerBar_count", 0);
		bar.data("timerBar_running", false);
	}
	function pauseBar(bar){
		clearInterval(bar.data("timerBar_timer"));
	}
	function resumeBar(bar){
		var timer = setInterval(timerFn, bar.data("timerBar_speed"));
		bar.data("timerBar_timer", timer);
		function timerFn(){
			addOne(bar);
		}
	}

	function isActive(obj){
		var bar = obj.find(".timerBar");
		return bar.data("timerBar_running");
	}

	function changeOptions(obj, options){
		var bar = obj.find(".timerBar");
		for(var i in options){
			changeOption(bar, i, options[i]);
		}
	}
	function changeOption(bar, label, value){
		switch(label){
			case "speed":
				pauseBar(bar);
				bar.data("timerBar_speed", value);
				if(bar.data("timerBar_running")){
					resumeBar(bar);
				}
				break;
			case "number":
				bar.data("timerBar_number", value);
				break;
		}
	}

	/*** secondary functions ***/

	/*** tertiary functions ***/
	function getOptions(options, label, defaultValue){
		if(!options || typeof options[label] == "undefined"){
			return defaultValue;
		}
		return options[label];
	}
})(jQuery);
