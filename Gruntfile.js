module.exports = function(grunt) {

  grunt.initConfig({

    run_node: {
      start: {
        files: { src: [ 'tests/mock-file-server.js'] }
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
      host: 'http://localhost:8888/',
      options: {
        specs: ['tests/*spec.js'],
        //keepRunner: true,
        vendor: [
          "bower_components/Blob/Blob.js",
          "bower_components/jquery/dist/jquery.min.js",
          "bower_components/underscore/underscore-min.js",
          "bower_components/backbone/backbone.js",
          "backbone-model-file-upload.js"
        ]
      }
    },

    parallel: {
      runTest: {
        tasks: [{
          grunt: true,
          args: ['run:mockServer']
        }, {
          grunt: true,
          args: ['jasmine']
        }, {
          cmd: 'node:kill'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-parallel');
  grunt.loadNpmTasks('grunt-run-node');

  grunt.registerTask('test', ['run:installBower','run_node','jasmine','stop_node']);
  grunt.registerTask('resetNodeWin', ['run:killAllNodeWindows']);
  grunt.registerTask('resetNodeMac', ['run:killAllNodeMac']);

};