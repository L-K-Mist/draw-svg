<template>
  <div id="chart-wrapper" class="chart-layer" ref="chartWrapper">
    <div id="chart" ref="chart"></div>
  </div>
</template>

<script setup>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import {
  onMounted,
  onBeforeUnmount,
  ref,
  computed,
  defineExpose,
  defineEmits,
} from "vue";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { toStringHDMS } from "ol/coordinate";
import { toLonLat, transform, transformExtent } from "ol/proj";
import OSM from "ol/source/OSM";
import "ol/ol.css";

const chart = ref(null);
const emit = defineEmits(["newExtent", "newPixels", "moveStart", "moveEnd"]);
let map;
let handleDrag = ref(function (event) {
  const newPixels = routeCoords.value.map((coord) =>
    map.getPixelFromCoordinate(coord.raw)
  );
  emit("newPixels", newPixels);
});
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
      zoom: 8,
    }),
  });

  map.on(["change:resolution", "pointerdrag"], handleDrag.value);
  map.on("movestart", () => {
    emit("moveStart");
  });

  map.on("moveend", () => {
    emit("moveEnd");
    handleDrag.value();
  });
  map.getView().on("change:resolution", handleDrag.value);
});

onBeforeUnmount(() => {
  map.on(
    (["movestart", "change:resolution", "pointerdrag", "moveend"],
    handleDrag.value)
  );
  map.getView().on("change:resolution", handleDrag.value);
});

const routeCoords = ref([]);

function handleNewCoords({ elementX, elementY }) {
  const raw = map.getCoordinateFromPixel([elementX, elementY]);

  const refined = transform(raw, "EPSG:3857", "EPSG:4326");
  const coordsDMS = toStringHDMS(refined);

  routeCoords.value.push({ refined, raw });
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
