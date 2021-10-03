<template>
  <div id="svg-wrapper" class="chart-layer" ref="svgWrapper">
    <svg id="draw-svg"></svg>
  </div>
</template>

<script setup>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import { onMounted, ref, computed, defineEmits, defineExpose } from "vue";
import { SVG } from "@svgdotjs/svg.js";
import "@/svg.draw.esm";

const svgWrapper = ref(null);
const emit = defineEmits(["newCoords"]);
let line;
onMounted(() => {
  let drawing = SVG("#draw-svg").size(`100%`, `100%`);
  line = drawing
    .polyline({
      "stroke-width": 10,
      stroke: "blue",
      fill: "none",
      drawCircles: true,
      clean: false,
    })
    .draw();

  line.on("drawpoint", (event) => {
    console.log("drawupdate - event", event);
    const { x: elementX, y: elementY } = event.detail.p;
    emit("newCoords", { elementX, elementY });
  });

  line.on("drawstart", (event) => {
    console.log("drawpoint - event", event);
    const { x: elementX, y: elementY } = event.detail.p;
    emit("newCoords", { elementX, elementY });
  });
  document.addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault();
    },
    false
  );

  drawing.on("mousedown", (e) => {
    console.log("mousedown - e", e);
    if (e.button === 2) {
      line.draw("done");
      const newPositions = [
        [0, 0],
        [1000, 100],
        [500, 10],
        [400, 500],
      ];
      // console.log("drawing.children()", drawing.children());
      line.circles = drawing
        .children()
        .filter((child) => child.type === "circle");
      // moveLineToNewPoints(line, newPositions);
      emit("newSvgRoute");
      // function to changeLineToNewPoints
    }
  });
});

function handleNewExtent(extent) {
  console.log("dvdb - handleNewExtent - extent", extent);
}

function handleNewPixels(pixels) {
  console.log("dvdb - handleNewPixels - pixels", pixels);
  moveLineToNewPoints(line, pixels);
}

function moveLineToNewPoints(line, points) {
  // if (line.circles.length !== points.length) {
  //   console.error(
  //     "Looks like we're attempting to move a different number of points than the line has"
  //   );
  //   return;
  // }
  line.plot(points);
  line.circles.forEach((circle, index) => {
    circle = circle.center(points[index][0], points[index][1]);
  });
}

defineExpose({ handleNewExtent, handleNewPixels });
</script>

<style scoped>
#svg-wrapper {
  outline: 4px dotted blue;
  /* pointer-events: none; */
}

#draw-svg {
  outline: 4px dotted pink;
}
</style>
