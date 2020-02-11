const inputFolderPath = "./src";
const outputFolderPath = "./build";

const config = {
  css: {
    inputFormats: ["css"],
    inputPath: `${inputFolderPath}/css`,
    outputPath: `${outputFolderPath}`
  },
  img: {
    inputFormats: ["jpg", "png"],
    inputPath: `${inputFolderPath}/img`,
    outputPath: `${outputFolderPath}/img`,
    outputFormat: "jpg",
    resizeVariants: [320, 640, 768, 1024, 1280, 1440, 1536, 2048, 2880]
  },
  svg: {
    inputPath: `${inputFolderPath}/img`,
    outputPath: `${outputFolderPath}/img`
  },
  appIcons: {
    inputFormats: ["svg", "png", "xml", "ico", "webmanifest"],
    inputPath: `${inputFolderPath}/favicons`,
    outputPath: `${outputFolderPath}`
  },
  html: {
    inputPath: `${inputFolderPath}`,
    outputPath: `${outputFolderPath}`,
    minifyOptions: {
      collapseWhitespace: true,
      removeComments: true,
      // removeOptionalTags: true,
      // removeRedundantAttributes: true,
      // removeScriptTypeAttributes: true,
      // removeTagWhitespace: true,
      // useShortDoctype: true,
      // minifyJs: true
    }
  },
  metaTagImages: {
    inputFormats: ["jpg"],
    inputPath: `${inputFolderPath}/metaTagsImages`,
    outputPath: `${outputFolderPath}/img`
  }
};

module.exports = {
  inputFolderPath,
  outputFolderPath,
  config
};
