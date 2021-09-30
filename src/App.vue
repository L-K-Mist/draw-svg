<template>
  <div @dblclick="end()" id="svg-wrapper" ref="svgWrapper">
    <svg id="draw-svg"></svg>
  </div>
  <!-- <dev-panel></dev-panel> -->
</template>

<script>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
// TODO next: Must split flag into rect(path) and line
import {
  defineComponent,
  onMounted,
  watchEffect,
  ref,
  nextTick,
  watch,
  computed,
} from "vue";

import { SVG, extend } from "@svgdotjs/svg.js";
import "@/svg.draw.esm";

import { screenToSVGPoint } from "@/helpers";
import {
  useMousePositionScreen,
  useMousePositionSVG,
  useWindowSize,
} from "@/composables/WebApi";

import DevPanel from "@/components/DevPanel";

export default defineComponent({
  name: "App",
  components: {
    // DevPanel
  },
  setup() {
    const svgWrapper = ref(null);
    const { windowWidth, windowHeight } = useWindowSize();

    function viewBoxString(frame) {
      return `${frame.x} ${frame.y} ${frame.width} ${frame.height}`;
    }
    let svg;
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
    // watch(positions, (currentValue) => {
    //   console.log(currentValue);
    // });
    const shipPosition = ref({ x: 40, y: 50 });

    function end() {
      console.log("dvdb - positions - positions", positions);
    }
    onMounted(() => {
      var drawing = SVG("#draw-svg").size(`100%`, `100%`);
      console.log("dvdb - onMounted - SVG", SVG);
      console.log("dvdb - onMounted - drawing", drawing);
      var line = drawing
        .polyline({
          "stroke-width": 10,
          stroke: "blue",
          fill: "none",
          drawCircles: true,
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
          console.log("dvdb - drawing.on - e.button", e.button);
          line.draw("done");
        }
        console.log("dvdb - onMounted - e", e);
      });
      // drawing.on("dblclick", () => {
      //   console.log("dvdb - drawing.on - dblClick");
      // });
      console.log("dvdb - line.on - line", line);
    });
    return {
      shipPosition,
      end,
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
