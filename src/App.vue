<template>
  <div id="svg-wrapper" ref="svgWrapper">
    <svg id="draw-svg"></svg>
  </div>
</template>

<script>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import { defineComponent, onMounted, ref, computed } from "vue";

import { SVG } from "@svgdotjs/svg.js";
import "@/svg.draw.esm";

import {
  useMousePositionScreen,
  useMousePositionSVG,
} from "@/composables/WebApi";

export default defineComponent({
  name: "App",
  components: {
    // DevPanel
  },
  setup() {
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
    return {
      svgWrapper,
    };
  },
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
#svg-wrapper {
  border: 4px dotted blue;
  height: 90vh;
}
</style>
