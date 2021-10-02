<script setup>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import { onMounted, ref, computed } from "vue";
import { SVG } from "@svgdotjs/svg.js";
import "@/svg.draw.esm";

import {
  useMousePositionScreen,
  useMousePositionSVG,
} from "@/composables/WebApi";

const svgWrapper = ref(null);

const { svgX, svgY } = useMousePositionSVG("draw-svg");
const { x, y } = useMousePositionScreen();
const positions = computed(() => {
  return {
    svgX: svgX.value,
    svgY: svgY.value,
    screenX: x.value,
    screenY: y.value,
  };
});

onMounted(() => {
  var drawing = SVG("#draw-svg").size(`100%`, `100%`);

  var line = drawing
    .polyline({
      "stroke-width": 10,
      stroke: "blue",
      fill: "none",
      drawCircles: true,
      clean: false,
    })
    .draw();

  line.on("drawpoint", () => {
    console.log(positions.value);
  });

  svgWrapper.value.addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault();
    },
    false
  );

  drawing.on("mousedown", (e) => {
    if (e.button === 2) {
      line.draw("done");
    }
  });
});
</script>

<template>
  <div id="svg-wrapper" class="chart-layer" ref="svgWrapper">
    <svg id="draw-svg"></svg>
  </div>
</template>

<style scoped>
#svg-wrapper {
  outline: 4px dotted blue;
  z-index: 10;
  /* pointer-events: none; */
}

#draw-svg {
  outline: 4px dotted pink;
}
</style>
