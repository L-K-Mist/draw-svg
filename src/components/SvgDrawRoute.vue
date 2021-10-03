<template>
  <div id="svg-wrapper" class="chart-layer" ref="svgWrapper">
    <svg id="draw-svg"></svg>
  </div>
</template>

<script setup>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import { onMounted, ref, computed, defineEmits } from "vue";
import { SVG } from "@svgdotjs/svg.js";
import "@/svg.draw.esm";

const svgWrapper = ref(null);
const emit = defineEmits(["newCoords"]);

onMounted(() => {
  let drawing = SVG("#draw-svg").size(`100%`, `100%`);
  let line = drawing
    .polyline({
      "stroke-width": 10,
      stroke: "blue",
      fill: "none",
      drawCircles: true,
      clean: false,
    })
    .draw();

  line.on("drawpoint", (event) => {
    const { x: elementX, y: elementY } = event.detail.p;
    emit("newCoords", { elementX, elementY });
  });

  svgWrapper.value.addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault();
    },
    false
  );

  function moveLineToNewPoints(line, points) {
    if (line.circles.length !== points.length) {
      console.error(
        "Looks like we're attempting to move a different number of points than the line has"
      );
      return;
    }
    line.animate(3000).plot(points);
    line.circles.forEach((circle, index) => {
      circle = circle.animate(3000).center(points[index][0], points[index][1]);
    });
  }

  drawing.on("mousedown", (e) => {
    if (e.button === 2) {
      line.draw("done");
      const newPositions = [
        [0, 0],
        [1000, 100],
        [500, 10],
        [400, 500],
      ];
      console.log("drawing.children()", drawing.children());
      line.circles = drawing
        .children()
        .filter((child) => child.type === "circle");
      moveLineToNewPoints(line, newPositions);
    }
  });
});
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
