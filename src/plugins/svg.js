import SVG from "@svgdotjs/svg.js";
// import panZoom from "svg.panzoom.js"; src/plugins/svg.js

export default {
  install: (app, options) => {
    app.config.globalProperties.$svg = (key) => {
      return key.split(".").reduce((o, i) => {
        if (o) return o[i];
      }, options);
    };

    app.provide(SVG, options);
  },
};
