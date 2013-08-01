/*global module:false*/

module.exports = function(grunt) {
  var DEMO_COUCH_DB = grunt.file.readJSON('url.json').url;

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      options: {
        separator: "\n"
      },
      dist: {
        src: [
          "src/Cloudant.js",
          "src/Docs.js",
          "src/Index.js",
          "src/Search.js"
        ],
        dest: "dist/<%= pkg.name %>.js"
      }
    },
    clean: ["dist/",
            "test/attachments/backbone.cloudant.js",
            "test/attachments/backbone.cloudant.min.js",
            "docs/*.html"],
    uglify: {
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
        files: [
          {
            expand: true,
            flatten: true,
            src: ["dist/backbone.cloudant.js"],
            dest: "test/attachments/"
          }
        ]
      },
      docs: {
        files: {
          "test/attachments/": "docs/*"
        }
      }
    },
    docco: {
      app: {
        src: ['dist/backbone.cloudant.js'],
        options: {
          output: 'docs/'
        }
      }
    },
    jshint: {
      files: ['src/*.js'],
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
        devel: true,
        globals: {
          jQuery: true,
          Backbone: true,
          _: true,
          $: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-couchapp');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('test', ['qunit', 'jshint', 'concat', 'uglify']);
  grunt.registerTask('build', ['clean', 'jshint', 'concat', 'uglify']);
  grunt.registerTask('wipe', ['rmcouchdb:demo', 'mkcouchdb:demo']);
  grunt.registerTask('deploy', ['docs', 'copy', 'couchapp:demo']);
  grunt.registerTask('deploynodocs', ['build', 'copy:dist', 'couchapp:demo']);
  grunt.registerTask('docs', ['build', 'docco']);
  grunt.registerTask('default', ['docs']);

};
