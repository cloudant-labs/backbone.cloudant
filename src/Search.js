// ### Backbone.Cloudant.Search

// A collection representing the result of a
// [search](https://cloudant.com/for-developers/search). Query parameters,
// including the lucene query, should be passed in via `cloudant_options`.
// **Note** this will *not* work with Apache CouchDB out of the box.
Backbone.Cloudant.Search = Backbone.Cloudant.Index.extend({
  // Name of the design document containing the search index.
  design: "my_design",
  // Name of the index
  index: "my_index",
  // To allow for paging searches return a bookmark. This is stored by the
  // `collection` to allow it to retrieve new results and picked up in the
  // `parse` function, hence overriding it here.
  parse: function(response){
    this.cloudant_options.bookmark = response.bookmark;
    if (response.total_rows) {
      this.totalLength = response.total_rows;
    } else {
      this.totalLength = response.rows.length;
    }
    return response.rows;
  },
  // Generate the correct base URL (without query parameters) for the
  // search.
  baseURL: function(){
    return [Backbone.Cloudant.database, "_design", this.design, "_search", this.index].join("/");
  },
  // Use the bookmark value held in `this.cloudant_options` to skip results.
  // Don't need to do anything other than call `fetch` with `{add:true}`
  // since `parse` stores the bookmark.
  fetchMore: function(){
    this.fetch({add: true});
  }
});
