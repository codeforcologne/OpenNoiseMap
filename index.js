/*
https://www.codefor.de/koeln/
contact@opendemdata.info 
based on Openlayers: https://openlayers.org/
License: BSD 2-Clause License
https://tldrlegal.com/license/bsd-2-clause-license-(freebsd)
*/

import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import GeoJSON from "ol/format/GeoJSON";
import OSM from "ol/source/OSM";
import VectorTileSource from "ol/source/VectorTile";
import { Tile as TileLayer, VectorTile as VectorTileLayer } from "ol/layer";
import Projection from "ol/proj/Projection";
import { defaults as defaultControls, Control } from "ol/control";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import Overlay from "ol/Overlay";
import { toStringHDMS } from "ol/coordinate";
import { toLonLat } from "ol/proj";

var startDate = new Date();
var begin;
var today;
var nomore = "2020-03-17";

// Custom Control Toggle Tools
var SwitchControl = /*@__PURE__*/ (function (Control) {
  function SwitchControl(opt_options) {
    var options = opt_options || {};
    var switchDiv = document.createElement("div");
    switchDiv.style.cssText =
      "position:absolute;top:0px;left:1px; width:30px; height:30px;";
    switchDiv.className = "switchDiv";
    switchDiv.id = "switchDiv";
    Control.call(this, {
      element: switchDiv,
      target: options.target,
    });
    switchDiv.addEventListener(
      "click",
      this.handleSwitchDivChange.bind(this),
      false
    );
  }
  if (Control) SwitchControl.__proto__ = Control;
  SwitchControl.prototype = Object.create(Control && Control.prototype);
  SwitchControl.prototype.constructor = SwitchControl;
  SwitchControl.prototype.handleSwitchDivChange = function handleSelection() {
    var selfDiv = document.getElementById("switchDiv");
    var controlEle = document.getElementById("controlEle");
    if (controlEle.style.display === "none") {
      controlEle.style.display = "block";
      selfDiv.className = "switchDiv";
    } else {
      controlEle.style.display = "none";
      selfDiv.className = "switchDivHide";
    }
  };
  return SwitchControl;
})(Control);

// Custom Control Selector Tools
var SelectorControl = /*@__PURE__*/ (function (Control) {
  function SelectorControl(opt_options) {
    var options = opt_options || {};
    // night or day
    var radioItem1 = document.createElement("input");
    radioItem1.type = "radio";
    radioItem1.name = "radioGrp";
    radioItem1.id = "rad1";
    radioItem1.value = "myradio1";
    radioItem1.defaultChecked = true;
    radioItem1.checked = true;
    var radioItem2 = document.createElement("input");
    radioItem2.type = "radio";
    radioItem2.name = "radioGrp";
    radioItem2.id = "rad2";
    radioItem2.value = "myradio2";
    var objTextNode1 = document.createTextNode("Tag: 6-22 Uhr");
    var objTextNode2 = document.createTextNode("Nacht: 22-6 Uhr");
    var objTextNode4 = document.createElement("P");
    objTextNode4.innerHTML = "&nbsp; < Schwellenwert >= &nbsp;";
    objTextNode4.id = "schwellenwert";
    objTextNode4.style.cssText = "position:absolute;top:165px;left:30px";
    var objLabel = document.createElement("label");
    objLabel.style.cssText = "position:absolute;top:50px;left:10px";
    objLabel.htmlFor = radioItem1.id;
    objLabel.appendChild(radioItem1);
    objLabel.appendChild(objTextNode1);
    var objLabel2 = document.createElement("label");
    objLabel2.style.cssText = "position:absolute;top:70px;left:10px;";
    objLabel2.htmlFor = radioItem2.id;
    objLabel2.appendChild(radioItem2);
    objLabel2.appendChild(objTextNode2);
    // select db values
    var selectEle = document.createElement("SELECT");
    selectEle.style.cssText =
      "position:absolute;top:100px;left:10px;width:200px;";
    selectEle.setAttribute("id", "selectEle");
    var db_35 = document.createElement("option");
    db_35.setAttribute("value", "35");
    var t = document.createTextNode("35 dB");
    db_35.appendChild(t);
    selectEle.appendChild(db_35);
    var db_40 = document.createElement("option");
    db_40.setAttribute("value", "40");
    var t = document.createTextNode("40 dB");
    db_40.appendChild(t);
    selectEle.appendChild(db_40);
    var db_45 = document.createElement("option");
    db_45.setAttribute("value", "45");
    var t = document.createTextNode("45 dB");
    db_45.appendChild(t);
    selectEle.appendChild(db_45);
    var db_50 = document.createElement("option");
    db_50.setAttribute("value", "50");
    var t = document.createTextNode("50 dB");
    db_50.appendChild(t);
    selectEle.appendChild(db_50);
    var db_55 = document.createElement("option");
    db_55.setAttribute("value", "55");
    var t = document.createTextNode("55 dB");
    db_55.appendChild(t);
    selectEle.appendChild(db_55);
    var db_60 = document.createElement("option");
    db_60.setAttribute("value", "60");
    var t = document.createTextNode("60 dB");
    db_60.appendChild(t);
    selectEle.appendChild(db_60);
    var db_65 = document.createElement("option");
    db_65.setAttribute("value", "65");
    var t = document.createTextNode("65 dB");
    db_65.appendChild(t);
    selectEle.appendChild(db_65);
    var db_70 = document.createElement("option");
    db_70.setAttribute("value", "70");
    var t = document.createTextNode("70 dB");
    db_70.appendChild(t);
    selectEle.appendChild(db_70);
    var db_75 = document.createElement("option");
    db_75.setAttribute("value", "75");
    var t = document.createTextNode("75 dB");
    db_75.appendChild(t);
    selectEle.appendChild(db_75);
    var db_80 = document.createElement("option");
    db_80.setAttribute("value", "80");
    var t = document.createTextNode("80 dB");
    db_80.appendChild(t);
    selectEle.appendChild(db_80);
    var db_85 = document.createElement("option");
    db_85.setAttribute("value", "85");
    db_85.setAttribute("selected", "selected");
    var t = document.createTextNode("85 dB");
    db_85.appendChild(t);
    selectEle.appendChild(db_85);
    var db_90 = document.createElement("option");
    db_90.setAttribute("value", "90");
    var t = document.createTextNode("90 dB");
    db_90.appendChild(t);
    selectEle.appendChild(db_90);
    var db_95 = document.createElement("option");
    db_95.setAttribute("value", "95");
    var t = document.createTextNode("95 dB");
    db_95.appendChild(t);
    selectEle.appendChild(db_95);
    var db_100 = document.createElement("option");
    db_100.setAttribute("value", "100");
    var t = document.createTextNode("100 dB");
    db_100.appendChild(t);
    selectEle.appendChild(db_100);
    // slider
    var objSpanNode1 = document.createElement("span");
    objSpanNode1.id = "objSpanNode1";
    objSpanNode1.style.cssText = "position:absolute;top:22px;left:1px;";
    objSpanNode1.innerHTML = "0";
    var objSpanNode2 = document.createElement("span");
    objSpanNode2.id = "objSpanNode2";
    objSpanNode2.style.cssText = "position:absolute;top:22px;left:210px;";
    objSpanNode2.innerHTML = "400";
    var objSpanNode3 = document.createElement("span");
    objSpanNode3.id = "objSpanNode3";
    objSpanNode3.innerHTML = "5";
    var objTextNodeSlider = document.createTextNode(
      "Schwellenwert Überschreitungen: "
    );
    var slider = document.createElement("input");
    slider.orient = "vertical";
    slider.style.cssText = "position:absolute;top:20px;left:10px;width:190px";
    slider.id = "rangeslider";
    slider.type = "range";
    slider.min = 0;
    slider.max = 400;
    slider.value = 5.0;
    slider.step = 1.0;
    var objLabelSlider = document.createElement("label");
    objLabelSlider.style.cssText = "position:absolute;top:130px;left:10px;";
    objLabelSlider.htmlFor = slider.id;
    objLabelSlider.appendChild(objTextNodeSlider);
    objLabelSlider.appendChild(objSpanNode3);
    objLabelSlider.appendChild(objSpanNode1);
    objLabelSlider.appendChild(slider);
    objLabelSlider.appendChild(objSpanNode2);
    var objTextNode5 = document.createElement("P");
    objTextNode5.innerHTML =
      "Überschreitungen des maximal gemessenen Schalldruckes";
    objTextNode5.style.cssText = "position:absolute;top:-15px;left:50px";
    var element = document.createElement("div");
    element.style.cssText =
      "position:relative;top:10px;left:10px;background: lightcyan; width: 255px;";
    element.className = "ol-unselectable ol-control noiseselect";
    element.id = "controlEle";
    element.appendChild(objTextNode5);
    element.appendChild(objLabel);
    element.appendChild(objLabel2);
    element.appendChild(selectEle);
    element.appendChild(objLabelSlider);
    element.appendChild(objTextNode4);
    Control.call(this, {
      element: element,
      target: options.target,
    });
    selectEle.addEventListener(
      "change",
      this.handleSelectionChange.bind(this),
      false
    );
    objLabel.addEventListener(
      "change",
      this.handleRadioDayChange.bind(this),
      false
    );
    objLabel2.addEventListener(
      "change",
      this.handleRadioNightChange.bind(this),
      false
    );
    slider.addEventListener(
      "change",
      this.handleSliderChange.bind(this),
      false
    );
  }
  if (Control) SelectorControl.__proto__ = Control;
  SelectorControl.prototype = Object.create(Control && Control.prototype);
  SelectorControl.prototype.constructor = SelectorControl;
  SelectorControl.prototype.handleSelectionChange = function handleSelection() {
    updateWMS();
  };
  SelectorControl.prototype.handleRadioDayChange = function handleRadioDay() {
    document.getElementById("objSpanNode2").innerHTML = "400";
    document.getElementById("rangeslider").max = 400;
    updateWMS();
  };
  SelectorControl.prototype.handleRadioNightChange = function handleRadioNight() {
    document.getElementById("objSpanNode2").innerHTML = "200";
    document.getElementById("rangeslider").max = 200;
    var Node3Num = Number(document.getElementById("objSpanNode3").innerHTML);
    if (Node3Num > 200) {
      document.getElementById("objSpanNode3").innerHTML = "200";
    }
    updateWMS();
  };
  SelectorControl.prototype.handleSliderChange = function handleSilder() {
    document.getElementById("objSpanNode3").innerHTML = document.getElementById(
      "rangeslider"
    ).value;
    updateWMS();
  };
  return SelectorControl;
})(Control);

// custom controller timeslider
var TimesliderControl = /*@__PURE__*/ (function (Control) {
  function TimesliderControl(opt_options) {
    var options = opt_options || {};
    var buttonBack = document.createElement("button");
    buttonBack.innerHTML = "<";
    var buttonForward = document.createElement("button");
    buttonForward.innerHTML = ">";
    var textTimeslider = document.createElement("div");
    textTimeslider.id = "textTimeslider";
    textTimeslider.innerHTML = "testdate";
    var element = document.createElement("div");
    element.style.cssText = "position:absolute;top:250px;left:10px;";
    element.className = "ol-unselectable ol-control timeslider";
    element.appendChild(buttonBack);
    element.appendChild(textTimeslider);
    element.appendChild(buttonForward);
    Control.call(this, {
      element: element,
      target: options.target,
    });
    buttonBack.addEventListener("click", this.handleBack.bind(this), false);
    buttonForward.addEventListener(
      "click",
      this.handleForward.bind(this),
      false
    );
  }
  if (Control) TimesliderControl.__proto__ = Control;
  TimesliderControl.prototype = Object.create(Control && Control.prototype);
  TimesliderControl.prototype.constructor = TimesliderControl;
  TimesliderControl.prototype.handleBack = function handleBack() {
    startDate = new Date(startDate.setDate(startDate.getDate() - 1));
    var yearbegin = startDate.getFullYear();
    var monthbegin = startDate.getMonth() + 1;
    if (monthbegin < 10) {
      monthbegin = "0" + monthbegin;
    }
    var daybegin = startDate.getDate();
    if (daybegin < 10) {
      daybegin = "0" + daybegin;
    }
    begin = yearbegin + "-" + monthbegin + "-" + daybegin;
    if (begin === nomore) {
      alert("Keine älteren Aufzeichnungen vorhanden.");
    }
    document.getElementById("textTimeslider").innerHTML = begin;
    updateWMS();
  };
  TimesliderControl.prototype.handleForward = function handleForward() {
    startDate = new Date(startDate.setDate(startDate.getDate() + 1));
    var yearbegin = startDate.getFullYear();
    var monthbegin = startDate.getMonth() + 1;
    if (monthbegin < 10) {
      monthbegin = "0" + monthbegin;
    }
    var daybegin = startDate.getDate();
    if (daybegin < 10) {
      daybegin = "0" + daybegin;
    }
    begin = yearbegin + "-" + monthbegin + "-" + daybegin;
    if (begin === today) {
      alert("Die Daten für heute sind noch nicht komplett");
    }
    document.getElementById("textTimeslider").innerHTML = begin;
    updateWMS();
  };
  return TimesliderControl;
})(Control);

// date
today = new Date();
var yeartoday = today.getFullYear();
var monthtoday = today.getMonth() + 1;
if (monthtoday < 10) {
  monthtoday = "0" + monthtoday;
}
var daytoday = today.getDate();
if (daytoday < 10) {
  daytoday = "0" + daytoday;
}
today = yeartoday + "-" + monthtoday + "-" + daytoday;

// ein Tag zurück da noch nicht die kompletten Daten da sind
startDate = new Date(startDate.setDate(startDate.getDate() - 1));
var yearbegin = startDate.getFullYear();
var monthbegin = startDate.getMonth() + 1;
if (monthbegin < 10) {
  monthbegin = "0" + monthbegin;
}
var daybegin = startDate.getDate();
if (daybegin < 10) {
  daybegin = "0" + daybegin;
}
begin = yearbegin + "-" + monthbegin + "-" + daybegin;
var wmsLayerSource = new ImageWMS({
  url: "https://www.opendem.info/geoserver/openair/wms",
  params: { LAYERS: "openair:noise", time: begin },
  serverType: "geoserver",
  crossOrigin: "anonymous",
  attributions:
    ', © <a target="_blank" href="https://sensor.community/de/"> Sensor Community</a> contributors',
});
var wmsLayer = new ImageLayer({
  source: wmsLayerSource,
});
// FeatureInfo
/**
 * Elements that make up the popup.
 */
var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var closer = document.getElementById("popup-closer");
/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});
/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};
// Map
var view = new View({
  center: [1081125.0, 6599267.0],
  //center: [51.425, 7.66],
  zoom: 6,
});
var map = new Map({
  controls: defaultControls().extend([
    new TimesliderControl(),
    new SelectorControl(),
    new SwitchControl(),
  ]),
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    wmsLayer,
  ],
  overlays: [overlay],
  target: "map",
  view: view,
});
document.getElementById("textTimeslider").innerHTML = begin;

function updateWMS() {
  //check for night or day
  var day;
  var dayB = document.getElementById("rad1").checked;
  if (dayB === true) {
    day = "d_" + document.getElementById("selectEle").value;
  } else {
    day = "n_" + document.getElementById("selectEle").value;
  }
  // threshold
  var threshold = document.getElementById("rangeslider").value;
  // chosen date
  var daydate = document.getElementById("textTimeslider").innerText;
  var sldBody =
    '<?xml version="1.0" encoding="ISO-8859-1"?><StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><NamedLayer><Name>openair:noise</Name><UserStyle><FeatureTypeStyle><Rule><Name>above</Name><Title>above</Title><Abstract>above the threshold</Abstract><ogc:Filter><ogc:PropertyIsGreaterThanOrEqualTo><ogc:PropertyName>' +
    day +
    "</ogc:PropertyName><ogc:Literal>" +
    threshold +
    '</ogc:Literal></ogc:PropertyIsGreaterThanOrEqualTo></ogc:Filter><PointSymbolizer><Graphic><Mark><WellKnownName>circle</WellKnownName><Fill><CssParameter name="fill">#FF0000</CssParameter></Fill></Mark><Size>12</Size></Graphic></PointSymbolizer></Rule><Rule><Name>below</Name><Title>below</Title><Abstract>below the threshold</Abstract><ogc:Filter><ogc:PropertyIsLessThan><ogc:PropertyName>' +
    day +
    "</ogc:PropertyName><ogc:Literal>" +
    threshold +
    '</ogc:Literal></ogc:PropertyIsLessThan></ogc:Filter><PointSymbolizer><Graphic><Mark><WellKnownName>circle</WellKnownName><Fill><CssParameter name="fill">#00FF00</CssParameter></Fill></Mark><Size>12</Size></Graphic></PointSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';
  wmsLayer.getSource().updateParams({
    SLD_BODY: sldBody,
    time: daydate,
  });
}

// FeatureInfo
map.on("singleclick", function (evt) {
  var viewResolution = /** @type {number} */ (view.getResolution());
  var url = wmsLayerSource.getFeatureInfoUrl(
    evt.coordinate,
    viewResolution,
    "EPSG:3857",
    { INFO_FORMAT: "application/json" }
  );
  if (url) {
    fetch(url)
      .then(function (response) {
        return response.text();
      })
      .then(function (json) {
        var fi = JSON.parse(json);
        var coordinate = evt.coordinate;
        content.innerHTML =
          "<p>Überschreitungen des maximal gemessenen Schalldruckes gemessen am " +
          fi.features[0].properties.date +
          '</p><div class="popupMain"><table><tr><td>Tag: 35 DB</td><td>' +
          fi.features[0].properties.d_35 +
          " von 400</td></tr><tr><td>Tag: 40 DB</td><td>" +
          fi.features[0].properties.d_40 +
          " von 400</td></tr><tr><td>Tag: 45 DB</td><td>" +
          fi.features[0].properties.d_45 +
          " von 400</td></tr><tr><td>Tag: 50 DB</td><td>" +
          fi.features[0].properties.d_50 +
          " von 400</td></tr><tr><td>Tag: 55 DB</td><td>" +
          fi.features[0].properties.d_55 +
          " von 400</td></tr><tr><td>Tag: 60 DB</td><td>" +
          fi.features[0].properties.d_60 +
          " von 400</td></tr><tr><td>Tag: 65 DB</td><td>" +
          fi.features[0].properties.d_65 +
          " von 400</td></tr><tr><td>Tag: 70 DB</td><td>" +
          fi.features[0].properties.d_70 +
          " von 400</td></tr><tr><td>Tag: 75 DB</td><td>" +
          fi.features[0].properties.d_75 +
          " von 400</td></tr><tr><td>Tag: 80 DB</td><td>" +
          fi.features[0].properties.d_75 +
          " von 400</td></tr><tr><td>Tag: 80 DB</td><td>" +
          fi.features[0].properties.d_80 +
          " von 400</td></tr><tr><td>Tag: 85 DB</td><td>" +
          fi.features[0].properties.d_85 +
          " von 400</td></tr><tr><td>Tag: 90 DB</td><td>" +
          fi.features[0].properties.d_90 +
          " von 400</td></tr><tr><td>Tag: 95 DB</td><td>" +
          fi.features[0].properties.d_95 +
          " von 400</td></tr><tr><td>Tag: 100 DB</td><td>" +
          fi.features[0].properties.d_100 +
          " von 400</td></tr><tr><td>Nacht: 35 DB</td><td>" +
          fi.features[0].properties.n_35 +
          " von 200</td></tr><tr><td>Nacht: 40 DB</td><td>" +
          fi.features[0].properties.n_40 +
          " von 200</td></tr><tr><td>Nacht: 45 DB</td><td>" +
          fi.features[0].properties.n_45 +
          " von 200</td></tr><tr><td>Nacht: 50 DB</td><td>" +
          fi.features[0].properties.n_50 +
          " von 200</td></tr><tr><td>Nacht: 55 DB</td><td>" +
          fi.features[0].properties.n_55 +
          " von 200</td></tr><tr><td>Nacht: 60 DB</td><td>" +
          fi.features[0].properties.n_60 +
          " von 200</td></tr><tr><td>Nacht: 65 DB</td><td>" +
          fi.features[0].properties.n_65 +
          " von 200</td></tr><tr><td>Nacht: 70 DB</td><td>" +
          fi.features[0].properties.n_70 +
          " von 200</td></tr><tr><td>Nacht: 75 DB</td><td>" +
          fi.features[0].properties.n_75 +
          " von 200</td></tr><tr><td>Nacht: 80 DB</td><td>" +
          fi.features[0].properties.n_80 +
          " von 200</td></tr><tr><td>Nacht: 85 DB</td><td>" +
          fi.features[0].properties.n_85 +
          " von 200</td></tr><tr><td>Nacht: 90 DB</td><td>" +
          fi.features[0].properties.n_90 +
          " von 200</td></tr><tr><td>Nacht: 95 DB</td><td>" +
          fi.features[0].properties.n_95 +
          " von 200</td></tr><tr><td>Nacht: 100 DB</td><td>" +
          fi.features[0].properties.n_100 +
          ' von 200</td></tr></table></div><p><a target="_blank" href="https://maps.sensor.community/grafana/d-solo/000000004/single-sensor-view?orgId=1&panelId=12&var-node=' +
          fi.features[0].properties.id +
          '">Statistik der letzen 24 Stunden für den Senor ' +
          fi.features[0].properties.id +
          " von der SensorCommunity</a></p>";
        overlay.setPosition(coordinate);
      });
  }
});

// help
document.getElementById("helpIcon").addEventListener("click", help);
function help() {
  document.getElementById("help").style.display = "block";
  document.getElementById("head").style.pointerEvents = "none";
  document.getElementById("head").style.opacity = "50%";
  document.getElementById("map").style.pointerEvents = "none";
  document.getElementById("map").style.opacity = "50%";
}
document.getElementById("closeHelp").addEventListener("click", closeHelp);
function closeHelp() {
  document.getElementById("help").style.display = "none";
  document.getElementById("head").style.pointerEvents = "auto";
  document.getElementById("head").style.opacity = "1";
  document.getElementById("map").style.pointerEvents = "auto";
  document.getElementById("map").style.opacity = "1";
}
// legal notes
document.getElementById("legalIcon").addEventListener("click", legal);
function legal() {
  document.getElementById("legal").style.display = "block";
  document.getElementById("head").style.pointerEvents = "none";
  document.getElementById("head").style.opacity = "50%";
  document.getElementById("map").style.pointerEvents = "none";
  document.getElementById("map").style.opacity = "50%";
}
document.getElementById("closeLegal").addEventListener("click", closeLegal);
function closeLegal() {
  document.getElementById("legal").style.display = "none";
  document.getElementById("head").style.pointerEvents = "auto";
  document.getElementById("head").style.opacity = "1";
  document.getElementById("map").style.pointerEvents = "auto";
  document.getElementById("map").style.opacity = "1";
}

function documentLoaded(e) {
  // handle very small displays
  if (innerWidth < 400) {
    var title = document.getElementById("titleApp");
    title.style.fontSize = "1.2rem";
    title.style.top = "0px";
  }
}
document.addEventListener("DOMContentLoaded", documentLoaded);
