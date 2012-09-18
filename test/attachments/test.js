/*global require:true */
require(['backbone', 'jquery'], function (Backbone, jquery) {
  $('#versions').append('<li>Backbone: ' + Backbone.VERSION + '</li>');

  var DumbView = Backbone.View.extend({
    tagName: "li",
    render: function(){
      var view = this;
      var list = $("<ul></ul>");
      list.append('<li>Length: ' + this.collection.length + '</li>');
      list.append('<li>Total Length: ' + this.collection.totalLength + '</li>');
      list.append('<li>Query options: ' + JSON.stringify(this.collection.cloudant_options) + '</li>');
      // Print 10 rows out to the screen
      _.each(this.collection.first(5), function(doc){
        list.append('<li><pre><code>' + JSON.stringify(doc) + '</code></pre></li>');
      });
      $(view.id).html(list);
    },
    initialize: function(args){
      this.collection = args.collection;
      this.collection.on("reset", this.render, this);
      this.collection.on("add", this.render, this);
    }
  });

  // Bit of a hack to load out non- require module code
  require(['backbone.cloudant'], function () {
    $('#versions').append('<li>Backbone.Cloudant: ' + Backbone.Cloudant.VERSION + '</li>');
    Backbone.Cloudant.database = "/backbone-cloudant-demo/";

    // start the change handler
    Backbone.Cloudant.ChangeHandler();

    var all_docs = new Backbone.Cloudant.Docs.Collection();

    var all_docs_view = new DumbView({collection: all_docs, id: '#all_docs'});

    all_docs.fetch().fail(function(){console.log('Could not load all_docs collection');});

    var view = new Backbone.Cloudant.View.Collection();
    view.design = 'app';
    view.view = 'test';
    view.cloudant_options = {"reduce": false, "limit": 10};

    var view_view = new DumbView({collection: view, id: '#view'});

    view.fetch().fail(function(){console.log('Could not load view collection');});

    var reducedview = new Backbone.Cloudant.View.Collection({"watch": true});
    reducedview.design = 'app';
    reducedview.view = 'test';
    reducedview.cloudant_options = {"reduce": true, "group": true};

    var reduced_view_view = new DumbView({collection: reducedview, id: '#reduced_view'});

    reducedview.fetch().fail(function(){console.log('Could not load reduced view collection');});

    var watchedview = new Backbone.Cloudant.View.Collection({"watch": true});
    watchedview.design = 'app';
    watchedview.view = 'test';
    watchedview.cloudant_options = {"reduce": false, "limit": 10, "descending": true};

    var watchedview_view = new DumbView({collection: watchedview, id: '#watchedview'});

    watchedview.fetch().fail(function(){console.log('Could not load watched view collection');});

    var search = new Backbone.Cloudant.Search.Collection();
    search.design = 'app';
    search.index = 'mysearch';
    search.cloudant_options = {"q": "a:1", "limit": 2};

    var search_view = new DumbView({collection: search, id: '#search'});

    search.fetch().fail(function(){console.log('Could not load search collection');});


    var limited_all_docs = new Backbone.Cloudant.Docs.Collection();
    limited_all_docs.cloudant_options = {"limit": 2, "skip": 5};
    console.log(limited_all_docs);
    var limited_all_docs_view = new DumbView({collection: limited_all_docs, id: '#limited_all_docs'});

    limited_all_docs.fetch().fail(function(){console.log('Could not load all_docs collection');});

    function testFetchMore(){
      limited_all_docs.fetchMore();
      search.fetchMore();
    }
    setTimeout(testFetchMore, 3000);

    function addDocs(){
      var doc = new Backbone.Cloudant.Model();
      doc.set("a", Math.floor(Math.random()*11));
      doc.save();

      function loop(){
        addDocs();
      }

      setTimeout(loop, 10000);
    }
    addDocs();
  });
});