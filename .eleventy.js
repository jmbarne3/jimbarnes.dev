const Image = require("@11ty/eleventy-img");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginSEO = require("eleventy-plugin-seo");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('style.css');

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Filters
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

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
        return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => eleventyConfig.getFilter('url')(entry.srcset)).join(", ")}" sizes="${sizes}">`;
      }).join("\n")}
        <img
          class="${classes}"
          src="${eleventyConfig.getFilter('url')(lowsrc.url)}"
          alt="${alt}"
          loading="lazy"
          decoding="async" />
    </picture>`;
  });

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addCollection('currentPosts', function (collectionApi) {
    const posts = [];
    const today = new Date();
    collectionApi.getFilteredByTags('post').map((post) => {
      if (post.date <= today) posts.push(post);
    });

    return posts;
  });

  function getTagList(collection) {
    let tagSet = new Set();
    collection.forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return filterTagList([...tagSet]);
  }

  function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ["post"].indexOf(tag) === -1
    );
  }

  eleventyConfig.addFilter('filterTagList', filterTagList);

  eleventyConfig.addCollection("postTags", function (collectionAPI) {
    let collection = collectionAPI.getFilteredByTag("post");
    return getTagList(collection);
  });

  function getTagUrl(tag) {
    const tagSlug = eleventyConfig.getFilter('slugify')(tag);
    const tagUrl = `/tags/${tagSlug}/`;
    return eleventyConfig.getFilter('url')(tagUrl)
  }

  eleventyConfig.addFilter('getTagUrl', getTagUrl);

  // SEO Configuration
  eleventyConfig.addPlugin(pluginSEO, {
    title: 'Jim Barnes Development',
    description: 'The personal blog of Jim Barnes, a web developer who lives in Central Florida.',
    url: 'https://jimbarnes.dev',
    author: 'Jim Barnes',
    image: './src/img/shared/code.png'
  });

  return {
    dir: {
      input: 'src',
      output: '_site'
    }
  };
};
