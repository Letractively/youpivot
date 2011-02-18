/*** Class tabinfo ***/

function createTabInfo(cObj){
	var t = {};
	t.title = cObj.title;
	t.url = cObj.url;
	t.focus = false;
	t.index = cObj.index;
	t.relativeIndex = false;
	t.window = cObj.wind;

	t.createTime = new Date().getTime();
	t.deathTime = 0;

	t.focusTime = 0;
	t.focusStart = 0;
	
	var obj = new TabInfo(t);
	obj.setFocus(cObj.focus);
	return obj;
}

function TabInfo(t){
	this.title = t.title;
	this.url = t.url;
	this.focus = t.focus;
	this.index = t.index;
	this.relativeIndex = t.relativeIndex;
	this.window = t.window;

	this.createTime = t.createTime;
	this.deathTime = t.deathTime;

	this.focusTime = t.focusTime;
	this.focusStart = t.focusStart;

	this.die = function(){
		this.setFocus(false);
		this.deathTime = new Date().getTime();
	}
	this.setFocus = function(focus){
		if(focus){
			this.focusStart = new Date().getTime();
			this.focus = true;
		}else{
			if(this.focusStart!==0){
				var ft = new Date().getTime() - this.focusStart;
				this.focusTime += ft;
			}
			focusStart = 0;
			this.focus = false;
		}
	}

	this.setSelection = function(focus){
		if(focus.window==this.window){
			this.relativeIndex = this.index - focus.index;
		}else{
			this.relativeIndex = false;
		}
	}

	this.getUrl = function(){ return this.url; }
	this.getAge = function(){
		//returns the age of the tab in milliseconds
		if(this.deathTime==0){
			return new Date().getTime() - this.createTime; 
		}else{
			return this.deathTime - this.createTime;
		}
	}
}

/*** end class tabinfo ***/
