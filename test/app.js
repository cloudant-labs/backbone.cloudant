/*global module:true, require:true, __dirname:true */

var couchapp, ddoc, path;

couchapp = require('couchapp');

path = require('path');

ddoc = {
  _id: '_design/app',
  rewrites: {},
  views: {"test": {"map":"function(doc){emit (doc.a, 1)}", "reduce": "_sum"}},
  shows: {},
  lists: {},
  indexes: {
    "mysearch" : {
      "index": "function(doc){index('a', doc.a)}"
    }
  }
};

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;