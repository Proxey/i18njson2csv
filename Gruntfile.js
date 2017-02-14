module.exports = grunt => {
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015'],
                plugins: [
                    'transform-async-to-generator',
                    ['transform-runtime', {"polyfill": false, "regenerator": true}]
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['**/*.js'],
                        dest: 'dist'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
};