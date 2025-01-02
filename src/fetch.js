import { triggerError } from "./helpers";

/**
 * Sends an AJAX request to the server and returns the JSON response.
 * If the response is invalid JSON, an error is logged to the console.
 * If the request fails, an error is thrown.
 *
 * @param {string} path - The URL to send the request to.
 * @param {string} [method='get'] - The request method.
 * @param {object} [body=null] - The request body.
 * @returns {Promise<object>} The JSON response.
 */
export async function ajaxRequest(path, method = 'get', body = null) {
    // If the router is already loading, do nothing
    if (window.FireLine.context.loading)
        return;

    // Fire the 'start' event
    document.dispatchEvent(window.FireLine.events.start);

    // Reset the redirected URL
    window.FireLine.redirectedUrl = undefined;

    // Set the loading state to true
    window.FireLine.context.loading = true;

    try {
        // Send ajax request to the server
        const response = await fetch(path, {
            // Set the request method
            method: method,
            // Set the request headers
            headers: { "Accept": "application/json" },
            // Set the request body if provided
            body: body,
            // Abort the request after this.timeout seconds
            signal: AbortSignal.timeout(1000 * window.FireLine.settings.timeout),
        });

        // Throw an error if the fetch failed
        if (!response.ok)
            throw new Error('Failed to complete the FireLine request.');

        // Check for redirection
        if (!response.url.endsWith(path)) {
            const redirectedUrl = new URL(response.url);

            // If the redirected origin matches the current origin
            if (window.location.origin === redirectedUrl.origin) {
                // Update the browser history with the redirected URL
                window.history.pushState({}, '', redirectedUrl);

                // Set the redirected URL
                window.FireLine.redirectedUrl = redirectedUrl;
            }
        }

        // Return the JSON response
        // If the response is invalid JSON, catch the error and log it to the console
        return await response.json()
            .catch(error => triggerError(error));
    } catch (error) {
        triggerError(error);
    }
}