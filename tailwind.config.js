module.exports = {
  purge: ["./src/**/*.svelte", "./public/*.html"],
  theme: {
    extend: {},
  },
  variants: {
    opacity: ["hover", "focus", "disabled"],
    backgroundColor: ["hover", "focus", "disabled"],
    textColor: ["hover", "focus", "disabled"],
  },
  plugins: [],
};
