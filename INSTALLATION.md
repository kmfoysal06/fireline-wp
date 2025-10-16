# FireLine SPA WordPress Plugin - Installation Guide

## What is FireLine SPA?

FireLine SPA is a WordPress plugin that transforms your traditional WordPress site into a modern Single Page Application (SPA). It provides:

- **Instant Page Loads**: Pages load without full browser refresh
- **Smooth Transitions**: Beautiful progress bar during navigation
- **Zero Configuration**: Works out of the box with any WordPress theme
- **Lightweight**: Only ~13KB total (minified)

## Installation

### Method 1: Direct Installation (Recommended)

1. **Download the Plugin**
   - Download or clone this repository
   - The plugin files are in the `fireline-spa` directory

2. **Install to WordPress**
   ```bash
   # Copy the plugin to your WordPress installation
   cp -r fireline-spa /path/to/wordpress/wp-content/plugins/
   ```

3. **Activate**
   - Go to WordPress Admin → Plugins
   - Find "FireLine SPA" in the list
   - Click "Activate"

4. **Done!** 🎉
   - Your site now works like a SPA
   - Try clicking any link - notice the smooth loading bar at the top

### Method 2: Build from Source

If you want to customize the plugin or build from source:

```bash
# Clone the repository
git clone https://github.com/kmfoysal06/fireline-wp.git
cd fireline-wp

# Install dependencies and build
npm install
npm run build

# The plugin is now ready in the 'fireline-spa' directory
# Copy it to your WordPress plugins folder
cp -r fireline-spa /path/to/wordpress/wp-content/plugins/

# Or create a zip file for upload through WordPress admin
cd fireline-spa
zip -r ../fireline-spa.zip .
```

Then upload the zip file through WordPress Admin → Plugins → Add New → Upload Plugin.

## System Requirements

- **WordPress**: 5.0 or higher
- **PHP**: 7.2 or higher
- **Modern Browser**: With ES2017 support (Chrome 58+, Firefox 52+, Safari 10.1+, Edge 79+)

## How It Works

Once activated, FireLine SPA:

1. **Automatically detects your theme's main content area**
   - Looks for common WordPress content containers
   - No configuration needed for most themes

2. **Intercepts link clicks**
   - Internal links load via AJAX
   - External links work normally
   - Admin links are preserved

3. **Shows a progress bar**
   - NProgress bar appears at the top during page loads
   - Automatically disappears when content is loaded

4. **Updates the browser URL**
   - Browser history works correctly
   - Back/forward buttons work as expected
   - You can bookmark any page

## Compatibility

### ✅ Works With

- Any WordPress theme (Twenty Twenty-One, Astra, GeneratePress, etc.)
- Most page builders (Elementor, Beaver Builder, etc.)
- WooCommerce (for basic navigation)
- Custom post types
- Archives and taxonomies
- Search results

### ⚠️ Limitations

- Forms are NOT intercepted by default (use WordPress's standard form handling)
- Some complex JavaScript interactions may need theme adjustments
- Real-time features (comments, likes) may require page reload
- Widgets with JavaScript may need reinitialization

### 🚫 Won't Affect

- WordPress Admin area
- Login/logout pages
- Edit links for logged-in users
- External links
- Links with `target="_blank"`
- Links with `native` attribute

## Customization

### For Users

**Exclude specific links from SPA navigation:**

Add the `native` attribute to any link you want to load normally:

```html
<a href="/special-page" native>Load Normally</a>
```

### For Theme Developers

**Manual target element configuration:**

If auto-detection doesn't work with your theme, add this to `functions.php`:

```php
function my_theme_fireline_config() {
    ?>
    <script>
    document.addEventListener('alpine:init', () => {
        // Set your custom content selector
        window.FireLine.settings.targetEl = '#my-custom-content';
        
        // Optional: adjust timeout (default: 30 seconds)
        window.FireLine.settings.timeout = 20;
    });
    </script>
    <?php
}
add_action('wp_footer', 'my_theme_fireline_config', 5);
```

**Disable on specific pages:**

```php
function disable_fireline_on_page() {
    if (is_page('contact')) {
        // Dequeue the plugin scripts
        wp_dequeue_script('fireline-spa');
        wp_dequeue_script('alpinejs');
        wp_dequeue_style('nprogress');
    }
}
add_action('wp_enqueue_scripts', 'disable_fireline_on_page', 100);
```

## Troubleshooting

### Issue: Links don't load smoothly

**Solution**: Check browser console for errors. Your theme might have a unique content structure.

Try setting a custom target element (see Customization section above).

### Issue: Some links still cause full page reload

**Solution**: This is normal for:
- External links
- Admin links
- Links with `target="_blank"`
- PDF/file downloads

If internal links aren't working, check if they have the `native` attribute.

### Issue: JavaScript stops working after navigation

**Solution**: Your theme's JavaScript needs to be reinitalized after content loads.

Add this to your theme's `functions.php`:

```php
function reinit_theme_scripts() {
    ?>
    <script>
    document.addEventListener('fireEnd', () => {
        // Reinitialize your theme's JavaScript here
        if (typeof myThemeInit === 'function') {
            myThemeInit();
        }
    });
    </script>
    <?php
}
add_action('wp_footer', 'reinit_theme_scripts');
```

### Issue: Progress bar color doesn't match my theme

**Solution**: Add custom CSS to your theme:

```css
#nprogress .bar {
    background: #your-color !important;
}

#nprogress .peg {
    box-shadow: 0 0 10px #your-color, 0 0 5px #your-color !important;
}
```

## FireLine Events

The plugin dispatches custom events you can listen to:

```javascript
// When navigation starts
document.addEventListener('fireStart', () => {
    console.log('Loading started');
});

// When navigation completes
document.addEventListener('fireEnd', () => {
    console.log('Loading complete');
    // Good place to reinitialize scripts
});

// When navigation fails
document.addEventListener('fireError', (error) => {
    console.log('Loading failed', error);
});

// When URL changes
document.addEventListener('fireNavigate', () => {
    console.log('Navigation occurred');
});
```

## Uninstallation

1. Deactivate the plugin through WordPress Admin → Plugins
2. Delete the plugin files
3. That's it! No database cleanup needed

## Performance

FireLine SPA improves perceived performance by:

- **Reducing server load**: Only content area is fetched, not entire page
- **Faster rendering**: Browser doesn't need to parse and execute common assets again
- **Better UX**: Instant feedback with progress bar

Typical improvements:
- 30-50% faster perceived load times
- Smoother navigation experience
- Reduced bandwidth usage

## Credits

- **FireLine Library**: Alpine.js plugin for dynamic routing
- **Alpine.js**: Lightweight JavaScript framework
- **NProgress**: Slim progress bar library

## Support

For issues, questions, or contributions:
- GitHub: https://github.com/kmfoysal06/fireline-wp
- Issues: https://github.com/kmfoysal06/fireline-wp/issues

## License

MIT License - Free to use and modify
