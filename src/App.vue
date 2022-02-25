<template>
  <div id="svg-chart" ref="svgChart">
    <chart ref="chartComponent" />
    <BaseButton @click="changeCircleColor()"
      >Change the color of the circle
    </BaseButton>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// These look like they're not being used, but they are.
// the 'script setup' approach does the rest.
import Chart from "@/components/Chart";
import BaseButton from "@/baseComponents/BaseButton";
const chartComponent = ref(null);
const changeCircleColor = ref(null);
onMounted(() => {
  changeCircleColor.value = chartComponent.value.changeCircleColor;
});
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
  height: 80vh;
  margin: 0 80px;
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
