//## A set of helper objects for interacting with data stored in Cloudant from Backbone.
//
//  * [code on github](https://github.com/cloudant-labs/backbone.cloudant)
//  * [get in touch](http://twitter.com/drsm79)
//
// &copy; 2012 Simon Metson, Cloudant Inc.
// <center><hr width="50%"/></center>

// Backbone.Cloudant provides an event dispatcher, allowing `_changes` to be
// polled in one place and collections notified to trigger appropriate action.
Backbone.Cloudant = _.clone(Backbone.Events);
_.extend(Backbone.Cloudant, {
  VERSION: "0.0.1",
  // Full URL to the root of the database
  database: "http://username.cloudant.com/mydb",
  // Auth information
  // TODO: implement using this
  auth: {},

  // Bind the `change:cloudant_change` event to the `collection.handleChange`
  // function.
  watch: function(collection){
    this.on("change:cloudant_change", function(changes){
      collection.handleChange(changes);
    });
  },

  // Fire the `change:cloudant_change` event if there has been a change in the
  // database. This uses `_changes` with long poll and records `since` to
  // avoid seeing duplicate events. If the long poll times out it will be
  // retried 5 seconds later.
  changeHandler: function(since){
    var cloudant = this;
    since = since || 0;
    function loop(){
      cloudant.changeHandler(since);
    }
    $.getJSON(cloudant.database + "/_changes",
      {since: since, feed:"longpoll"}).success(
      function(data) {
        if (since !== data.last_seq){
          since = data.last_seq;
          cloudant.trigger("change:cloudant_change", data.results);
        }
        loop();
      }
    ).error(
      function(data) {
        setTimeout(loop, 5000);
      }
    );
  }
});

// ### Backbone.Cloudant.Model

// A generic document Model that knows how to get the document `_id` correctly
Backbone.Cloudant.Model = Backbone.Model.extend({
  // CouchDB/Cloudant defines a unique `_id` which we can use directly. See
  // the [Backbone docs](http://backbonejs.org/#Model-idAttribute) for more
  // information
  idAttribute: "_id",
  // The Model's URL is the database URL and it's `id`. If the Model hasn't
  // been stored in the database the URL is just the database URL.
  url: function(){
    var url = Backbone.Cloudant.database;
    if (typeof this.id !== "undefined"){
      url += "/" + this.id;
    }
    return url;
  },
  parse: function(resp) {
    // Behaviour depends on where the document has come from (a document vs
    // `_all_docs`/view).
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

// ### Backbone.Cloudant.Collection

// Base class for other collections to extend. Deals with paging data into the
// collection, handling change events and setting the appropriate URL for the
// collection.
Backbone.Cloudant.Collection = Backbone.Collection.extend({
  model: Backbone.Cloudant.Model,
  // All parameters passed to the server should be stored in
  // `cloudant_options`, e.g. `limit`, `startkey`, `endkey`, `group` etc.
  cloudant_options: {},
  // The `collection` can have more documents in the server than in the
  // current instance (e.g. queries with `limit=X`). `totalLength` stores the
  // number of docs in the server side collection, if available.
  totalLength: 0,
  // If the collection is initialized with the watch parameter tell the
  // Cloudant event dispatch to notify when changes are seen.
  // TODO: make a better initialize
  initialize: function(args){
    if (args){
      if (args.watch){
        Backbone.Cloudant.watch(this);
        delete args.watch;
      }
    }
  },
  // Server queries return metadata as well as the documents in the collection
  // deal with that here.
  parse: function(response){
    if (response.total_rows) {
      this.totalLength = response.total_rows;
    } else {
      this.totalLength = response.rows.length;
    }
    return response.rows;
  },
  // Its possible to paginate through server side collections, fetchMore will
  // retrieve the next batch of documents and add them to the collection.
  fetchMore: function(){
    // If there's no limit there's no point paging, the first query will have
    // retrieved everything already.
    if (this.cloudant_options.limit){
      // If skip hasn't been set skip is the limit, other wise add the two.
      if (!this.cloudant_options.skip){
        this.cloudant_options.skip = this.cloudant_options.limit;
      } else {
        this.cloudant_options.skip += this.cloudant_options.limit;
      }
      this.fetch({add: true});
    }
    // TODO: log a warning?
  },
  // Generate the correct base URL (without query parameters) for the
  // collection. This is a helper function to simplify subclasses. Modify this
  // function and not `collection.url`.
  baseURL: function(){
    return Backbone.Cloudant.database;
  },
  // Return the URL of the collection, including any query parameters.
  url: function(){
    var query = $.param(this.cloudant_options);
    var url = this.baseURL();
    if (query){
      url = url + "?" + query;
    }
    return url;
  },
  // If a change event is fired and this `collection` is watched this function
  // will be called. `changes` is the list of changes reported by Cloudant.
  // The default behaviour is simplistic (reload the collection) and likely
  // sub-optimal. Override this function to change sync behaviour.

  handleChange: function(changes){
    this.fetch();
  }
});

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
// ### Backbone.Cloudant.Search

// A collection representing the result of a
// [search](https://cloudant.com/for-developers/search). Query parameters,
// including the lucene query, should be passed in via `cloudant_options`.
// **Note** this will *not* work with Apache CouchDB out of the box.
Backbone.Cloudant.Search = {
  Collection: Backbone.Cloudant.Collection.extend({
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
  })
};
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