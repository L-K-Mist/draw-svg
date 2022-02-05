<template>
  <div id="svg-wrapper" class="chart-layer" ref="svgWrapper">
    <svg id="draw-svg">
      <defs>
        <!-- identify the filter-->
        <filter id="blurFilter">
          <!-- filter processes -->
          <feGaussianBlur class="blur" in="SourceGraphic" deviation="0" />
          <!-- stdDeviation is amount of blur -->
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script setup>
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
import debounce from "lodash.debounce";
import gsap from "gsap";
// import debounce from "lodash/debounce";
import "@/svg.draw.esm";

const app = getCurrentInstance();
console.log("dvdb - app", app.appContext);

const props = defineProps({
  isMoving: Boolean,
});
// const isMoving = ref(props.isMoving);

const svgWrapper = ref(null);
const stdDeviation = ref({ magnitude: 0 });
watch(
  () => props.isMoving,
  (value) => {
    console.log("dvdb - watch - value", value);
    // TODO Dylan next: tween the fade
    // stdDeviation.value = value ? 8 : 0;
    if (value) {
      gsap.to(".blur", { deviation: 9, duration: 300 });
      return;
    }
    gsap.to(".blur", { deviation: 0, duration: 300 });
    // debounce(() => {}, 500, {
    //   leading: true,
    // });
  }
);
const emit = defineEmits(["newCoords"]);
let line;

onMounted(() => {
  let drawing = SVG("#draw-svg").size(`100%`, `100%`).addClass("blur");
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
  moveLineToNewPoints(line, pixels);
}

function moveLineToNewPoints(line, points) {
  line.plot(points);
  line.circles?.forEach((circle, index) => {
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

/* apply the filter with css */
.blur {
  filter: url(#blurFilter);
  -webkit-filter: url(#blurFilter);
  -moz-filter: url(#blurFilter);
  -o-filter: url(#blurFilter);
  -ms-filter: url(#blurFilter);
}
</style>
