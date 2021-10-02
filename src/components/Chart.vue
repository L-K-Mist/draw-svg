<script setup>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import { onMounted, ref } from "vue";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import "ol/ol.css";

const chart = ref(null);

// MAP bits
onMounted(() => {
  console.log("dvdb - onMounted - map.value", chart.value);
  new Map({
    target: chart.value,
    layers: [
      new TileLayer({
        source: new XYZ({
          url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        }),
      }),
    ],
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });
});
</script>

<template>
  <div id="chart-wrapper" class="chart-layer" ref="chartWrapper">
    <div id="chart" ref="chart"></div>
  </div>
</template>

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
