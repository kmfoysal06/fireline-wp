/**
 * Builds the FireLine plugin for use in a browser environment.
 *
 * This script is the entry point for the CDN build of FireLine. It imports the
 * plugin from the source file and registers it with Alpine in the browser.
 *
 * @module builds/cdn
 */

import FireLine from '../src/index.js'

/**
 * Registers the FireLine plugin with Alpine in the browser.
 *
 * This function is called when the browser is ready to receive the plugin.
 */
document.addEventListener('alpine:init', () => window.Alpine.plugin(FireLine));