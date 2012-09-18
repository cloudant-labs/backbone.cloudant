/*global module:false*/

module.exports = function(grunt) {
  var DEMO_COUCH_DB = grunt.file.readJSON('url.json')['url'];
  grunt.log.write(DEMO_COUCH_DB);

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:backbone.cloudant.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist: {
        src: [
          "src/Cloudant.js",
          "src/Docs.js",
          "src/Search.js",
          "src/View.js"
        ],
        dest: "dist/<%= pkg.name %>.js",
        separator: "\n"
      }
    },
    clean: ["dist/",
            "test/attachments/backbone.cloudant.js",
            "test/attachments/backbone.cloudant.min.js",
            "docs/"],
    min: {
      dist: {
        src: ['dist/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    lint: {
      files: ['grunt.js', 'src/*.js', 'test/*.js', 'test/attachments/test.js']
    },
    couchapp: {
      demo: {
        db: DEMO_COUCH_DB,
        app: './test/app.js'
      }
    },
    mkcouchdb: {
      demo: {
        db: DEMO_COUCH_DB
      }
    },
    rmcouchdb: {
      demo: {
        db: DEMO_COUCH_DB,
        options: {
          okay_if_missing: true
        }
      }
    },
    copy: {
      dist: {
        files: {
          "test/attachments": "dist/backbone.cloudant.js",
          "test/attachments/docs": "docs/*"
        }
      }
    },
    docco: {
      app: {
        src: ['dist/backbone.cloudant.js']
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        devel: true
      },
      globals: {
        jQuery: true,
        Backbone: true,
        _: true,
        $: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-couchapp');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-docco');

  // Default task.
  grunt.registerTask('test', 'lint qunit concat min');
  grunt.registerTask('build', 'clean lint concat min');
  grunt.registerTask('wipe', 'rmcouchdb:demo mkcouchdb:demo');
  grunt.registerTask('deploy', 'docs copy couchapp:demo');
  grunt.registerTask('docs', 'build docco');
  grunt.registerTask('default', 'docs');

};
