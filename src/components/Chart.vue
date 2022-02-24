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
import OSM from "ol/source/OSM";
import "ol/ol.css";

import { SVG } from "@svgdotjs/svg.js";

const chart = ref(null);
const emit = defineEmits(["newExtent", "newPixels", "moveStart", "moveEnd"]);
let map;
let handleDrag = ref(function (event) {
  const newPixels = routeCoords.value.map((coord) =>
    map.getPixelFromCoordinate(coord.raw)
  );
  emit("newPixels", newPixels);
});
onMounted(() => {
  map = new Map({
    target: chart.value,
    projection: "EPSG:3857",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: transform([-1.542609, 50.703489], "EPSG:4326", "EPSG:3857"),
      zoom: 8,
    }),
  });

  map.addLayer(
    new Layer({
      render: function (frameState) {
        console.log("dvdb - onMounted - frameState", frameState);

        const [width, height] = frameState.size;
        var draw = SVG().size(width, height);
        draw.attr({
          fill: "#f06",
          "fill-opacity": 0.5,
          style: "z-index: 2; border: 8px dotted blue",
        });
        console.log("dvdb - onMounted - draw", draw);
        // const scale = svgResolution / frameState.viewState.resolution;
        // const center = frameState.viewState.center;
        // const cssTransform = composeCssTransform(
        //   size[0] / 2,
        //   size[1] / 2,
        //   scale,
        //   scale,
        //   frameState.viewState.rotation,
        //   -center[0] / svgResolution - width / 2,
        //   center[1] / svgResolution - height / 2
        // );
        // svgContainer.style.transform = cssTransform;
        // svgContainer.style.opacity = this.getOpacity();
        // return svgContainer;
        return draw.node;
      },
    })
  );

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
