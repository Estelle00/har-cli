module.exports = function (api) {
  api.extendPackage({
    devDependencies: {
      "@har/eslint-config": "^1.2.0"
    },
  });
  api.render("./template");
};
