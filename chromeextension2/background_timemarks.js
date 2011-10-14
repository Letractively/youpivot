//FIXME encapsulate this


if(window.localStorage['initialized']!="true"){
   window.localStorage['initialized'] = "true";
   window.localStorage['geolocation'] = "true";
   window.localStorage['timemarksync'] = "false";
   window.localStorage['computer_id'] = jQuery.uuid();
   chrome.tabs.create({"url":chrome.extension.getURL('options.html#general')}); 
}

//correction for mistake reed made early on. Could be removed at somepoint
if(window.localStorage['geolocation'] == ""){
   window.localStorage['geolocation'] = "true";
}

if(window.localStorage['timemarksync'] == ""){
   window.localStorage['timemarksync'] = "false";
}

if(window.localStorage['computer_id'] == ""){
   window.localStorage['computer_id'] = jQuery.uuid();
}

//init
//connect and setup database
/* --------------------------------------------------- 
   Object Definitions
   --------------------------------------------------- */
//Page object 
function Page(title, url, favicon, windowNum, tabPosition, timeOpen) {
   this.title = title;
   this.url = url;
   this.favicon = favicon;
   this.window = windowNum;
   this.tabPosition = tabPosition;
   this.timeOpen = timeOpen;
   this.id = jQuery.uuid();
}

//timemark object
function TimeMark(description, pageArray,color,latitude,longitude){
   this.description = description;
   this.pageArray = pageArray;
   this.timestamp = new Date().getTime();
   this.id = jQuery.uuid();
   this.color = color;
   this.latitude = latitude;
   this.longitude = longitude;
   this.computer = window.localStorage['computer_id'];
}

function TabTrack(time){
   this.openTime = time;
}

/* --------------------------------------------------- 
   init
   --------------------------------------------------- */
database.open();
database.createTable();


//change the icon if developer mode
if(chrome.extension.getURL("/") != "chrome-extension://ojlhmjdbcecjagnlhignlhkoplpfpjop/"){
   chrome.browserAction.setIcon({"path":"timemarks/images/timeMarkMarks/timemark_32_blue.png"});
}
 



//add a listener to listen for requests
chrome.extension.onRequest.addListener(onRequest);
chrome.tabs.onCreated.addListener(newTab);
chrome.tabs.onUpdated.addListener(updateTab);
chrome.tabs.onRemoved.addListener(destroyTab);

//tab tracking
tabs = new Array();

/* --------------------------------------------------- 
   Functions
   --------------------------------------------------- */

function createNewTimeMark(description,color){
   //go through all the windows and all of their tabs and make new Page objects
   chrome.windows.getAll({populate: true},function(windows){
      //array to hold all the pages
      pageArray = new Array();
    
    
      for(i=0;i<windows.length;i++){
         var currentWindow = windows[i];
         for(j=0;j<currentWindow.tabs.length;j++){
            var currentTab = currentWindow.tabs[j];
            //check that it is a real tab
            if(currentTab.url.indexOf("chrome-devtools://") != 0 && currentTab.url.indexOf("chrome://") != 0 && currentTab.url.indexOf("chrome-extension://") != 0){
               var timenow = new Date();
               var timeOpen = null;
               if(tabs["_" + currentTab.id]){
                  timeOpen = timenow - tabs["_" + currentTab.id].openTime;
               }
               var page = new Page(currentTab.title, currentTab.url, currentTab.favIconUrl, currentTab.windowId, currentTab.index, timeOpen);
               pageArray.push(page);
            }
         }
      }
      var latitude = null;
      var longitude = null;
      if(window.localStorage['geolocation'] == "true"){
         navigator.geolocation.getCurrentPosition(function(position){
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            //create a new time mark object
            var timemark = new TimeMark(description,pageArray,color,latitude,longitude);
            database.addTimeMark(timemark);
         }, function(){
            var timemark = new TimeMark(description,pageArray,color,latitude,longitude);
            database.addTimeMark(timemark);
         });
      }else{
         var timemark = new TimeMark(description,pageArray,color,latitude,longitude);
         database.addTimeMark(timemark);
      }
   });
}


//open timemark view
function viewTimeMarks(){
   chrome.tabs.create({"url":chrome.extension.getURL('view.html#timemarks')});
}


//request handler
function onRequest(request, sender, callback){
   switch(request.action){
      case "addTimeMark":
         createNewTimeMark(request.description,request.color);
         callback({});
         break;
      case "viewTimeMarks":
         viewTimeMarks();
         callback({});
         break;
      case "initSync":
         initSync();
         break;
      case "destroySync":
         destroySync();
         break;
   }
}

//new tab
function newTab(tab){
   tabs["_" + tab.id] = new TabTrack(new Date());
}

//
function destroyTab(tab){
   delete tabs["_" + tab];
}

//
function updateTab(tab){
   if(tabs["_" + tab]){
      tabs["_" + tab].openTime = new Date();
   }else{
      tabs["_" + tab] = new TabTrack(new Date());
   }
}







/*** SYNC RELATED STUFF ***/
var oauth = ChromeExOAuth.initBackgroundPage({
  'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
  'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
  'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
  'consumer_key': 'anonymous',
  'consumer_secret': 'anonymous',
  'scope': 'https://spreadsheets.google.com/feeds/',
  'app_name': 'TimeMarks'
});



/* TEST */
getSync();




function initSync(){
   oauth.authorize(function() {
      //get list of worksheets
      oauth.sendSignedRequest("https://spreadsheets.google.com/feeds/spreadsheets/private/full/?title=TimeMarks&title-exact=true",function(response){
         var xmlDoc = $.parseXML(response);
         var $xml = $( xmlDoc );
         var resultCount = $xml.find("opensearch:totalresults").text();
         if(resultCount == 0){
            //need to create the spreadsheet
         }
         var entry = $xml.find("entry");
         window.localStorage["timemarks_spreadsheet"] = $(entry).find("link[rel='http://schemas.google.com/spreadsheets/2006#worksheetsfeed']").attr("href");
         
         //get the spreadsheet ids
         oauth.sendSignedRequest(window.localStorage["timemarks_spreadsheet"],function(response){
            var xmlDoc = $.parseXML(response);
            var $xml = $( xmlDoc );
            var entries = $xml.find("entry");
            for(i=0;i<entries.length;i++){
               var entry = entries[i];
               var title = $(entry).find("title").text();
               var link = $(entry).find("link[rel='http://schemas.google.com/spreadsheets/2006#listfeed']").attr("href");
               if(title == "TimeMarks"){
                  window.localStorage["timemarks_worksheet"] = link;
               }else if(title == "Pages"){
                  window.localStorage["pages_worksheet"] = link;
               }else if(title == "Computers"){
                  window.localStorage["computers_worksheet"] = link;
               }else if(title == "ChangeLog"){
                  window.localStorage["changeLog_worksheet"] = link;
               }
            }
            
            //add self to change log
             
         },null);
     },null);
   });
}

function destroySync(){
   oauth.clearTokens();
   delete window.localStorage["timemarks_spreadsheet"];
   delete window.localStorage["timemarks_worksheet"];
   delete window.localStorage["pages_worksheet"];
   delete window.localStorage["changeLog_worksheet"];
   delete window.localStorage["computers_worksheet"];
}




/* TESTING AREA */
function getSync(){
  var params = new Array();
  params["q"] = window.localStorage['computer_id'];
  sendSignedGetRequest(window.localStorage["computers_worksheet"],params,function(response){
      var xmlDoc = $.parseXML(response);
      var $xml = $( xmlDoc );
      var line = $xml.find('entry > changelogline').text();
      var params = new Array();
      params["start-index"] = line; 
      sendSignedGetRequest(window.localStorage["changeLog_worksheet"],params,function(response){
         var xmlDoc = $.parseXML(response);
         var $xml = $( xmlDoc );
         var items = $xml.find("entry");
         for(i=0;i<items.length;i++){
            var computer = $(items[i]).find("computer").text();
            if(computer !=  window.localStorage['computer_id']){
               var ids = $(items[i]).find("id");
               var id = $(ids[1]).text();
               var params = new Array();
               params["q"] = id;
               sendSignedGetRequest(window.localStorage["timemarks_worksheet"],params,function(response){
                  var xmlDoc = $.parseXML(response);
                  var $xml = $( xmlDoc );
                  var item = $xml.find("entry");
                  
                  //item details
                  var ids = $(items[i]).find("id");
                  var id = $(ids[1]).text();
                  
               });
               sendSignedGetRequest(window.localStorage["pages_worksheet"],params,function(response){
                  var xmlDoc = $.parseXML(response);
                  var $xml = $( xmlDoc );
                  var items = $xml.find("entry");
                  console.log(items.length);
                  for(i=0;i<items.length;i++){
                     var currentItem = items[i];
                     //console.log(currentItem);
                  }
               });
            }
         }
      });
      
   });
}

function sendTimeMark(id){
   getSync();
   database.db.transaction(function(tx){
      tx.executeSql("SELECT * FROM timemark WHERE id=?",[id],function(tx,results){
         var timemark = results.rows.item(0);
         var body = formatTimeMarkForGoogle(timemark);
         sendSignedPostRequest(window.localStorage["timemarks_worksheet"],body,function(){
            
         });
         tx.executeSql("SELECT * FROM page WHERE timemark_id=?",[id],function(tx,results){
            for(i=0;i<results.rows.length;i++){
               var item = results.rows.item(i);
               var body = formatPageForGoogle(item);
               sendSignedPostRequest(window.localStorage["pages_worksheet"],body,function(){

               });
            }
         });
         var changeBody = formatChangeLogForGoogle(id,"add");
         sendSignedPostRequest(window.localStorage["changeLog_worksheet"],changeBody,function(){
            
         });
      });
      tx.executeSql("UPDATE timemark SET synced='true' WHERE id=?",[id],function(){});
   });

}

function sendSignedPostRequest(url,body,callback){
   oauth.authorize(function(){
      var parameter = new Array();
      parameter["method"] = "post";
      parameter["body"] = body;
      parameter["headers"] = {"Content-Type":"application/atom+xml"};
      oauth.sendSignedRequest(url,callback,parameter);
   });
}


function sendSignedGetRequest(url,params,callback){
   var parameter = new Array();
   parameter["parameters"] = params;
   oauth.sendSignedRequest(url,callback,parameter);
}


function formatTimeMarkForGoogle(timemark){
   var body =  '<entry xmlns="http://www.w3.org/2005/Atom" xmlns:gsx="http://schemas.google.com/spreadsheets/2006/extended">';
       body += "<gsx:id>" + timemark.id + "</gsx:id>";
       body += "<gsx:timestamp>" + timemark.timestamp + "</gsx:timestamp>";
       body += "<gsx:description>" + timemark.description + "</gsx:description>";
       body += "<gsx:color>" + timemark.color + "</gsx:color>";
       body += "<gsx:latitude>" + timemark.latitude + "</gsx:latitude>";
       body += "<gsx:longitude>" + timemark.longitude + "</gsx:longitude>";
       body += "<gsx:computer>" + timemark.computer + "</gsx:computer>";
       body += "</entry>";
   return body;
}

function formatPageForGoogle(page){
   var body =  '<entry xmlns="http://www.w3.org/2005/Atom" xmlns:gsx="http://schemas.google.com/spreadsheets/2006/extended">';
       body += "<gsx:id>" + page.id + "</gsx:id>";
       body += "<gsx:timemarkid>" + page.timemark_id + "</gsx:timemarkid>";
       body += "<gsx:title>" + page.title + "</gsx:title>";
       body += "<gsx:url>" + page.url + "</gsx:url>";
       body += "<gsx:favicon>" + page.favicon + "</gsx:favicon>";
       body += "<gsx:window>" + page.window + "</gsx:window>";
       body += "<gsx:tabPosition>" + page.tabPosition + "</gsx:tabPosition>";
       body += "<gsx:timeOpen>" + page.timeOpen + "</gsx:timeOpen>";
       body += "</entry>";
   return body;
}

function formatChangeLogForGoogle(id,action){
   var body =  '<entry xmlns="http://www.w3.org/2005/Atom" xmlns:gsx="http://schemas.google.com/spreadsheets/2006/extended">';
       body += "<gsx:id>" + id + "</gsx:id>";
       body += "<gsx:action>" + action + "</gsx:action>";
       body += "<gsx:computer>" + window.localStorage['computer_id'] + "</gsx:computer>";
       body += "</entry>";
   return body;
}
