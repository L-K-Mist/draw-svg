<template>
  <div id="chart-wrapper" class="chart-layer" ref="chartWrapper">
    <div id="chart" ref="chart"></div>
  </div>
</template>

<script setup>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import { onMounted, ref, defineExpose } from "vue";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { toStringHDMS } from "ol/coordinate";
import { toLonLat, transform } from "ol/proj";
import OSM from "ol/source/OSM";
import "ol/ol.css";

const chart = ref(null);
let map;
// MAP bits
onMounted(() => {
  map = new Map({
    target: chart.value,
    // projection: "EPSG:3857",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: [0, 0],
      zoom: 1,
      // projection: "EPSG:3857",
    }),
  });
  map.on("singleclick", function (evt) {
    console.log("dvdb - evt", evt);
    console.log(evt.coordinate);

    // convert coordinate to EPSG-4326
    console.log(transform(evt.coordinate, "EPSG:3857", "EPSG:4326"));
  });
});
const handleNewCoords = ({ elementX, elementY }) => {
  const coordsRaw = map.getCoordinateFromPixel([elementX, elementY]);
  const coordsRefined = transform(coordsRaw, "EPSG:3857", "EPSG:4326");
  console.log("dvdb - handleNewCoords - coordsRefined", coordsRefined);
  const coords = toStringHDMS(coordsRefined);
  console.log("dvdb - handleNewCoords - coords", coords);
};
defineExpose({ handleNewCoords });
</script>

<style scoped>
#chart-wrapper {
  outline: 4px dotted green;
  z-index: 10;
}

#chart {
  height: 100%;
  width: 100%;
}
</style>
