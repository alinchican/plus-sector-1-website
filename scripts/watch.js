const chokidar = require("chokidar");
const helpers = require("./helpers");

chokidar.watch("./src/*.html").on("change", async path => {
  console.log(`Changed ${path}`);
  await helpers.buildHTML();
});

chokidar.watch("./src/css/tailwind.css").on("change", async path => {
  console.log(`Changed ${path}`);
  await helpers.buildCSS();
});
