$(function(){
	//initialize
	setUseAlert(getOption("useAlerts"));

	/*** model: events ***/
	$("#useAlerts").change(function(){
		var value = $(this).attr("checked");
		setOption("useAlerts", value);
	});
	/*** end model: events ***/
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
