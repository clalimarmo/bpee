/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: false,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        expr: true,
        trailing: true,
        ignores: [
          'app/init/mixpanel.js'
        ],
      },
      gruntfile: {
        src: 'Gruntfile.js',
        options: {
          globals: {
            require: false,
          },
        },
      },
      app: {
        src: ['app/**/*.js'],
        options: {
          globals: {
            requirejs: false,
            define: false,
            window: false,
          },
        },
      },
      spec: {
        src: ['spec/**/*.js'],
        options: {
          globals: {
            requirejs: false,
            describe: false,
            it: false,
            xit: false,
            context: false,
            before: false,
            beforeEach: false,
            after: false,
            afterEach: false,
            define: false,
            expect: false,
          },
        },
      },
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        coverageReporter: {
          type: 'text-summary'
        }
      },
      coverage: {
        coverageReporter: {
          type: 'html'
        }
      },
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      dev: {
        files: ['app/**/*.js', 'spec/**/*.js', 'spec/**/*.coffee', 'app/**/*.html'],
        tasks: ['build', 'karma:unit', 'jshint']
      },
      jst: {
        files: ['app/templates/**/*.html'],
        tasks: ['jst']
      },
      copy: {
        files: [
          'app/**/*.html',
          'app/lib',
          'app/locales/**/*.json',
        ],
        tasks: ['copy:dev'],
      },
      sass: {
        files: ['app/styles/**/*.scss'],
        tasks: ['sass'],
      },
      bower: {
        files: ['bower.json'],
        tasks: ['build:full', 'karma:unit', 'jshint'],
      },
    },

    copy: {
      dev: {
        files: [
          {expand: true, cwd: 'app', src: ['**/*.html'], dest: 'build'},
          {expand: true, cwd: 'app', src: ['**/*.png'], dest: 'build'},
          {expand: true, cwd: 'app', src: ['**/*.js'], dest: 'build'},
          {expand: true, cwd: 'app', src: ['**/*.json'], dest: 'build'},
        ],
      },
      dist: {
        files: [
          {expand: true, cwd: 'build', src: ['**/require.js'], dest: 'dist'},
          {expand: true, cwd: 'build', src: ['index.html'], dest: 'dist'},
          {expand: true, cwd: 'app', src: ['images/**/*.png'], dest: 'dist'},

          //make sass files available in dev build (instead of the compiled
          //sass output) so that the dist build can be compiled from the dev
          //build, with third party assets available in the same directory if
          //necessary
          {expand: true, cwd: 'app', src: ['**/*.scss'], dest: 'build'},
        ],
      },
      testdist: {
        files: [
          //copy of a prod build to a test directory
          {expand: true, cwd: 'dist', src: ['**/*'], dest: '.tmp/testdist'},

          //manually copy necessary third party js
          {src: 'build/lib/requirejs/require.js', dest: '.tmp/testdist/lib/requirejs/require.js'},

          //manually copy third party style stuff, so "sample" index.html works
          //in production build; actual integration of optimized js in
          //production environment should not need any files from
          //dist/lib
          {expand: true, cwd: 'build', src: ['lib/**/*.css'], dest: '.tmp/testdist'},
          {expand: true, cwd: 'build', src: ['lib/**/*.woff'], dest: '.tmp/testdist'},
          {expand: true, cwd: 'build', src: ['lib/**/*.ttf'], dest: '.tmp/testdist'},
        ],
      },
      thirdpartycsshack: {
        files: [
          //hack, to allow third party css to be included into optimized stylesheet
          {expand: true, cwd: 'build', src: ['**/*.css'], dest: 'build', ext: '.scss'},
        ],
      }
    },

    requirejs: {
      compile: {
        options: {
          name: 'main',
          mainConfigFile: 'build/main.js',
          out: 'dist/main.js',
          optimize: 'uglify2',
        },
      },
    },

    sass: {
      options: {
        loadPath: require('node-bourbon').includePaths,
        sourcemap: true,
        bundleExec: true
      },
      dev: {
        files: [
          {expand: true, cwd: 'app/styles', src: ['**/*.scss'], dest: 'build/styles', ext: '.css'}
        ],
      },
      dist: {
        options: {
          style: 'compressed',
        },
        files: [
          // build the distribution against the dev build, which includes third-party stylesheets
          {expand: true, cwd: 'build/styles', src: ['**/*.scss'], dest: 'dist/styles', ext: '.css'}
        ],
      },
    },

    scsslint: {
      files: [
        'app/styles/**/*.scss',
      ],
      options: {
        config: '.scss-lint.yml',
        reporterOutput: null,
      },
    },

    jst: {
      compile: {
        options: {
          amd: true
        },
        files: {
          'build/templates.js': ['app/templates/**/*.html']
        }
      }
    },

    bower: {
      install: {}
    },

    connect: {
      options: {
        protocol: 'http',
        middleware: function (connect, options) {
          return [
            // Serve static files.
            connect.static(options.base),
            // Make empty directories browsable.
            connect.directory(options.base)
          ];
        }
      },
      dev: {
        options: {
          base: 'build',
          port: 3333,
        },
      },
      testdist: {
        options: {
          base: '.tmp/testdist',
          port: 3334,
          keepalive: 'true',
        },
      },
      keepalive: {
        options: {
          base: 'build',
          keepalive: 'true',
        }
      }
    },

    open: {
      dev: {
        path: '<%= connect.options.protocol %>://localhost:<%= connect.dev.options.port %>'
      },
      testdist: {
        path: '<%= connect.options.protocol %>://localhost:<%= connect.testdist.options.port %>'
      },
    },

    clean: ['.tmp', 'build', 'dist', 'coverage'],
  });

  // These plugins provide necessary tasks.
  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  // Build tasks.
  grunt.registerTask('build', ['jst', 'sass:dev', 'copy:dev']);
  grunt.registerTask('build:full', ['clean', 'build', 'bower:install']);
  grunt.registerTask('build:dist', ['clean', 'jst', 'copy:dev', 'bower:install', 'requirejs', 'copy:dist', 'sass:dist']);

  // Default task.
  grunt.registerTask('default', ['build:full', 'karma:unit', 'jshint', 'scsslint']);

  grunt.registerTask('coverage', 'Detailed test coverage information', ['build:full', 'karma:coverage']);

  // Creates the `server` tasks - serves app and automatically rebuilds it whenever the sources change
  grunt.registerTask('server', ['build', 'configureProxies', 'connect:dev', 'open:dev', 'watch']);

  grunt.registerTask('testdist', ['build:dist', 'copy:testdist', 'configureProxies', 'open:testdist', 'connect:testdist']);

};
