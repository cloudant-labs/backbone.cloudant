// ### Backbone.Cloudant.View

// A `collection` representing a view result. View query parameters should be
// passed in via `cloudant_options`.
Backbone.Cloudant.View = {
  Collection: Backbone.Cloudant.Collection.extend({
    // Name of the design document containing the view.
    design: "my_design",
    // Name of the view.
    view: "my_view",
    // Generate the correct base URL (without query parameters) for the view.
    baseURL: function(){
      return [Backbone.Cloudant.database, "_design", this.design, "_view", this.view].join("/");
    }
  })
};