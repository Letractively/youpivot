///THIS ISNT THE REAL ONE!!!!!!
///use options/js/timemarks.js


// JavaScript Document
function getAllTimeMarks(){
   database.db.transaction(function(tx){
      tx.executeSql("SELECT * FROM timemark ORDER BY timestamp DESC",[],printTimeMarks);
   });
}

function getColorTimeMarks(color){
   database.db.transaction(function(tx){
      tx.executeSql("SELECT * FROM timemark WHERE color=? ORDER BY timestamp DESC",[color],printTimeMarks);
   });
}

function deleteTimeMarkPage(id){
   database.db.transaction(function(tx){
      tx.executeSql("DELETE FROM page WHERE id=?",[id],function(tx,results){
         
      });
   });
}


function printTimeMarks(tx,result){
   TMDomainManager.clearDomains();
   $("#bodyCopy_timeMarks").html("");
   var lastdate = null;
   for(i=0;i<result.rows.length;i++){
      var item = result.rows.item(i);
      (function(item){
         tx.executeSql("SELECT * FROM page WHERE timemark_id=?",[item.id],function(tx,result){
            var timestamp = new Date(item.timestamp);
            if(lastdate != timestamp.format("dddd, mmmm d, yyyy")){
               $("#bodyCopy_timeMarks").append("<div class='day'>" + timestamp.format("dddd, mmmm d, yyyy") + "</div>");
               lastdate = timestamp.format("dddd, mmmm d, yyyy");
            }
            var string = printTimeMark(item,result.rows);
            $("#bodyCopy_timeMarks").append(string);
            console.log("display thing");
            TMDomainManager.display();
         });
      })(item);
   }
}


function printTimeMark(item,rows){
  var string = "<div class='entry' id='timemark-"+item.id+"'>";
  var timestamp = new Date(item.timestamp);
  string += "<div class='timeMarkHeader'>"
  string += "<div class='time'>" + timestamp.format("shortTime") + "</div>";
  string += "<a onclick=\"openPageBox('#timemark-"+ item.id  +"');\" class='description'><img class='timeMarkIcon' src='images/timeMarkMarks/timemark_32_" + item.color  + ".png' width='16' height='16' />";
  string += "<span class='timeMarkDescription'>" + item.description + "</span>";
  if(item.latitude != null){
     string += "<span class='timeMarkLocation'>"+ item.latitude + ", " + item.longitude+"</span>";
  }
  string += "</a></div>";//timeMarkHeader
  string += "<div class='pages-box'>";
  string += "<div class='timemark-window top-window'>";
  var currentWindow = rows.item(0).window;
  for(i=0;i<rows.length;i++){
     var item = rows.item(i);
     THDomainManager.addDomain("chrome://favicon/"+item.url, item.domain);
     if(item.window != currentWindow){
        string += "</div><div class='timemark-window'>";
        currentWindow = item.window;
     }
      var favicon = item.favicon;
      if(favicon=="undefined"){
         favicon = "http://www.google.com/s2/favicons?domain=" + item.url
      }
      string += "<div class='title'><a href='" + item.url + "' style=\"background-image:url('" + favicon + "')\" class='title'>" + item.title + "</a>";

      var timeOpen = new Date(item.timeOpen);

      string += " <span class='timeOpen'> - open " + timeOpen.getMinutes() + " minutes";
      string += " <span class='deletePage'><a href='javascript:deleteTimeMarkPage(\"" + item.id + "\");'>Delete</a></span>";
      string += "</div>";
   }
   string += "</div>";
   string += "</div>";
   string += "</div>";
      return string;
}

function formatDate(date){
   return date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear()
}

function formatTime(date){
   return date.getHours() + ":" + date.getMinutes();
}

function openPageBox(id){
   $(id).toggleClass("open");
}

//calculate the distance between two coordinates
function calcDistance(lon1,lat1,lon2,lat2){
   var R = 6371*.621371192; //miles
   var dLat = (lat2-lat1).toRad();
   var dLon = (lon2-lon1).toRad();
   var lat1 = lat1.toRad();
   var lat2 = lat2.toRad();

   var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
           Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
   var d = R * c;
   return d;
}
