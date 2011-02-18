$(function(){
	chrome.extension.sendRequest({action: "getCurrent"}, function(tInfo){
		write("Current URL: "+tInfo.url);
		var createDate = new Date(tInfo.createTime);
		write("Created: "+createDate.toLocaleTimeString()+" ("+Math.floor((new Date().getTime() - createDate.getTime())/1000)+" seconds ago)");

		var focusDate = new Date(tInfo.focusStart);
		var currentFocusTime = Math.floor((new Date().getTime() - focusDate.getTime())/1000);
		if(tInfo.focus){
			write("Focused: "+focusDate.toLocaleTimeString()+" ("+currentFocusTime+" seconds ago)");
		}else{
			write("Focused: false");
		}
		write("Accumulated focus time: "+(Math.floor(tInfo.focusTime/1000)+currentFocusTime)+" seconds");
		write("TabIndex: "+tInfo.index);
		write("Relative Tab index: "+tInfo.relativeIndex);
		write("Window ID: "+tInfo.window);
		write("Importance: "+tInfo.importance);
	});
});

function write(text){
	$("#output").append(text+"<br />");
}
