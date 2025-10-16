# FireLine

**FireLine** is a powerful Alpine.js plugin that enhances your web applications with advanced reactivity, seamless integration, and features like server-side rendering of Alpine.js components, form handling, and a robust router.

## WordPress Plugin

This repository includes **FireLine SPA** - a WordPress plugin that transforms your WordPress site into a Single Page Application with smooth page transitions and a beautiful progress bar.

👉 **[See the WordPress Plugin README](fireline-spa/README.md)** for installation and usage instructions.

### Quick Start (WordPress)

1. Clone this repository
2. Run `npm install && npm run build`
3. Copy the `fireline-spa` folder to your WordPress `/wp-content/plugins/` directory
4. Activate the plugin in WordPress
5. Your site now works like a SPA! 🚀

---

## FireLine Library  

## Features

- Global reactive state management via `window.FireLine.settings`.
- Intercepts links and forms for dynamic client-side routing.
- Directives:
  - **`x-navigate`**: Enables dynamic routing using the built-in diffAndPatch algorithm.
  - **`x-submit`**: Handles form submissions with customizable responses.
- Server-side rendering integration for updated content.
- Customizable plugin settings.
- Automatic event triggers for lifecycle management (`fireStart`, `fireEnd`, `fireError`).
- Skip Auto Interception by adding **native** in anchor tag and form element.

## Installation

```shell
# Install
npm install fireline

# Setup
import FireLine from 'fireline'
import Alpine from 'alpinejs'

Alpine.plugin(FireLine)

window.Alpine = Alpine

Alpine.start()

```
or Include the plugin in your project by adding the built file to your HTML:

```html
<!-- Alpine Plugins -->
<script src="https://cdn.jsdelivr.net/npm/fireline@1.x.x/dist/cdn.min.js"></script>
 
<!-- Alpine Core -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

## Getting Started

### Configuration
FireLine is globally configurable using the *window.FireLine.settings* object.

### Default Settings

```js
window.FireLine.settings = {
    targetEl: '#app > div', // The element to replace with loaded content
    timeout: 30, // Timeout for the loading state in seconds
    interceptLinks: true, // Enable link interception for SPA routing
    interceptForms: true, // Enable form interception for SPA form submissions
};
```

To update a setting, simply modify it before initializing Alpine.js:

## Example

```html 
<div id="app">
    <!-- Element to be replaced from here -->
    <div>
        <a x-navigate href="/about">Go to About</a>
        <form x-submit action="/api/submit" method="POST">
            <input type="text" name="email" placeholder="Enter your email" />
            <button type="submit">Submit</button>
        </form>
    </div>
    <!-- Element to be replaced to here -->
</div>
<script>
    document.addEventListener('alpine:init', () => {
        // Customize Settings
        window.FireLine.settings.targetEl = '#app > div';
        window.FireLine.settings.timeout = 40;
        window.FireLine.settings.interceptLinks = false;
        window.FireLine.settings.interceptForms = false;
    });
</script>
```
**NOTE:** every html response should have only **one** root laval element.

### Directives

### x-navigate
The **x-navigate** directive dynamically loads and renders content:

```html
<a x-navigate href="/new-page">Navigate to New Page</a>
```

- Uses **diffAndPatch** for DOM updates.
- Ensure Alpine short attributes (e.g., **@click**, **@input**) are replaced with their full form (e.g., **x-on:click**, **x-on:input**).

#### Server Response Handling
The response object can include:
- **title**: (Optional) the *title* to update the document.
- **html**: (Required) the router response to be rendered.

### x-submit

Handles form submissions dynamically with server responses:

```html
<form x-submit action="/submit-form" method="POST">
    <!-- Optional: Form Alert -->
    <div status="success" style="color:green"></div>
    <div status="error" style="color:red"></div>
    
    <input type="text" name="name" placeholder="Enter your name" />
    <button type="submit">Submit</button>
</form>
```

**Server Response Handling**
The response object can include:

- **status** and **message**: Shows an alert under the form.
- **html** and **title**: Renders new HTML content using diffAndPatch.
- **redirect** or **navigate**: Redirects or navigates to a new route.

## `$fire` Magic Property

FireLine introduces the `$fire` magic property, providing a powerful and intuitive way to interact with the router and manage navigation, loading states, and server-side form submissions directly in your Alpine.js components.

### Available Properties and Methods

- **`$fire.current`**: The current URL path.
- **`$fire.loading`**: Boolean indicating whether the router is currently loading.
- **`$fire.navigate(url)`**: Navigates to the specified URL.
- **`$fire.reload()`**: Reloads the current URL.
- **`$fire.replaceHtml(html)`**: Replaces the router content with the provided HTML.
- **`$fire.formSubmit(formEl)`**: Submits a form to the server and handles the response.

## Example Usage

#### Highlight Active Links
```html
<a :class="$fire.current == '/' && 'text-green-600'" href="/">Home</a>
<a :class="$fire.current.startsWith('/about') && 'text-green-600'" href="/about">About</a>
```

#### Navigation Buttons
```html
<button x-on:click="$fire.navigate('/dashboard')" class="btn">Go to Dashboard</button>
<button x-on:click="$fire.reload()" class="btn">Reload Page</button>
```

#### Custom Content Replacement
```html
<div id="app">
    <div>
        <button x-on:click="$fire.replaceHtml('<div><h1>Welcome to FireLine!</h1></div>')" class="btn">
            Update Content
        </button>
    </div>
</div>
```

**Note:** In *replaceHtml* function the input Html should contain *only one root laval element*.

#### Server-Side Form Submission

```html
<form x-data x-on:submit="$fire.formSubmit($el)">
    <input type="text" name="username" placeholder="Enter username" required>
    <button type="submit" class="btn">Submit</button>
</form>
```

## Notes
- Use **$fire.navigate(url)** to programmatically navigate between pages.
- When using server-side form submission, make sure your form's response includes **one** of the following properties:
    - **status** and **message**: Displays an alert under the form.
    - **html** and **title**: Updates the content via replaceHtml.
    - **redirect** or **navigate**: Redirects or navigates to a specific route.
- Ensure Alpine.js shorthand attributes (e.g., **@click**) are replaced with full syntax (**x-on:click**) when using the **replaceHtml** function to avoid compatibility issues.

The **$fire** magic property simplifies complex routing and state management, making it easier to build dynamic and reactive Alpine.js applications with FireLine.

### Tips for Usage

- **Use Full Attribute Names:**
    Replace Alpine short attributes (**@click**, **@input**) with full ones (**x-on:click**, **x-on:input**) to avoid issues with the dom rendering.
- **Avoid Mixed Bind Attributes:**
    If using **x-bind:class**, **x-bind:style**, etc do not include generic attributes (class, style, etc) to prevent conflicts. Example:
    
    ```html
    <!-- Avoid this -->
    <div class="bg-red-500" x-bind:class="isActive ? 'text-white' : 'text-gray-500'"></div>

    <!-- Recommended -->
    <div x-bind:class="isActive ? 'bg-red-500 text-white' : 'bg-red-500 text-gray-500'"></div>
    ```

### Events
FireLine emits the following events during its lifecycle:

- **fireStart**: Triggered at the start of navigation or submission.
- **fireEnd**: Triggered after successful navigation or submission.
- **fireError**: Triggered when an error occurs.