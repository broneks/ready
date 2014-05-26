module.exports = function(grunt) {

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),

        htmlhint: {
            build: {
                options: {
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'attr-lowercase': true,
                    'attr-value-double-quotes': true,
                    'spec-char-escape': true,
                    'id-unique': true,
                    'head-script-disabled': true,
                    'style-disabled': true
                },
                src: ['templates/**/*.html']
            }
        },

        jshint: {
        	build: {
	        	options: {
                    'devel': true,
      				'eqeqeq': true,
      				'eqnull': true,
      				'browser': true,
      				'quotmark': 'single',
      				'trailing': true,
		        	"globals": {
		        		"angular": true,
		        		"jQuery": true
		        	}
	        	},
	        	files: { src: ['js/*.js'] }
        	}
        },

        sass: {
            build: {
                files: { 'css/main.css' : 'sass/base.sass' }
            },
            options: {
                style: 'expanded', // 'compressed',
                trace: true
            }
        },

        watch: {            
            html: {
            	files: ['templates/**/*.html'],
                tasks: ['htmlhint']
            },

            js: {
            	files: ['js/*.js'],
            	tasks: ['jshint']
            },

            css: {
                files: ['sass/**/*.sass'],
                tasks: ['sass']
            }
        }

    });

    grunt.registerTask('default', []);

};