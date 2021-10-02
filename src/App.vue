<template>
  <div id="svg-chart" ref="svgChart">
    <chart />
    <svg-draw-route />
  </div>
</template>

<script setup>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import SvgDrawRoute from "@/components/SvgDrawRoute";
import Chart from "@/components/Chart";
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
