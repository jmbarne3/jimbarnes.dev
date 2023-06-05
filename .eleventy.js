const Image = require("@11ty/eleventy-img");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");


module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('style.css');

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addShortcode("image", async function (classes, src, alt, sizes) {
    if (alt === undefined) {
      throw new Error(`Missing \`alt\` on responseiveimage from : ${src}`);
    }

    let metadata = await Image(src, {
      widths: [150, 300, 600, 1024],
      formats: ["jpeg", "webp"],
      outputDir: './_site/img/'
    });

    let lowsrc = metadata.jpeg[0];

    return `<picture class=${classes}>
      ${Object.values(metadata).map(imageFormat => {
        return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
      }).join("\n")}
        <img
          class="${classes}"
          src="${lowsrc.url}"
          alt="${alt}"
          loading="lazy"
          decoding="async" />
    </picture>`;
  });

  eleventyConfig.addPlugin(syntaxHighlight);

  return {
    dir: {
      input: 'src',
      output: '_site'
    }
  };
};
