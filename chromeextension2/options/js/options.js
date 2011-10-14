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
}

function navBar_clickGeneral(){
	
	navBar_unClick();navBar_show_general();
	document.title = "Options";
}

function navBar_clickTimeMarks(){
	
	navBar_unClick();navBar_show_timeMarks();
	document.title = "Options: TimeMarks";
}

function navBar_clickTraditionalHistory(){
	
	navBar_unClick();navBar_show_TraditionalHistory();
	document.title = "Options: Web History";
}

function navBar_clickGeo(){
	
	navBar_unClick();navBar_show_timeMarkGeo();
	document.title = "Option: GeoLocation";
}

function navBar_clickChangeLog(){
	
	navBar_unClick();navBar_show_ChangeLog();
	document.title = "Option: ChangeLog";
}


function navBar_hide_TraditionalHistory(){
	$("#navBar_traditional_history").removeClass( 'navbar-item-selected' );
	$("#bodyCopy_history").css("display","none");
}
function navBar_hide_timeMarks(){
	$("#navBar_timeMarks").removeClass( 'navbar-item-selected' );
	$("#bodyCopy_timeMarks").css("display","none");
}
function navBar_hide_timeMarkGeo(){
	$("#bodyCopy_geo").css("display","none");
	$("#navBar_geo").removeClass( 'navbar-item-selected' );
}
function navBar_hide_general(){
	$("#bodyCopy_general").css("display","none");
	$("#navBar_general").removeClass( 'navbar-item-selected' );
}


function navBar_show_TraditionalHistory(){
	$("#navBar_traditional_history").addClass( 'navbar-item-selected' );
	$("#bodyCopy_history").css("display","block");
}
function navBar_show_timeMarks(){
	$("#navBar_timeMarks").addClass( 'navbar-item-selected' );
	$("#bodyCopy_timeMarks").css("display","block");
}
function navBar_show_timeMarkGeo(){
	$("#bodyCopy_geo").css("display","block");
	$("#navBar_geo").addClass( 'navbar-item-selected' );	
}
function navBar_show_general(){
	$("#bodyCopy_general").css("display","block");
	$("#navBar_general").addClass( 'navbar-item-selected' );
}
