$(function(){
	$("#saveBtn").click(function(){
		var description = $("#description").val();
		if(description==""){
			alert("Please enter a description");
			return;
		}
		TimeMarkManager.add(description);
	});
	$("#cancelBtn").click(function(){
		window.close();
	});
});