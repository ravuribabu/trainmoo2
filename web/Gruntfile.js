module.exports = function(grunt){


  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-sync');

  var externalModules = [
      'lodash',
      'angular',  
      'select2',
      'SweetAlert', 
      'angular-animate', 
      'angularjs-datepicker', 
      'react-dom', 
      'react',
      'ngalertify',
      'SweetAlert',
      'angular-animate',
      'angularjs-datepicker',
      'jquery', 
      'flow', 
      'angular-bootstrap', 
      'draft-js' ,
      'react-big-calendar'
  ];

    // Default task.

  grunt.registerTask('myTask', function(){
    console.log('mytask');
  });

  grunt.registerTask('default', ['build']);
  //grunt.registerTask('build', ['clean', 'mkdir', 'copy:jstobin', 'html2js:app','concat:allappjs', 'browserify', 'copy:assets', 'copy:html', 'copy:vendorcss']);
  grunt.registerTask('build', ['clean', 'mkdir' , 'sync:jstobin', 'html2js:app', 'concat:allappjs',  'sync:assets', 'sync:html', 'sync:vendorcss', 'browserify']);
  grunt.registerTask('release', ['clean', 'html2js', 'uglify','jshint','concat:index', 'copy:assets']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  grunt.initConfig({

    distdir: 'dist',

    pkg: grunt.file.readJSON('package.json'),

    src: {
      appjs: ['src/app/**/*.js'],
      commonjs: ['src/common/**/*.js'],
      css: {
        app: ['src/**/*.css'],
        vendor: ['vendor/**/*.css']
      },
      html: ['src/*.html'],
      tpl: {
        app: ['src/app/**/*.tpl.html'],
        common: ['src/common/**/*.tpl.html']
      }
    },

    clean: ['dist/*', 'bin/*'], 

    mkdir: {
      all: {
        options: {
          create: ['bin', 'dist']
        },
      },
    },

    sync: {
      jstobin: {
        files: [{ dest: 'bin/', src : ['app/**/*js', 'common/**/*.js'], expand: true, cwd: 'src/' }]
      },
      vendorcss:{
        files: [{ dest: 'dist/', src : ['node_modules/**/*.css', 'node_modules/**/*.png', 'node_modules/**/*.svg'], expand: true }],
        verbose: true
      },
      assets: {
        files: [{ dest: '<%= distdir %>/assets/', src : '**', expand: true, cwd: 'src/assets/' }],
        verbose: true
      },
      html: {
        files: [{ dest: '<%= distdir %>', src : '*.html', expand: true, cwd: 'src/' }],
        verbose: true
      }
    },

    html2js: {
      app: {
        options: {
          base: 'src/app'
        },
        src: ['<%= src.tpl.app %>'],
        dest: 'bin/templates/app.js',
        module: 'templates.app'
      },
      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%= src.tpl.common %>'],
        dest: 'bin/templates/common.js',
        module: 'templates.common'
      }
    },

    browserify: {
      vendors: {
              src: ['.'],
              dest: '<%= distdir %>/app/vendor.js',
              options: {
                debug: true,
                alias: externalModules.map(function(module) {
                  return module + ':';
                }),
                external: null,
                watch: true
              }
          },

      js: {
            options: {
               transform: [['babelify', {presets: ['es2015', 'react', 'stage-2']}]],
               external: [
                                      'lodash',
                                      'angular',  
                                      'select2',
                                      'SweetAlert', 
                                      'angular-animate', 
                                      'angularjs-datepicker', 
                                      'react-dom', 
                                      'react',
                                      'ngalertify',
                                      'SweetAlert',
                                      'angular-animate',
                                      'angularjs-datepicker',
                                      'jquery', 
                                      'flow', 
                                      'angular-bootstrap', 
                                      'draft-js' ,
                                      'react-big-calendar'
                                  ],
               watch: true,
               keepAlive: true
            },
            src: ['bin/app/app.js'],
            dest: '<%= distdir %>/app/app.js'
          }
    },

    concat:{
        allappjs:{
          src:['bin/app/app.js', 'bin/templates/**/*.js'],
          dest:'bin/app/app.js'
        }
    },

    uglify: {
        js:{
          src:['<%= distdir %>/app/app.js'],
          dest:'<%= distdir %>/app/app.min.js'
        },
    },

    watch:{
      assets: {
        files:['src/assets/**/*'],
        tasks:['sync:assets', 'timestamp']
      },
      html: {
        files:['src/*.html', ],
        tasks:['sync:html', 'timestamp']
      },
      tpl: {
        files:['<%= src.tpl.app %>', 'src/app.js'],
        tasks:['html2js:app', 'concat:allappjs', 'timestamp']
      },
      js: {
        files:['<%= src.appjs %>'],
        tasks:['sync:jstobin', 'timestamp']
      }
      // build: {
      //   files:['<%= src.appjs %>', '<%= src.commonjs %>', '<%= src.css.app %>', '<%= src.css.vendor %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>', 'Gruntfile.js'],
      //   tasks:['sync', 'timestamp']
      // }
    },

    jshint:{
      files:['gruntFile.js', '<%= src.js %>'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    },
  });
};
