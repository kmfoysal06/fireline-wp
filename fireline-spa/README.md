# FireLine SPA - WordPress Plugin

Transform your WordPress site into a Single Page Application (SPA) with smooth page transitions and a beautiful progress bar.

![FireLine SPA Demo](https://github.com/user-attachments/assets/2c7303ba-2ca3-4148-9ed5-f1bdb6a82e91)

## Features

- 🚀 **SPA-like Experience**: Pages load instantly without full page refreshes
- 📊 **Progress Bar**: Beautiful NProgress bar shows loading status
- 🔧 **Zero Configuration**: Just install and activate - works automatically
- ⚡ **Powered by FireLine**: Uses FireLine's advanced Alpine.js plugin for dynamic routing
- 🎨 **Theme Compatible**: Works with any WordPress theme
- 🔒 **Admin Safe**: Automatically preserves WordPress admin functionality

## Installation

### From GitHub

1. Download the plugin from the releases page
2. Upload the `fireline-spa` folder to `/wp-content/plugins/`
3. Activate the plugin through the 'Plugins' menu in WordPress

### Manual Installation

1. Clone or download this repository
2. Run `npm install` in the root directory
3. Run `npm run build` to build the plugin assets
4. Copy the `fireline-spa` folder to your WordPress `/wp-content/plugins/` directory
5. Activate the plugin through the 'Plugins' menu in WordPress

## How It Works

FireLine SPA automatically:

1. **Detects your theme's content area** - Looks for common WordPress content selectors
2. **Intercepts link clicks** - Loads content dynamically without full page refresh
3. **Shows progress bar** - Displays NProgress bar during page loads
4. **Preserves admin functionality** - Admin links and edit links work normally
5. **Updates browser history** - Back/forward buttons work as expected

## Compatibility

- **WordPress**: 5.0 or higher
- **PHP**: 7.2 or higher
- **Browsers**: Modern browsers with ES2017 support

## Technical Details

### Built With

- [FireLine](https://github.com/kmfoysal06/fireline-wp) - Alpine.js plugin for dynamic routing
- [Alpine.js](https://alpinejs.dev/) - Lightweight JavaScript framework
- [NProgress](https://ricostacruz.com/nprogress/) - Progress bar library

### Auto-Detection

The plugin automatically detects your WordPress theme's main content area by checking for these common selectors (in order):

- `#content > article`, `#content > div`, `#content`
- `#main > article`, `#main > div`, `#main`
- `#primary > article`, `#primary > div`, `#primary`
- `.site-content > article`, `.site-content > div`, `.site-content`
- `.content-area > article`, `.content-area > div`, `.content-area`

### What's Intercepted

- ✅ Internal navigation links
- ✅ Same-domain links
- ❌ External links
- ❌ WordPress admin links (`/wp-admin/`)
- ❌ Login links (`/wp-login.php`)
- ❌ Edit post links
- ❌ Links with `native` attribute
- ❌ Links with `target="_blank"`

## Customization

### For Theme Developers

If the auto-detection doesn't work with your theme, you can specify the target element by adding this to your theme's functions.php:

```php
add_action('wp_footer', function() {
    ?>
    <script>
    document.addEventListener('alpine:init', () => {
        window.FireLine.settings.targetEl = '#your-custom-selector';
    });
    </script>
    <?php
});
```

### Disabling on Specific Pages

Add the `native` attribute to links you want to exclude from SPA navigation:

```html
<a href="/special-page" native>Regular Link</a>
```

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# This will:
# 1. Build FireLine from source
# 2. Bundle the plugin assets
# 3. Create the distributable plugin
```

### File Structure

```
fireline-wp/
├── fireline/                 # FireLine library source
│   ├── src/                 # FireLine source files
│   ├── builds/              # FireLine build configs
│   └── dist/                # FireLine built files
├── plugin-src/              # Plugin source files
│   └── main.js             # Main plugin entry point
├── fireline-spa/           # WordPress plugin directory
│   ├── assets/             # Built plugin assets
│   └── fireline-spa.php    # Main plugin file
├── build-plugin.js         # Plugin build script
└── package.json            # Dependencies and scripts
```

## License

MIT License - see LICENSE file for details

## Credits

- Created by [kmfoysal06](https://github.com/kmfoysal06)
- Powered by [FireLine](https://github.com/kmfoysal06/fireline-wp)
- Built with [Alpine.js](https://alpinejs.dev/)
- Progress bar by [NProgress](https://ricostacruz.com/nprogress/)

## Support

For issues, questions, or contributions, please visit:
https://github.com/kmfoysal06/fireline-wp
