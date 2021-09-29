<template>
  <div class="bottom-panel">
      <p>
      Screen: x = {{mouseX}} y = {{mouseY}}
      </p>
      <p>
          SVG: x = {{ svgX }} y = {{ svgY }}
      </p>
      <p>
        Window: Width = {{windowWidth}} Height = {{windowHeight}}
      </p>
  </div>
</template>

<script>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import { defineComponent, onMounted, watchEffect } from "vue";

import {
  useMousePositionScreen,
  useMousePositionSVG,
  useWindowSize
} from "@/composables/WebApi";

export default defineComponent({
  name: "App",
  components: {

  },
  setup() {
    const { x: mouseX, y: mouseY } = useMousePositionScreen();
    const { svgX, svgY } = useMousePositionSVG("svg-timeline");
    const { windowWidth, windowHeight} = useWindowSize();
    return {
      mouseX,
      mouseY,
      svgX,
      svgY,
      windowWidth,
      windowHeight
    };
  },
});
</script>

<style>
.bottom-panel {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border: 1px dotted grey;
    font-weight: bold;
    z-index: 10;
    background-color: rgba(210, 233, 240, 0.5);
}
</style>
