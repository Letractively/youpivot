var PageFlipper = {};

(function(){
	var m = PageFlipper;
	var enabled = true;

	//initialization
	$(function(){
		$(document).scrollTop($("#topPageFlipper").height());
		//initialize the timer bars
		$("#topPageFlipper .flip").timerBar("create", {complete: doScrollNew, speed: 100, number: 20});
		$("#bottomPageFlipper .flip").timerBar("create", {complete: doScrollOld, speed: 100, number: 20});
	});

	function disable(){
		enabled = false;
		$(".pageFlipper").hide();
	}

	function enable(){
		enabled = true;
		$(".pageFlipper").show();
	}

	//disable on search
	$("#searchResults").bind("search", function(e, active){
		if(active){
			disable();
			$(document).scrollTop(0);
		}else{
			enable();
			scrollHideFlipper(0);
		}
	});

	$(window).resize(onresize);
	$("#graphShadow").bind("resize", onresize);
	function onresize(e){
		var mHeight = window.innerHeight - $("#graphShadow").height();
		$("#textContent").css("min-height", mHeight);
		m.hideFlipper();
	}
	m.hideFlipper = function(){
		scrollHideFlipper(0);
	}

	$(document).mouseenter(function(e){
		if(!enabled) return;
		stopFlipAndScroll();
	});
	$("#topPageFlipper").mouseenter(function(e){
		pauseFlip("top");
	}).mouseleave(function(e){
		resumeFlip("top", doScrollNew);
	}).click(stopFlipAndScroll);
	$("#bottomPageFlipper").mouseenter(function(e){
		pauseFlip("bottom");
	}).mouseleave(function(e){
		resumeFlip("bottom", doScrollOld);
	}).click(function(e){
		stopFlipAndScroll();
	});
	$(document).mousewheel(function(e, delta){
		if(!enabled) return;
		if(atTop(1) && delta<0){
			stopFlip("top");
			scrollHideFlipper(100);
			e.preventDefault();
		}
		if(atBottom(1) && delta>0){
			stopFlip("bottom");
			scrollHideFlipper(100);
			e.preventDefault();
		}
	});
	$(document).scroll(function(e){
		if(!enabled) return; //do nothing if disabled
		if(atTop(2)){
			startFlip("top");
		}else{
			stopFlip("top");
		}
		if(atBottom(2)){
			startFlip("bottom");
		}else{
			stopFlip("bottom");
		}
	});
	function doScrollNew(){
		var topItem = $("#textContent tr.item:visible").first();
		scrollNewer();
		resetFlipButton($("#topPageFlipper"));
		$("#topPageFlipper .flip").timerBar("reset");
		$(document).scrollTop(topItem.offset().top - $("#graphShadow").height() - 107);
		scrollHideFlipper(500);
	}
	function doScrollOld(){
		scrollOlder();
		resetFlipButton($("#bottomPageFlipper"));
		$("#bottomPageFlipper .flip").timerBar("reset");
		scrollHideFlipper(500);
	}
	function scrollHideFlipper(duration){
		var flipperHeight = $("#topPageFlipper").outerHeight()+6;
		if(atTop(1)){
			$("body").animate({"scrollTop": flipperHeight}, duration);
		}else if(atBottom(1)){
			$("body").animate({"scrollTop": $("body")[0].scrollHeight - $("body").height() - flipperHeight}, duration);
		}
	}
	function resetFlipButton(button){
		button.removeClass("active");
		button.find(".label").text("Load more items");
	}
	var mousepos = {};
	function startFlip(dir){
		var flipper = $("#"+dir+"PageFlipper");
		$(".flip", flipper).timerBar("reset");
		$(".flip", flipper).timerBar("start");
		flipper.addClass("active");
		$(".label", flipper).text("Loading more items....");
		//cancel on move
		mousepos.x = undefined, mousepos.y = undefined;
		if(pref("stopFlipOnMove")){
			$(document).mousemove(mousemoveHandler);
		}
	}
	function mousemoveHandler(e){
		if(typeof mousepos.x == "undefined"){
			mousepos.x = e.pageX;
			mousepos.y = e.pageY;
			return;
		}
		if(Math.abs(e.pageX - mousepos.x) > 10 || Math.abs(e.pageY - mousepos.y) > 10){
			stopFlipAndScroll();
		}
	}
	function stopFlipAndScroll(){
		stopFlip("all");
		scrollHideFlipper(100);
	}
	function stopFlip(dir){
		if(dir=="all"){
			stopFlip("top");
			stopFlip("bottom");
			return;
		}
		var flipper = $("#"+dir+"PageFlipper");
		var flip = $(".flip", flipper);
		if(flip.timerBar("isActive")){
			flip.timerBar("options", {speed: 100}).timerBar("reset");
			resetFlipButton(flipper);
			$(document).unbind("mousemove");
		}
	}
	function pauseFlip(dir){
		$("#"+dir+"PageFlipper .flip").timerBar("options", {speed: 750});
	}
	function resumeFlip(dir, callback){
		$("#"+dir+"PageFlipper .flip").timerBar("options", {speed: 100});
	}
	// level 1 - page flipper is visible; 2 - at the very top of document
	function atTop(level){
		var scrollTop = $(document).scrollTop();
		if(level==1){
			var flipperHeight = $("#topPageFlipper").outerHeight();
			return scrollTop < flipperHeight;
		}else if(level==2){
			return scrollTop == 0;
		}
	}
	function atBottom(level){
		var scrollTop = $(document).scrollTop();
		var maxScrollTop = $("body")[0].scrollHeight - $("body").height();
		if(level==1){
			var flipperHeight = $("#bottomPageFlipper").outerHeight();
			return scrollTop > maxScrollTop - flipperHeight;
		}else if(level==2){
			return scrollTop == maxScrollTop;
		}
	}
	function scrollOlder(){
		var graphPos = GraphManager.getGraphPos();
		if(graphPos.offset<=0) return;
		var scrollScale = pref("scrollScale");
		var scrollMethod = pref("scrollMethod");
		if(scrollMethod == "expand"){
			GraphManager.setSelectionScale(graphPos.offset-scrollScale, graphPos.scale+scrollScale);
		}else if(scrollMethod == "move"){
			GraphManager.setSelectionScale(graphPos.offset-scrollScale, graphPos.scale);
		}else{
			console.log("scrolling method in preferences not recognized. ");
		}
		$("#textContent").itemTable("refreshTopRows");
	}
	function scrollNewer(){
		var graphPos = GraphManager.getGraphPos();
		if(graphPos.offset + graphPos.scale >= 1) return;
		var scrollScale = pref("scrollScale");
		var scrollMethod = pref("scrollMethod");
		if(scrollMethod == "expand"){
			GraphManager.setSelectionScale(graphPos.offset, graphPos.scale+scrollScale);
		}else if(scrollMethod == "move"){
			GraphManager.setSelectionScale(graphPos.offset+scrollScale, graphPos.scale);
		}else{
			console.log("scrolling method in preferences not recognized. ");
		}
		$("#textContent").itemTable("refreshTopRows");
	}
})();
