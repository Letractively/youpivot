function initView(){
   var currentView = window.location.hash;
   if(currentView == "#timemarks"){
      navBar_clickTimeMarks();
   }else if(currentView == "#history"){
      navBar_clickTraditionalHistory();
   }else if(currentView == "#geolocation"){
      navBar_clickGeo();
   }else if(currentView == "#general"){
      navBar_clickGeneral();
   }else if(currentView == "#changelog"){
	  navBar_clickChangeLog();
   }else if(currentView == "#youpivot"){
		  navBar_clickYouPivot();
   }
   
   favicon.change("images/box0.png");
}
$(window).bind( 'hashchange', function(e) {
   initView();
});


function getVersion(callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', '/manifest.json');
        xmlhttp.onload = function (e) {
            var manifest = JSON.parse(xmlhttp.responseText);
            callback(manifest.version);
        };
        xmlhttp.send(null);
	}

function setVersionNumber(){ 
	getVersion(function (ver) {
		$("#version").html("YouPivot (v "+ver+")");
	
	});
	
}

function navBar_onLoad(){
	//navBar_clickTimeMarks();
	//navBar_clickGeneral();
	redirect_general();
	
}

function openWebpage(targetUrl) {
  chrome.tabs.create({
    selected: true,
    url: targetUrl
  });
  return false;
}

function redirect_general(){
	window.location = (window.location+"").split("#")[0]+"#general";
}
function redirect_timeMarks(){
	window.location = (window.location+"").split("#")[0]+"#timemarks";
}
function redirect_youpivot(){
	window.location = (window.location+"").split("#")[0]+"#youpivot";
}
function redirect_history(){
	window.location = (window.location+"").split("#")[0]+"#history";
}
function redirect_geo(){
	window.location = (window.location+"").split("#")[0]+"#geolocation";
}
function redirect_changeLog(){
	window.location = (window.location+"").split("#")[0]+"#changelog";
}

function navBar_unClick(){
	navBar_hide_general();
	navBar_hide_timeMarkGeo();	
	navBar_hide_TraditionalHistory();
	navBar_hide_timeMarks();
	navBar_hide_ChangeLog();
	navBar_hide_YouPivot();
}

function navBar_clickGeneral(){
	
	navBar_unClick();navBar_show_general();
	//document.title = "Options";
}

function navBar_clickTimeMarks(){
	
	navBar_unClick();navBar_show_timeMarks();
	//document.title = "Options: TimeMarks";
}

function navBar_clickTraditionalHistory(){
	
	navBar_unClick();navBar_show_TraditionalHistory();
	//document.title = "Options: Web History";
}

function navBar_clickGeo(){
	
	navBar_unClick();navBar_show_timeMarkGeo();
	//document.title = "Option: GeoLocation";
}

function navBar_clickChangeLog(){
	
	navBar_unClick();navBar_show_ChangeLog();
	//document.title = "Option: ChangeLog";
}

function navBar_clickYouPivot(){
	
	navBar_unClick();navBar_show_YouPivot();
	//document.title = "Option: ChangeLog";
}


function navBar_hide_TraditionalHistory(){
	$("#navBar_traditional_history").removeClass( 'navbar-item-selected' );
	$("#m-tabView_options #bodyCopy_history").css("display","none");
}
function navBar_hide_timeMarks(){
	$("#navBar_timeMarks").removeClass( 'navbar-item-selected' );
    $("#m-tabView_options #bodyCopy_timeMarks").css("display","none");
}
function navBar_hide_timeMarkGeo(){
	$("#m-tabView_options #bodyCopy_geo").css("display","none");
	$("#navBar_geo").removeClass( 'navbar-item-selected' );
}
function navBar_hide_general(){
	$("#m-tabView_options #bodyCopy_general").css("display","none");
	$("#navBar_general").removeClass( 'navbar-item-selected' );
}

function navBar_hide_ChangeLog(){
	$("#m-tabView_options #bodyCopy_changeLog").css("display","none");
	$("#m-tabView_options #navBar_changeLog").removeClass( 'navbar-item-selected-gray' );
	changeLog_hideAll();
}

function navBar_hide_YouPivot(){
	$("#m-tabView_options #navBar_youPivot").removeClass( 'navbar-item-selected' );
	$("#m-tabView_options #bodyCopy_youPivot").css("display","none");
}

function navBar_show_YouPivot(){
	$("#m-tabView_options #navBar_youPivot").addClass( 'navbar-item-selected' );
		$("#m-tabView_options #bodyCopy_youPivot").css("display","block");
}

function navBar_show_TraditionalHistory(){
	$("#navBar_traditional_history").addClass( 'navbar-item-selected' );
	$("#m-tabView_options #bodyCopy_history").css("display","block");
}
function navBar_show_timeMarks(){
	$("#navBar_timeMarks").addClass( 'navbar-item-selected' );
	$("#m-tabView_options #bodyCopy_timeMarks").css("display","block");
}
function navBar_show_timeMarkGeo(){
	$("#m-tabView_options #bodyCopy_geo").css("display","block");
	$("#navBar_geo").addClass( 'navbar-item-selected' );	
}
function navBar_show_general(){
	$("#m-tabView_options #bodyCopy_general").css("display","block");
	$("#navBar_general").addClass( 'navbar-item-selected' );
}
function navBar_show_ChangeLog(){
	$("#navBar_changeLog").addClass( 'navbar-item-selected-gray' );
	$("#m-tabView_options #bodyCopy_changeLog").css("display","block");
	changeLog_showAll();
}

$(function(){
    setVersionNumber();
    initOptions();
    initView();
});
