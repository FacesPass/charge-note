const path = require('path')
const { override, addWebpackAlias } = require('customize-cra')
const addLessLoader = require('customize-cra-less-loader')

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  }),
  addLessLoader({
    cssLoaderOptions: {
      modules: {
        localIdentName: '[hash:base64:8]',
      },
    },
    lessLoaderOptions: {
      lessOptions: {
        javascriptEnabled: true,
      },
    },
  }),
)
