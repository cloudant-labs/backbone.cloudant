# Backbone Cloudant

Helper objects for interacting with data stored in Cloudant

## Getting Started
Download the [production version][min] or the [development version][max].

In your web page:

```html
<script src="jquery.js"></script>
<script src="underscore.js"></script>
<script src="backbone.js"></script>
<script src="dist/backbone.cloudant.min.js"></script>
<script>
jQuery(function($) {
  $.awesome(); // "awesome"
});
</script>
```

## Documentation

### Installation
 * npm install couchapp // not sure that this is required...
 * npm install grunt-couchapp
 * npm install grunt-contrib-clean
 * npm install grunt-contrib-copy
 * Edit `url.json` to point to your database

### Known issues
 * Collections need initialize functions
 * the couchapp grunt tool doesn't work with authenticated URL's, this has
   been reported upstream...
 * Need to implement `fetchMore` for collections
 * Need a decent way of handling auth details
 * Improve collection initialize

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Simon Metson
Licensed under the MIT license.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality. Lint and test your
code using [bbb][bbb].

### Important notes
Please don't edit files in the `dist` subdirectory as they are generated via
grunt. You'll find source code in the `src` subdirectory!

While grunt can run the included unit tests via PhantomJS, this shouldn't be considered a substitute for the real thing. Please be sure to test the `test/*.html` unit test file(s) in _actual_ browsers.

### Installing grunt
_This assumes you have [node.js][node] and [npm][npm] installed already._

1. Test that grunt is installed globally by running `grunt --version` at the command-line.
1. If grunt isn't installed globally, run `npm install -g grunt` to install the latest version. _You may need to run `sudo npm install -g grunt`._
1. From the root directory of this project, run `npm install` to install the project's dependencies.

### Installing PhantomJS

In order for the qunit task to work properly, [PhantomJS][phantom] must be installed and in the system PATH (if you can run "phantomjs" at the command line, this task should work).

Unfortunately, PhantomJS cannot be installed automatically via npm or grunt, so you need to install it yourself. There are a number of ways to install PhantomJS.

* [PhantomJS and Mac OS X](http://ariya.ofilabs.com/2012/02/phantomjs-and-mac-os-x.html)
* [PhantomJS Installation](http://code.google.com/p/phantomjs/wiki/Installation) (PhantomJS wiki)

Note that the `phantomjs` executable needs to be in the system `PATH` for grunt to see it.

* [How to set the path and environment variables in Windows](http://www.computerhope.com/issues/ch000549.htm)
* [Where does $PATH get set in OS X 10.6 Snow Leopard?](http://superuser.com/questions/69130/where-does-path-get-set-in-os-x-10-6-snow-leopard)
* [How do I change the PATH variable in Linux](https://www.google.com/search?q=How+do+I+change+the+PATH+variable+in+Linux)

[phantom]: http://www.phantomjs.org/
[node]: http://nodejs.org/
[npm]: http://npmjs.org/
[min]: https://raw.github.com/cloudant-labs/backbone.cloudant/master/dist/backbone.cloudant.min.js
[max]: https://raw.github.com/cloudant-labs/backbone.cloudant/master/dist/backbone.cloudant.js
