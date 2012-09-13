// Set the require.js configuration for your application.
require.config({
  deps: ["cloudant"],
  paths: {
    // JavaScript folders.
    libs: "../assets/js/libs",

    // // Libraries.
    jquery: "assets/js/libs/jquery",
    lodash: "assets/js/libs/lodash",
    backbone: "assets/js/libs/backbone",

    cloudant: "src/Cloudant",
    search: "src/Search"
  },

  shim: {
    // Backbone.LayoutManager depends on Backbone.
    backbone: {
      deps: ["lodash", "jquery"],
      exports: "Backbone"
    },
    "cloudant": ["backbone"],
    "search": ["cloudant"]
  }

});
