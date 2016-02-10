module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			options: {
				mangle: false,
				compress: {},
//				beautify: true
			},
			build: {
				files: {			         
			        'js/unedd3.min.js':['js/main.js', 'js/animations.js','js/drags.js', 'js/cursosAreas.js', 'js/nodetags.js', 'js/utils.js']			        
			     }
			}
		}  
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.registerTask('default', ['uglify']);

};
