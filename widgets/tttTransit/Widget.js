var dModeOptions = [
  { label: "All Transit"      , name: "all" , value: "T", hierarchyoptions:[4,5,6,7,8,9]},
  { label: "Local Bus"        , name: "lcl" , value: "4", hierarchyoptions:[4,5,6,7,8,9]},
  { label: "Core Route"       , name: "brt5", value: "5", hierarchyoptions:[  5,6,7,8,9]},
  { label: "Express Bus"      , name: "exp" , value: "6", hierarchyoptions:[4,5,6,7,8,9]},
  { label: "Bus Rapid Transit", name: "brt9", value: "9", hierarchyoptions:[4,5,6,7,8,9]},
  { label: "Light Rail"       , name: "lrt" , value: "7", hierarchyoptions:[      7,8,9]},
  { label: "Commuter Rail"    , name: "crt" , value: "8", hierarchyoptions:[        8  ]}
];
var curMode = "T"; //T is total

var dTimeOfDayOptions = [
  { label: "Daily"   , value: "DY"},
  { label: "Peak"    , value: "Pk"},
  { label: "Off-Peak", value: "Ok"}
];
var curTimeOfDay = "DY";

var dAccessModeOptions = [
  { label: "Walk & Drive" , value: "WD"},
  { label: "Walk Only"    , value: "W"},
  { label: "Drive Only"   , value: "D"}
];
var curAccessMode = "WD";

var dTripOrientationOptions = [
  {value: "OD", label:"Origin-Destination"   },
  {value: "PA", label:"Production-Attraction"}
];
var curTripOrientation = "OD";

var dDisplayOptions = [
  {value: "RDR", label:"Riders"      },
  {value: "BRD", label:"Boardings"   },
  {value: "SPD", label:"Speed"       },
  {value: "HDW", label:"Headway"     }
];
var curDisplay = "RDR";


var dRadioButtonGroups = [
  { title: "Trip Orientation" , htmldivname: "divTripOrientationOptions"  , contents: dTripOrientationOptions , curVarName: "curTripOrientation"},
  { title: "Display"          , htmldivname: "divDisplayOptions"          , contents: dDisplayOptions         , curVarName: "curDisplay"        }
];


var minScaleForLabels = 87804;
var labelClassOn;
var labelClassOff;
var sCWhite = "#FFFFFF";
var dHaloSize = 2.0;

var bindata;

var tttT;

var iPixelSelectionTolerance = 5;

var renderer_Riders;
var renderer_Riders_Change;

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
      
      tttT = this;
      
      try {
        dom.byId(tttT.id + "_panel").style.left = '55px'; // NEED TO FIND BETTER PLACE WHERE WIDGET IS CREATED RATHER THAN HERE
      } catch (err) {
        console.log(err.message);
      }
    },

    startup: function() {
      console.log('startup');

      
      this.inherited(arguments);
      this.map.setInfoWindowOnClick(false); // turn off info window (popup) when clicking a feature
      
      //Widen the widget panel to provide more space for charts
      //var panel = this.getPanel();
      //var pos = panel.position;
      //pos.width = 500;
      //panel.setPosition(pos);
      //panel.panelManager.normalizePanel(panel);
      
      cmbMode = new Select({
        id: "selectMode",
        name: "selectModeName",
        options: dModeOptions,
        onChange: function(){
          curMode = this.value;
          console.log('Select Mode: ' + curMode)
          tttT._updateDisplayTransit();
        }
      }, "cmbMode");
      cmbMode.set("value",curMode);
      cmbMode.startup();

      cmbTimeOfDay = new Select({
        id: "selectTimeOfDay",
        name: "selectTimeOfDayName",
        options: dTimeOfDayOptions,
        onChange: function(){
          curTimeOfDay = this.value;
          console.log('Select TimeOfDay: ' + curTimeOfDay)
          tttT._updateDisplayTransit();
        }
      }, "cmbTimeOfDay");
      cmbTimeOfDay.set("value",curTimeOfDay);
      cmbTimeOfDay.startup();

      cmbAccessMode = new Select({
        id: "selectAccessMode",
        name: "selectAccessModeName",
        options: dAccessModeOptions,
        onChange: function(){
          curAccessMode = this.value;
          console.log('Select Mode: ' + curAccessMode)
          tttT._updateDisplayTransit();
        }
      }, "cmbAccessMode");
      cmbAccessMode.set("value",curAccessMode);
      cmbAccessMode.startup();
      


      // setup radio button groups
      for (rbg in dRadioButtonGroups) {

        var sDivName = dRadioButtonGroups[rbg].htmldivname;

        var _divRBDiv = dom.byId(sDivName);
        var _divRBDiv_title = dom.byId(sDivName + '_title');
        
        dojo.place('<div class="cmbtitle">' + dRadioButtonGroups[rbg].title + ':</div>', _divRBDiv_title);

        for (d in dRadioButtonGroups[rbg].contents) {

          var sValue = dRadioButtonGroups[rbg].contents[d].value;
          var sLabel = dRadioButtonGroups[rbg].contents[d].label;
      
          // define if this is the radio button that should be selected
          const _curVarName  = dRadioButtonGroups.find(x => x.htmldivname === sDivName).curVarName;
          if (dRadioButtonGroups[rbg].contents[d].value == window[_curVarName]) {
            var bChecked = true;
          } else {
            var bChecked = false;
          }
          
          // radio button id
          _rbID = "rb_" + sDivName + "_" + sValue; // value for future lookup will be after 3rd item in '_' list
  
          // radio button object
          var _rbRB = new RadioButton({ name:sDivName, label:sLabel, id:_rbID, value: sValue, checked: bChecked});
          _rbRB.startup();
          _rbRB.placeAt(_divRBDiv);
  
          // radio button label
          var _lblRB = dojo.create('label', {
            innerHTML: sLabel,
            for: _rbID,
            id: _rbID + '_label'
          }, _divRBDiv);
          
          // place radio button
          dojo.place("<br/>", _divRBDiv);
      
          // Radio Buttons Change Event
          dom.byId(_rbID).onchange = function(isChecked) {
            console.log(sDivName + "radio button onchange");
            if(isChecked) {
              console.log(this.name)
              var _divname = this.name
              const _varName  = dRadioButtonGroups.find(x => x.htmldivname === _divname).curVarName;
              window[_varName] = this.value;
              tttT._updateDisplayTransit();
            }
          }
        }
      }

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
            
      //Riders Absolute Renderers
      var aBrk_Riders_Absolute = new Array(
        {minValue:        1, maxValue:      249, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[0]), 0.50), label:   "Less than 250 Riders"},
        {minValue:      250, maxValue:      499, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[1]), 1.25), label:      "250 to 500 Riders"},
        {minValue:      500, maxValue:      999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[2]), 2.00), label:    "500 to 1,000 Riders"},
        {minValue:     1000, maxValue:     1999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[3]), 2.75), label:  "1,000 to 2,000 Riders"},
        {minValue:     2000, maxValue:     2999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[4]), 3.50), label:  "2,000 to 3,000 Riders"},
        {minValue:     3000, maxValue:     4999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[5]), 4.25), label:  "3,000 to 5,000 Riders"},
        {minValue:     5000, maxValue:     9999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[6]), 5.00), label: "5,000 to 10,000 Riders"},
        {minValue:    10000, maxValue:    14999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[7]), 5.75), label:"10,000 to 15,000 Riders"},
        {minValue:    15000, maxValue: Infinity, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[8]), 6.50), label:"More than 15,000 Riders"}
      );
      renderer_Riders = new ClassBreaksRenderer(null, 'Riders');
      for (var j=0;j<aBrk_Riders_Absolute.length;j++) {
        renderer_Riders.addBreak(aBrk_Riders_Absolute[j]);
      }

      //Riders Change Renderers
      var aBrk_Riders_Change = new Array(
        {minValue: -10000000, maxValue:   -10001, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[0]), 5.0000), label: "Less than -10,000 Riders"},
        {minValue:    -10000, maxValue:    -2501, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[1]), 3.7500), label: "-10,000 to -2,500 Riders"},
        {minValue:     -2500, maxValue:    -1001, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[2]), 2.5000), label:  "-2,500 to -1,000 Riders"},
        {minValue:     -1000, maxValue:     -100, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[3]), 1.2500), label:    "-1,000 to -100 Riders"},
        {minValue:      -100, maxValue:      100, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[4]), 0.6250), label:      "-100 to +100 Riders"},
        {minValue:       100, maxValue:     1000, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[5]), 1.2500), label:      "100 to 1,000 Riders"},
        {minValue:      2500, maxValue:     4999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[6]), 2.5000), label:    "2,500 to 5,000 Riders"},
        {minValue:      5000, maxValue:     9999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[7]), 3.7500), label:   "5,000 to 10,000 Riders"},
        {minValue:     10000, maxValue:    24999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[8]), 5.0000), label:  "10,000 to 25,000 Riders"},
        {minValue:     25000, maxValue: Infinity, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex("#000000"), 7.0000), label:  "More than 25,000 Riders"}
      );
      renderer_Riders_Change = new ClassBreaksRenderer(null, 'Riders');
      for (var j=0;j<aBrk_Riders_Change.length;j++) {
        renderer_Riders_Change.addBreak(aBrk_Riders_Change[j]);
      }


      tttT._updateDisplayTransit();

    },

    _updateDisplayTransit: function() {
      console.log('updateDisplay to Mode ' + curMode);

      // clear all graphics
      tttT.map.graphics.clear();

      if (curScenarioComp=='none') {
        _renderer_transit = renderer_Riders;
      } else {
        _renderer_transit = renderer_Riders_Change;
      }

      if (curDisplay=='RDR' && curTripOrientation=='OD' && curAccessMode=='WD') {
        tttT._queryFeaturesRidersOD();
      } else {

      }
      
    },

    _queryFeaturesRidersOD: function(){ 

      var query, updateFeature;
      query = new Query();
      query.outFields = ["SEGID"];
      query.returnGeometry = true;
      query.where = "1=1"; // query all segments
      
      lyrSegments.queryFeatures(query,function(featureSet) {
        //Update values
        var resultCount = featureSet.features.length;
        for (var i = 0; i < resultCount; i++) {
          updateFeature = featureSet.features[i];
          _segid = updateFeature.attributes['SEGID']
          //A: SEGID
          //I: DY_VOL_2WY

          _mainValue_Riders = 0;
          _compValue_Riders = 0;
          _dispValue_Riders = 0;

          try {
            _mainValue_Riders = dataTransitModeMain.data.find(o => o.SEGID === _segid)['M' + curMode];

            if (curScenarioComp!='none') {
              try {
                _compValue_Riders = dataTransitModeComp.data.find(o => o.SEGID === _segid)['M' + curMode];
                
                if (curRoadPCOption=='Abs') {
                  _dispValue_Riders = _mainValue_Riders - _compValue_Riders;

                } else{
                  if (_compValue_Riders >0) _dispValue_Riders = ((_compValue_Riders - _compValue_Riders) / _compValue_Riders) * 100;
                }

              } catch(err) {
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

        lyrSegments.setRenderer(_renderer_transit);

        tttT.map.graphics.setRenderer(_renderer_transit);
        tttT.map.graphics.refresh();

        
      });

      //lyrSegments.show();

    },

    numberWithCommas: function(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    onOpen: function(){
      console.log('onOpen');
      tttT._updateDisplayTransit();
      lastOpenedWidget = 'transit';
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
      if(data.message=='transit'){
        tttT._updateDisplayTransit();
      }
    },


  });
});