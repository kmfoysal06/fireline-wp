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
        add_action('template_redirect', array($this, 'handle_fireline_request'));
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
    
    /**
     * Handle FireLine AJAX requests and return JSON response
     */
    public function handle_fireline_request() {
        // Check if this is a FireLine AJAX request
        if (!isset($_SERVER['HTTP_X_FIRELINE_AGENT']) || is_admin()) {
            return;
        }
        
        // Start output buffering to capture the page HTML
        ob_start();
        
        // Hook into wp_footer to capture and return JSON
        add_action('wp_footer', array($this, 'return_json_response'), 999999);
    }
    
    /**
     * Capture page content and return as JSON
     */
    public function return_json_response() {
        // Get the buffered content
        $html = ob_get_clean();
        
        // Extract the title from the HTML
        $title = '';
        if (preg_match('/<title>(.*?)<\/title>/is', $html, $title_match)) {
            $title = html_entity_decode($title_match[1], ENT_QUOTES, 'UTF-8');
        }
        
        // Try to extract just the content area we need
        // This is based on the selectors in the JavaScript
        $content_html = $this->extract_content_element($html);
        
        // If we couldn't extract a specific content area, use the full body
        if (empty($content_html)) {
            if (preg_match('/<body[^>]*>(.*?)<\/body>/is', $html, $body_match)) {
                $content_html = $body_match[1];
            } else {
                $content_html = $html;
            }
        }
        
        // Create the JSON response
        $response = array(
            'html' => $content_html,
            'title' => $title
        );
        
        // Clear all output buffers
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        
        // Send JSON headers
        status_header(200);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Fireline-Response: true');
        
        // Output JSON and exit
        $json = json_encode($response);
        if ($json === false) {
            // Handle JSON encoding error - use content_html instead of full html
            $error_message = 'JSON encoding failed: ' . json_last_error_msg();
            $json = json_encode(array(
                'html' => $content_html,
                'title' => $title,
                'error' => $error_message
            ));
        }
        
        echo $json;
        exit;
    }
    
    /**
     * Extract the content element from HTML based on common WordPress selectors
     */
    private function extract_content_element($html) {
        // List of common WordPress content selectors (same as in JavaScript)
        $selectors = array(
            array('id' => 'content', 'child' => 'article'),
            array('id' => 'content', 'child' => 'div'),
            array('id' => 'content'),
            array('id' => 'main', 'child' => 'article'),
            array('id' => 'main', 'child' => 'div'),
            array('id' => 'main'),
            array('id' => 'primary', 'child' => 'article'),
            array('id' => 'primary', 'child' => 'div'),
            array('id' => 'primary'),
            array('class' => 'site-content', 'child' => 'article'),
            array('class' => 'site-content', 'child' => 'div'),
            array('class' => 'site-content'),
            array('class' => 'content-area', 'child' => 'article'),
            array('class' => 'content-area', 'child' => 'div'),
            array('class' => 'content-area')
        );
        
        // Create a DOMDocument to parse HTML
        $dom = new DOMDocument();
        
        // Suppress errors from malformed HTML
        $previous_error_handling = libxml_use_internal_errors(true);
        
        // Load HTML with proper flags to handle HTML5
        $dom->loadHTML($html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        
        // Clear errors
        libxml_clear_errors();
        
        // Restore previous error handling
        libxml_use_internal_errors($previous_error_handling);
        
        $xpath = new DOMXPath($dom);
        
        // Try each selector
        foreach ($selectors as $selector) {
            $query = '';
            
            if (isset($selector['id'])) {
                $query = "//*[@id='" . $selector['id'] . "']";
            } elseif (isset($selector['class'])) {
                $query = "//*[contains(concat(' ', normalize-space(@class), ' '), ' " . $selector['class'] . " ')]";
            }
            
            if (empty($query)) {
                continue;
            }
            
            $nodes = $xpath->query($query);
            
            // Check if query failed
            if ($nodes === false || $nodes->length === 0) {
                continue;
            }
            
            $parent_node = $nodes->item(0);
            
            // If looking for a child element
            if (isset($selector['child'])) {
                $child_tag = $selector['child'];
                // Use XPath to find the first direct child element of the specified tag
                $child_nodes = $xpath->query('./*[name()="' . $child_tag . '"]', $parent_node);
                if ($child_nodes !== false && $child_nodes->length > 0) {
                    return $dom->saveHTML($child_nodes->item(0));
                }
            } else {
                return $dom->saveHTML($parent_node);
            }
        }
        
        return '';
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
