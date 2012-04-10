// JavaScript Document

function navBar_show_ChangeLog_empty(){
	$("#bodyCopy_changeLogContent").empty(); //clear out old data
}

function changeLog_hideAll(){

	navBar_show_ChangeLog_empty();
}

function changeLog_addVersion(theVersion,theDate){
	$("#bodyCopy_changeLogContent").append('<div class="changeLogVersion">'+theVersion+'<div class="changeLogDate">'+theDate+'</div></div>');
}

function changeLog_addUpdate(updateType,associatedPart,description){
	$("#bodyCopy_changeLogContent").append('<div class="changeLog_Update">'+
												'<div class="changeLogElement changeLog_UpdateType changeLog_UpdateType_'+updateType+'">'+updateType+'</div>'+
												'<div class="changeLogElement changeLog_UpdateAssociation changeLog_UpdateAssociation_'+associatedPart+'">'+associatedPart+'</div>'+
												'<div class="changeLogElement changeLog_UpdateDescription">'+description+'</div>'+
											'</div>');
}

function changeLog_addFix(associatedPart,description){
	changeLog_addUpdate("fixed",associatedPart,description);
}
function changeLog_addChange(associatedPart,description){
	changeLog_addUpdate("changed",associatedPart,description);
}
function changeLog_addNew(associatedPart,description){
	changeLog_addUpdate("new",associatedPart,description);
}

function changeLog_showAll(){

	
	navBar_show_ChangeLog_empty();
    changeLog_addVersion("Beta 0.3", "Wednesday, Feb 29, 2012");
	changeLog_addChange("history","History page now supports terms filters");
	
	changeLog_addVersion("Alpha 0.0.11","Friday, May 20, 2011");
	changeLog_addChange("general","TimeMarks now replaces chrome's default history");
	changeLog_addChange("timeMarks","TimeMarks database now setup for versioning");
	changeLog_addChange("timeMarks","Favicon Pulled from interal Chrome Database");
	changeLog_addChange("timeMarks","Now grouped by window by vertical line");
	changeLog_addChange("general","Version number printed is now auto detected");
	changeLog_addChange("general","When user switches between TimeMarks, History, and Location Labels icons shift");
	changeLog_addNew("history","TimeMarks now displays the user's full chrome history");
	changeLog_addNew("history","History Events in Traditional History View with the same timeStamp are replaced by vertical line");
	changeLog_addNew("general","Options Page Now Exists");
	changeLog_addNew("general","Changelog now in Options Page");
	changeLog_addNew("general","Option Page now have link to homepage");
	changeLog_addNew("general","Added General Information Page with key features and additional features list");
	changeLog_addNew("geo","Now Logging GeoLocation");
	changeLog_addNew("geo","Enable/Disable Geo Logging option now in options page");
	changeLog_addFix("general","When Extension updates, correctly loads options start page");
	
	changeLog_addVersion("Alpha 0.0.4","Sunday, May 8, 2011");
	changeLog_addNew("timeMarks","Multiple Colored TimeMarks");
	changeLog_addNew("timeMarks","Can Add TimeMark Description");
	changeLog_addNew("timeMarks","TimeMarks Stored in Internal Database");
	changeLog_addNew("timeMarks","Favicon Pulled from tabs");
	changeLog_addNew("timeMarks","Keep Track of Open Time");
}

