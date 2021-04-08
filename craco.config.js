const { addBeforeLoader, loaderByName } = require("@craco/craco");

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  webpack: {
    configure: function(webpackConfig) {
      const yamlLoader = {
         test: /\.ya?ml$/,
         type: "json",
         use: ['yaml-loader']
      };

      addBeforeLoader(webpackConfig, loaderByName("file-loader"), yamlLoader);

      return webpackConfig;
    }
  },
  eslint: {
    configure: {
      rules: {
        "@typescript-eslint/no-unused-vars": "off"
      }
    }
  }
};
