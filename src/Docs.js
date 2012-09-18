Backbone.Cloudant.Docs = {
  Collection: Backbone.Cloudant.Collection.extend({
    baseURL: function(){
      return [Backbone.Cloudant.database, "_all_docs"].join("/");
    }
  })
};