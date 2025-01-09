import { navigateTo, formSubmission } from "./page";
import { safeReplaceHtml } from "./helpers";

/**
 * FireLine is a plugin for Alpine.js that provides a global reactive object
 * and enables server-side rendering of Alpine.js components.
 * 
 * The plugin exports a single function that takes the Alpine.js constructor
 * as an argument and returns nothing. The function is called immediately
 * when the plugin is imported, and it sets up the reactive object and
 * enables server-side rendering.
 * 
 * @param {function} Alpine - The Alpine.js constructor.
 * @returns {void}
 */
export default (Alpine) => {
    /**
     * FireLine is a proxy object that handles reactive properties and custom events.
     * 
     * The proxy allows interception of property access and modification,
     * enabling custom logic to be executed when properties are accessed or changed.
     * The context object provides methods for navigation and fetching the current path.
     */
    const FireLine = Alpine.reactive({
        version: '1.0.0', // The version of the plugin
        name: 'fireline', // The name of the plugin
        events: {
            start: new Event('fireStart'), // Event triggered at the start of loading
            end: new Event('fireEnd'), // Event triggered at the end of loading
            error: new Event('fireError'), // Event triggered on load error
            navigate: new Event('fireNavigate'), // Event triggered on navigation
        },
        settings: {
            /**
             * The selector for the element to replace with the loaded content.
             * @type {string}
             */
            targetEl: '#app > div',

            /**
             * The timeout in seconds for the loading state.
             * @type {number} - The timeout in seconds
             */
            timeout: 30,

            /** 
             * Indicates if the router should intercept links and handle navigation.
             * @type {boolean}
             */
            interceptLinks: true,

            /** 
             * Indicate if the form should be intercepted and handled.
             * @type {boolean}
             */
            interceptForms: true,
        },
        context: {
            /**
             * Returns the current path.
             * @returns {string} The current path.
             */
            current: window.location.href,

            /** 
             * Indicates if the router is currently loading.
             * @type {boolean} - The loading state
             */
            loading: false,

            /** 
             * Indicates if the router is currently redirected.
             * @type {URL} - The redirected url
             */
            redirectedUrl: undefined,

            /**
             * Navigates to the specified URL.
             * @param {string} url - The URL to navigate to.
             */
            navigate: (url) => navigateTo(url),

            /**
             * Reloads the current path.
             */
            reload: () => navigateTo(window.location.href),

            /**
             * Replace the router content.
             * @param {string} html - The HTML content to update the element with.
             * @returns {void}
             */
            replaceHtml: (html) => safeReplaceHtml(html),

            /**
             * Server side form submission.
             * @param {HTMLFormElement} formEl - The form element to be submitted. 
             * @returns {void}
             */
            formSubmit: (formEl) => formSubmission(formEl),
        }
    });

    // Expose the FireLine object as a global variable
    window.FireLine = FireLine;

    // Expose the FireLine object in Alpine
    Alpine.fire = FireLine.context;

    // Expose the FireLine object as a magic property
    Alpine.magic('fire', () => FireLine.context);

    // Handle link clicks
    Alpine.directive('navigate', (el, { expression }, { evaluate, cleanup }) => {
        /**
         * Handles clicks on links and prevents the default event behavior.
         * 
         * Gets the target URL from the element's href attribute, and if no URL
         * is found, does nothing.
         * 
         * Optionally evaluates an expression if passed, and finally performs
         * navigation logic by calling the navigateTo method.
         * @param {MouseEvent} event - The click event.
         * @returns {void}
         */
        const onClick = (event) => {
            event.preventDefault();

            // Get the target URL
            const url = el.getAttribute('href');

            // If no URL is found, do nothing
            if (!url) return;

            // Optionally evaluate expression if passed
            if (expression) {
                evaluate(expression);
            }

            // Perform navigation logic
            navigateTo(url);
        };

        // Attach the click event listener
        el.addEventListener('click', onClick);

        // Cleanup logic: Remove event listener when the element is removed
        cleanup(() => {
            el.removeEventListener('click', onClick);
        });
    });

    // Handle form submissions
    Alpine.directive('submit', (el, { expression }, { evaluate, cleanup }) => {
        /**
         * Handles form submission events by preventing the default behavior,
         * optionally evaluating a provided expression, and then submitting
         * the form using the formSubmission function.
         * 
         * @param {Event} event - The form submission event.
         * @returns {void}
         */
        const onSubmit = (event) => {
            event.preventDefault();

            // Optionally evaluate expression if passed
            if (expression) {
                evaluate(expression);
            }

            // Submit the form
            formSubmission(el);
        };

        // Attach the click event listener
        el.addEventListener('submit', onSubmit);

        // Cleanup logic: Remove event listener when the element is removed
        cleanup(() => {
            el.removeEventListener('submit', onSubmit);
        });
    });

    // Handle back/forward navigation
    window.addEventListener('popstate', () => navigateTo(window.location.href, false));

    // Intercept links click and handle navigation
    window.document.body.addEventListener('click', (event) => {
        // Intercept links only if the setting is enabled
        if (window.FireLine.settings.interceptLinks === false) return;

        // Get the clicked element
        const anchor = event.target.closest('a');

        // Check if the clicked element has the native attribute
        if (anchor && !anchor.hasAttribute('native') && !anchor.hasAttribute('x-navigate') && anchor.target !== '_blank' && anchor.hostname === window.location.hostname) {
            event.preventDefault();

            // Get the target URL
            const url = anchor.getAttribute('href');

            // If no URL is found, do nothing
            if (!url) return;

            // Perform navigation logic
            navigateTo(url);
        }
    });

    // Intercept links click and handle navigation
    window.document.body.addEventListener('submit', (event) => {
        // Intercept forms only if the setting is enabled
        if (window.FireLine.settings.interceptForms === false) return;

        // Get the submitted form
        const formEl = event.target.closest('form');

        // Check if the form has the native attribute
        if (formEl && !formEl.hasAttribute('native') && !formEl.hasAttribute('x-submit') && formEl.action.startsWith(window.location.origin)) {
            event.preventDefault();

            // Submit the form
            formSubmission(formEl);
        }
    });
}