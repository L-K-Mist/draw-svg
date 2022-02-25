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
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import Layer from "ol/layer/Layer";
import { toStringHDMS } from "ol/coordinate";
import { toLonLat, transform, transformExtent } from "ol/proj";
import { composeCssTransform } from "ol/transform";
import OSM from "ol/source/OSM";
import "ol/ol.css";

import { SVG } from "@svgdotjs/svg.js";

const chart = ref(null);
const emit = defineEmits(["newExtent", "newPixels", "moveStart", "moveEnd"]);
let map, svgLayer;
let handleDrag = ref(function (event) {
  const newPixels = routeCoords.value.map((coord) =>
    map.getPixelFromCoordinate(coord.raw)
  );
  emit("newPixels", newPixels);
});

onMounted(() => {
  const svgContainer = document.createElement("div");
  // svgContainer.setAttribute(
  //   "style",
  //   "position: absolute; width: 100%; height: 100%; z-index: 10;"
  // );
  const svgWidth = 2000;
  const svgHeight = 100;
  svgContainer.style.width = svgWidth + "px";
  svgContainer.style.height = svgHeight + "px";
  svgContainer.style.transformOrigin = "top left";
  svgContainer.style.position = "absolute";
  svgContainer.className = "svg-layer";
  const svg = SVG().addTo(svgContainer).size(svgWidth, svgHeight);
  const svgResolution = 360 / svgWidth;
  svg.attr({
    fill: "transparent",
    // "fill-opacity": 0,
    style: "border: 8px dotted blue",
  });
  const rect = svg.rect(100, 100);

  rect.attr({
    fill: "#blue",
  });
  svgLayer = new Layer({
    transparent: true,
    render: function (frameState) {
      // console.log("dvdb - onMounted - frameState", frameState);

      const [width, height] = frameState.size;
      // svg.size(width, height);

      const scale = svgResolution / frameState.viewState.resolution;
      const center = frameState.viewState.center;
      const size = frameState.size;
      const cssTransform = composeCssTransform(
        size[0] / 2,
        size[1] / 2,
        scale,
        scale,
        frameState.viewState.rotation,
        -center[0] / svgResolution - width / 2,
        center[1] / svgResolution - height / 2
      );
      // svgContainer.style.position = "absolute";
      // svgContainer.style.width = "100%";
      // svgContainer.style.height = "100%";
      // svgContainer.style.opacity = this.getOpacity();
      svgContainer.style.transform = cssTransform;

      return svgContainer;
    },
  });
  map = new Map({
    target: chart.value,
    projection: "EPSG:3857",
    layers: [
      svgLayer,
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: [0, 0],
      extent: [-180, -90, 180, 90],
      projection: "EPSG:4326",
      zoom: 2,
    }),
  });

  map.on(["change:resolution", "pointerdrag"], handleDrag.value);
  map.on("movestart", () => {
    emit("moveStart");
  });

  map.on("moveend", () => {
    emit("moveEnd");
    handleDrag.value();
  });
  map.getView().on("change:resolution", handleDrag.value);
});

onBeforeUnmount(() => {
  map.on(
    (["movestart", "change:resolution", "pointerdrag", "moveend"],
    handleDrag.value)
  );
  map.getView().on("change:resolution", handleDrag.value);
});

const routeCoords = ref([]);

function handleNewCoords({ elementX, elementY }) {
  const raw = map.getCoordinateFromPixel([elementX, elementY]);

  const refined = transform(raw, "EPSG:3857", "EPSG:4326");
  const coordsDMS = toStringHDMS(refined);

  routeCoords.value.push({ refined, raw });
}

function getCoords() {
  return routeCoords;
}

defineExpose({ handleNewCoords, getCoords, map });
</script>

<style scoped>
#chart-wrapper {
  outline: 4px dotted green;
}

#chart {
  height: 100%;
  width: 100%;
}
</style>
