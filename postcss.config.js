const tailwindcss = require("tailwindcss");
const purgecss = require("@fullhuman/postcss-purgecss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const { config } = require("./build.config");

module.exports = {
  plugins: [
    tailwindcss,
    ...(process.env.NODE_ENV === "production"
      ? [
          purgecss({
            // Specify the paths to all of the template files in your project
            content: [`${config.html.inputPath}/*/.html`],
            // Include any special characters you're using in this regular expression
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
          }),
          autoprefixer,
          cssnano({
            preset: "default"
          })
        ]
      : [])
  ]
};
