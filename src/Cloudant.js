/*global Cloudant: true */
Backbone.Cloudant = {};
_.extend(Backbone.Cloudant, Backbone.Events, {
  VERSION: "0.0.1",
  // URL to the root of the database
  database: "http://username.cloudant.com/mydb",
  // Auth information
  // TODO: implement using this
  auth: {},

  Watch: function(collection){
    this.on("change:cloudant_change", function(){
      collection.handleChange();
    });
  },

  ChangeHandler: function(since){
    // Hit changes every 5 seconds, fetch collection if one is fired
    // TODO: switch to long poll
    var cloudant = this;
    since = since || 0;
    $.getJSON(cloudant.database + "/_changes", {since: since}, function(data) {
      if (since !== data.last_seq){
        since = data.last_seq;
        cloudant.trigger("change:cloudant_change");
      }
    });

    function loop(){
      cloudant.ChangeHandler(since);
    }

    setTimeout(loop, 5000);
  }
});

// Generic document Model
Backbone.Cloudant.Model = Backbone.Model.extend({
  idAttribute: "_id",
  url: function(){
    var url = Backbone.Cloudant.database;
    if (typeof this.id !== "undefined"){
      url += "/" + this.id;
    }
    return url;
  },
  parse: function(resp) {
    // Thanks Chewie
    if (resp.rev) {
      resp._rev = resp.rev;
      delete resp.rev;
    }
    if (resp.id) {
      if (typeof(this.id) === "undefined") {
        resp._id = resp.id;
      }
      delete resp.id;
    }
    if (resp.ok) {
      delete resp.ok;
    }
    return resp;
  }
});

Backbone.Cloudant.Collection = Backbone.Collection.extend({
  //Base class for other collections to extend
  // TODO: make a constructor
  model: Backbone.Cloudant.Model,
  cloudant_options: {},
  initialize: function(args){
    if (args){
      console.log(args);
      if (args.watch){
        Backbone.Cloudant.Watch(this);
        delete args.watch;
      }
    }
  },
  parse: function(response){
    return response.rows;
  },
  fetchMore: function(){
    var query = $.param(this.cloudant_options);
  },
  baseURL: function(){
    return Backbone.Cloudant.database;
  },
  url: function(){
    var query = $.param(this.cloudant_options);
    var url = this.baseURL();
    if (query){
      url = url + "?" + query;
    }
    return url;
  },
  handleChange: function(docs){
    // Override to change sync behaviour
    this.fetch();
  }
});
