module.exports = function(grunt) {

  grunt.initConfig({

    run_node: {
      start: {
        files: { src: [ 'test/mock-file-server.js'] }
      }
    },

    stop_node: { stop: {} },

    run: {
      installBower: {
        cmd: 'node',
        args: [
          './node_modules/bower/bin/bower',
          'install'
        ]
      },
      killAllNodeWindows: {
        cmd: 'taskkill',
        args: [
          '/f',
          '/im',
          'node.exe'
        ]
      },
      killAllNodeMac: {
        cmd: 'killall',
        args: [
          'node'
        ]
      }
    },

    jasmine: {
      amd: {
        src: 'backbone-model-file-upload.js',
        host: 'http://localhost:8888/',
        options: {
          specs: ['test/*spec.js'],
          helpers: 'bower_components/Blob/Blob.js',
          //keepRunner: true,
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfig: {
              paths: {
                "jquery": "bower_components/jquery/dist/jquery.min",
                "underscore": "bower_components/underscore/underscore-min",
                "backbone": "bower_components/backbone/backbone"
              }
            }
          },

        }
      },
      browserGlobal: {
        src: 'backbone-model-file-upload.js',
        host: 'http://localhost:8888/',
        options: {
          specs: ['test/*spec.js'],
          //keepRunner: true,
          vendor: [
            "bower_components/Blob/Blob.js",
            "bower_components/jquery/dist/jquery.min.js",
            "bower_components/underscore/underscore-min.js",
            "bower_components/backbone/backbone.js"
          ]
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-run-node');

  grunt.registerTask('test', ['build','run_node','jasmine','stop_node']);
  grunt.registerTask('build', ['run:installBower']);
  grunt.registerTask('resetNodeWin', ['run:killAllNodeWindows']);
  grunt.registerTask('resetNodeMac', ['run:killAllNodeMac']);

};