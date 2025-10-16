<?php
/**
 * Plugin Name: FireLine SPA
 * Plugin URI: https://github.com/kmfoysal06/fireline-wp
 * Description: Transform your WordPress site into a Single Page Application (SPA) with smooth page transitions and a beautiful progress bar. Powered by FireLine and Alpine.js.
 * Version: 1.0.0
 * Author: FireLine
 * Author URI: https://github.com/kmfoysal06
 * License: MIT
 * License URI: https://opensource.org/licenses/MIT
 * Text Domain: fireline-spa
 * Requires at least: 5.0
 * Requires PHP: 7.2
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('FIRELINE_SPA_VERSION', '1.0.0');
define('FIRELINE_SPA_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('FIRELINE_SPA_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Main FireLine SPA Plugin Class
 */
class FireLine_SPA_Plugin {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_head', array($this, 'add_spa_meta'));
        add_filter('script_loader_tag', array($this, 'add_defer_attribute'), 10, 2);
    }
    
    /**
     * Enqueue scripts and styles
     */
    public function enqueue_scripts() {
        // Don't load on admin pages
        if (is_admin()) {
            return;
        }
        
        // Enqueue NProgress CSS
        wp_enqueue_style(
            'nprogress',
            FIRELINE_SPA_PLUGIN_URL . 'assets/nprogress.css',
            array(),
            FIRELINE_SPA_VERSION
        );
        
        // Enqueue Alpine.js from CDN
        wp_enqueue_script(
            'alpinejs',
            'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js',
            array(),
            '3.x.x',
            false // Load in header with defer
        );
        
        // Enqueue FireLine SPA bundle (includes FireLine + NProgress + initialization)
        wp_enqueue_script(
            'fireline-spa',
            FIRELINE_SPA_PLUGIN_URL . 'assets/fireline-spa.min.js',
            array(),
            FIRELINE_SPA_VERSION,
            false // Load in header before Alpine.js
        );
    }
    
    /**
     * Add defer attribute to Alpine.js script
     */
    public function add_defer_attribute($tag, $handle) {
        if ('alpinejs' === $handle) {
            return str_replace(' src', ' defer src', $tag);
        }
        return $tag;
    }
    
    /**
     * Add meta tags for SPA functionality
     */
    public function add_spa_meta() {
        if (is_admin()) {
            return;
        }
        
        echo '<!-- FireLine SPA Plugin v' . FIRELINE_SPA_VERSION . ' -->' . "\n";
        echo '<meta name="fireline-spa-enabled" content="true">' . "\n";
    }
}

/**
 * Initialize the plugin
 */
function fireline_spa_init() {
    new FireLine_SPA_Plugin();
}
add_action('plugins_loaded', 'fireline_spa_init');

/**
 * Activation hook
 */
function fireline_spa_activate() {
    // Set default options
    update_option('fireline_spa_version', FIRELINE_SPA_VERSION);
    update_option('fireline_spa_activated', time());
    
    // Flush rewrite rules
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'fireline_spa_activate');

/**
 * Deactivation hook
 */
function fireline_spa_deactivate() {
    // Flush rewrite rules
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'fireline_spa_deactivate');
