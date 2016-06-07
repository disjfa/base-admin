module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            options: {},
            build: {
                expand: true,
                flatten: true,
                filter: 'isFile',
                src: 'node_modules/font-awesome/fonts/*',
                dest: 'fonts'
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                esversion: 6
            },
            all: [
                'Gruntfile.js',
                'scripts/**/*.js'
            ]
        },
        browserify: {
            dist: {
                options: {
                    transform: [
                        [
                            'babelify',
                            {
                                presets: ['es2015']
                            }
                        ]
                    ],
                    browserifyOptions: {
                        debug: true
                    },
                    exclude: ''
                },
                files: {
                    'js/index.js': ['scripts/index.js']
                }
            }
        },
        uglify: {
            options: {
                report: 'min',
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    'js/index.min.js': ['js/index.js']
                }
            }
        },
        sasslint: {
            options: {
                configFile: '.sass-lint.yml'
            },
            target: [
                'sass/**/*.scss'
            ]
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    loadPath: 'node_modules'
                },
                files: {
                    'css/index.css': 'sass/index.scss'
                }
            }
        },
        cssmin: {
            options: {
                report: 'min',
                root: 'web',
                target: 'web',
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    'css/index.min.css': 'css/index.css'
                }
            }
        },
        clean: [
            'css/*',
            'fonts/*',
            'js/*'
        ],
        watch: {
            sass: {
                files: '**/*.scss',
                tasks: ['sasslint', 'sass'],
                options: {
                    debounceDelay: 250
                }
            },
            scripts: {
                files: 'scripts/**/*.js',
                tasks: ['jshint', 'browserify'],
                options: {
                    debounceDelay: 250
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-sass-lint');

    grunt.registerTask('default', ['clean', 'copy', 'jshint', 'browserify', 'sasslint', 'sass']);
    grunt.registerTask('watcher', ['default', 'watch']);
    grunt.registerTask('prod', ['clean', 'copy', 'jshint', 'browserify', 'uglify', 'sasslint', 'sass', 'cssmin']);
};