module.exports = function (api) {
  api.extendPackage({
    devDependencies: {
      "@har/eslint-config": "^1.1.1",
    },
  });
  api.render("./template");
};
