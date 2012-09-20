// ### Backbone.Cloudant.Docs

// A collection representing the `_all_docs` resource. Query parameters should
// be passed in via `cloudant_options`.
Backbone.Cloudant.Docs = {
  Collection: Backbone.Cloudant.Collection.extend({
    // Generate the correct base URL (without query parameters) for
    // `_all_docs`
    baseURL: function(){
      return [Backbone.Cloudant.database, "_all_docs"].join("/");
    }
  })
};