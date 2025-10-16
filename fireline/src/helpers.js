import { replaceHtml } from "./dom";

// Common WordPress content container selectors for fallback
// NOTE: This list is intentionally duplicated from plugin-src/main.js to keep
// the FireLine core library independent and reusable outside of WordPress.
// The plugin-src/main.js file handles initial detection, while this provides
// runtime fallback for the core library.
const FALLBACK_SELECTORS = [
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
    'body'
];

/**
 * Triggers an error for the router, logging the error to the console,
 * firing the 'error' event, and setting the loading state to false.
 * 
 * @param {Error} error - The error to trigger.
 */
export function triggerError(error) {
    // Log any errors that occur during navigation
    console.error('FireLine failed:', error);

    // Fire the 'error' event
    document.dispatchEvent(window.FireLine.events.error);

    // Set the loading state to false
    window.FireLine.context.loading = false;
}

/**
 * Safely replaces the HTML content of the router's target element.
 * 
 * This function attempts to update the content by calling `replaceRouterHtml`
 * with the provided HTML. If an error occurs during the replacement process, 
 * it triggers an error handling routine to manage the exception.
 * 
 * @param {string} html - The HTML content to replace in the target element.
 */
export function safeReplaceHtml(html) {
    try {
        replaceRouterHtml(html);
    } catch (error) {
        triggerError(error);
    }
}

/**
 * Updates the content of the router's target element with the provided HTML.
 * 
 * This function queries the DOM for the target element specified in the 
 * FireLine settings and replaces its current content with the new content 
 * specified in the HTML parameter. If the target element is not found, an 
 * error is thrown.
 * 
 * Script elements within the new content are processed separately to ensure 
 * they are executed correctly. Each script is appended to the document head 
 * and removed immediately after execution.
 * 
 * @param {string} html - The HTML content to update the target element with.
 * @throws {Error} If the router target element is not found.
 */
export function replaceRouterHtml(html) {
    // Store the original target selector for debugging
    const originalTargetSelector = window.FireLine.settings.targetEl;
    
    // Get the router target element and throw an error if it's not found
    let targetEl = document.querySelector(originalTargetSelector);

    // If target element is not found, try to fallback to common selectors
    if (!targetEl) {
        for (const selector of FALLBACK_SELECTORS) {
            targetEl = document.querySelector(selector);
            if (targetEl) {
                console.warn(
                    `FireLine: Target element '${originalTargetSelector}' not found, ` +
                    `falling back to '${selector}'. Consider updating your FireLine configuration.`
                );
                // Update the setting for future navigations
                window.FireLine.settings.targetEl = selector;
                // Store original selector as a reference for debugging
                if (!window.FireLine.settings._originalTargetEl) {
                    window.FireLine.settings._originalTargetEl = originalTargetSelector;
                }
                break;
            }
        }
    }

    // Throw an error if the target element is still not found
    if (!targetEl) {
        throw new Error(
            `Router target element not found. Tried selector: '${originalTargetSelector}'. ` +
            `Please ensure your theme has a valid content container element.`
        );
    }

    // Replace the targetEl with the provided HTML
    replaceHtml(targetEl, html);
}