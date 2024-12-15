import { replaceHtml } from "./dom";

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
    // Get the router target element and throw an error if it's not found
    const targetEl = document.querySelector(window.FireLine.settings.targetEl);
    
    // Throw an error if the target element is not found
    if (!targetEl)
        throw new Error('Router target element not found.');

    // Replace the targetEl with the provided HTML
    replaceHtml(targetEl, html);
}