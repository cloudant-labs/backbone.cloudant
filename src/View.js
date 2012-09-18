// TODO: make a constructor :)
Backbone.Cloudant.View = {
  Collection: Backbone.Cloudant.Collection.extend({
    design: "my_design",
    view: "my_view",
    baseURL: function(){
      return [Backbone.Cloudant.database, "_design", this.design, "_view", this.view].join("/");
    }
  })
};