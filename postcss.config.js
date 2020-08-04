const autoprefixer = require("autoprefixer");
const tailwind = require("tailwindcss");
const cssnano = require("cssnano");
const purgecss = require("@fullhuman/postcss-purgecss");

const plugins = !process.env.ROLLUP_WATCH
  ? [
      autoprefixer,
      tailwind("./tailwind.config.js"),
      purgecss({
        content: ["./src/**/*.svelte", "./src/**/*.html"],
        whitelistPatterns: [/svelte-/],
        defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
      }),
      cssnano,
    ]
  : [tailwind("./tailwind.config.js")];

module.exports = { plugins };
