$(function(){
	//initialize
	setUseAlert(PrefManager.getOption("useAlerts"));

	/*** model: events ***/
	$("#useAlerts").change(function(){
		var value = $(this).attr("checked");
		PrefManager.setOption("useAlerts", value);
	});
	/*** end model: events ***/
	
	$(".sideTab").click(function(){
		$(".sideTab").removeClass("selected");
		$(this).addClass("selected");
		var id = $(this).attr("id");
		var item = id.substr(id.indexOf("tab_")+4);
		$(".tabViews").hide();
		$("#tabView_"+item).show();
	}).mousedown(function(){
		$(this).addClass("active");
	}).mouseup(function(){
		$(this).removeClass("active");
	}).mouseout(function(){
		$(this).removeClass("active");
	});
});


/*** view ***/
function setUseAlert(value){
	setCheckbox($("#useAlerts"), value);
}

function setCheckbox(obj, value){
	if(value)
		obj.attr("checked", "checked");
	else
		obj.removeAttr("checked");
}
/*** end view ***/
