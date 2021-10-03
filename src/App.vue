<template>
  <div id="svg-chart" ref="svgChart">
    <chart ref="chartComponent" />
    <svg-draw-route v-if="true" @new-coords="handleNewCoords" />
    <button
      type="button"
      class="
        inline-flex
        items-center
        px-6
        py-3
        border border-transparent
        text-base
        font-medium
        rounded-md
        shadow-sm
        text-white
        bg-indigo-600
        hover:bg-indigo-700
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-indigo-500
        absolute
        top-4
        right-4
        z-20
      "
    >
      Draw Route
    </button>
  </div>
</template>

<script setup>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import { ref } from "vue";
// These look like they're not being used, but they are.
// the 'script setup' approach does the rest.
import SvgDrawRoute from "@/components/SvgDrawRoute";
import Chart from "@/components/Chart";

const chartComponent = ref(null);

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
