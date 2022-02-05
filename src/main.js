import { createApp } from "vue";
import App from "./App.vue";
import "./assets/tailwind.css";
import svgJS from "@/plugins/svg.js";
const app = createApp(App);
app.use(svgJS).mount("#app");
