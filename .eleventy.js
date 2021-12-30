// eleventy configuration

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
    // next/prev
  eleventyConfig.addCollection("blog", function (collection) {
    const coll = collection.getFilteredByTag("blog");

    for (let i = 0; i < coll.length; i++) {
      const prevPost = coll[i - 1];
      const nextPost = coll[i + 1];

      coll[i].data["prevPost"] = prevPost;
      coll[i].data["nextPost"] = nextPost;
    }

    return coll;
  });
  eleventyConfig.addShortcode("excerpt", (post) => extractExcerpt(post));
  return {
    passthroughFileCopy: true,
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"],
    dir: {
      input: "src",
      output: "_site",
      include: "_includes",
    },
  };
};

const excerptMinimumLength = 30;
const excerptMaximumLength = 60;
const excerptSeparator = "<!--more-->";

/**
 * Extracts the excerpt from a document.
 *
 * @param {*} doc A real big object full of all sorts of information about a document.
 * @returns {String} the excerpt.
 */
function extractExcerpt(doc) {
  if (!doc.hasOwnProperty("templateContent")) {
    console.warn(
      "Failed to extract excerpt: Document has no property `templateContent`."
    );
    return;
  }

  const content = doc.templateContent;

  if (content.includes(excerptSeparator)) {
    return content.substring(0, content.indexOf(excerptSeparator)).trim();
  } else if (content.length <= excerptMinimumLength) {
    return content.trim();
  }

  return content.substring(0, excerptMaximumLength).trim();
}
