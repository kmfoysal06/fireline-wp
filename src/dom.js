/**
 * Replaces the content of the router's target element with the provided HTML.
 * 
 * This function takes the HTML response from the server and creates a new
 * template element from it. It then gets the first element from the created
 * template element and injects any script elements found into the document
 * head using the `injectScripts` function. After the scripts are injected, it
 * replaces the current content of the router's target element with the new
 * content using the `diffAndPatch` function.
 * 
 * @param {Element} targetEl - The element to replace with the new content.
 * @param {string} html - The HTML content to replace the old content with.
 */
export function replaceHtml(targetEl, html) {
    // Create a template element from the response html
    const template = document.createElement('template');
    template.innerHTML = html.trim();

    // Get the first element from the created template
    const newContent = template.content.firstElementChild;

    // Initializes any Script elements in the template
    const scripts = newContent.querySelectorAll('script');

    // Inject the scripts into the DOM
    injectScripts(scripts);

    // Replace the current router content with the new content
    diffAndPatch(targetEl.parentElement, targetEl, newContent);
}

/**
 * Injects script elements from the provided list into the document head.
 * 
 * This function is used to process scripts found in the HTML response from the server.
 * It loops through the provided list of scripts, creates a new script element for
 * each one, and adds it to the document head. If the script element doesn't have a
 * source, it sets the content of the script element to the text content of the
 * original script element. After the script element is added to the document head,
 * it is then removed to avoid memory leaks.
 * 
 * @param {HTMLScriptElement[]} scripts - The list of script elements to inject.
 */
export function injectScripts(scripts) {
    // Process scripts separately
    scripts.forEach(scriptElement => {
        const script = document.createElement('script');
        // Set the type of the script element
        script.type = scriptElement.type || 'text/javascript';

        // Set the source of the script element if it has one
        if (scriptElement.src) {
            script.src = scriptElement.src;
        } else {
            // Set the content of the script element if it doesn't have a source
            script.textContent = scriptElement.textContent;
        }

        // Add the script element to the document head and remove it after it's executed
        document.head.appendChild(script);
        document.head.removeChild(script);
    });
}

/**
 * Diffs two DOM nodes and patches the first node to match the second
 * node. The function will replace the first node if the node type
 * changes, update text content for text nodes, update attributes for
 * element nodes, and recursively diff children.
 *
 * @param {Node} parent - The parent node that contains oldNode and
 *   newNode.
 * @param {Node} oldNode - The old node to be patched.
 * @param {Node} newNode - The new node to patch to.
 */
export function diffAndPatch(parent, oldNode, newNode) {
    // Replace node if type changes or old node is missing
    if (!oldNode || oldNode.nodeName !== newNode.nodeName) {
        // Clean up Alpine.js state if it exists
        if (oldNode && oldNode._x_dataStack) {
            // Allow Alpine to handle cleanup first
            Alpine.destroyTree(oldNode);
        }

        // Replace the old node with the new node
        parent.replaceChild(newNode, oldNode || null);
        return;
    }

    // Update text content for text nodes
    if (oldNode.nodeType === Node.TEXT_NODE && oldNode.textContent !== newNode.textContent) {
        oldNode.textContent = newNode.textContent;
        return;
    }

    // Replace node if x-data changes
    if (oldNode.nodeType === Node.ELEMENT_NODE && oldNode.hasAttribute('x-data') && oldNode.getAttribute('x-data') !== newNode.getAttribute('x-data')) {
        // Clean up existing Alpine state
        Alpine.destroyTree(oldNode);

        // Replace the old node with the new node
        parent.replaceChild(newNode, oldNode);
        return;
    }

    // Update attributes for element nodes
    if (oldNode.nodeType === Node.ELEMENT_NODE) {
        // Get old and new attributes
        const oldAttributes = Array.from(oldNode.attributes);
        const newAttributes = Array.from(newNode.attributes);

        // Set new/updated attributes
        newAttributes.forEach(attr => {
            // Only set the attribute if the value has changed
            if (oldNode.getAttribute(attr.name) !== attr.value) {
                oldNode.setAttribute(attr.name, attr.value);
            }
        });

        // Remove old attributes, but ignore attributes managed by Alpine.js
        oldAttributes.forEach(attr => {
            // Check if the attribute is managed by Alpine.js
            const isManagedByAlpine = oldAttributes.some(bindAttr => {
                const match = bindAttr.name.match(/^(x-bind:|:)(.+)$/); // Match x-bind:attr or :attr
                return match && match[2] === attr.name;
            });

            // Only remove the attribute if it's not managed by Alpine.js
            if (
                !newNode.hasAttribute(attr.name) &&
                !isManagedByAlpine &&
                !(attr.name === 'style' && oldAttributes.some(attr => attr.name === 'x-show')) // Preserve `style` for x-show
            ) {
                // Remove the attribute
                oldNode.removeAttribute(attr.name);
            }
        });

        // Skip child diffing for x-html and x-text
        if (oldAttributes.some(attr => ['x-text', 'x-html'].includes(attr.name))) {
            return;
        }
    }

    // Recursively diff children
    const oldChildren = Array.from(oldNode.childNodes);
    const newChildren = Array.from(newNode.childNodes);

    // Remove extra old children
    while (oldChildren.length > newChildren.length) {
        // Remove the last child
        const childToRemove = oldChildren.pop();

        // Clean up Alpine.js state if it exists
        if (childToRemove._x_dataStack) {
            // Allow Alpine to handle cleanup first
            Alpine.destroyTree(childToRemove);
        }

        // Remove the child from the DOM
        oldNode.removeChild(childToRemove);
    }

    // Update or append children
    newChildren.forEach((newChild, index) => {
        // Append new children
        if (!oldChildren[index]) {
            oldNode.appendChild(newChild);
        } else {
            // Diff children
            diffAndPatch(oldNode, oldChildren[index], newChild);
        }
    });
}