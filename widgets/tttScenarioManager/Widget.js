//javascript for controlling Transit Ridership App
//written by Bill Hereth February 2022

var sYear = "50";
var curScenarioMain = "id_37001244863cadd40e1b8f7.52642706"  //v9 Beta 2019
var curScenarioComp = "id_112358168963ceca332cc148.76455495" //v9 2019 Observed

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
var curMode = "";
var curYear = sYear;
var lyrLinks;
var lyrSegments;
//var curMasterNetworkLinks = "master20211115";
var curSegments = "Road and Transit Segments";

var minScaleForLabels = 87804;
var labelClassOn;
var labelClassOff;
var sCWhite = "#FFFFFF";
var dHaloSize = 2.0;

var bindata;

var tttSM;

var iPixelSelectionTolerance = 5;

var dataRawModelMain = [];
var dataRawModelComp = [];

var dataRoadMain;
var dataRoadComp;
var dataTransitModeMain;
var dataTransitModeComp;
var dataTransitRouteMain;
var dataTransitRouteComp;

define(['dojo/_base/declare',
        'jimu/BaseWidget',
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
        'esri/layers/GraphicsLayer',
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
        'esri/renderers/UniqueValueRenderer',
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
function(declare, BaseWidget, registry, dom, domStyle, dijit, Chart, Claro, Julie, SimpleTheme, Scatter, Markers, Columns, Legend, Tooltip, TableContainer, ScrollPane, ContentPane, PanelManager, TextBox, ToggleButton, LayerInfos, Query, QueryTask, GraphicsLayer, FeatureLayer, FeatureTable, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, TextSymbol, Font, LabelClass, InfoTemplate, Color, Map, UniqueValueRenderer, Extent, Memory, StoreSeries, Dialog, Button, RadioButton, MutliSelect, CheckedMultiSelect, Select, ComboBox, CheckBox, Observable) {
    //To create a widget, you need to derive from BaseWidget.
    
    return declare([BaseWidget], {
        // DemoWidget code goes here

        //please note that this property is be set by the framework when widget is loaded.
        //templateString: template,

        baseClass: 'jimu-widget-demo',
        
        postCreate: function() {
            this.inherited(arguments);
            console.log('postCreate');
        },

        startup: function() {
            console.log('startup');

            tttSM = this;
            
            this.inherited(arguments);
            this.map.setInfoWindowOnClick(false); // turn off info window (popup) when clicking a feature
            
            //Widen the widget panel to provide more space for charts
            //var panel = this.getPanel();
            //var pos = panel.position;
            //pos.width = 500;
            //panel.setPosition(pos);
            //panel.panelManager.normalizePanel(panel);

            //when zoom finishes run changeZoomExtents to display
            this.map.on("zoom-end", function () {
                tttSM.changeZoomExtents();
            });
            
            //when pan finishes run changeZoomExtents to display
            this.map.on("pan-end", function () {
                tttSM.changeZoomExtents();
            });

            //Initialize Selection Layer, FromLayer, and ToLayer and define selection colors
            var layerInfosObject = LayerInfos.getInstanceSync();
            for (var j=0, jl=layerInfosObject._layerInfos.length; j<jl; j++) {
                var currentLayerInfo = layerInfosObject._layerInfos[j];
                if (currentLayerInfo.title == curSegments) { //must mach layer title
                    console.log('Segment Layer Found')
                    lyrSegments = layerInfosObject._layerInfos[j].layerObject;
                } 
            }


            //Get Scenarios
            dojo.xhrGet({
                url: "widgets/tttScenarioManager/data/scenarios.json",
                handleAs: "json",
                load: function(obj) {
                    /* here, obj will already be a JS object deserialized from the JSON response */
                    console.log('scenarios.json');
                    scenarios = obj;
                    cmbScenarioMain = new Select({
                        options: scenarios,
                        onChange: function() {
                            curScenarioMain = this.value;
                            tttSM.readInScenarioMainJSON();
                        }
                    }, "cmbScenarioMain");
                    cmbScenarioMain.startup();
                    cmbScenarioMain.set("value",curScenarioMain);

                    cmbScenarioComp = new Select({
                        options: scenarios,
                        onChange: function() {
                            curScenarioComp = this.value;
                            tttSM.readInScenarioCompJSON();
                        }
                    }, "cmbScenarioComp");
                    cmbScenarioComp.startup();
                    cmbScenarioComp.set("value",curScenarioComp);

                    //cW.initializeChart();
                },
                error: function(err) {
                        /* this will execute if the response couldn't be converted to a JS object,
                                or if the request was unsuccessful altogether. */
                }
            });
        },

        changeZoomExtents: function() {
            tttSM.publishData({message: "road"});
            tttSM.publishData({message: "transitmode"});
        },

        readInScenarioMainJSON: function() {
            console.log('readInScenarioMainJSON');

            //create GraphicsLayer
            //var tempGraphicsLayer = new GraphicsLayer({ id: "billLayer" });
            //var tempGraphicsLayer = new GraphicsLayer();

            ////Get rawmodelscenariofile
            //strRawMain = (curScenarioMain).replace('id_', 'rm_') + '.json';
            ////Raw Model Data
            //dojo.xhrGet({
            //    url: "widgets/tttScenarioManager/data/" + strRawMain,
            //    handleAs: "json",
            //    load: function(obj) {
            //        /* here, obj will already be a JS object deserialized from the JSON response */
            //        console.log(strRawMain);
            //        dataRawModelMain = obj;
            //        tttSM.publishData({message: "rawmodel"});
            //     },
            //     error: function(err) {
            //          /* this will execute if the response couldn't be converted to a JS object,
            //                  or if the request was unsuccessful altogether. */
            //      }
            //});

            //Get roadscenariofile
            strRoadMain = (curScenarioMain).replace('id_', 'ss_') + '.json';
            //Raw Model Data
            dojo.xhrGet({
                url: "widgets/tttScenarioManager/data/segsummaries/" + strRoadMain,
                handleAs: "json",
                load: function(obj) {
                    /* here, obj will already be a JS object deserialized from the JSON response */
                    console.log(strRoadMain);
                    dataRoadMain = obj;
                    tttSM.publishData({message: "road"});
                },
                error: function(err) {
                        /* this will execute if the response couldn't be converted to a JS object,
                                or if the request was unsuccessful altogether. */
                }
            });
            
            //Get transit mode file
            strTransitModeMain = curScenarioMain + '.json';
            //Raw Model Data
            dojo.xhrGet({
                url: "widgets/tttScenarioManager/data/transitdetailbymode/" + strTransitModeMain,
                handleAs: "json",
                load: function(obj) {
                    /* here, obj will already be a JS object deserialized from the JSON response */
                    console.log(strTransitModeMain);
                    dataTransitModeMain = obj;
                    tttSM.publishData({message: "transitmode"});
                },
                error: function(err) {
                        /* this will execute if the response couldn't be converted to a JS object,
                                or if the request was unsuccessful altogether. */
                }
            });

            //Get transit route file
            strTransitRouteMain = curScenarioMain + '.json';
            //Raw Model Data
            dojo.xhrGet({
                url: "widgets/tttScenarioManager/data/transitdetailbyroute/" + strTransitRouteMain,
                handleAs: "json",
                load: function(obj) {
                    /* here, obj will already be a JS object deserialized from the JSON response */
                    console.log(strTransitRouteMain);
                    dataTransitRouteMain = obj;
                    tttSM.publishData({message: "transitroute"});
                },
                error: function(err) {
                        /* this will execute if the response couldn't be converted to a JS object,
                                or if the request was unsuccessful altogether. */
                }
            });

            //Route Longnames
            dojo.xhrGet({
                url: "widgets/tttScenarioManager/data/routesummarynames_revised.json",
                handleAs: "json",
                load: function(obj) {
                    /* here, obj will already be a JS object deserialized from the JSON response */
                    console.log("routesummarynames_revised");
                    dataTransitRouteNames = obj;
                    tttSM.publishData({message: "transitroutenames"});
                },
                error: function(err) {
                        /* this will execute if the response couldn't be converted to a JS object,
                                or if the request was unsuccessful altogether. */
                }
            });
        },

        readInScenarioCompJSON: function() {
            console.log('readInScenarioCompJSON');
            ////Get rawmodelscenariofile
            //strRawComp = (curScenarioComp).replace('id_', 'rm_') + '.json';
            //Raw Model Data
            //dojo.xhrGet({
            //    url: "widgets/tttScenarioManager/data/" + strRawComp,
            //    handleAs: "json",
            //    load: function(obj) {
            //        /* here, obj will already be a JS object deserialized from the JSON response */
            //        console.log(strRawComp);
            //        dataRawModelComp = obj;
            //        tttSM.publishData({message: "rawmodel"});
            //    },
            //    error: function(err) {
            //          /* this will execute if the response couldn't be converted to a JS object,
            //                  or if the request was unsuccessful altogether. */
            //    }
            //});

            //Get roadscenariofile
            strRoadComp = (curScenarioComp).replace('id_', 'ss_') + '.json';
            //Raw Model Data
            dojo.xhrGet({
                url: "widgets/tttScenarioManager/data/segsummaries/" + strRoadComp,
                handleAs: "json",
                load: function(obj) {
                    /* here, obj will already be a JS object deserialized from the JSON response */
                    console.log(strRoadComp);
                    dataRoadComp = obj;
                    tttSM.publishData({message: "road"});
                },
                error: function(err) {
                      /* this will execute if the response couldn't be converted to a JS object,
                              or if the request was unsuccessful altogether. */
                }
            });

            //Get transit mode file
            strTransitRouteComp = curScenarioComp + '.json';
            //Raw Model Data
            dojo.xhrGet({
                url: "widgets/tttScenarioManager/data/transitdetailbyroute/" + strTransitRouteComp,
                handleAs: "json",
                load: function(obj) {
                    /* here, obj will already be a JS object deserialized from the JSON response */
                    console.log(strTransitRouteComp);
                    dataTransitRouteComp = obj;
                    tttSM.publishData({message: "transitroute"});
                },
                error: function(err) {
                        /* this will execute if the response couldn't be converted to a JS object,
                                or if the request was unsuccessful altogether. */
                }
            });

            //Get transit mode file
            strTransitModeComp = curScenarioComp + '.json';
            //Raw Model Data
            dojo.xhrGet({
                url: "widgets/tttScenarioManager/data/transitdetailbymode/" + strTransitModeComp,
                handleAs: "json",
                load: function(obj) {
                    /* here, obj will already be a JS object deserialized from the JSON response */
                    console.log(strTransitModeComp);
                    dataTransitModeComp = obj;
                    tttSM.publishData({message: "transitmode"});
                },
                error: function(err) {
                        /* this will execute if the response couldn't be converted to a JS object,
                                or if the request was unsuccessful altogether. */
                }
            });
        },

        //UpdateCCSs: function(a_strStationGroup) {

        //    //Build Options
        //    aCCSs = [];
        //    curSeletectedStations = [];
        //    sATRs="IN(";
        //    for (var i=0;i<stationGroupsCCSs.length;i++){
        //        if (stationGroupsCCSs[i].StationGroup==a_strStationGroup) {
        //            aCCSs.push({"label" : stationGroupsCCSs[i].StationName, "value" : stationGroupsCCSs[i].StationID});
        //            if (dom.byId("button").innerHTML == "Unselect All") {
        //                curSeletectedStations.push(stationGroupsCCSs[i].StationID);
        //            }
        //            sATRs += stationGroupsCCSs[i].StationID + ","
        //        }
        //    }
        //
        //    sATRs = sATRs.slice(0,-1) + ")";
        //
        //    //Populate Station Multi Select List
        //
        //    parent = this;
        //
        //    if (iFirst) {
        //        cmbCCS = new CheckedMultiSelect({
        //            id: "selectSG",
        //            name: "selectSGName",
        //            options: aCCSs,
        //            multiple: true,
        //            onChange: function(){
        //                curSeletectedStations = this.value;
        //                parent.UpdateCharts();
        //            }
        //        }, "cmbCCSs");
        //        cmbCCS.startup();
        //        cmbCCS.set("value", curSeletectedStations);
        //        iFirst = false;
        //    } else {
        //        cmbCCS.set("options", aCCSs).reset();
        //        cmbCCS.set("value", curSeletectedStations);
        //        cmbCCS.startup();
        //    }
        //},

        numberWithCommas: function(x) {
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
        }

    });
});