<template>
  <div id="svg-wrapper" class="chart-layer" ref="svgWrapper">
    <svg id="draw-svg"></svg>
  </div>
</template>

<script>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import {
  watch,
  onMounted,
  ref,
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  getCurrentInstance,
} from "vue";
import { SVG } from "@svgdotjs/svg.js";

export default {
  setup(props, { emit }) {
    const svgWrapper = ref(null);
    let line;

    onMounted(() => {});

    function handleNewExtent(extent) {
      console.log("dvdb - handleNewExtent - extent", extent);
    }

    function handleNewPixels(pixels) {
      moveLineToNewPoints(line, pixels);
    }

    function moveLineToNewPoints(line, points) {
      line.plot(points);
      line.circles?.forEach((circle, index) => {
        circle = circle.center(points[index][0], points[index][1]);
      });
    }

    return {};
  },
};
</script>

<style scoped>
#svg-wrapper {
  outline: 4px dotted blue;
  /* pointer-events: none; */
}

#draw-svg {
  outline: 4px dotted pink;
}

/* apply the filter with css */
.blur {
  filter: url(#blurFilter);
  -webkit-filter: url(#blurFilter);
  -moz-filter: url(#blurFilter);
  -o-filter: url(#blurFilter);
  -ms-filter: url(#blurFilter);
}
</style>
