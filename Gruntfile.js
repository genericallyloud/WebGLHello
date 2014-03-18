module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                src: ['src/**/*.ts'],
                dest: 'build/webgl-hello.js',
                options: {
                    module: 'amd' //or commonjs
                }
            }
        },
        watch: {
          files: ['src/**/*.ts'],
          tasks: ['typescript']
        },
        devserver: {options:{port:8888}, server: {}}
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-devserver');
    grunt.loadNpmTasks('grunt-typescript');

    grunt.registerTask('default', ['typescript']);

};