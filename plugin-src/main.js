/**
 * FireLine SPA WordPress Plugin - Main Entry Point
 * 
 * This file bundles Alpine.js, FireLine, and NProgress to create
 * a seamless SPA experience for WordPress sites.
 */

// Import Alpine.js from CDN (we'll load it separately as it's better for WordPress)
// Import FireLine plugin
import FireLine from '../fireline/src/index.js';

// Import NProgress
import NProgress from 'nprogress';

// Default target element selector (from FireLine defaults)
const DEFAULT_TARGET_SELECTOR = '#app > div';

// Common WordPress content container selectors
// Ordered from most specific to least specific
// NOTE: This list is also defined in fireline/src/helpers.js as FALLBACK_SELECTORS
// for runtime fallback. The duplication is intentional to keep the FireLine core
// library independent of WordPress-specific code.
const WORDPRESS_CONTENT_SELECTORS = [
    '#content > article',
    '#content > div',
    '#content',
    '#main > article',
    '#main > div', 
    '#main',
    '#primary > article',
    '#primary > div',
    '#primary',
    '.site-content > article',
    '.site-content > div',
    '.site-content',
    '.content-area > article',
    '.content-area > div',
    '.content-area',
    'body' // Ultimate fallback
];

// Configure NProgress
NProgress.configure({ 
    showSpinner: false,
    trickleSpeed: 200,
    minimum: 0.08
});

/**
 * Auto-detect and set the target element for FireLine
 * This function tries common WordPress content selectors
 */
function detectAndSetTargetElement() {
    // If target element is already set and exists, don't change it
    if (window.FireLine && window.FireLine.settings.targetEl !== DEFAULT_TARGET_SELECTOR) {
        const existing = document.querySelector(window.FireLine.settings.targetEl);
        if (existing) {
            return;
        }
    }
    
    for (const selector of WORDPRESS_CONTENT_SELECTORS) {
        const element = document.querySelector(selector);
        if (element) {
            if (window.FireLine) {
                window.FireLine.settings.targetEl = selector;
                console.log('FireLine SPA: Target element set to', selector);
            }
            return selector;
        }
    }
    
    return null;
}

/**
 * Initialize FireLine SPA for WordPress
 */
(function() {
    // Wait for Alpine to be available
    document.addEventListener('alpine:init', () => {
        // Register FireLine plugin
        if (window.Alpine) {
            window.Alpine.plugin(FireLine);
            
            // Configure FireLine for WordPress
            window.FireLine.settings.interceptLinks = true;
            window.FireLine.settings.interceptForms = false; // Keep WordPress form handling
            window.FireLine.settings.timeout = 30;
            
            // Auto-detect target element
            detectAndSetTargetElement();
        }
    });
    
    // Also try to detect target element when DOM is ready
    // This provides a fallback if alpine:init doesn't fire
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (window.FireLine) {
                detectAndSetTargetElement();
            }
        });
    } else {
        // DOM is already ready, detect now
        setTimeout(() => {
            if (window.FireLine) {
                detectAndSetTargetElement();
            }
        }, 100);
    }
    
    // Hook into FireLine events to show/hide progress bar
    document.addEventListener('fireStart', () => {
        // Only start NProgress if the body element exists
        if (document.body) {
            NProgress.start();
        }
    });
    
    document.addEventListener('fireEnd', () => {
        // Only call done if the body element exists
        if (document.body) {
            NProgress.done();
        }
    });
    
    document.addEventListener('fireError', () => {
        // Only call done if the body element exists
        if (document.body) {
            NProgress.done();
        }
    });
    
    // Prevent navigation to WordPress admin URLs
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (anchor) {
            const href = anchor.getAttribute('href');
            // Skip admin links, edit links, and external links
            if (href && (
                href.includes('/wp-admin/') ||
                href.includes('/wp-login.php') ||
                href.includes('wp-comments-post.php') ||
                anchor.classList.contains('post-edit-link') ||
                anchor.hasAttribute('native')
            )) {
                // Mark as native so FireLine won't intercept
                anchor.setAttribute('native', '');
            }
        }
    });
    
    console.log('FireLine SPA Plugin initialized for WordPress');
})();
