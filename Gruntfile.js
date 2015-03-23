'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        clean: {
            css: ['css'],
            bower: ['bower_components']
        },

        sass: {
            options: {
                sourceMap: false, //no source maps b/c web-components inline css anyway...

                 /*
                  See https://github.sw.ge.com/pxc/px-getting-started#a-note-about-relative-import-paths for an explanation
                  of the contents of the includePaths option for Sass
                 */
                includePaths: ['bower_components/*']
            },
            dist: {
                files: {
                    'css/px-app-nav-sketch.css': 'sass/px-app-nav-sketch.scss',
                    'css/px-app-nav.css': 'sass/px-app-nav-predix.scss'
                }
            }
        },

        shell: {
            options: {
                stdout: true,
                stderr: true
            },
            bower: {
                command: 'bower install'
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'js/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        watch: {
            sass: {
                files: ['sass/**/*.scss'],
                tasks: ['sass'],
                options: {
                    interrupt: true
                }
            }
        },

        depserve: {
            options: {
                open: '<%= depserveOpenUrl %>'
            }
        },

        'wct-test': {
            local: {
                options: {
                    root: './',
                    verbose: false,
                    plugins: {
                        local: {browsers: ['chrome']}
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-dep-serve');
    grunt.loadNpmTasks('web-component-tester');

    // Default task.
    grunt.registerTask('default', 'Basic build', [
        'sass'
    ]);

    // First run task.
    grunt.registerTask('firstrun', 'Basic first run', function() {
        grunt.config.set('depserveOpenUrl', '/index.html');
        grunt.task.run('default');
        grunt.task.run('depserve');
    });

    // Default task.
    grunt.registerTask('test', 'Test', [
        'jshint',
        'wct-test:local'
    ]);

    grunt.registerTask('release', 'Release', [
        'clean',
        'shell:bower',
        'default',
        'test'
    ]);

};
