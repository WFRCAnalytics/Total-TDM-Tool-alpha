//javascript for controlling Transit Ridership App
//written by Bill Hereth February 2022

var dModeOptions = [
  { label: "All Transit"    , name: "all" , value: "0", selected: true },
  { label: "Local Bus"    , name: "lcl" , value: "4"         },
  { label: "Core Route"     , name: "brt5", value: "5"         },
  { label: "Express Bus"    , name: "exp" , value: "6"         },
  { label: "Bus Rapid Transit", name: "brt9", value: "9"         },
  { label: "Light Rail"     , name: "lrt" , value: "7"         },
  { label: "Commuter Rail"  , name: "crt" , value: "8"         }
];

var dRoadOptions = [
  {value:"Lanes" ,label:"Lanes"},
  {value:"Vol"   ,label:"Daily Volume (2-Way)"},
  {value:"AMSpd" ,label:"AM Period Speeds"},
  {value:"AMVC"  ,label:"AM Period V/C Ratio"},
  {value:"PMSpd" ,label:"PM Period Speeds"},
  {value:"PMVC"  ,label:"PM Period V/C Ratio"},
  {value:"VolTrk",label:"Daily Trucks"}
];

var sRoadOption = "Vol";

var sCBertGrad9 = "#Af2944"; //rgb(175,41,68)
var sCBertGrad8 = "#E5272d"; //rgb(229,39,45)
var sCBertGrad7 = "#Eb672d"; //rgb(235,103,45)
var sCBertGrad6 = "#E09d2e"; //rgb(224,157,46)
var sCBertGrad5 = "#8dc348"; //rgb(141,195,72)
var sCBertGrad4 = "#6cb74a"; //rgb(108,183,74)
var sCBertGrad3 = "#00a74e"; //rgb(0,167,78)
var sCBertGrad2 = "#1ba9e6"; //rgb(27,169,230)
var sCBertGrad1 = "#31398a"; //rgb(49,57,138)

var sCLaneGrad9 = "#000000"; //rgb(175,41,68)
var sCLaneGrad8 = "#222222"; //rgb(229,39,45)
var sCLaneGrad7 = "#800000"; //rgb(235,103,45)
var sCLaneGrad6 = "#FF0000"; //rgb(224,157,46)
var sCLaneGrad5 = "#66023C"; //rgb(141,195,72)
var sCLaneGrad4 = "#3c59ff"; //rgb(108,183,74)
var sCLaneGrad3 = "#86DC3D"; //rgb(0,167,78)
var sCLaneGrad2 = "#333333"; //rgb(27,169,230)
var sCLaneGrad1 = "#CCCCCC"; //rgb(49,57,138)

var sCVCGrad9 = "#000000"; //rgb(175,41,68)
var sCVCGrad8 = "#750227"; //rgb(229,39,45)
var sCVCGrad7 = "#AC131C"; //rgb(235,103,45)
var sCVCGrad6 = "#FF0D0D"; //rgb(224,157,46)
var sCVCGrad5 = "#FF0000"; //rgb(141,195,72)
var sCVCGrad4 = "#FD9A01"; //rgb(108,183,74)
var sCVCGrad3 = "#FEFB01"; //rgb(0,167,78)
var sCVCGrad2 = "#87FA00"; //rgb(27,169,230)
var sCVCGrad1 = "#00ED01"; //rgb(49,57,138)

var sCBertGrad0 = "#EEEEEE";

laneColorData = [sCLaneGrad1,sCLaneGrad2,sCLaneGrad3,sCLaneGrad4,sCLaneGrad5,sCLaneGrad6,sCLaneGrad7,sCLaneGrad8,sCLaneGrad9];
bertColorData = [sCBertGrad1,sCBertGrad2,sCBertGrad3,sCBertGrad4,sCBertGrad5,sCBertGrad6,sCBertGrad7,sCBertGrad8,sCBertGrad9];
vcColorData   = [sCVCGrad1,sCVCGrad2,sCVCGrad3,sCVCGrad4,sCVCGrad5,sCVCGrad6,sCVCGrad7,sCVCGrad8,sCVCGrad9];

//Typical Colors
var sCLightGrey     = "#EEEEEE";
var sCDefaultGrey   = "#CCCCCC";
var sCBlue1         = "#BED2FF";
var sCBlue2         = "#73B2FF";
var sCBlue3         = "#0070FF";
var sCBlue4         = "#005CE6";
var sCBlue5         = "#004DA8";
var sCRed1          = "#FFBEBE";
var sCRed2          = "#FF7F7F";
var sCRed3          = "#E60000";
var sCRed4          = "#730000";
var sCGreen1        = "#54ff00";
var sCGreen2        = "#4ce600";
var sCWhite         = "#ffffff";
var sSelectionColor = "#ffff00";//"#FF69B4"; //Hot Pink

var aCR_Change9  = new Array(sCBlue4,sCBlue3,sCBlue2,sCBlue1,sCDefaultGrey,sCRed1,sCRed2,sCRed3,sCRed4);

//Tranist Variables
var curMode = "";
var curRoadOption = sRoadOption;
var lyrLinks;
var sLinks = "LinksWithRiders_v2";

var minScaleForLabels = 87804;
var labelClassOn;
var labelClassOff;
var sCWhite = "#FFFFFF";
var dHaloSize = 2.0;

var bindata;
var dataFNConv;

var tttR;

var iPixelSelectionTolerance = 5;

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
  'esri/layers/GraphicsLayer',
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
function(declare, BaseWidget, LayerInfos, registry, dom, domStyle, dijit, Chart, Claro, Julie, SimpleTheme, Scatter, Markers, Columns, Legend, Tooltip, TableContainer, ScrollPane, ContentPane, PanelManager, TextBox, ToggleButton, LayerInfos, Query, QueryTask, GraphicsLayer, FeatureLayer, FeatureTable, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, TextSymbol, Font, LabelClass, InfoTemplate, Color, Map, ClassBreaksRenderer, UniqueValueRenderer, Extent, Memory, StoreSeries, Dialog, Button, RadioButton, MutliSelect, CheckedMultiSelect, Select, ComboBox, CheckBox, Observable) {
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

      tttR = this;
      
      this.inherited(arguments);
      //this.map.setInfoWindowOnClick(false); // turn off info window (popup) when clicking a feature

      //Daily Volume Renderers
      var aBrk_Vol_Absolute = new Array(
        {minValue:      0, maxValue:     5999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[0]), 0.50), label:   "Less than 6,000"},
        {minValue:   6000, maxValue:    17999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[1]), 1.10), label:   "6,000 to 18,000"},
        {minValue:  18000, maxValue:    35999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[2]), 1.70), label:  "18,000 to 36,000"},
        {minValue:  36000, maxValue:    71999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[3]), 2.30), label:  "36,000 to 72,000"},
        {minValue:  72000, maxValue:   119999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[4]), 3.90), label: "72,000 to 120,000"},
        {minValue: 120000, maxValue:   159999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[5]), 3.50), label:"120,000 to 160,000"},
        {minValue: 160000, maxValue:   199999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[6]), 4.10), label:"160,000 to 200,000"},
        {minValue: 200000, maxValue:   239999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[7]), 4.70), label:"200,000 to 240,000"},
        {minValue: 240000, maxValue: Infinity, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[8]), 5.30), label: "More than 240,000"}
      );
      renderer_Vol_Absolute = new ClassBreaksRenderer(null, 'Vol');
      for (var j=0;j<aBrk_Vol_Absolute.length;j++) {
        renderer_Vol_Absolute.addBreak(aBrk_Vol_Absolute[j]);
      }
      var aBrk_Vol_Change = new Array(
        {minValue: -9999999, maxValue:   -25001, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[0]), 5.0000), label: ""},
        {minValue:   -25000, maxValue:   -10001, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[1]), 2.5000), label: ""},
        {minValue:   -10000, maxValue:    -5001, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[2]), 1.2500), label: ""},
        {minValue:    -5000, maxValue:    -1001, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[3]), 0.6250), label: ""},
        {minValue:    -1000, maxValue:      999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[4]), 0.3125), label: ""},
        {minValue:     1000, maxValue:     4999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[5]), 0.6250), label: ""},
        {minValue:     5000, maxValue:     9999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[6]), 1.2500), label: ""},
        {minValue:    10000, maxValue:    49999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[7]), 2.5000), label: ""},
        {minValue:    50000, maxValue:    74999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[7]), 4.5000), label: ""},
        {minValue:    75000, maxValue:    99999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex("#000000"), 5.0000), label: ""},
        {minValue:   100000, maxValue: Infinity, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex("#000000"), 9.0000), label: ""}
      );
      renderer_Vol_Change = new ClassBreaksRenderer(null, 'Vol');
      for (var j=0;j<aBrk_Vol_Change.length;j++) {
        renderer_Vol_Change.addBreak(aBrk_Vol_Change[j]);
      }

      //Lanes Renderers
      var aBrk_Lanes_Absolute = new Array(
        {minValue:  1, maxValue:  3, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(laneColorData[0]), 0.50), label:"3 Lanes or Less" },
        {minValue:  4, maxValue:  5, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(laneColorData[1]), 1.25), label:"4 to 5 Lanes"    },
        {minValue:  6, maxValue:  7, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(laneColorData[2]), 2.00), label:"6 to 7 Lanes"    },
        {minValue:  8, maxValue:  9, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(laneColorData[3]), 2.75), label:"8 to 9 Lanes"    },
        {minValue: 10, maxValue: 11, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(laneColorData[4]), 3.50), label:"10 to 11 Lanes"  },
        {minValue: 12, maxValue: 13, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(laneColorData[5]), 4.25), label:"12 to 13 Lanes"  },
        {minValue: 14, maxValue: 15, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(laneColorData[6]), 5.00), label:"14 to 15 Lanes"  },
        {minValue: 16, maxValue: 17, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(laneColorData[7]), 5.75), label:"16 to 17 Lanes"  },
        {minValue: 18, maxValue: 99, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(laneColorData[8]), 6.50), label:"18 or More Lanes"}
      );
      renderer_Lanes_Absolute = new ClassBreaksRenderer(null, 'Lanes');
      for (var j=0;j<aBrk_Lanes_Absolute.length;j++) {
        renderer_Lanes_Absolute.addBreak(aBrk_Lanes_Absolute[j]);
      }
      var aBrk_Lanes_Change = new Array(
        {minValue: -99, maxValue: -4, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[0]), 5.0000), label: "-4 or More Lanes"},
        {minValue:  -3, maxValue: -3, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[1]), 3.7500), label: "-3 Lanes"        },
        {minValue:  -2, maxValue: -2, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[2]), 2.5000), label: "-2 Lanes"        },
        {minValue:  -1, maxValue: -1, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[3]), 1.2500), label: "-1 Lane"         },
        {minValue:   0, maxValue:  0, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[4]), 0.6250), label: "No Change"       },
        {minValue:   1, maxValue:  1, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[5]), 1.2500), label: "+1 Lane"         },
        {minValue:   2, maxValue:  2, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[6]), 2.5000), label: "+2 Lanes"        },
        {minValue:   3, maxValue:  3, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[7]), 3.7500), label: "+3 Lanes"        },
        {minValue:   4, maxValue: 99, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[8]), 5.0000), label: "+4 or More Lanes"}
      );
      renderer_Lanes_Change = new ClassBreaksRenderer(null, 'Lanes');
      for (var j=0;j<aBrk_Lanes_Change.length;j++) {
        renderer_Lanes_Change.addBreak(aBrk_Lanes_Change[j]);
      }

      //PM Speed Renderers
      var aBrk_Spd_Absolute = new Array(
        {minValue:  0, maxValue:       10, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[0]), 0.50), label:"Less than 10"},
        {minValue: 10, maxValue:       20, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[1]), 1.10), label:"10 to 20"    },
        {minValue: 20, maxValue:       30, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[2]), 1.70), label:"20 to 30"    },
        {minValue: 30, maxValue:       40, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[3]), 2.30), label:"30 to 40"    },
        {minValue: 40, maxValue:       50, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[4]), 3.90), label:"40 to 50"    },
        {minValue: 50, maxValue:       60, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[5]), 3.50), label:"50 to 60"    },
        {minValue: 60, maxValue:       70, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[6]), 4.10), label:"60 to 70"    },
        {minValue: 70, maxValue:       80, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[7]), 4.70), label:"70 to 80"    },
        {minValue: 80, maxValue: Infinity, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[8]), 5.30), label:"More than 80"}
      );
      renderer_AMSpd_Absolute = new ClassBreaksRenderer(null, 'AMSpd');
      for (var j=0;j<aBrk_Spd_Absolute.length;j++) {
        renderer_AMSpd_Absolute.addBreak(aBrk_Spd_Absolute[j]);
      }
      renderer_PMSpd_Absolute = new ClassBreaksRenderer(null, 'PMSpd');
      for (var j=0;j<aBrk_Spd_Absolute.length;j++) {
        renderer_PMSpd_Absolute.addBreak(aBrk_Spd_Absolute[j]);
      }
      var aBrk_Spd_Change = new Array(
        {minValue: -999, maxValue:      -30, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[0]), 5.0000), label: "Less than -30" },
        {minValue:  -30, maxValue:      -20, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[1]), 2.5000), label: "-30 to -20"    },
        {minValue:  -20, maxValue:      -10, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[2]), 1.2500), label: "-20 to -10"    },
        {minValue:  -10, maxValue:       -5, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[3]), 0.6250), label: "-10 to -5"     },
        {minValue:   -5, maxValue:        5, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[4]), 0.3125), label: "-5 to 5"       },
        {minValue:    5, maxValue:       10, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[5]), 0.6250), label: "5 to 10"       },
        {minValue:   10, maxValue:       20, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[6]), 1.2500), label: "10 to 20"      },
        {minValue:   20, maxValue:       30, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[7]), 2.5000), label: "20 to 30"      },
        {minValue:   30, maxValue: Infinity, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[8]), 5.0000), label: "More than 30"  }
      );
      renderer_AMSpd_Change = new ClassBreaksRenderer(null, 'AMSpd');
      for (var j=0;j<aBrk_Spd_Change.length;j++) {
        renderer_AMSpd_Change.addBreak(aBrk_Spd_Change[j]);
      }
      renderer_PMSpd_Change = new ClassBreaksRenderer(null, 'PMSpd');
      for (var j=0;j<aBrk_Spd_Change.length;j++) {
        renderer_PMSpd_Change.addBreak(aBrk_Spd_Change[j]);
      }

      //PM V/C Renderers
      var aBrk_VC_Absolute = new Array(
        {minValue: 0.00, maxValue:     0.49, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(vcColorData[0]), 0.50), label: "Less than 0.50"},
        {minValue: 0.50, maxValue:     0.74, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(vcColorData[1]), 1.10), label: "0.50 to 0.74"  },
        {minValue: 0.75, maxValue:     0.84, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(vcColorData[2]), 1.70), label: "0.75 to 0.85"  },
        {minValue: 0.85, maxValue:     0.94, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(vcColorData[3]), 2.30), label: "0.85 to 0.95"  },
        {minValue: 0.95, maxValue:     0.99, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(vcColorData[4]), 3.90), label: "0.95 to 1.00"  },
        {minValue: 1.00, maxValue:     1.24, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(vcColorData[5]), 3.50), label: "1.00 to 1.25"  },
        {minValue: 1.25, maxValue:     1.49, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(vcColorData[6]), 4.10), label: "1.25 to 1.50"  },
        {minValue: 1.50, maxValue:     1.99, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(vcColorData[7]), 4.70), label: "1.50 to 2.00"  },
        {minValue: 2.00, maxValue: Infinity, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(vcColorData[8]), 5.30), label: "More than 2.00"}
      );
      renderer_AMVC_Absolute = new ClassBreaksRenderer(null, 'AMVC');
      for (var j=0;j<aBrk_VC_Absolute.length;j++) {
        renderer_AMVC_Absolute.addBreak(aBrk_VC_Absolute[j]);
      }
      renderer_PMVC_Absolute = new ClassBreaksRenderer(null, 'PMVC');
      for (var j=0;j<aBrk_VC_Absolute.length;j++) {
        renderer_PMVC_Absolute.addBreak(aBrk_VC_Absolute[j]);
      }
      var aBrk_VC_Change = new Array(
        {minValue: -999999, maxValue:    -0.51, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[0]), 5.0000), label: "Less than -0.50"},
        {minValue:   -0.50, maxValue:    -0.26, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[1]), 2.5000), label: "-0.50 to -0.25" },
        {minValue:   -0.25, maxValue:    -0.11, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[2]), 1.2500), label: "-0.25 to -0.10" },
        {minValue:   -0.10, maxValue:    -0.06, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[3]), 0.6250), label: "-0.10 to -0.05" },
        {minValue:   -0.05, maxValue:     0.05, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[4]), 0.3125), label: "-0.05 to 0.05"  },
        {minValue:    0.05, maxValue:     0.09, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[5]), 0.6250), label: "0.05 to 0.10"   },
        {minValue:    0.10, maxValue:     0.24, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[6]), 1.2500), label: "0.10 to 0.25"   },
        {minValue:    0.25, maxValue:     0.49, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[7]), 2.5000), label: "0.25 to 0.50"   },
        {minValue:    0.50, maxValue: Infinity, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[8]), 5.0000), label: "More than 0.50" }
      );
      renderer_AMVC_Change = new ClassBreaksRenderer(null, 'AMVC');
      for (var j=0;j<aBrk_VC_Change.length;j++) {
        renderer_AMVC_Change.addBreak(aBrk_VC_Change[j]);
      }
      renderer_PMVC_Change = new ClassBreaksRenderer(null, 'PMVC');
      for (var j=0;j<aBrk_VC_Change.length;j++) {
        renderer_PMVC_Change.addBreak(aBrk_VC_Change[j]);
      }

      //Truck Volume Renderers
      var aBrk_VolTrk_Absolute = new Array(
        {minValue:     0, maxValue:      599, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[0]), 0.50), label: "Less than 600"   },
        {minValue:   600, maxValue:     1799, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[1]), 1.10), label: "600 to 1,800"    },
        {minValue:  1800, maxValue:     3599, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[2]), 1.70), label: "1,800 to 3,600"  },
        {minValue:  3600, maxValue:     7199, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[3]), 2.30), label: "3,600 to 7,200"  },
        {minValue:  7200, maxValue:    11999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[4]), 3.90), label: "7,200 to 12,000" },
        {minValue: 12000, maxValue:    15999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[5]), 3.50), label: "12,000 to 16,000"},
        {minValue: 16000, maxValue:    19999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[6]), 4.10), label: "16,000 to 20,000"},
        {minValue: 20000, maxValue:    23999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[7]), 4.70), label: "20,000 to 24,000"},
        {minValue: 24000, maxValue: Infinity, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(bertColorData[8]), 5.30), label: "More than 24,000"}
      );
      renderer_VolTrk_Absolute = new ClassBreaksRenderer(null, 'VolTrk');
      for (var j=0;j<aBrk_VolTrk_Absolute.length;j++) {
        renderer_VolTrk_Absolute.addBreak(aBrk_VolTrk_Absolute[j]);
      }
      var aBrk_TrkVol_Change = new Array(
        {minValue: -999999, maxValue:    -2501, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[0]), 5.0000), label: "Less than -2,500"},
        {minValue:   -2500, maxValue:    -1001, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[1]), 2.5000), label: "-2,500 to -1,000"},
        {minValue:   -1000, maxValue:     -501, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[2]), 1.2500), label: "-1,000 than -500"},
        {minValue:    -500, maxValue:     -101, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[3]), 0.6250), label: "-500 to -100"    },
        {minValue:    -100, maxValue:       99, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[4]), 0.3125), label: "-100 to 100"     },
        {minValue:     100, maxValue:      499, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[5]), 0.6250), label: "100 to 500"      },
        {minValue:     500, maxValue:      999, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[6]), 1.2500), label: "500 to 1,000"    },
        {minValue:    1000, maxValue:     2499, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[7]), 2.5000), label: "1,000 to 2,500"  },
        {minValue:    2500, maxValue: Infinity, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change9[8]), 5.0000), label: "More than 2,500" }
      );
      renderer_VolTrk_Change = new ClassBreaksRenderer(null, 'VolTrk');
      for (var j=0;j<aBrk_TrkVol_Change.length;j++) {
        renderer_VolTrk_Change.addBreak(aBrk_TrkVol_Change[j]);
      }

      dojo.xhrGet({
        url: "widgets/tttScenarioManager/data/segsummaries/_config_segsummary_fieldname_conversion.json",
        handleAs: "json",
        load: function(obj) {
            /* here, obj will already be a JS object deserialized from the JSON response */
            console.log('_config_segsummary_fieldname_conversion.json');
            dataFNConv = obj;
        },
        error: function(err) {
                /* this will execute if the response couldn't be converted to a JS object,
                        or if the request was unsuccessful altogether. */
        }
      });


      var divRoadOptions = dom.byId("divRoadOptions");
      
      for (d in dRoadOptions) {

        if (dRoadOptions[d].value == sRoadOption) {
          bChecked = true;
        } else {
          bChecked = false;
        }
        
        var rbRoadOption = new RadioButton({ name:"RoadOption", label:dRoadOptions[d].label, id:"rb_" + dRoadOptions[d].value, value: dRoadOptions[d].value, checked: bChecked});
        rbRoadOption.startup();
        rbRoadOption.placeAt(divRoadOptions);
        
        var lblDOWPeak = dojo.create('label', {
          innerHTML: dRoadOptions[d].label,
          for: rbRoadOption.id
        }, divRoadOptions);
        
        dojo.place("<br/>", divRoadOptions);

        //Radio Buttons Change Event
        dom.byId("rb_" + dRoadOptions[d].value).onchange = function(isChecked) {
          if(isChecked) {
            curRoadOption = this.value;
            console.log('Radio button select: ' + curRoadOption);
            tttR.updateRoadDisplay();
          }
        }
      }

      


      tttR.updateRoadDisplay();
    },

    updateRoadDisplay: function() {
      console.log('updateRoadDisplay');

      if (curScenarioComp=='none') {
        if (curRoadOption=='Vol') {
          _renderer = renderer_Vol_Absolute;
        } else if (curRoadOption=='AMSpd') {
          _renderer = renderer_AMSpd_Absolute;
        } else if (curRoadOption=='AMVC') {
          _renderer = renderer_AMVC_Absolute;
        } else if (curRoadOption=='Lanes') {
          _renderer = renderer_Lanes_Absolute;
        }else if (curRoadOption=='PMSpd') {
          _renderer = renderer_PMSpd_Absolute;
        } else if (curRoadOption=='PMVC') {
          _renderer = renderer_PMVC_Absolute;
        } else if (curRoadOption=='VolTrk') {
          _renderer = renderer_VolTrk_Absolute;
        }
      } else {
        if (curRoadOption=='Vol') {
          _renderer = renderer_Vol_Change;
        } else if (curRoadOption=='AMSpd') {
          _renderer = renderer_AMSpd_Change;
        } else if (curRoadOption=='AMVC') {
          _renderer = renderer_AMVC_Change;
        } else if (curRoadOption=='Lanes') {
          _renderer = renderer_Lanes_Change;
        }else if (curRoadOption=='PMSpd') {
          _renderer = renderer_PMSpd_Change;
        } else if (curRoadOption=='PMVC') {
          _renderer = renderer_PMVC_Change;
        } else if (curRoadOption=='VolTrk') {
          _renderer = renderer_VolTrk_Change;
        }
      }

      // divider seg
      strMiddleSeg1 = '2102_003.0';
      strMiddleSeg2 = 'MAG_6018';

      // clear all graphics
      tttR.map.graphics.clear();

      // run multiple times to avoid 2000 limit on returned features
      tttR._queryFeatures("SEGID <= '" + strMiddleSeg1 + "'");
      tttR._queryFeatures("SEGID  > '" + strMiddleSeg1 + "' AND SEGID <= '" + strMiddleSeg2 + "'");
      tttR._queryFeatures("SEGID  > '" + strMiddleSeg2 + "'");
    },

    _queryFeatures: function(_filterstring){ 

      var query, updateFeature;
      query = new Query();
      query.outFields = ["*"];
      query.returnGeometry = false;
      //query.where = "1=1";
      query.where = _filterstring

      
      lyrSegments.queryFeatures(query,function(featureSet) {
        //Update values
        var resultCount = featureSet.features.length;
        for (var i = 0; i < resultCount; i++) {
          updateFeature = featureSet.features[i];
          _segid = updateFeature.attributes['SEGID']
          //A: SEGID
          //I: DY_VOL_2WY

          _mainValue_Vol       = 0;
          _mainValue_Lanes     = 0;
          _mainValue_Lanes1    = 0;
          _mainValue_Lanes2    = 0;
          _mainValue_AMSpd     = 0;
          _mainValue_AMSpd1    = 0;
          _mainValue_AMSpd2    = 0;
          _mainValue_AMVC      = 0;
          _mainValue_AMVC1     = 0;
          _mainValue_AMVC2     = 0;
          _mainValue_PMSpd     = 0;
          _mainValue_PMSpd1    = 0;
          _mainValue_PMSpd2    = 0;
          _mainValue_PMVC      = 0;
          _mainValue_PMVC1     = 0;
          _mainValue_PMVC2     = 0;
          _mainValue_VolTrk    = 0;
          _compValue_Vol       = 0;
          _compValue_Lanes     = 0;
          _compValue_Lanes1    = 0;
          _compValue_Lanes2    = 0;
          _compValue_AMSpd     = 0;
          _compValue_AMSpd1    = 0;
          _compValue_AMSpd2    = 0;
          _compValue_AMVC      = 0;
          _compValue_AMVC1     = 0;
          _compValue_AMVC2     = 0;
          _compValue_PMSpd     = 0;
          _compValue_PMSpd1    = 0;
          _compValue_PMSpd2    = 0;
          _compValue_PMVC      = 0;
          _compValue_PMVC1     = 0;
          _compValue_PMVC2     = 0;
          _compValue_VolTrk    = 0;
          _dispValue_Vol       = 0;
          _dispValue_Lanes     = 0;
          _compValue_Lanes1    = 0;
          _compValue_Lanes2    = 0;
          _dispValue_AMSpd     = 0;
          _dispValue_AMSpd1    = 0;
          _dispValue_AMSpd2    = 0;
          _dispValue_AMVC      = 0;
          _dispValue_AMVC1     = 0;
          _dispValue_AMVC2     = 0;
          _dispValue_PMSpd     = 0;
          _dispValue_PMSpd1    = 0;
          _dispValue_PMSpd2    = 0;
          _dispValue_PMVC      = 0;
          _dispValue_PMVC1     = 0;
          _dispValue_PMVC2     = 0;
          _dispValue_VolTrk    = 0;

          try {
            _mainValue_Vol      = dataRoadMain[_segid][dataFNConv['DY_VOL'  ]];
            _mainValue_Lanes    = dataRoadMain[_segid][dataFNConv['LANES'   ]];
            _mainValue_Lanes1   = dataRoadMain[_segid][dataFNConv['D1_LANES']];
            _mainValue_Lanes2   = dataRoadMain[_segid][dataFNConv['D2_LANES']];

            if (dataRoadMain[_segid][dataFNConv['D1_LANES']]>0) {

              _mainValue_AMSpd1 = dataRoadMain[_segid][dataFNConv['D1_AM_SPD']];
              _mainValue_AMVC1  = dataRoadMain[_segid][dataFNConv['D1_AM_VOL']] / (3 * dataRoadMain[_segid][dataFNConv['D1_LANES']] * dataRoadMain[_segid][dataFNConv['D1_CAP1HL']]);

              _mainValue_PMSpd1 = dataRoadMain[_segid][dataFNConv['D1_PM_SPD']];
              _mainValue_PMVC1  = dataRoadMain[_segid][dataFNConv['D1_PM_VOL']] / (3 * dataRoadMain[_segid][dataFNConv['D1_LANES']] * dataRoadMain[_segid][dataFNConv['D1_CAP1HL']]);

              if (dataRoadMain[_segid][dataFNConv['D2_LANES']]>0) {

                _mainValue_AMSpd2 = dataRoadMain[_segid][dataFNConv['D2_AM_SPD']];
                _mainValue_AMVC2  = dataRoadMain[_segid][dataFNConv['D2_AM_VOL']] / (3 * dataRoadMain[_segid][dataFNConv['D2_LANES']] * dataRoadMain[_segid][dataFNConv['D2_CAP1HL']]);

                _mainValue_PMSpd2 = dataRoadMain[_segid][dataFNConv['D2_PM_SPD']];
                _mainValue_PMVC2  = dataRoadMain[_segid][dataFNConv['D2_PM_VOL']] / (3 * dataRoadMain[_segid][dataFNConv['D2_LANES']] * dataRoadMain[_segid][dataFNConv['D2_CAP1HL']]);
  
                _mainValue_AMSpd  = Math.min(_mainValue_AMSpd1, _mainValue_AMSpd2)
                _mainValue_AMVC   = Math.max(_mainValue_AMVC1 , _mainValue_AMVC2 )
                
                _mainValue_PMSpd  = Math.min(_mainValue_PMSpd1, _mainValue_PMSpd2)
                _mainValue_PMVC   = Math.max(_mainValue_PMVC1 , _mainValue_PMVC2 )
  
              } else {
                _mainValue_PMSpd  = _mainValue_PMSpd1;
                _mainValue_PMVC   = _mainValue_PMVC1;
              }
            } else {
              _mainValue_PMSpd  = null;
              _mainValue_PMVC   = null;
            }

            _mainValue_VolTrk = dataRoadMain[_segid][dataFNConv['DY_LT']] + dataRoadMain[_segid][dataFNConv['DY_MD']] + dataRoadMain[_segid][dataFNConv['DY_HV']];

            if (curScenarioComp!='none') {
              try {
                _compValue_Vol      = dataRoadComp[_segid][dataFNConv['DY_VOL']];
                _compValue_Lanes    = dataRoadComp[_segid][dataFNConv['LANES' ]];

                _mainValue_Lanes1   = dataRoadComp[_segid][dataFNConv['D1_LANES']];
                _mainValue_Lanes2   = dataRoadComp[_segid][dataFNConv['D2_LANES']];
    
                if (dataRoadComp[_segid][dataFNConv['D1_LANES']]>0) {

                  _compValue_AMSpd1 = dataRoadComp[_segid][dataFNConv['D1_AM_SPD']];
                  _compValue_AMVC1  = dataRoadComp[_segid][dataFNConv['D1_AM_VOL']] / (3 * dataRoadComp[_segid][dataFNConv['D1_LANES']] * dataRoadComp[_segid][dataFNConv['D1_CAP1HL']]);
    
                  _compValue_PMSpd1 = dataRoadComp[_segid][dataFNConv['D1_PM_SPD']];
                  _compValue_PMVC1  = dataRoadComp[_segid][dataFNConv['D1_PM_VOL']] / (3 * dataRoadComp[_segid][dataFNConv['D1_LANES']] * dataRoadComp[_segid][dataFNConv['D1_CAP1HL']]);
    
                  if (dataRoadComp[_segid][dataFNConv['D2_LANES']]>0) {

                    _compValue_AMSpd2 = dataRoadComp[_segid][dataFNConv['D2_AM_SPD']];
                    _compValue_AMVC2  = dataRoadComp[_segid][dataFNConv['D2_AM_VOL']] / (3 * dataRoadComp[_segid][dataFNConv['D2_LANES']] * dataRoadComp[_segid][dataFNConv['D2_CAP1HL']]);

                    _compValue_PMSpd2 = dataRoadComp[_segid][dataFNConv['D2_PM_SPD']];
                    _compValue_PMVC2  = dataRoadComp[_segid][dataFNConv['D2_PM_VOL']] / (3 * dataRoadComp[_segid][dataFNConv['D2_LANES']] * dataRoadComp[_segid][dataFNConv['D2_CAP1HL']]);
      
                    _compValue_AMSpd  = Math.min(_compValue_AMSpd1, _compValue_AMSpd2)
                    _compValue_AMVC   = Math.max(_compValue_AMVC1 , _compValue_AMVC2 )

                    _compValue_PMSpd  = Math.min(_compValue_PMSpd1, _compValue_PMSpd2)
                    _compValue_PMVC   = Math.max(_compValue_PMVC1 , _compValue_PMVC2 )
      
                  } else {
                    _compValue_PMSpd  = _compValue_PMSpd1;
                    _compValue_PMVC   = _compValue_PMVC1;
                  }
                } else {
                  _compValue_PMSpd  = 0;
                  _compValue_PMVC   = 0;
                }

                _compValue_VolTrk = dataRoadComp[_segid][dataFNConv['DY_LT']] + dataRoadComp[_segid][dataFNConv['DY_MD']] + dataRoadComp[_segid][dataFNConv['DY_HV']];

                _dispValue_Vol       = _mainValue_Vol    - _compValue_Vol   ;
                _dispValue_Lanes     = _mainValue_Lanes  - _compValue_Lanes ;
                _dispValue_Lanes1    = _mainValue_Lanes1 - _compValue_Lanes1;
                _dispValue_Lanes2    = _mainValue_Lanes2 - _compValue_Lanes2;
                _dispValue_AMSpd     = _mainValue_AMSpd  - _compValue_AMSpd ;
                _dispValue_AMSpd1    = _mainValue_AMSpd1 - _compValue_AMSpd1;
                _dispValue_AMSpd2    = _mainValue_AMSpd2 - _compValue_AMSpd2;
                _dispValue_AMVC      = _mainValue_AMVC   - _compValue_AMVC  ;
                _dispValue_AMVC1     = _mainValue_AMVC1  - _compValue_AMVC1 ;
                _dispValue_AMVC2     = _mainValue_AMVC2  - _compValue_AMVC2 ;
                _dispValue_PMSpd     = _mainValue_PMSpd  - _compValue_PMSpd ;
                _dispValue_PMSpd1    = _mainValue_PMSpd1 - _compValue_PMSpd1;
                _dispValue_PMSpd2    = _mainValue_PMSpd2 - _compValue_PMSpd2;
                _dispValue_PMVC      = _mainValue_PMVC   - _compValue_PMVC  ;
                _dispValue_PMVC1     = _mainValue_PMVC1  - _compValue_PMVC1 ;
                _dispValue_PMVC2     = _mainValue_PMVC2  - _compValue_PMVC2 ;
                _dispValue_VolTrk    = _mainValue_VolTrk - _compValue_VolTrk;

              } catch(err) {
                _dispValue_Vol       = _mainValue_Vol   ;
                _dispValue_Lanes     = _mainValue_Lanes ;
                _dispValue_Lanes1    = _mainValue_Lanes1;
                _dispValue_Lanes2    = _mainValue_Lanes2;
                _dispValue_AMSpd     = _mainValue_AMSpd ;
                _dispValue_AMSpd1    = _mainValue_AMSpd1;
                _dispValue_AMSpd2    = _mainValue_AMSpd2;
                _dispValue_AMVC      = _mainValue_AMVC  ;
                _dispValue_AMVC1     = _mainValue_AMVC1 ;
                _dispValue_AMVC2     = _mainValue_AMVC2 ;
                _dispValue_PMSpd     = _mainValue_PMSpd ;
                _dispValue_PMSpd1    = _mainValue_PMSpd1;
                _dispValue_PMSpd2    = _mainValue_PMSpd2;
                _dispValue_PMVC      = _mainValue_PMVC  ;
                _dispValue_PMVC1     = _mainValue_PMVC1 ;
                _dispValue_PMVC2     = _mainValue_PMVC2 ;
                _dispValue_VolTrk    = _mainValue_VolTrk;
              }
            } else {
              _dispValue_Vol       = _mainValue_Vol   ;
              _dispValue_Lanes     = _mainValue_Lanes ;
              _dispValue_Lanes1    = _mainValue_Lanes1;
              _dispValue_Lanes2    = _mainValue_Lanes2;
              _dispValue_AMSpd     = _mainValue_AMSpd ;
              _dispValue_AMSpd1    = _mainValue_AMSpd1;
              _dispValue_AMSpd2    = _mainValue_AMSpd2;
              _dispValue_AMVC      = _mainValue_AMVC  ;
              _dispValue_AMVC1     = _mainValue_AMVC1 ;
              _dispValue_AMVC2     = _mainValue_AMVC2 ;
              _dispValue_PMSpd     = _mainValue_PMSpd ;
              _dispValue_PMSpd1    = _mainValue_PMSpd1;
              _dispValue_PMSpd2    = _mainValue_PMSpd2;
              _dispValue_PMVC      = _mainValue_PMVC  ;
              _dispValue_PMVC1     = _mainValue_PMVC1 ;
              _dispValue_PMVC2     = _mainValue_PMVC2 ;
              _dispValue_VolTrk    = _mainValue_VolTrk;
            }
            
            updateFeature.attributes['Vol'   ] = _dispValue_Vol   ;
            updateFeature.attributes['Lanes' ] = _dispValue_Lanes ;
            updateFeature.attributes['Lanes1'] = _dispValue_Lanes1;
            updateFeature.attributes['Lanes2'] = _dispValue_Lanes2;
            updateFeature.attributes['AMSpd' ] = _dispValue_AMSpd ;
            updateFeature.attributes['AMSpd1'] = _dispValue_AMSpd1;
            updateFeature.attributes['AMSpd2'] = _dispValue_AMSpd2;
            updateFeature.attributes['AMVC'  ] = _dispValue_AMVC  ;
            updateFeature.attributes['AMVC1' ] = _dispValue_AMVC1 ;
            updateFeature.attributes['AMVC2' ] = _dispValue_AMVC2 ;
            updateFeature.attributes['PMSpd' ] = _dispValue_PMSpd ;
            updateFeature.attributes['PMSpd1'] = _dispValue_PMSpd1;
            updateFeature.attributes['PMSpd2'] = _dispValue_PMSpd2;
            updateFeature.attributes['PMVC'  ] = _dispValue_PMVC  ;
            updateFeature.attributes['PMVC1' ] = _dispValue_PMVC1 ;
            updateFeature.attributes['PMVC2' ] = _dispValue_PMVC2 ;
            updateFeature.attributes['VolTrk'] = _dispValue_VolTrk;
            
            tttR.map.graphics.add(updateFeature);

            
          }
          catch(err) {
            updateFeature.attributes['Vol'   ] = null;
            updateFeature.attributes['Lanes' ] = null;
            updateFeature.attributes['Lanes1'] = null;
            updateFeature.attributes['Lanes2'] = null;
            updateFeature.attributes['AMSpd' ] = null;
            updateFeature.attributes['AMSpd1'] = null;
            updateFeature.attributes['AMSpd2'] = null;
            updateFeature.attributes['AMVC'  ] = null;
            updateFeature.attributes['AMVC1' ] = null;
            updateFeature.attributes['AMVC2' ] = null;
            updateFeature.attributes['PMSpd' ] = null;
            updateFeature.attributes['PMSpd1'] = null;
            updateFeature.attributes['PMSpd2'] = null;
            updateFeature.attributes['PMVC'  ] = null;
            updateFeature.attributes['PMVC1' ] = null;
            updateFeature.attributes['PMVC2' ] = null;
            updateFeature.attributes['VolTrk'] = null;
          }
        }

        tttR.map.graphics.setRenderer(_renderer);
        tttR.map.graphics.refresh();

      });

      //lyrSegments.show();

    },

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

    checkVolLabel: function() {
      console.log('checkVolLabel');
      if (dom.byId("chkLabels").checked == true) {
        lyrLinks[this.getCurDispLayerLoc()].setLabelingInfo([ labelClassOn  ] );
      } else {
        lyrLinks[this.getCurDispLayerLoc()].setLabelingInfo([ labelClassOff ]);
      }
      
    },
    
    getMethods: function (obj) 
    {
      var res = [];
      for(var m in obj) {
        if(typeof obj[m] == "function") {
          res.push(m)
        }
      }
      return res;
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
      if(data.message=='road'){
        tttR.updateRoadDisplay();
      }
    },
  });
});