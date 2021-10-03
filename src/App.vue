<template>
  <div id="svg-chart" ref="svgChart">
    <chart
      @new-extent="handleNewExtent"
      ref="chartComponent"
      @newRoute="handleNewRoute"
      @newPixels="handleNewPixels"
    />
    <svg-draw-route
      ref="svgDraw"
      :style="{ pointerEvents }"
      @new-coords="handleNewCoords"
      @new-svg-route="handleNewSvgRoute"
    />
    <BaseButton @click="handleRouteButton">{{
      showRoute ? "Route Done" : "Draw Route"
    }}</BaseButton>
  </div>
</template>

<script setup>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import { ref, computed } from "vue";
// These look like they're not being used, but they are.
// the 'script setup' approach does the rest.
import SvgDrawRoute from "@/components/SvgDrawRoute";
import Chart from "@/components/Chart";
import BaseButton from "@/baseComponents/BaseButton";

const chartComponent = ref(null);
const svgDraw = ref(null);
const showRoute = ref(false);

const pointerEvents = computed(() => {
  return showRoute.value ? "inherit" : "none";
});

function handleNewCoords(pixelCoords) {
  chartComponent.value.handleNewCoords(pixelCoords);
}

let coords;
function handleRouteButton() {
  if (!showRoute.value) {
    coords = chartComponent.value.getCoords();
    // const coords = JSON.parse(JSON.stringify(coords.value));
    console.dir("dvdb - handleRouteButton - coords.value", coords);
  }
  showRoute.value = !showRoute.value;
}
function handleNewExtent(extent) {
  svgDraw.value.handleNewExtent(extent);
}

function handleNewRoute(coords) {
  console.log("dvdb - handleNewRoute - coords", [...coords]);
}

function handleNewSvgRoute() {
  showRoute.value = false;
  coords = chartComponent.value.getCoords();
  console.log("dvdb - handleNewSvgRoute - coords", coords.value);
}

function handleNewPixels(pixels){
  svgDraw.value.handleNewPixels(pixels)
}
</script>

<style>
body {
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#svg-chart {
  outline: 8px dotted gray;
  position: relative;
  height: 90vh;
}
</style>

<style>
.chart-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
