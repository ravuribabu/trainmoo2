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
 grunt.loadNpmTasks('grunt-watchify');

  // Default task.

  grunt.registerTask('myTask', function(){
    console.log('mytask');
  });

  grunt.registerTask('default', ['build']);
  //grunt.registerTask('build', ['clean', 'mkdir', 'copy:jstobin', 'html2js:app','concat:allappjs', 'browserify', 'copy:assets', 'copy:html', 'copy:vendorcss']);
  grunt.registerTask('build', ['clean', 'mkdir', 'copy:jstobin', 'html2js:app', 'concat:allappjs', 'browserify', 'copy:assets', 'copy:html', 'copy:vendorcss']);
  grunt.registerTask('release', ['clean', 'html2js', 'uglify','jshint','concat:index', 'copy:assets']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  grunt.initConfig({

    distdir: 'dist',

    pkg: grunt.file.readJSON('package.json'),

    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',

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

    clean: ['dist/*', 'bin/*', 'vendor/*'], //why expression is not working?????

    mkdir: {
      all: {
        options: {
          create: ['bin', 'dist', 'vendor']
        },
      },
    },

    copy: {
      vendorcss:{
        files: [{ dest: 'dist/', src : ['node_modules/**/*.css', 'node_modules/**/*.png', 'node_modules/**/*.svg'], expand: true }]
      },

      jstobin: {
        files: [{ dest: 'bin/', src : ['app/**/*js', 'common/**/*.js'], expand: true, cwd: 'src/' }]
      },
      assets: {
        files: [{ dest: '<%= distdir %>/assets/', src : '**', expand: true, cwd: 'src/assets/' }]
      },
      vendor: {
        files: [{ dest: '<%= distdir %>/css', src : '**', expand: true, cwd: 'vendor/' }]
      },
      html: {
        files: [{ dest: '<%= distdir %>', src : '*.html', expand: true, cwd: 'src/' }]
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
    watchify: {
      options: {
               transform: [['babelify', {presets: ['es2015', 'react', 'stage-2']}]]
            },
      js: {
            
            src: ['./bin/app/app.js'],
            dest: '<%= distdir %>/app/app.js'
          }
    },
    browserify: {
      js: {
            options: {
               transform: [['babelify', {presets: ['es2015', 'react', 'stage-2']}]]
            },
            src: ['bin/app/app.js'],
            dest: '<%= distdir %>/app/app.js'
          }
    },

    concat:{
        allappjs:{
          src:['bin/app/app.js', 'bin/templates/**/*.js'],
          dest:'bin/app/app.js'
        },
        index: {
          src: ['src/index.html'],
          dest: '<%= distdir %>/index.html',
          options: {
            process: true
          }
        },
    },

    uglify: {
        js:{
          src:['dist/app.js'],
          dest:'dist/app.min.js'
        },
    },

    watch:{

      build: {
        files:['<%= src.appjs %>', '<%= src.commonjs %>', '<%= src.css.app %>', '<%= src.css.vendor %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>', 'Gruntfile.js'],
        tasks:['build','timestamp']
      }
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
