module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				mangle: false,
				banner: '/* Data viz by Sergio Galán http://sergio.eclectico.net Alfredo Calosci.  for UNED. Magic By D3js.org */',

				compress: { 
					drop_console: true,
					global_defs: {
			    	      "DEBUG": false
			        },
			    	dead_code: true
			    }

//				beautify: true
			},
			build: {
				files: {			         
			        'build/unedd3.min.js':['js/main.js', 'js/animations.js','js/drags.js', 'js/cursosAreas.js', 'js/nodetags.js', 'js/utils.js']			        
			     }
			}
		},  
		cssmin: {		  
		  target: {
		    files: {
		      'build/unedd3.min.css': ['css/main_color.css', 'css/page_style.css']
		    }
		  }
		},
		processhtml: {
		    options: {		      
		    },
		    dist: {
		      files: {
		        'build/index.html': ['index.html']
		      }
		    }
		  },
		  copy: {
			  main: {
			    files: [
			      // includes files within path
			      {expand: true, src: ['libraries/*'], dest: 'build', filter: 'isFile'},
			       {expand: true, src: ['img/*'], dest: 'build', filter: 'isFile'},
			       {expand: true, src: ['fonts/*'], dest: 'build', filter: 'isFile'},
			       {expand: true, src: ['css/*.min.css'], dest: 'build', filter: 'isFile'},			      
			      {expand: true, src: ['*.json'], dest: 'build/', filter: 'isFile'}
			    ],
			  },
			},

	});//init config

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-contrib-copy');

	var tasksDefault = [
	    'uglify:build',
	    'cssmin',
	    'processhtml',
	    'copy'
  	];
	grunt.registerTask('default', tasksDefault);

};
