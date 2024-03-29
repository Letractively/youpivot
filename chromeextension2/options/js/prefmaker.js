/**

  Create views or widgets to toggle certain preference values. 

**/

var PrefMaker = {};

(function(){
	var m = PrefMaker;

    m.makeBooleanCheckbox = function(key, label, secondLine){
        if(typeof secondLine == "string"){
            label = createTwoLineBox(label, secondLine);
        }
        var div = $('<div class="PMcheckbox"></div>');
        var box = $('<input id="PMcheckbox_'+key+'" type="checkbox" />');
        var label = $('<label for="PMcheckbox_'+key+'">'+label+'</label>');
        div.append(box).append(label);
        box.click(updateOption);
        label.click(updateOption);
        updateView();

        PrefManager.onPreferenceChanged(key, function(pair){
            if(!prefChange)
                updateView();
            prefChange = false;
        });

        var prefChange = false;
        function updateOption(){
            prefChange = true;
            PrefManager.setOption(key, box.prop("checked"));
        }
        function updateView(){
            box.attr("checked", pref(key)); // convert to string to comply with HTML (otherwise error thrown);
        }

        return div;
    }

    m.makeSlider = function(key, label, max, min){
        var div = $('<div class="PMslider"></div>');
        var slider = $('<input type="range" id="PMslider_'+key+'" max="'+max+'" min="'+min+'" />');
        var preview = $('<span id="PMsliderPreview_'+key+'" class="PMsliderPreview"></span>');
        var label = $('<label for="PMslider_'+key+'">'+label+'</label>');
        div.append(label).append(slider).append(preview);

        slider.change(updateOption);
        updateView();

        PrefManager.onPreferenceChanged(key, function(pair){
            if(!prefChange)
                updateView();
            prefChange = false;
        });

        var prefChange = false;
        function updateOption(){
            prefChange = true;
            PrefManager.setOption(key, slider.val());
            preview.text(pref(key));
        }
        function updateView(){
            slider.val(pref(key));
            preview.text(pref(key));
            console.log(pref(key));
        }

        return div;
    }

    function createTwoLineBox(label, secondLine){
        var output = '<div class="PMcheckbox_labelwrap"><div class="PMcheckbox_labeltext">'+label+'</div><div class="PMcheckbox_smalltext">'+secondLine+'</div></div>';
        return output;
    }
})();
