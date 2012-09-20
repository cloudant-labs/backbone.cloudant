# Backbone Cloudant

Helper objects for interacting with data stored in Cloudant from Backbone.

## Getting Started
Download the [production version][min] or the [development version][max]. The
code depends on [Backbone][backbone] and [Underscore][backbone] only.

In your web page:

```html
<script src="jquery.js"></script>
<script src="underscore.js"></script>
<script src="backbone.js"></script>
<script src="dist/backbone.cloudant.min.js"></script>
<script>
  Backbone.Cloudant.database = "/backbone-cloudant-demo/";
  // start the change handler
  Backbone.Cloudant.ChangeHandler();

  var all_docs = new Backbone.Cloudant.Docs.Collection();
  var all_docs_view = new MyView({collection: all_docs, id: '#all_docs'});

  all_docs.fetch().fail(function(){console.log('Could not load all_docs collection');});

</script>
```

## Documentation

[Documentation][docslink] is generated with [docco][docco]. You can generate
the docs using `grunt docs`.

### Installation
 * npm install [couchapp][nodecouchapp] // not sure that this is required...
 * npm install [grunt-couchapp][grunt-couchapp]
 * npm install [grunt-contrib-clean][grunt-contrib-clean]
 * npm install [grunt-contrib-copy][grunt-contrib-copy]
 * npm install [grunt-docco][grunt-docco] (to build docs)
 * Edit `url.json` to point to your database

### Known issues
 * Need a decent way of handling auth details
 * Improve collection initialize
 * [grunt-couchapp][grunt-couchapp] can't delete authenticated URL's

### Using `Backbone.Cloudant` with Apache CouchDB
There is nothing that prevents using Backbone.Cloudant with [CouchDB][couchdb]
where the two systems have feature parity. The Search collection isn't usable
with CouchDB, as that functionality is only available via Cloudant. All other
collections and change handling should work with CouchDB and are tested on
CouchDB as well as Cloudant.

## Examples
 * [Live testpage][testpage]

## Release History
 * 17th September 2012: v0.0.1 released for public testing

## License
Copyright (c) 2012 Cloudant

Licensed under the MIT license.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality. Lint and test your
code using [grunt][grunt].

### Important notes
Please don't edit files in the `dist` subdirectory as they are generated via
grunt. You'll find source code in the `src` subdirectory!

While grunt can run the included unit tests via PhantomJS, this shouldn't be
considered a substitute for the real thing. Please be sure to test the
`test/*.html` unit test file(s) in _actual_ browsers.

### Installing grunt
_This assumes you have [node.js][node] and [npm][npm] installed already._

1. Test that grunt is installed globally by running `grunt --version` at the
   command-line.
1. If grunt isn't installed globally, run `npm install -g grunt` to install
   the latest version. _You may need to run `sudo npm install -g grunt`._
1. From the root directory of this project, run `npm install` to install the
   project's dependencies.

### Installing PhantomJS

In order for the qunit task to work properly, [PhantomJS][phantom] must be
installed and in the system PATH (if you can run "phantomjs" at the command
line, this task should work).

Unfortunately, PhantomJS cannot be installed automatically via npm or grunt,
so you need to install it yourself. There are a number of ways to install
PhantomJS.

* [PhantomJS and Mac OS X][phantomosx]
* [PhantomJS Installation][phantominstall] (PhantomJS wiki)

Note that the `phantomjs` executable needs to be in the system `PATH` for
grunt to see it.

* [How to set the path and environment variables in Windows][winpath]
* [Where does $PATH get set in OS X 10.6 Snow Leopard?][osxpath]
* [How do I change the PATH variable in Linux][linpath]

[grunt]: http://gruntjs.com/
[phantom]: http://www.phantomjs.org/
[node]: http://nodejs.org/
[npm]: http://npmjs.org/
[couchdb]: http://couchdb.apache.org/
[min]: https://raw.github.com/cloudant-labs/backbone.cloudant/master/dist/backbone.cloudant.min.js
[max]: https://raw.github.com/cloudant-labs/backbone.cloudant/master/dist/backbone.cloudant.js
[nodecouchapp]: https://github.com/mikeal/node.couchapp.js
[grunt-contrib-clean]: https://github.com/gruntjs/grunt-contrib-clean
[grunt-couchapp]: https://github.com/elfsternberg/grunt-couchapp
[grunt-contrib-copy]: https://github.com/gruntjs/grunt-contrib-copy/
[grunt-docco]: https://github.com/DavidSouther/grunt-docco
[phantomosx]: http://ariya.ofilabs.com/2012/02/phantomjs-and-mac-os-x.html
[phantominstall]: http://code.google.com/p/phantomjs/wiki/Installation
[winpath]: http://www.computerhope.com/issues/ch000549.htm
[osxpath]: http://superuser.com/questions/69130/where-does-path-get-set-in-os-x-10-6-snow-leopard
[linpath]: https://www.google.com/search?q=How+do+I+change+the+PATH+variable+in+Linux
[testpage]: https://drsm79.cloudant.com/backbone-cloudant-demo/_design/app/index.html
[docslink]: https://drsm79.cloudant.com/backbone-cloudant-demo/_design/app/docs/backbone.cloudant.html
[docco]: https://jashkenas.github.com/docco/
[backbone]: http://backbonejs.org
[underscore]: http://underscorejs.org/