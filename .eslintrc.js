module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ["@altocumulus/custom"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
