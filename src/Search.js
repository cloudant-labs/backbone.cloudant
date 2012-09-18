Backbone.Cloudant.Search = {
  Collection: Backbone.Cloudant.Collection.extend({
    design: "my_design",
    index: "my_index",
    bookmark: undefined,
    baseURL: function(){
      return [Backbone.Cloudant.database, "_design", this.design, "_search", this.index].join("/");
    },
    fetchMore: function(){
      // Use bookmarks to skip results
      var query = $.param(this.cloudant_options);
    }
  })
};