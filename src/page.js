import { ajaxRequest } from "./fetch";
import { safeReplaceHtml } from "./helpers";

/**
 * Navigates to the specified URL by fetching the content as JSON and
 * updating the router target element with the HTML content.
 * 
 * If the response does not contain HTML, an error is thrown.
 * 
 * When the content is updated, the browser's history state and the
 * `current` route are updated, and the `loadEnd` event is fired.
 * Finally, the loading state is set to false.
 * 
 * @param {string} url - The URL to navigate to.
 * @param {boolean} pushState - Whether to update the browser's history state.
 * @returns {void}
 */
export function navigateTo(url, pushState = true) {
    // Fetch the page content as JSON
    ajaxRequest(url)
        .then(response => {
            // If the response is invalid then do nothing
            if (!response) return;

            // Extract HTML and title from the response
            const { html, title } = response;

            // Update the document title if a new title is provided
            if (title) document.title = title;

            // Update the content of the router target element
            safeReplaceHtml(html);

            // When the content is updated, wait for the next tick
            Alpine.nextTick(() => {
                // Update the browser's history state and fire the 'current' route
                if (pushState && window.FireLine.redirectedUrl === undefined)
                    window.history.pushState({}, '', url);

                // Update the current route
                window.FireLine.context.current = window.location.href;

                // Fire the 'loadEnd' event
                document.dispatchEvent(window.FireLine.events.end);

                // Set the loading state to false
                window.FireLine.context.loading = false;
            });
        });
}

/**
 * Handles the submission of a form element and processes the server response.
 * 
 * Sends an AJAX request using the form's action URL and method, along with
 * the form data. Based on the server response, performs various actions:
 * 
 * - If the response status is 'success', the form is reset.
 * - If the response contains a 'redirect' property, the window is redirected
 *   to the specified URL.
 * - If the response contains a 'navigate' property, navigates to the specified
 *   URL.
 * - If the response status is 'error', displays the error message next to the
 *   relevant form fields.
 * - If the response contains HTML content, updates the document title and
 *   router content.
 * 
 * After processing the response, fires the 'loadEnd' event and sets the loading
 * state to false.
 * 
 * @param {HTMLFormElement} formEl - The form element to be submitted.
 * @returns {void}
 */
export function formSubmission(formEl) {
    ajaxRequest(formEl.getAttribute('action'), formEl.getAttribute('method'), new FormData(formEl))
        .then(response => {
            // If the response is invalid then do nothing
            if (!response) return;

            // If the response contains a "status" property set to "success", reset the form
            if (response.status && response.status === 'success')
                formEl.reset();

            // If the response contains a "redirect" property, redirect the window to the specified URL
            if (response.redirect)
                window.location.href = response.redirect;

            // If the response contains a "navigate" property, navigate to the specified url
            else if (response.navigate) {
                // Set the loading state to false
                window.FireLine.context.loading = false;

                // Navigate to the specified url
                navigateTo(response.navigate);
                return;
            }

            // If the response contains a "status" property set to "error", display the error message next to the form fields
            else if (response.status && response.message) {
                // Loop through the form's children
                for (const child of formEl.children) {
                    // If the child has a "status" attribute
                    child.attributes.status && (
                        // If the child's status attribute matches the response's status
                        child.attributes.status.nodeValue === response.status ?
                            // Display the status message
                            (child.textContent = response.message, child.style.display = 'block') :
                            // Hide the status message
                            (child.textContent = '', child.style.display = 'none')
                    );
                }
            }

            // If the response contains a "content" property, update the document with the specified content
            else if (response.html) {
                // Update the document title
                if (response.title) document.title = response.title;

                // Reset the form
                formEl.reset();

                // Update the router content
                safeReplaceHtml(response.html);
            }

            // When the content is updated, wait for the next tick
            Alpine.nextTick(() => {
                // Fire the 'loadEnd' event
                document.dispatchEvent(window.FireLine.events.end);

                // Set the loading state to false
                window.FireLine.context.loading = false;
            });
        });
}