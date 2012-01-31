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

function toggleTimemarksEdit(){
   if($("#timemarksEditButton input").prop('value') == "Edit"){
      $(".deletePage").show();
      $("#timemarksEditButton input").prop('value', 'Done');
   }else{
      $(".deletePage").hide();
      $("#timemarksEditButton input").prop('value', 'Edit');
   }
}

function deleteTimeMarkPage(id){
   database.db.transaction(function(tx){
      tx.executeSql("DELETE FROM page WHERE id=?",[id],function(tx,results){
         $("#timemark-page-"+id).remove();
      });
   });
}

function deleteTimeMark(id){
   database.db.transaction(function(tx){
      tx.executeSql("DELETE FROM page WHERE timemark_id=?",[id],function(tx,results){
         tx.executeSql("DELETE FROM timemark where id=?",[id],function(tx,results){
            $("#timemark-"+id).remove();
         });
      });
   });
}

function reopenTimemark(id){
   console.log("reopen: "+id);
   chrome.extension.sendRequest({
         'action' : 'reopenTimemark',
         'id': id
     },function(response){
         
   });
     
}


function printTimeMarks(tx,result){
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
  string += "</a>";//timeMarkHeader
  string += " <span class='deletePage'><a href='javascript:deleteTimeMark(\"" + item.id + "\");'>Delete</a></span>";
  string += "<a href='javascript:reopenTimemark(\"" + item.id + "\");'>Reopen</a></span>"
  string += "</div>";
  string += "<div class='pages-box'>";
  string += "<div class='timemark-window'>";
  var currentWindow = rows.item(0).window;
  for(i=0;i<rows.length;i++){
     var item = rows.item(i);
     if(item.window != currentWindow){
        string += "</div><div class='timemark-window'>";
        currentWindow = item.window;
     }
      var favicon = item.favicon;
      if(favicon=="undefined"){
         favicon = "http://www.google.com/s2/favicons?domain=" + item.url
      }
      
      var domain = getDomain(item.url);
      string += "<div class='title domain-"+domain+"' id='timemark-page-"+item.id+"'><a href='" + item.url + "' style=\"background-image:url('" + favicon + "')\" class='title'>" + item.title + "</a>";

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

function getDomain(url)
{
   return url.match(/:\/\/(www\.)?(.[^/:]+)/)[2];
}