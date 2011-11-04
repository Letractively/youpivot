// JavaScript Document
/*
function redirect_timeMarks(){
	window.location = (window.location+"").split("#")[0]+"#timemarks";
}
function redirect_history(){
	window.location = (window.location+"").split("#")[0]+"#history";
}
function redirect_geo(){
	window.location = (window.location+"").split("#")[0]+"#geolocation";
}

function navBar_clickTimeMarks(){
	navBar_show_timeMarks();
}

function navBar_clickTraditionalHistory(){
	navBar_show_TraditionalHistory();
}

function navBar_hide_TraditionalHistory(){
	$("#icon_settingsTitle_traditionalHistory").css("display","none");
	$("#navBar_traditional_history").removeClass( 'navbar-item-selected' );
	$("#bodyCopy_history").css("display","none");
	$("#navbar_filters_traditionalHistory").css("display","none");
}
function navBar_hide_timeMarks(){
	$("#icon_settingsTitle_timeMark").css("display","none");
	$("#navBar_timeMarks").removeClass( 'navbar-item-selected' );
	$("#bodyCopy_timeMarks").css("display","none");
	$("#navbar_filters_timeMarks").css("display","none");
}
function navBar_hide_timeMarkGeo(){
	$("#bodyCopy_geo").css("display","none");
	$("#navBar_geo").removeClass( 'navbar-item-selected' );
	$("#icon_settingsTitle_geo").css("display","none");
}


function navBar_show_TraditionalHistory(){
	$("#icon_settingsTitle_traditionalHistory").css("display","block");
	$("#navBar_traditional_history").addClass( 'navbar-item-selected' );
	$("#bodyCopy_history").css("display","block");
	$("#navbar_filters_traditionalHistory").css("display","block");
	//favicon.change("images/historyClock.png");
	
}
function navBar_show_timeMarks(){
	$("#icon_settingsTitle_timeMark").css("display","block");
	$("#navBar_timeMarks").addClass( 'navbar-item-selected' );
	$("#bodyCopy_timeMarks").css("display","block");
	$("#navbar_filters_timeMarks").css("display","block");
	//favicon.change("images/timeMarkClock/clockface_48.png");
}
function navBar_show_timeMarkGeo(){
	$("#bodyCopy_geo").css("display","block");
	$("#navBar_geo").addClass( 'navbar-item-selected' );
	$("#icon_settingsTitle_geo").css("display","block");
	//favicon.change("images/geo.png");
}


function getVersion(callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', 'manifest.json');
        xmlhttp.onload = function (e) {
            var manifest = JSON.parse(xmlhttp.responseText);
            callback(manifest.version);
        }
        xmlhttp.send(null);
	}

function setVersionNumber(){ 
    return; // FIXME
	getVersion(function (ver) {
		$("#version").html("Alpha (v "+ver+")");
	
	});
	
}
*/