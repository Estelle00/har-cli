module.exports = function (api) {
  api.extendPackage({
    devDependencies: {
      "@vue/tsconfig": "^0.1.3"
    },
  });
  api.render("./template");
};
