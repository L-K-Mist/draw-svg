<template>
  <div id="svg-chart" ref="svgChart">
    <chart ref="chartComponent" />
    <svg-draw-route :style="{ pointerEvents }" @new-coords="handleNewCoords" />
    <BaseButton @click="showRoute = !showRoute">{{
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
const showRoute = ref(false);

const pointerEvents = computed(() => {
  return showRoute.value ? "inherit" : "none";
});

function handleNewCoords(pixelCoords) {
  chartComponent.value.handleNewCoords(pixelCoords);
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
