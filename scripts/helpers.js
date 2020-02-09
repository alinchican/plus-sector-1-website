const fs = require("fs");
const { config, outputFolderPath } = require("../build.config");
const minify = require("html-minifier-terser").minify;
const sharp = require("sharp");
const postcss = require("postcss");
const postcssConfig = require("../postcss.config");

const safeMkDir = async path =>
  await fs.promises.mkdir(path, { recursive: true });
const readDirFiles = async path => await fs.promises.readdir(path);
const copyFile = async (inputPath, outputPath) =>
  await fs.promises.copyFile(inputPath, outputPath);
const writeFile = async (outputPath, content) =>
  fs.promises.writeFile(outputPath, content);
const readFile = inputPath =>
  fs.promises.readFile(inputPath, {
    encoding: "utf8"
  });

const deleteFolder = async path =>
  (await fs.promises.access(path)) && (await fs.promises.rmdir(path));

const deletePreviousBuild = async () => {
  try {
    await deleteFolder(outputFolderPath);
    console.log("Deleted previous build");
  } catch (error) {
    throw new Error(error);
  }
};
const getFileExtension = fileName => fileName.split(".").pop();

const buildSVGs = async () => {
  const files = await readDirFiles(config.svg.inputPath);
  await safeMkDir(config.svg.outputPath);

  files
    .filter(fileName => getFileExtension(fileName) === "svg")
    .forEach(async file => {
      const fileOutputPath = `${config.svg.outputPath}/${file}`;
      await copyFile(`${config.svg.inputPath}/${file}`, fileOutputPath);
      console.log(`Wrote ${fileOutputPath}`);
    });
};

const buildImages = async () => {
  const inputPathFiles = await readDirFiles(config.img.inputPath);
  await safeMkDir(config.img.outputPath);

  const images = inputPathFiles
    .filter(fileName =>
      config.img.inputFormats.includes(getFileExtension(fileName))
    )
    .map(fileName => {
      const nameParts = fileName.split(".");
      const ext = nameParts.pop();
      const name = nameParts.join("");

      return {
        ext,
        name
      };
    });

  images.forEach(async image => {
    await config.img.resizeVariants.forEach(async variant => {
      const fileOutputPath = `${config.img.outputPath}/${image.name}-${variant}.jpg`;

      await sharp(`${config.img.inputPath}/${image.name}.${image.ext}`)
        .resize(variant)
        .jpeg({
          quality: process.env.NODE_ENV === "production" ? 80 : 100
        })
        .toFile(fileOutputPath);

      console.log(`Wrote ${fileOutputPath}`);
    });
  });
};

const buildAppIcons = async () => {
  const inputPathFiles = await readDirFiles(config.appIcons.inputPath);
  await safeMkDir(config.appIcons.outputPath);

  inputPathFiles
    .filter(fileName =>
      config.appIcons.inputFormats.includes(getFileExtension(fileName))
    )
    .forEach(async file => {
      const fileOutputPath = `${config.appIcons.outputPath}/${file}`;
      await copyFile(`${config.appIcons.inputPath}/${file}`, fileOutputPath);
      console.log(`Wrote ${fileOutputPath}`);
    });
};

const buildHTML = async () => {
  const inputPathFiles = await readDirFiles(config.html.inputPath);
  await safeMkDir(config.html.outputPath);

  inputPathFiles
    .filter(fileName => getFileExtension(fileName) === "html")
    .forEach(async file => {
      const fileInputPath = `${config.html.inputPath}/${file}`;
      const fileOutputPath = `${config.html.outputPath}/${file}`;

      if (process.env.NODE_ENV === "production") {
        const html = await readFile(fileInputPath);
        const processedHTML = minify(html, config.html.minifyOptions);
        await writeFile(fileOutputPath, processedHTML);
      } else {
        await copyFile(fileInputPath, fileOutputPath);
      }

      console.log(`Wrote ${fileOutputPath}`);
    });
};

const buildMetaTagImages = async () => {
  const inputPathFiles = await readDirFiles(config.metaTagImages.inputPath);
  await safeMkDir(config.metaTagImages.outputPath);

  inputPathFiles
    .filter(fileName =>
      config.metaTagImages.inputFormats.includes(getFileExtension(fileName))
    )
    .forEach(async file => {
      const fileOutputPath = `${config.metaTagImages.outputPath}/${file}`;
      await copyFile(
        `${config.metaTagImages.inputPath}/${file}`,
        fileOutputPath
      );
      console.log(`Wrote ${fileOutputPath}`);
    });
};

const buildCSS = async () => {
  const css = await readFile(
    `${config.css.inputPath}/tailwind.${config.css.inputFormats}`
  );
  await safeMkDir(config.css.outputPath);

  const fileOutputPath = `${config.css.outputPath}/style.css`;
  const processor = await postcss(postcssConfig.plugins);
  const result = await processor.process(css, {
    from: `${config.css.inputPath}/tailwind.css`,
    to: fileOutputPath
  });

  await writeFile(fileOutputPath, result.css);
  console.log(`Wrote ${fileOutputPath}`);
};

module.exports = {
  config,
  deletePreviousBuild,
  buildImages,
  buildHTML,
  buildSVGs,
  buildAppIcons,
  buildMetaTagImages,
  buildCSS
};
