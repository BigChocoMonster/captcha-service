const { file } = require("grunt");

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    uglify: {
      build: {
        src: ["src/index.js"],
        dest: "build/captcha.s.min.js",
      },
    },
    cssmin: {
      target: {
        files: [
          {
            src: ["src/styles.css"],
            dest: "build/captcha.s.min.css",
          },
        ],
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks("grunt-contrib-uglify-es");
  grunt.loadNpmTasks("grunt-contrib-cssmin");

  // Default task(s).
  grunt.registerTask("default", ["uglify", "cssmin"]);
};
