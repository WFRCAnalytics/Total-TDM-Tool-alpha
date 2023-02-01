//javascript for controlling Transit Ridership App
//written by Bill Hereth February 2022


var dModeOptions = [
  { label: "All Transit"      , name: "all" , value: "T", selected: true },
  { label: "Local Bus"        , name: "lcl" , value: "4"                 },
  { label: "Core Route"       , name: "brt5", value: "5"                 },
  { label: "Express Bus"      , name: "exp" , value: "6"                 },
  { label: "Bus Rapid Transit", name: "brt9", value: "9"                 },
  { label: "Light Rail"       , name: "lrt" , value: "7"                 },
  { label: "Commuter Rail"    , name: "crt" , value: "8"                 }
];

var iFirst=true;

var sCBertGrad9 = "#Af2944"; //rgb(175,41,68)
var sCBertGrad8 = "#E5272d"; //rgb(229,39,45)
var sCBertGrad7 = "#Eb672d"; //rgb(235,103,45)
var sCBertGrad6 = "#E09d2e"; //rgb(224,157,46)
var sCBertGrad5 = "#8dc348"; //rgb(141,195,72)
var sCBertGrad4 = "#6cb74a"; //rgb(108,183,74)
var sCBertGrad3 = "#00a74e"; //rgb(0,167,78)
var sCBertGrad2 = "#1ba9e6"; //rgb(27,169,230)
var sCBertGrad1 = "#31398a"; //rgb(49,57,138)

var sCBertGrad0 = "#EEEEEE";

bertColorData = [sCBertGrad1,sCBertGrad2,sCBertGrad3,sCBertGrad4,sCBertGrad5,sCBertGrad6,sCBertGrad7,sCBertGrad8,sCBertGrad9];

//Tranist Variables
var curMode = "T"; //T is total
var curRoute = [];
var lyrLinks;
var sLinks = "LinksWithRiders_v2";

var minScaleForLabels = 87804;
var labelClassOn;
var labelClassOff;
var sCWhite = "#FFFFFF";
var dHaloSize = 2.0;

var bindata;

var tttT;

var iPixelSelectionTolerance = 5;

var renderer_Riders;

define(['dojo/_base/declare',
    'jimu/BaseWidget',
    'jimu/LayerInfos/LayerInfos',
    'dijit/registry',
    'dojo/dom',
    'dojo/dom-style',
    'dijit/dijit',
    'dojox/charting/Chart',
    'dojox/charting/themes/Claro',
    'dojox/charting/themes/Julie',
    'dojox/charting/SimpleTheme',
    'dojox/charting/plot2d/Scatter',
    'dojox/charting/plot2d/Markers',
    'dojox/charting/plot2d/Columns',
    'dojox/charting/widget/Legend',
    'dojox/charting/action2d/Tooltip',
    'dojox/layout/TableContainer',
    'dojox/layout/ScrollPane',
    'dijit/layout/ContentPane',
    'jimu/PanelManager',
    'dijit/form/TextBox',
    'dijit/form/ToggleButton',
    'jimu/LayerInfos/LayerInfos',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'esri/layers/FeatureLayer',
    'esri/dijit/FeatureTable',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/TextSymbol',
    'esri/symbols/Font',
    'esri/layers/LabelClass',
    'esri/InfoTemplate',
    'esri/Color',
    'esri/map',
    'esri/renderers/ClassBreaksRenderer',
    'esri/geometry/Extent',
    'dojo/store/Memory',
    'dojox/charting/StoreSeries',
    'dijit/Dialog',
    'dijit/form/Button',
    'dijit/form/RadioButton',
    'dijit/form/MultiSelect',
    'dojox/form/CheckedMultiSelect',
    'dijit/form/Select',
    'dijit/form/ComboBox',
    'dijit/form/CheckBox',
    'dojo/store/Observable',
    'dojox/charting/axis2d/Default',
    'dojo/domReady!'],
function(declare, BaseWidget, LayerInfos, registry, dom, domStyle, dijit, Chart, Claro, Julie, SimpleTheme, Scatter, Markers, Columns, Legend, Tooltip, TableContainer, ScrollPane, ContentPane, PanelManager, TextBox, ToggleButton, LayerInfos, Query, QueryTask, FeatureLayer, FeatureTable, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, TextSymbol, Font, LabelClass, InfoTemplate, Color, Map, ClassBreaksRenderer, Extent, Memory, StoreSeries, Dialog, Button, RadioButton, MutliSelect, CheckedMultiSelect, Select, ComboBox, CheckBox, Observable) {
  //To create a widget, you need to derive from BaseWidget.
  
  return declare([BaseWidget], {
    // DemoWidget code goes here

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,

    baseClass: 'jimu-widget-demo',

    postCreate: function() {
      this.inherited(arguments);
      console.log('postCreate');
      dom.byId("_8_panel").style.left = '55px';
    },

    startup: function() {
      console.log('startup');

      tttT = this;
      
      this.inherited(arguments);
      this.map.setInfoWindowOnClick(false); // turn off info window (popup) when clicking a feature
      
      //Widen the widget panel to provide more space for charts
      //var panel = this.getPanel();
      //var pos = panel.position;
      //pos.width = 500;
      //panel.setPosition(pos);
      //panel.panelManager.normalizePanel(panel);
      
      var parent = this;

      //when zoom finishes run changeZoom to update label display
      //this.map.on("zoom-end", function (){  
      //  parent.changeZoom();  
      //});  
      tttT.updateRoutesList(curMode);

      cmbMode = new Select({
        id: "selectMode",
        name: "selectModeName",
        options: dModeOptions,
        onChange: function(){
          curMode = this.value;
          console.log('Select Mode: ' + curMode)
          tttT.updateDisplayMode();
          tttT.updateRoutesList(curMode);
        }
      }, "cmbMode");
      cmbMode.startup();
      cmbMode.set("value",curMode);

      // create a text symbol to define the style of labels
      var volumeLabel = new TextSymbol();
      volumeLabel.font.setSize("8pt");
      volumeLabel.font.setFamily("arial");
      volumeLabel.font.setWeight(Font.WEIGHT_BOLD);
      volumeLabel.setHaloColor(sCWhite);
      volumeLabel.setHaloSize(dHaloSize);

      //Setup empty volume label class for when toggle is off
      labelClassOff = ({
        minScale: minScaleForLabels,
        labelExpressionInfo: {expression: ""}
      })
      labelClassOff.symbol = volumeLabel;
    
      //Create a JSON object which contains the labeling properties. At the very least, specify which field to label using the labelExpressionInfo property. Other properties can also be specified such as whether to work with coded value domains, fieldinfos (if working with dates or number formatted fields, and even symbology if not specified as above)
      labelClassOn = {
        minScale: minScaleForLabels,
        labelExpressionInfo: {expression: "$feature.LABEL"}
      };
      labelClassOn.symbol = volumeLabel;
      
      //Check box change events
      dom.byId("chkLabels").onchange = function(isChecked) {
        parent.checkVolLabel();
      };  

      //setup click functionality
      //this.map.on('click', selectTAZ);

      function pointToExtent(map, point, toleranceInPixel) {  
        var pixelWidth = parent.map.extent.getWidth() / parent.map.width;  
        var toleranceInMapCoords = toleranceInPixel * pixelWidth;  
        return new Extent(point.x - toleranceInMapCoords,  
          point.y - toleranceInMapCoords,  
          point.x + toleranceInMapCoords,  
          point.y + toleranceInMapCoords,  
          parent.map.spatialReference);  
      }
      
      //Setup Function for Selecting Features
      
      function selectTAZ(evt) {
        console.log('selectFeatures');
          
          var query = new Query();  
          query.geometry = pointToExtent(parent.map, evt.mapPoint, iPixelSelectionTolerance);
          query.returnGeometry = false;
          query.outFields = ["*"];
          
          var tblqueryTaskTAZ = new QueryTask(lyrDispLayers[parent.getCurDispLayerLoc()].url);
          tblqueryTaskTAZ.execute(query,showTAZResults);
          
          //Segment search results
          function showTAZResults (results) {
            console.log('showTAZResults');
        
            var resultCount = results.features.length;
            if (resultCount>0) {
              //use first feature only
              var featureAttributes = results.features[0].attributes;
          }
        }
      }
      this.setLegendBar();
      this.showLegend();
      this.updateDisplayMode();

//      var divYears = dom.byId("divYears");
//      
//      for (d in dYears) {

//        if (dYears[d].value == sYear) {
//          bChecked = true;
//        } else {
//          bChecked = false;
//        }
//        
//        var rbYear = new RadioButton({ name:"year", label:dYears[d].label, id:"rb_" + dYears[d].value, value: dYears[d].value, checked: bChecked});
//        rbYear.startup();
//        rbYear.placeAt(divYears);
//        
//        var lblDOWPeak = dojo.create('label', {
//          innerHTML: dYears[d].label,
//          for: rbYear.id
//        }, divYears);
//        
//        dojo.place("<br/>", divYears);

//        //Radio Buttons Change Event
//        dom.byId("rb_" + dYears[d].value).onchange = function(isChecked) {
//          if(isChecked) {
//            curYear = this.value;
//            console.log('Radio button select: ' + curYear);
//            tttT.updateDisplay();
//          }
//        }
//      }
    },

    updateRoutesList: function(curMode) {
      routes = [];
      curRoutes = [];
      //currentMode = [];
      //sATRs="IN(";
      //console.log("CURMODE " + curMode);
      //console.log(dataTransitRouteMain);
      for (var i=0;i<dataTransitRouteMain.data.length;i++){
        if (dataTransitRouteMain.data[i].MODE==curMode) {
          if (i == 0 || (dataTransitRouteMain.data[i].NAME != dataTransitRouteMain.data[i-1].NAME)){
            //loop through and get the corresponding LONGNAME  
            routeName = dataTransitRouteNames.data.find(o => o.NAME === dataTransitRouteMain.data[i].NAME)['LONGNAME'];
            routes.push({"label" : routeName, "value" : dataTransitRouteMain.data[i].NAME});
            //if (dom.byId("button").innerHTML == "Unselect All") {
            //  currentMode.push(dataTransitRouteMain.data[i].MODE);
            //}
            //sATRs += dataTransitRouteMain.data[i].NAME + ","
          }
        } else if (curMode == 'T'){
          if (i == 0 || (dataTransitRouteMain.data[i].NAME != dataTransitRouteMain.data[i-1].NAME)){
            routeName = dataTransitRouteNames.data.find(o => o.NAME === dataTransitRouteMain.data[i].NAME)['LONGNAME'];
            routes.push({"label" : routeName, "value" : dataTransitRouteMain.data[i].NAME});
            //curRoutes.push(dataTransitRouteMain.data[i].NAME);
          }
        } 
      }
      //sATRs = sATRs.slice(0,-1) + ")";
      if (iFirst) {
        cmbRoute = new CheckedMultiSelect({
          id: "selectRoute",
          name: "selectRouteName",
          options: routes,
          multiple: true,
          onChange: function(){
            curRoute = this.value;
            console.log('curRoute is ' + curRoute);
            //console.log('curRoutes is ' + curRoutes[4]);
            tttT.updateDisplayMode();
          }
        }, "cmbRoute");
        cmbRoute.startup();
        cmbRoute.set("value", curRoute);
        iFirst = false;
      } else {
        cmbRoute.set("options", routes).reset();
        cmbRoute.set("value", curRoute);
        cmbRoute.startup();
      }
      
    },

    updateDisplayMode: function() {
      sFieldName = 'M' + curMode;

      console.log('updateDisplay to ' + sFieldName);
      
      //Lanes Renderers
      var aBrk_Riders_Absolute = new Array(
        {minValue:        1, maxValue:      249, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[0]), 0.50), label:   "Less than 250"},
        {minValue:      250, maxValue:      499, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[1]), 1.25), label:      "250 to 500"},
        {minValue:      500, maxValue:      999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[2]), 2.00), label:    "500 to 1,000"},
        {minValue:     1000, maxValue:     1999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[3]), 2.75), label:  "1,000 to 2,000"},
        {minValue:     2000, maxValue:     2999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[4]), 3.50), label:  "2,000 to 3,000"},
        {minValue:     3000, maxValue:     4999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[5]), 4.25), label:  "3,000 to 5,000"},
        {minValue:     5000, maxValue:     9999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[6]), 5.00), label: "5,000 to 10,000"},
        {minValue:    10000, maxValue:    14999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[7]), 5.75), label:"10,000 to 15,000"},
        {minValue:    15000, maxValue: Infinity, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[8]), 6.50), label:"More than 15,000"}
      );
      renderer_Riders = new ClassBreaksRenderer(null, 'Riders');
      for (var j=0;j<aBrk_Riders_Absolute.length;j++) {
        renderer_Riders.addBreak(aBrk_Riders_Absolute[j]);
      }

//      vcClassRenderer_Riders = new ClassBreaksRenderer({
//        type: "unique-value",  // autocasts as new ClassBreaksRenderer()
//        valueExpression: "var r = $feature.Riders;" +
//                          "if      (r==0    ) { return 'class_0'; }" +
//                          "else if (r<   250) { return 'class_1'; }" +
//                          "else if (r<   500) { return 'class_2'; }" +
//                          "else if (r<  1000) { return 'class_3'; }" +
//                          "else if (r<  2000) { return 'class_4'; }" +
//                          "else if (r<  3000) { return 'class_5'; }" +
//                          "else if (r<  5000) { return 'class_6'; }" +
//                          "else if (r< 10000) { return 'class_7'; }" +
//                          "else if (r< 15000) { return 'class_8'; }" +
//                          "else if (r>=15000) { return 'class_9'; }",
//        uniqueValueInfos: [//{value:"class_0", label:      "No Transit", symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(sCBertGrad0     ), 0.1)},
//                           {value:"class_1", label:   "Less than 250", symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[0]), 0.7)},
//                           {value:"class_2", label:      "250 to 500", symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[1]), 1.7)},
//                           {value:"class_3", label:    "500 to 1,000", symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[2]), 2.7)},
//                           {value:"class_4", label:  "1,000 to 2,000", symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[3]), 3.7)},
//                           {value:"class_5", label:  "2,000 to 3,000", symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[4]), 4.7)},
//                           {value:"class_6", label:  "3,000 to 5,000", symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[5]), 5.7)},
//                           {value:"class_7", label: "5,000 to 10,000", symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[6]), 6.7)},
//                           {value:"class_8", label:"10,000 to 15,000", symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[7]), 7.7)},
//                           {value:"class_9", label:"More than 15,000", symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[8]), 8.7)}]
//      });

      // divider seg
      strMiddleSeg1 = '2102_003.0';
      strMiddleSeg2 = 'MAG_6018';

      // clear all graphics
      tttT.map.graphics.clear();
      tttT.map.graphics.refresh();

      // run multiple times to avoid 2000 limit on returned features
      tttT._queryFeatures("1=1")
    },

    _queryFeatures: function(_filterstring){ 

      var query, updateFeature;
      query = new Query();
      query.outFields = ["*"];
      query.returnGeometry = false;
      //query.where = "1=1";
      query.where = _filterstring

      _renderer = renderer_Riders;
      
      lyrSegments.queryFeatures(query,function(featureSet) {
        //Update values
        var resultCount = featureSet.features.length;
        for (var i = 0; i < resultCount; i++) {
          updateFeature = featureSet.features[i];
          _segid = updateFeature.attributes['SEGID']
          //_mode = updateFeature.attributes['MODE']
          //_route = updateFeature.attributes['NAME']
          //A: SEGID
          //I: DY_VOL_2WY

          _mainValue_Riders = 0;
          _compValue_Riders = 0;
          _dispValue_Riders = 0;

          if (curRoute != "" && curMode != "T"){
            try { 
              if (curRoute.length > 1){
                  var _mainValue_Riders1 = dataTransitRouteMain.data.filter(o => o.SEGID === _segid && o.MODE === Number(curMode) && curRoute.includes(o.NAME));
                  if (_mainValue_Riders1.length > 0){
                    var riders = 0;
                    var routeRiders = 0;
                    for (var j = 0; j < _mainValue_Riders1.length; j++){
                      routeRiders = _mainValue_Riders1.find(o => o.SEGID == _segid)['SEGVOL'];
                      //console.log(_mainValue_Riders1);
                      riders += routeRiders;
                    }
                    //console.log(_segid);
                    _mainValue_Riders = riders;
                  }
                  console.log(_mainValue_Riders);
              } else {
                _mainValue_Riders = dataTransitRouteMain.data.find(o => o.SEGID === _segid && o.MODE === Number(curMode) && o.NAME === String(curRoute))['SEGVOL'];
                console.log(_mainValue_Riders);
              }
              
              if (curScenarioComp!='none') {
                try {
                  _compValue_Riders = dataTransitRouteMain.data.find(o => o.SEGID === _segid && o.MODE === Number(curMode) && o.NAME === String(curRoute))['SEGVOL'];
                  
                  if (curRoadPCOption=='Abs') {
                    _dispValue_Riders = _mainValue_Riders - _compValue_Riders;
                  } else {
                    if (_compValue_Riders >0) _dispValue_Riders = ((_compValue_Riders - _compValue_Riders) / _compValue_Riders) * 100;
                  }
                } catch(err){
                  _dispValue_Riders = _mainValue_Riders;
                }
              } else {
                _dispValue_Riders = _mainValue_Riders;
              }
              updateFeature.attributes['Riders'] = _dispValue_Riders; 
              tttT.map.graphics.add(updateFeature);
            }
            catch(err) { 
              updateFeature.attributes['Riders'] = null;
            }
          }
          
          //try {
          //  _mainValue_Riders = dataTransitModeMain.data.find(o => o.SEGID === _segid)['M' + curMode];
//
          //  if (curScenarioComp!='none') {
          //    try {
          //      _compValue_Riders = dataTransitModeComp.data.find(o => o.SEGID === _segid)['M' + curMode];
          //      
          //      if (curRoadPCOption=='Abs') {
          //        _dispValue_Riders = _mainValue_Riders - _compValue_Riders;
//
          //      } else{
          //        if (_compValue_Riders >0) _dispValue_Riders = ((_compValue_Riders - _compValue_Riders) / _compValue_Riders) * 100;
          //      }
//
          //    } catch(err) {
          //      _dispValue_Riders = _mainValue_Riders;
          //    }
          //  } else {
          //    _dispValue_Riders = _mainValue_Riders;
          //  }
          //  
          //  updateFeature.attributes['Riders'] = _dispValue_Riders;
          //  
          //  tttT.map.graphics.add(updateFeature);
//
          //}
          //catch(err) {
          //  updateFeature.attributes['Riders'] = null;
          //}
        }

        lyrSegments.setRenderer(_renderer);

        tttT.map.graphics.setRenderer(_renderer);
        tttT.map.graphics.refresh();

        
      });

      //lyrSegments.show();

    },

    numbetttTithCommas: function(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
        
    setLegendBar: function() {
      console.log('setLegendBar');

      var _sLegend = 'Number of Daily Riders per Link'

      dom.byId("LegendName").innerHTML = _sLegend;

      if (typeof bertColorData !== 'undefined') {
        for (var i=0;i<bertColorData.length;i++)
          dom.byId("divColor" + (i + 1).toString()).style.backgroundColor = bertColorData[i];
      }
    },

    showLegend: function(){
      console.log('showLegend');
      var pm = PanelManager.getInstance();
      var bOpen = false;
      
      //Close Legend Widget if open
      for (var p=0; p < pm.panels.length; p++) {
        if (pm.panels[p].label == "Legend") {
          if (pm.panels[p].state != "closed") {
            bOpen=true;
            pm.closePanel(pm.panels[p]);
          }
        }
      }
    
      if (!bOpen) {
        //pm.showPanel(this.appConfig.widgetOnScreen.widgets[WIDGETPOOLID_LEGEND]);
      }
    },

    checkVolLabel: function() {
      console.log('checkVolLabel');
      if (dom.byId("chkLabels").checked == true) {
        lyrLinks[this.getCurDispLayerLoc()].setLabelingInfo([ labelClassOn  ] );
      } else {
        lyrLinks[this.getCurDispLayerLoc()].setLabelingInfo([ labelClassOff ]);
      }
      
    },

    onOpen: function(){
      console.log('onOpen');
    },

    onClose: function(){
      //this.ClickClearButton();
      console.log('onClose');
    },

    onMinimize: function(){
      console.log('onMinimize');
    },

    onMaximize: function(){
      console.log('onMaximize');
    },

    onSignIn: function(credential){
      /* jshint unused:false*/
      console.log('onSignIn');
    },

    onSignOut: function(){
      console.log('onSignOut');
    },

    //added from Demo widget Setting.js
    setConfig: function(config){
      //this.textNode.value = config.districtfrom;
    var test = "";
    },

    getConfigFrom: function(){
      //WAB will get config object through this method
      return {
        //districtfrom: this.textNode.value
      };
    },

    //Receiving messages from other widgets
    onReceiveData: function(name, widgetId, data, historyData) {
      //filter out messages
      if(data.message=='transitroute'){
        tttT.updateDisplayMode();
      }
    },


  });
});