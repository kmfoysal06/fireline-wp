/**
 * Builds the FireLine plugin for use in a browser environment and as a Node.js
 * module.
 *
 * The first build is the CDN build, which is the main entry point for the
 * browser. It bundles the plugin source code and places it in the
 * `dist/cdn.min.js` file.
 *
 * The second build is the module build, which is the main entry point for
 * Node.js. It bundles the plugin source code and places it in the
 * `dist/module.esm.js` file, which is a CommonJS module.
 *
 * @module scripts/build
 */
(function () {
    /**
     * Builds the FireLine plugin based on the given build options.
     *
     * @param {Object} buildOptions - The esbuild build options.
     * @returns {Object} The esbuild build result.
     */
    function buildPlugin(buildOptions) {
        return require('esbuild').buildSync({
            ...buildOptions,
            minify: true,
            bundle: true,
        })
    }

    /**
     * Builds the CDN version of the plugin.
     *
     * @returns {void}
     */
    buildPlugin({
        entryPoints: ['builds/cdn.js'],
        outfile: 'dist/cdn.min.js',
    })

    /**
     * Builds the module version of the plugin.
     *
     * @returns {void}
     */
    buildPlugin({
        entryPoints: ['builds/module.js'],
        outfile: 'dist/module.esm.js',
        platform: 'neutral',
        mainFields: ['main', 'module'],
    })
})()

