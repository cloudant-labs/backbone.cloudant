// A collection representing the result of a
// [search](https://cloudant.com/for-developers/search). Query parameters,
// including the lucene query, should be passed in via `cloudant_options`.
// **Note** this will *not* work with Apache CouchDB.
Backbone.Cloudant.Search = {
  Collection: Backbone.Cloudant.Collection.extend({
    // Name of the design document containing the search index.
    design: "my_design",
    // Name of the index
    index: "my_index",
    // To allow for paging searches return a bookmark. This is stored by the
    // `collection` to allow it to retrieve new results.
    bookmark: undefined,
    // Generate the correct base URL (without query parameters) for the
    // search.
    baseURL: function(){
      return [Backbone.Cloudant.database, "_design", this.design, "_search", this.index].join("/");
    },
    // Use the bookmark value to skip results.
    // TODO: implement
    fetchMore: function(){
      var query = $.param(this.cloudant_options);
    }
  })
};