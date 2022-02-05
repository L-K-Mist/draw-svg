<template>
  <div id="svg-wrapper" class="chart-layer" ref="svgWrapper">
    <svg id="draw-svg">
      <defs>
        <!-- identify the filter-->
        <filter id="blurFilter">
          <!-- filter processes -->
          <!-- <feGaussianBlur
            class="blur"
            in="SourceGraphic"
            :stdDeviation="stdDeviation.magnitude"
          /> -->
          <feGaussianBlur
            id="gaussian-blur"
            in="SourceGraphic"
            stdDeviation="10"
          />
          <!-- stdDeviation is amount of blur -->
        </filter>
      </defs>
    </svg>
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
import debounce from "lodash.debounce";
import gsap from "gsap";
// import debounce from "lodash/debounce";
import "@/svg.draw.esm";

export default {
  setup(props, { emit }) {
    console.log(props); // { user: '' }
    const app = getCurrentInstance();
    console.log("dvdb - app", app.appContext);

    // const isMoving = ref(props.isMoving);

    const svgWrapper = ref(null);
    // const stdDeviation = ref({ magnitude: 0 });

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

    // defineExpose({ handleNewExtent, handleNewPixels });
    return {
      handleNewPixels,
      handleNewExtent,
    }; // anything returned here will be available for the rest of the component
  },
  props: ["isMoving"],
  data() {
    return {
      stdDeviation: { magnitude: 0 },
    };
  },

  watch: {
    isMoving(value) {
      console.log("dvdb - watch - value", value);
      // TODO Dylan next: tween the fade
      // stdDeviation.value = value ? 8 : 0;
      if (value) {
        console.log("dvdb - isMoving - value", value);
        console.log(
          "dvdb - isMoving - this.$data.stdDeviation",
          this.$data.stdDeviation
        );
        gsap.to("#gaussian-blur", 1, {
          attr: { stdDeviation: 9 },
          repeat: -1,
          // yoyo: true,
        });
        gsap.to(this.$data.stdDeviation, { magnitude: 9, duration: 300 });
        return;
      }
      gsap.to("#gaussian-blur", 1, {
        attr: { stdDeviation: 0 },
        repeat: -1,
        // yoyo: true,
      });
      // debounce(() => {}, 500, {
      //   leading: true,
      // });
    },
  },
  // the "rest" of the component
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
