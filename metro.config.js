const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

const uniwindConfig = withUniwindConfig(config, {
  cssEntryFile: "./global.css",
  dtsFile: "./src/uniwind-types.d.ts",
  extraThemes: ['groupify']
});

module.exports = uniwindConfig;
