import { ref, onMounted, onUnmounted, onBeforeMount, watchEffect } from "vue";
import { throttle } from "lodash";
import { angleBetweenPoints } from "@/helpers";

export function useMousePositionScreen() {
  const x = ref(0);
  const y = ref(0);

  function handler(event) {
    x.value = event.clientX;
    y.value = event.clientY;
  }

  const onMouseMove = throttle(handler, 200);
  onMounted(() => {
    window.addEventListener("mousemove", onMouseMove);
  });

  onUnmounted(() => {
    window.removeEventListener("mousemove", onMouseMove);
  });

  return {
    x,
    y
  };
}

function screenToSVGPoint(screenPoint, svgElement) {
  const point = svgElement.createSVGPoint();
  point.x = screenPoint.x;
  point.y = screenPoint.y;
  const svgPoint = point.matrixTransform(svgElement.getScreenCTM().inverse());
  return svgPoint;
}

export function useMousePositionSVG(svgId) {
  const svgX = ref(0);
  const svgY = ref(0);
  let svg;
  function handler(event) {
    const svgPoint = screenToSVGPoint(
      { x: event.clientX, y: event.clientY },
      svg
    );
    const { x, y } = svgPoint;
    svgX.value = x;
    // console.log("handler -> svgX.value", svgX.value);
    svgY.value = y;
    // console.log("handler -> svgY.value", svgY.value);
  }

  const onMouseMove = throttle(handler, 200);
  onMounted(() => {
    svg = document.getElementById(svgId);
    svg.addEventListener("mousemove", onMouseMove);
  });

  onUnmounted(() => {
    svg.removeEventListener("mousemove", onMouseMove);
  });

  return {
    svgX,
    svgY
  };
}


function getCenterPoint(elementId) {
  const box = document.getElementById(elementId).getBBox();
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2
  };
}

export function useAngleBetweenMouseAndCenter(svgX, svgY, elementId) {
  const angle = ref(0);
  onMounted(() => {
    const centerPoint = getCenterPoint(elementId);
    console.log("useAngleBetweenMouseAndCenter -> centerPoint", centerPoint);
    // const centerPoint = {
    //   x: 477,
    //   y: 481
    // };
    watchEffect(() => {
      // console.log("useAngleBetweenMouseAndCenter -> centerPoint", centerPoint);
      angle.value = angleBetweenPoints(centerPoint, {
        x: svgX.value,
        y: svgY.value
      });
    });
  });
  return { angle };
}


export function useWindowSize() {
  const windowWidth = ref(0);
  const windowHeight = ref(0);

  function setSize() {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  }

  const onResize = throttle(setSize, 200);
  onBeforeMount(() => {
    setSize();
  });

  onMounted(() => {
    window.addEventListener("resize", onResize, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener("resize", onResize);
  });

  return {
    windowWidth,
    windowHeight,
  };
}