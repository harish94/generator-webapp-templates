module.exports = function(grunt) {
  grunt.initConfig({
    //task config
  });
 
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
 
  concat: {
	    dist: {
	        src: ["app/header.html", "app/menu.html", "app/sections/*.html", "app/footer.html"],
	        dest: "build/index.html"
	    }
	},
	cssmin: {
	    css: {
	        files: {
	            "build/css/main.css": ["app/css/*.css"]
	        }
	    }
	},
	connect: {
    server: {
        options: {
            keepalive: true,
            open: true,
            middleware: function(){
                //custom handlers here
            }
        }
    }
},


  

  grunt.registerTask('serve', ['connect']);
  grunt.registerTask('build', ['concat', 'cssmin']);
  grunt.registerTask('default', ['build']);



};