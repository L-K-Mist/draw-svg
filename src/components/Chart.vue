<template>
  <div id="chart-wrapper" class="chart-layer" ref="chartWrapper">
    <div id="chart" ref="chart"></div>
  </div>
</template>

<script setup>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import { onMounted, ref, computed, defineExpose, defineEmits } from "vue";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { toStringHDMS } from "ol/coordinate";
import { toLonLat, transform, transformExtent } from "ol/proj";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import throttle from "lodash/throttle";

const chart = ref(null);
const emit = defineEmits(["newExtent"]);
let map;
let handleDrag = ref(
  throttle(function (event) {
    // console.log("dvdb - event", event);
    // const { extent } = event.frameState;
    // console.log("dvdb - event.frameState", event.frameState);
    // emit("newExtent", transformExtent(extent, "EPSG:3857", "EPSG:4326"));
    const newPixels = routeCoords.value.map((coord) =>
      map.getPixelFromCoordinate(coord.raw)
    );
    console.log("dvdb - newPixels", newPixels);
    emit("newPixels", newPixels);
    // emit("newExtent", extent);
    // console.log("dvdb - movestart - event", event.frameState);
  }, 2)
);
onMounted(() => {
  map = new Map({
    target: chart.value,
    projection: "EPSG:3857",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: transform([-1.542609, 50.703489], "EPSG:4326", "EPSG:3857"),
      zoom: 1,
    }),
  });

  map.on("singleclick", function (event) {
    // console.log("dvdb - evt", event);
    console.log(event.coordinate);

    // convert coordinate to EPSG-4326
    console.log(transform(event.coordinate, "EPSG:3857", "EPSG:4326"));
  });
  map.on("pointerdrag", handleDrag.value);

  map.getView().on("change:resolution", handleDrag.value);
});

// handleDrag.value = throttle(handleDrag.value, 1000);
const routeCoords = ref([]);

function handleNewCoords({ elementX, elementY }) {
  const raw = map.getCoordinateFromPixel([elementX, elementY]);

  const refined = transform(raw, "EPSG:3857", "EPSG:4326");
  // console.log("dvdb - handleNewCoords - coordsRefined", coordsRefined);
  const coordsDMS = toStringHDMS(refined);
  // console.log("dvdb - handleNewCoords - coords", coordsDMS);
  routeCoords.value.push({ refined, raw });
  // console.log("dvdb - handleNewCoords - routeCoords.value", routeCoords.value);
  // emit(
  //   "newRoute",
  //   JSON.parse(
  //     JSON.stringify({
  //       refined: routeCoords.value,
  //       raw: routeCoordsRaw.value,
  //     })
  //   )
  // );
}

function getCoords() {
  return routeCoords;
}

defineExpose({ handleNewCoords, getCoords, map });
</script>

<style scoped>
#chart-wrapper {
  outline: 4px dotted green;
}

#chart {
  height: 100%;
  width: 100%;
}
</style>
