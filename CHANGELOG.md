# Changelog

All notable changes to FireLine and FireLine SPA WordPress Plugin will be documented in this file.

## [1.0.2] - 2025-10-16

### WordPress Plugin - Bug Fix

#### Fixed
- **Critical**: Fixed "Router target element not found" error
  - Error occurred when target element detection failed or happened after navigation attempts
  - Added robust fallback mechanism that tries multiple common WordPress selectors
  - Target element detection now happens at multiple stages (alpine:init, DOMContentLoaded, and delayed retry)
  - Added 'body' as ultimate fallback to ensure plugin always has a valid target
  - Improved error messages to help debug theme compatibility issues

#### Technical Details
- Extracted target element detection into reusable `detectAndSetTargetElement()` function
- Added multiple detection attempts to handle different loading scenarios
- `replaceRouterHtml()` now tries fallback selectors (#content, #main, #primary, .site-content, .content-area, body) if initial target not found
- Added console warnings when falling back to different selectors for debugging
- Enhanced error message to show which selector was attempted

## [1.0.1] - 2025-10-16

### WordPress Plugin - Bug Fix

#### Fixed
- **Critical**: Fixed JSON parsing error when clicking links in WordPress SPA mode
  - Previously, FireLine requests were receiving HTML instead of JSON responses
  - Error: "SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON"
  - Solution: Changed from `wp_footer` hook to `shutdown` hook to properly capture output before headers are sent
  - Improved output buffer handling to capture all buffer levels
  - Added `headers_sent()` check for better error detection and debugging

#### Technical Details
- Changed WordPress hook from `wp_footer` to `shutdown` for JSON response handling
- Output buffering now starts earlier in `template_redirect` with priority 1
- Properly handles multiple output buffer levels
- Headers are now sent before any output is flushed, preventing HTML response

## [1.0.0] - 2025-10-16

### WordPress Plugin - Initial Release

#### Added
- **FireLine SPA WordPress Plugin**: Complete SPA functionality for WordPress sites
- Auto-detection of WordPress theme content areas
- NProgress integration for beautiful loading indicators
- Automatic link interception for smooth navigation
- WordPress admin area protection (admin links remain functional)
- Zero-configuration setup - works immediately after activation
- Event system for developers (fireStart, fireEnd, fireError, fireNavigate)
- Support for all modern WordPress themes
- Lightweight bundle (~13KB minified)

#### Changed
- Reorganized repository structure
- Moved FireLine library source to `/fireline/` subdirectory
- Updated build system to support both library and plugin builds

#### Technical Details
- Uses Alpine.js 3.x as framework foundation
- Powered by FireLine router for dynamic content loading
- NProgress 0.2.0 for progress bar
- ES2017+ JavaScript (modern browsers)
- PHP 7.2+ and WordPress 5.0+ compatible

### FireLine Library - v1.1.0

#### Core Features (Existing)
- Alpine.js plugin for SPA-like routing
- Dynamic content loading with diffAndPatch algorithm
- Form handling with x-submit directive
- Navigation with x-navigate directive
- Global reactive state management
- Server-side rendering integration
- Automatic event lifecycle (fireStart, fireEnd, fireError)
- $fire magic property for programmatic control

---

## Future Plans

### Planned Features
- [ ] Settings page in WordPress admin
- [ ] Customizable progress bar colors from admin
- [ ] Enable/disable per page type (posts, pages, archives)
- [ ] Cache support for faster repeat visits
- [ ] Analytics integration helpers
- [ ] Transition animations between pages
- [ ] Preloading on link hover
- [ ] Better WooCommerce integration
- [ ] Multisite support

### Under Consideration
- Gutenberg block for SPA control
- REST API enhancements
- CDN version of WordPress plugin assets
- Theme compatibility checker
- Performance monitoring dashboard
- A/B testing support

---

## Support & Contributions

For bug reports, feature requests, or contributions:
- **GitHub Issues**: https://github.com/kmfoysal06/fireline-wp/issues
- **Pull Requests**: Welcome! Please read CONTRIBUTING.md first
- **Discussions**: Share your ideas and get help

---

## Version History

- **1.0.0** (2025-10-16): Initial WordPress plugin release + FireLine v1.1.0
