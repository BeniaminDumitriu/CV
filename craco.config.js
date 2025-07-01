const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      if (env === 'production') {
        // Dezactivez CSS minification care cauzează probleme
        const optimization = webpackConfig.optimization;
        if (optimization.minimizer) {
          optimization.minimizer = optimization.minimizer.filter(
            minimizer => !minimizer.constructor.name.includes('CssMinimizerPlugin')
          );
        }
      }
      return webpackConfig;
    },
  },
  style: {
    postcss: {
      mode: 'extends',
      loaderOptions: (postcssLoaderOptions, { env, paths }) => {
        postcssLoaderOptions.postcssOptions = {
          ...postcssLoaderOptions.postcssOptions,
          parser: require('postcss-safe-parser'),
        };
        return postcssLoaderOptions;
      },
    },
  },
}; 