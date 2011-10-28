var noFaviconImg = null;
var noFaviconImg_base64 = null;
var noFaviconImg_base64_hash = null;

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function checkNoFaviconObject(){
	if(noFaviconImg == null){
		noFaviconImg = new Image();
		noFaviconImg.src = 'timemarks/images/noFavicon.png';
		noFaviconImg_base64 = getBase64Image(noFaviconImg);
		noFaviconImg_base64_hash = hex_md5(noFaviconImg_base64);		
	}
}


function findIdealFavicon(url, title, explicitFavIconUrl){
	
	checkNoFaviconObject();
	
	var explicitFavIconUrlImg = new Image();
	explicitFavIconUrlImg.src = explicitFavIconUrl;
	var explicitFavIconUrlImg_base64 = getBase64Image(explicitFavIconUrlImg);
	var explicitFavIconUrlImg_base64_hash = hex_md5(explicitFavIconUrlImg_base64);

	if (noFaviconImg_base64_hash == explicitFavIconUrlImg_base64_hash){
	    //console.log("BAD FAVICON (1) = "+title);
		
	    return findIdealFavicon_noExplicitFavicon(url,title);
	}else{
		//console.log("*** FAVICON (1)= "+title);
		return new Array(url,explicitFavIconUrl,explicitFavIconUrlImg_base64_hash,explicitFavIconUrlImg_base64,explicitFavIconUrlImg);
	}
	
}

function findIdealFavicon_noExplicitFavicon(url,title){	
	
	checkNoFaviconObject();
	
	var chromefavIconUrl = 'chrome://favicon/'+url;
	
	var chromeFavIconUrlImg = new Image();
	chromeFavIconUrlImg.src = chromefavIconUrl;
	var chromeFavIconUrlImg_base64 = getBase64Image(chromeFavIconUrlImg);
	var chromeFavIconUrlImg_base64_hash = hex_md5(chromeFavIconUrlImg_base64);
	
	if (noFaviconImg_base64_hash == chromeFavIconUrlImg_base64_hash){
	    //console.log("BAD FAVICON (2)= "+title);
	    //console.log("\t"+chromefavIconUrl);
		//console.log(chromeFavIconUrlImg);
	    return findIdealFavicon_noExplicitFavicon_nofullURLInternal(url,title);
	}else{
		//console.log("*** FAVICON (2)= "+title);
		return new Array(url,chromefavIconUrl,chromeFavIconUrlImg_base64_hash,chromeFavIconUrlImg_base64,chromeFavIconUrlImg);
	}	
}

function findIdealFavicon_noExplicitFavicon_nofullURLInternal(url,title){	
	
	checkNoFaviconObject();
	var doubleLineSplit = url.split("//");
	var extractedDomain = doubleLineSplit[1].split("/")[0];
	var chromefavIconUrl = 'chrome://favicon/'+doubleLineSplit[0]+"//"+extractedDomain;
	
	var chromeFavIconUrlImg = new Image();
	chromeFavIconUrlImg.src = chromefavIconUrl;
	var chromeFavIconUrlImg_base64 = getBase64Image(chromeFavIconUrlImg);
	var chromeFavIconUrlImg_base64_hash = hex_md5(chromeFavIconUrlImg_base64);
	
	if (noFaviconImg_base64_hash == chromeFavIconUrlImg_base64_hash){
	    //console.log("BAD FAVICON (3)= "+title);
	    
	    return findIdealFavicon_noExplicitFavicon_nofullURLInternal_noInternalChromeFavicon(url,title);
	}else{
		return new Array(url,chromefavIconUrl,chromeFavIconUrlImg_base64_hash,chromeFavIconUrlImg_base64,chromeFavIconUrlImg);
	}	
}

function findIdealFavicon_noExplicitFavicon_nofullURLInternal_noInternalChromeFavicon(url,title){
	
	checkNoFaviconObject();
	var doubleLineSplit = url.split("//");
	var extractedDomain = doubleLineSplit[1].split("/")[0];
	var s2favIconUrl = 'http://www.google.com/s2/favicons?domain='+extractedDomain;
	
	var s2FavIconUrlImg = new Image();
	s2FavIconUrlImg.src = s2favIconUrl;
	var s2FavIconUrlImg_base64 = getBase64Image(s2FavIconUrlImg);
	var s2FavIconUrlImg_base64_hash = hex_md5(s2FavIconUrlImg_base64);
	
	if (noFaviconImg_base64_hash == s2FavIconUrlImg_base64_hash){
	    //console.log("BAD FAVICON (4)= "+title);
	    return new Array(url,s2favIconUrl,s2FavIconUrlImg_base64_hash,s2FavIconUrlImg_base64,s2FavIconUrlImg);
	}else{
		//console.log("*** FAVICON (4)= "+title);
		return new Array(url,s2favIconUrl,s2FavIconUrlImg_base64_hash,s2FavIconUrlImg_base64,s2FavIconUrlImg);
	}
}
