//document.ready is too early. CSS width is not calculated yet
$(window).load(function(){
	if($(window).width()==0){
		//to fix that weird CSS bug in webkit where the width is occasionally rendered wrongly at first
		setTimeout("GraphManager.draw()", 100);
	}else{
		GraphManager.draw();
	}
});
