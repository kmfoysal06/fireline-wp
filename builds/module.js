/**
 * Builds the FireLine plugin for use in a Node.js environment.
 *
 * This script is the entry point for the module build of FireLine. It imports
 * the plugin from the source file and re-exports it as the default export.
 *
 * @module builds/module
 */
import FireLine from '../src/index.js'

/**
 * The FireLine plugin as the default export.
 *
 * @type {import('../src/index.js').default}
 */
export default FireLine