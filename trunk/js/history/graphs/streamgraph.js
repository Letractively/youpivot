include("js/color.js");

var StreamGraph = {};

(function(){
    var m = StreamGraph;
    var sg;

    m.provideData = function(data){
        if(!sg){
            var canvas = document.getElementById("streamCanvas");
            sg = new Processing(canvas, stream);
        }
        sg.stream.provideData(data);
    }

    m.draw = function(data){
        if(data.length==0) return;
        //createColorArray(data);
        if(!sg){
            var canvas = document.getElementById("streamCanvas");
            sg = new Processing(canvas, stream);
        }
        sg.stream.draw(data);
    }

    function getNormalColor(id){
        var domain = ItemManager.getDomain(id)
        if(domain == null)
            return [1,255,0,0,0,0];
        return domain.graphColor;
    }

    function getHighlightColor(id){
        var domain = ItemManager.getDomain(id)
        if(domain == null)
            return [1,255,0,0,0,0];
        return domain.graphHighlightColor;
    }

    m.render = function(){
        if(!sg) return;
        sg.stream.render();
    }

    m.highlightLayer = function(id){
        if(!sg) return;
        var i = GraphManager.getDataIndex(id);
        var data = GraphManager.getData(i);
        data.highlight++;
        if(data.highlight > 0)
            sg.stream.highlight(id);
    }

    m.lowlightLayer = function(id){
        if(!sg) return;
        var i = GraphManager.getDataIndex(id);
        var data = GraphManager.getData(i);
        data.highlight--;
        if(data.highlight <= 0)
            sg.stream.lowlight(id);
    }

    m.scale = function(offset, scale, redraw){
        if(!sg) return;
        if(redraw === undefined) redraw = true;
        sg.stream.scale(offset, scale, redraw);
    }

    function mouseClickOnLayer(id){
        // undefined or -1 means click on background
        if(id !== undefined && id != -1){
            toggleItemHighlight(id, !layers_toggle[id]);
            layers_toggle[id] = !layers_toggle[id];
        }
    }

    // callback function
    function mouseEnterLayer(id){
        highlightItem(id, false);
    }

    // callback function
    function mouseLeaveLayer(id){
        lowlightItem(id, false);
    }

    function highlightItem(id, persistent){
        HighlightManager.highlightDomain(id, {persistent: persistent, parent: $("#textContent")});
        HighlightManager.highlightLayer(id, persistent);
        HighlightManager.scrollToItem(id, (persistent) ? 0 : 500);
    }

    function lowlightItem(id, clearPersistent){
        HighlightManager.cancelScroll(id); 
        HighlightManager.lowlightDomain(id, {clearPersistent: clearPersistent, parent: $("#textContent")});
        HighlightManager.lowlightLayer(id, clearPersistent);
    }

    function toggleItemHighlight(id, toggle){
        if(toggle)
            highlightItem(id, true);
        else
            lowlightItem(id, true);
    }

    var layers_toggle = {};
    function stream(P){
        // By Jason Sundram 5/2010, based on Byron & Wattenberg's Streamgraph Generator.
        // Translated into javascript by Maurice Lam

        // tell Processing.js to make the background transparent
        this.options.isTransparent = true;

        /* FIELDS */
        var SETTINGS = {
            _w: 680,
            _h: 150,
            sort: VolatilitySort,
            layout: ThemeRiverLayout,
            curve: true,
            background: [0,0,0,0]
        };

        /* Import data Dataset*/
        var LAYERS = null;
        var RAW_DATA;
        var DATA_LABELS;

        /*** external facing functions, wrapped in P.stream ***/

        P.stream = {};

        P.stream.draw = function(data){
            P.stream.provideData(data);
            P.stream.render();
        }

        P.stream.provideData = function(data){
            RAW_DATA = getStreamgraphData(data);
            DATA_LABELS = getStreamgraphLabels(data);
            var data = new DataSource(RAW_DATA, DATA_LABELS);
            LAYERS = data.make(DATA_LABELS.length, RAW_DATA[0].length);
        }

        P.stream.render = function(){
            REDRAW_REGION = RedrawRegions.all;
            P.redraw();
        }

        P.stream.highlight = function(id){
            var i = layerTable[id];
            P.pushStyle();
            P.fill();
            P.noStroke();
            drawLayer(LAYERS[i], getHighlightColor(id), false, true);
        }

        P.stream.lowlight = function(id){
            var i = layerTable[id];
            P.pushStyle();
            P.fill();
            P.noStroke();
            drawLayer(LAYERS[i], getNormalColor(id), false, true);
            P.popStyle();
        }

        P.stream.scale = function(offset, scale, redraw){
            console.log("redraw", redraw);
            if(offset<0 || offset+scale>1){
                console.log("offset:", offset, "scale:", scale);
                throw "Offset and scale out of bounds. ";
            }
            SETTINGS.start = Math.floor(offset*RAW_DATA[0].length);
            SETTINGS.end = Math.ceil((offset+scale)*RAW_DATA[0].length);
            if(redraw){
                REDRAW_REGION = RedrawRegions.move;
                P.redraw();
            }
        }

        /*** end external facing functions ***/

        RedrawRegions = {}; // enum 
        RedrawRegions.all = 0;
        RedrawRegions.move = 1;
        RedrawRegions.color = 3;

        REDRAW_REGION = RedrawRegions.all;

        P.setup = function(){
            P.size(SETTINGS._w, SETTINGS._h);

            SETTINGS.start = 0;
            SETTINGS.end = -1; // -1 means end of data array

            P.background.apply(this, SETTINGS.background); // background(0,0,0,0) -> transparent
            P.smooth();

            P.noLoop(); // This needs to be called last.
        }

        var layerTable = {};

        function createLayerTable(layers){
            for(var i in layers){
                layerTable[layers[i].name] = i;
            }
        }


        var m; // FIXME debug
        P.draw = function(){
            //console.trace();

            if(REDRAW_REGION == RedrawRegions.all){
                console.log("draw all");
            }else if (REDRAW_REGION == RedrawRegions.color){
                console.log("draw color");
            }
            console.log("cycle time: ", P.millis() - m); // FIXME debug
            m = P.millis(); // FIXME debug

            // don't draw if data is undefined
            if(typeof RAW_DATA == "undefined"){
                return;
            }

            if (REDRAW_REGION == RedrawRegions.all){
                try{
                    P.size(SETTINGS._w, SETTINGS._h);
                }catch(e){
                    // This is a known issue in processing v0.8:
                    // https://processing-js.lighthouseapp.com/projects/41284-processingjs/tickets/576
                    console.log('expected error: '  + e);
                }
            }


            /* Set up screen geometry */
            if(REDRAW_REGION == RedrawRegions.all){ //don't redo all the calculations if only changing color
                var ttt3 = P.millis(); // FIXME debug
                if (SETTINGS.end == -1){
                    SETTINGS.end = RAW_DATA[0].length;
                }
                /* Calculate */
                // WARNING: this will change the order of the layers array, making it not the same as the source data
                var layer_sort = SETTINGS.sort;
                LAYERS = layer_sort(LAYERS);

                var layer_layout = SETTINGS.layout;
                layer_layout(LAYERS);

                createLayerTable(LAYERS);
                console.log("sort time: ", P.millis() - ttt3); // FIXME debug
            }

            if(REDRAW_REGION == RedrawRegions.all || REDRAW_REGION == RedrawRegions.move){
                var ttt2 = P.millis(); // FIXME debug
                scaleLayers(LAYERS, P.height);
                console.log("scale time: ", P.millis() - ttt2);
            }

            /* Draw */
            var curve = SETTINGS.curve;
            drawLayers(LAYERS, curve);

            console.log("total time to draw: ", P.millis() - m); // FIXME debug
        }

        function scaleLayers(layers, canvasHeight) 
        {
            var ttt2 = P.millis(); // FIXME debug
            // Figure out max and min values of layers.
            var lmin = layers[0].yTop[SETTINGS.start];
            var lmax = layers[0].yBottom[SETTINGS.start];
            for (var i = SETTINGS.start; i < SETTINGS.end; i++)
            {
                for (var j = 0; j < layers.length; j++)
                {
                    lmin = _min(lmin, layers[j].yTop[i]);
                    lmax = _max(lmax, layers[j].yBottom[i]);
                }
            }
            console.log("find extreme time: ", P.millis() - ttt2);

            var maxi=0, maxj=0;
            if(lmax - lmin == 0) lmax = 1; // prevent division by 0
            var scale = (canvasHeight) / (lmax - lmin);
            for (var i = SETTINGS.start; i < SETTINGS.end; i++)
            {
                maxi++;
                for (var j = 0; j < layers.length; j++)
                {
                    maxj++;
                    layers[j].yTop[i] = scale * (layers[j].yTop[i] - lmin);
                    layers[j].yBottom[i] = scale * (layers[j].yBottom[i] - lmin);
                }
            }
            console.log("max i: ", maxi, "max j: ", maxj, "layers length: ", layers.length);
        }

        function _max(a, b){
            return (a > b) ? a : b;
        }

        function _min(a, b){
            return (a < b) ? a : b;
        }


        function drawLayers(layers, isGraphCurved)
        {
            var n = layers.length;
            var m = SETTINGS.end;
            var lastLayer = n - 1;

            P.background.apply(this, SETTINGS.background); // background(0,0,0,0); -> transparent
            P.pushStyle();
            P.noStroke();

            // Generate graph.
            for (var i = 0; i < n; i++) 
            {
                var layer = layers[i];
                var color = getColor(layer);
                if(color !== undefined){
                    drawLayer(layer, color, (i == lastLayer), isGraphCurved);
                }else{
                    //console.log("Color is undefined for", layer);
                }
            }

            P.popStyle();
        }

        function drawLayer(layer, color, pxl, isGraphCurved){
            //var ttt = P.millis();
            var start = P.max(SETTINGS.start, layer.onset - 1);
            var end   = P.min(m - 1, layer.end);

            P.colorMode.apply(this, color.slice(0,2)); // i.e. colorMode(c[0], c[1])
            P.fill.apply(this, color.slice(2));       // i.e. fill(c[2], c[3], c[4])

            // Draw shape.
            P.beginShape();

            // Draw top edge, left to right.
            graphVertex(start, layer.yTop, isGraphCurved, pxl);
            for (var j = start; j <= end; j++)
                graphVertex(j, layer.yTop, isGraphCurved, pxl);

            graphVertex(end, layer.yTop, isGraphCurved, pxl);

            // Draw bottom edge, right to left.
            graphVertex(end, layer.yBottom, isGraphCurved, false);
            for (var j = end; j >= start; j--)
                graphVertex(j, layer.yBottom, isGraphCurved, false);

            graphVertex(start, layer.yBottom, isGraphCurved, false);

            P.endShape(P.CLOSE);

            //console.log("time to draw 1 layer: ", P.millis() - ttt);
        }

        function graphVertex(point, source, curve, pxl)
        {
            var x = P.map(point, SETTINGS.start, SETTINGS.end-1, 0, P.width);
            var y = source[point] - (pxl ? 1 : 0);
            if (curve)
                P.curveVertex(x, y);
            else
                P.vertex(x, y);
        }

        function getData(id){
            var index = GraphManager.getDataIndex(id);
            return GraphManager.getData(index);
        }

        // Return colorMode, range, color triplet (either in rgb or hsb, specified by colorMode)
        function getColor(layer){
            return getNormalColor(layer.name);
        }

        P.mouseClicked = function(){
            var hover = getHitLayer(P, -1);
            mouseClickOnLayer(hover);
        }

        var cleanupNeeded = false;

        function trueMatch(i){
            // one match maybe coincidence, but two must be the layer
            P.pushStyle();
            P.fill();
            P.noStroke();
            drawLayer(LAYERS[i], [P.RGB, 255, 255, 255, 255, 255], false, true);
            var hit = P.get(P.mouseX, P.mouseY-($("body").scrollTop()));
            var match1 = P.red(hit)==255 && P.green(hit)==255 && P.blue(hit)==255;
            if(!match1){
                cleanUp(i);
                return false;
            }

            drawLayer(LAYERS[i], [P.RGB, 255, 111, 111, 111, 255], false, true);
            var hit = P.get(P.mouseX, P.mouseY-($("body").scrollTop()));
            var match2 = P.red(hit)==111 && P.green(hit)==111 && P.blue(hit)==111;
            P.popStyle();

            cleanUp(i);
            return match2;
        }

        // clean up after the mess truematch created
        function cleanUp(i){
            P.pushStyle();
            P.fill();
            P.noStroke();
            drawLayer(LAYERS[i], getColor(LAYERS[i]), false, true);
            P.popStyle();
        }

        function colorMatch(i, r, g, b){
            var s = getColor(LAYERS[i]);
            if(s === undefined) return false;

            var colorMatch = s[2] == r && s[3] == g && s[4] == b;
            return colorMatch;
        }

        function getHitIndex(P, lastHit){
            var hit = P.get(P.mouseX, P.mouseY-($("body").scrollTop()));
            //console.log("gethit");

            // return if mouse is still out of any layers
            if(lastHit===-1 && P.alpha(hit)===0){
                return undefined;
            }

            // return if mouse is on the same layer
            if(lastHit!==-1){
                if(trueMatch(lastHit)){
                    return lastHit;
                }
            }

            if(P.alpha(hit)===0){
                return -1;
            }

            for (var i = 0; i < LAYERS.length; i++){
                // Check by colors
                if(colorMatch(i, P.red(hit), P.green(hit), P.blue(hit))){
                    if(trueMatch(i)){
                        return i;
                    }
                }
            }
        }

        function getHitLayer(P, lastHit){
            var i = getHitIndex(P, lastHit);
            if(i === undefined || i === -1)
                return i;
            return LAYERS[i].name;
        }

        // This function should not be changed. 
        // Use mouseEnterLayer() and mouseLeaveLayer() for events
        var lastHit = -1;
        P.mouseMoved = function(){
            var hover = getHitLayer(P, lastHit);

            if(hover == undefined){
                return;
            }
            if(lastHit !== -1 && hover != lastHit){
                mouseLeaveLayer(lastHit);
            }
            if(hover !== -1 && hover != lastHit){
                mouseEnterLayer(hover);
            }
            lastHit = hover;
        }

        //make sure colors are reverted to normal when mouse out the canvas
        P.mouseOut = function(){
            if(lastHit===-1) return;
            mouseLeaveLayer(lastHit);
            if(lastHit != -1){
                lastHit = -1; // set last hit back to -1, resetting mouseover state
                REDRAW_REGION = RedrawRegions.color;
                P.redraw();
            }
        }

        function getStreamgraphLabels(data)
        {
            var output = [];
            for(var i in data){
                output[i] = data[i].id;
            }
            return output;
        }

        function getStreamgraphData(data)
        {    
            var output = [];
            for(var i in data){
                output[i] = data[i].data;
            }
            return output;
        }
    }
})();
