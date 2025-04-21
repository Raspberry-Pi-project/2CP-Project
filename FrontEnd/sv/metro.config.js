const { getDefaultConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'mjs', 'cjs'],
  assetExts: [
    ...config.resolver.assetExts.filter(ext => ext !== 'json'),
    'obj', 'glb', 'gltf', 'png', 'jpg', 'ttf', 'otf', 'bin'
  ]
};

// Remove the serializer configuration
module.exports = config;