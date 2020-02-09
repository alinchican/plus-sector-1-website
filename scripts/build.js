const helpers = require("./helpers");

(async () => {
  await helpers.deletePreviousBuild();

  await Promise.all([
    helpers.buildHTML(),
    helpers.buildCSS(),
    helpers.buildAppIcons(),
    helpers.buildSVGs(),
    helpers.buildMetaTagImages(),
    helpers.buildImages(),
  ]);
})();
