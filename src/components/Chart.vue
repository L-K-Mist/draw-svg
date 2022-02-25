<template>
  <div id="chart-wrapper" class="chart-layer" ref="chartWrapper">
    <div id="chart" ref="chart"></div>
  </div>
</template>

<script setup>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import {
  onMounted,
  onBeforeUnmount,
  ref,
  computed,
  defineExpose,
  defineEmits,
} from "vue";
import { TransitionPresets, useTransition } from "@vueuse/core";
// OpenLayers
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import Layer from "ol/layer/Layer";
import { toStringHDMS } from "ol/coordinate";
import {
  toLonLat,
  transform,
  transformExtent,
  get as getProjection,
} from "ol/proj";
import { composeCssTransform } from "ol/transform";
import OSM from "ol/source/OSM";
import "ol/ol.css";

import { SVG } from "@svgdotjs/svg.js";

import { screenToSVGPoint } from "@/composables/WebApi.js";

const chart = ref(null);
// local globals
let map, svgLayer, svg, pixelOne, circle, ctm, point, screenPoint; // svg stuff #reactive-coords
screenPoint = {
  x: 300,
  y: 599,
};

var projection = getProjection("EPSG:4326");
var worldExtent = projection.getWorldExtent();
console.log("dvdb - worldExtent", worldExtent);

// Initialise the map with svg layer
onMounted(() => {
  const svgContainer = document.createElement("div");
  // svgContainer.setAttribute(
  //   "style",
  //   "position: absolute; width: 100%; height: 100%; z-index: 10;"
  // );

  /**
   * And these are the kinds of arrays, I'm only starting to get familiar with,
   * but want to get better at: [-137.66514806378132, -90, 137.66514806378132, 90]1343, 851
   *
   */

  // Should be a calculated-value based on the screen-size.
  // You want to be forcefull/static with its height so that you can
  // be flexible on its width. Just how world-maps with repeating x-axis work.
  // In our case: OpenLayers. [Best choice in my opinion, even if I started with leaflet.]

  // The trick here is to make the height the same as the map-canvas height,
  // and because the world-map - in this case (EPSG:4326) - is a 2 x 1 widthXheight
  // See: worldExtent(projection) <-- [-180, -90, 180, 90]
  const svgWidth = 1560;
  const svgHeight = svgWidth / 2;
  svgContainer.style.width = svgWidth + "px";
  svgContainer.style.height = svgHeight + "px";
  svgContainer.classList.add("svg-container");
  // svgContainer.style.marginTop = 40 + "px";

  // Note: SVG can be instantiated with a pre-designed svg,
  // And modified from here onwards.

  // Some naming-conventions
  // between designers and devs
  // will smooth such processes out.
  // eg. better to set the svg editor to output class based
  // svg's.  That rather than inline-style based.

  svg = SVG().addTo(svgContainer).size(svgWidth, svgHeight).attr({
    style: "border: 8px dotted blue",
    id: "svg-timeline",
  });

  // for continuous x-axis we're going to need, something like the ui-pattern for
  // a circular carousel.
  // That is: you need at least three synchronous clones of one of this globe-block.
  // swapping one out for the next. So that there's always at least two of them available for the screen,
  // while the "reserve" svg, jumps to either end, depending on the direction of movement.
  // direction of movement, is usefull to watch on any range-slider, it simplifies many
  // calculations. While going up, this is true. When going down this is true or do this.
  // SVG(svg).addTo(svgContainer).size(svgWidth, svgHeight);
  const svgResolution = 360 / svgWidth;
  const polygon = svg
    .polygon("0,0 100,50 50,100")
    .fill("none")
    .stroke({ width: 10, color: "grey" })
    .x(50)
    .y(40);
  const rect = svg.rect(100, 100);
  rect.stroke({ color: "blue", width: 5 });
  rect.fill({ opacity: 0 });
  circle = svg
    .circle(100)
    .x(50)
    .y(40)
    .stroke({ color: "blue", width: 5 })
    .fill({ opacity: 0 });

  // const { svgX, svgY } = useMousePositionSVG("svg-timeline");
  screenPoint = {
    x: screenPoint.x,
    y: screenPoint.y,
  };
  // point = screenToSVGPoint(screenPoint, circle.node);
  // console.log("dvdb - onMounted - point", point);
  // ctm = circle.node.getScreenCTM();
  // console.log("dvdb - onMounted - circle.node", circle.node);
  // var cx = circle.cx.baseVal;
  // var cy = circle.cy.baseVal;
  // console.log("dvdb - onMounted - ctm", ctm);
  // const inverse = ctm.inverse();
  // const p = point.matrixTransform(inverse);
  // cx.value = p.x;
  // console.log("dvdb - onMounted - cx.value", cx.value);
  // cy.value = p.y;
  // console.log("dvdb - onMounted - cy.value", cy.value);

  svgLayer = new Layer({
    transparent: true,
    render: function (frameState) {
      // console.log("dvdb - onMounted - frameState", frameState);

      const [width, height] = frameState.size;

      const scale = svgResolution / frameState.viewState.resolution;
      const center = frameState.viewState.center;
      // const size = frameState.size;
      const cssTransform = composeCssTransform(
        width / 2,
        height / 2,
        scale,
        scale,
        frameState.viewState.rotation,
        -center[0] / svgResolution - width / 2,
        center[1] / svgResolution - height / 2
      );
      svgContainer.style.transform = cssTransform;

      return svgContainer;
    },
  });
  map = new Map({
    target: chart.value,
    projection: "EPSG:4326",
    layers: [
      svgLayer,
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: [0, 0],
      // extent: [-180, -90, 180, 90],
      projection: "EPSG:4326",
      zoom: 1,
    }),
  });
  // pixelOne = map.getPixelFromCoordinate([708.0000000000001, 290.9999999999927]);
  // console.log("dvdb - onMounted - pixelOne", pixelOne);
  const view = map.getView();
  // console.log("dvdb - onMounted - view", view);
});

onMounted(() => {});
// end of svg stuff

// Expose your function to the parent.
// Looks like $refs are becoming first-class
// citizens, but with the extra safety-catch
// of defineExpose https://www.youtube.com/watch?v=tqoeAAH21Y4
const go = ({ color, direction, deltaMove }) => {
  // let deltaPixelCoords = 0;
  // const valueMapping = () => {
  //   if (direction === "up") {
  //     deltaPixelCoords = deltaMove ? deltaMove : [-500, -500];
  //   }
  //   if (direction === "down") {
  //     deltaPixelCoords = [500, 500];
  //   }
  // };
  const [dx, dy] = deltaMove;
  circle.stroke({ color });
  const inout = "<>";
  circle
    .animate({
      duration: 2000,
      // delay: 1000,
      // when: "now",
      // swing: true,
      // times: 5,
      // wait: 200,
    })
    .ease(inout)
    // Now here comes the tricky bit:
    // How do we make these movements line up with the
    // geographic-coords?
    // We must map three kinds of coords between each other
    // ScreenPixelCoords, SvgCoords, GeoCoords
    // With a precision-check force update, at the end of every animation.
    .dmove(dx, dy);
  // So instead of above more like:
  // .dmove(geo(17.66634, -67.45434))
};

function screenToSVG(screenX, screenY) {
  var p = svg.node.createSVGPoint();
  p.x = screenX;
  p.y = screenY;
  return p.matrixTransform(svg.getScreenCTM().inverse());
}

function SVGToScreen(svgX, svgY) {
  var p = svg.node.createSVGPoint();
  p.x = svgX;
  p.y = svgY;
  return p.matrixTransform(svg.node.getScreenCTM());
}

// var pt = screenToSVG(20, 30);
// console.log("screenToSVG: ", pt);

const changeCircleColor = ref(() => {
  const ptSvg = circle.node.getBBox();
  console.log("dvdb - changeCircleColor - ptSvg", ptSvg);
  var ptScreen = SVGToScreen(ptSvg.x, ptSvg.y);
  console.log("dvdb - changeCircleColor - pt", ptScreen);

  const currentColor = circle.attr("stroke");
  currentColor === "green"
    ? go({
        direction: "up",
        color: "blue",
        deltaMove: [-500, -500],
      })
    : go({
        direction: "down",
        color: "green",
        deltaMove: [500, 500],
      });
});

defineExpose({
  changeCircleColor,
});
</script>

<style>
#chart-wrapper {
  outline: 4px dotted green;
  position: relative;
}

.svg-container {
  position: absolute;
  transform-origin: top left;
  display: flex;
  z-index: 10;
}

#chart {
  height: 100%;
  width: 100%;
}
</style>
