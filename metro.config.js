const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...(config.resolver || {}),
  // Metro occasionally misses helpers provided by @babel/runtime during native builds.
  extraNodeModules: {
    ...(config.resolver?.extraNodeModules || {}),
    '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
  },
};

module.exports = withNativeWind(config, { input: './global.css' });
