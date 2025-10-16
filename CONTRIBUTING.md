# Contributing to FireLine

Thank you for your interest in contributing to FireLine! This document provides guidelines and instructions for contributing.

## Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- 💬 Help others in discussions
- ⭐ Star the repository

## Development Setup

### Prerequisites

- Node.js 14+ and npm
- Git
- A code editor (VS Code recommended)
- For WordPress plugin testing: Local WordPress installation

### Getting Started

```bash
# Clone the repository
git clone https://github.com/kmfoysal06/fireline-wp.git
cd fireline-wp

# Install dependencies
npm install

# Build the project
npm run build

# This builds both:
# 1. FireLine library (in fireline/dist/)
# 2. WordPress plugin (in fireline-spa/assets/)
```

## Project Structure

```
fireline-wp/
├── fireline/                # FireLine library
│   ├── src/                # Library source files
│   ├── builds/             # Build configurations
│   ├── dist/               # Built library files
│   └── package.json        # Library dependencies
│
├── plugin-src/             # WordPress plugin source
│   └── main.js            # Plugin entry point
│
├── fireline-spa/          # WordPress plugin output
│   ├── assets/            # Built plugin assets
│   ├── fireline-spa.php   # Main plugin file
│   └── README.md          # Plugin documentation
│
├── build-plugin.js        # Plugin build script
├── package.json           # Root package dependencies
└── README.md             # Main documentation
```

## Making Changes

### For FireLine Library

1. Edit files in `fireline/src/`
2. Test your changes
3. Run `npm run build` to rebuild
4. Submit a pull request

### For WordPress Plugin

1. Edit files in `plugin-src/` or `fireline-spa/fireline-spa.php`
2. Run `npm run build` to rebuild plugin assets
3. Test in a WordPress installation
4. Submit a pull request

## Coding Standards

### JavaScript

- Use ES6+ features
- Follow existing code style
- Add JSDoc comments for functions
- Keep functions small and focused
- Use meaningful variable names

Example:
```javascript
/**
 * Navigate to a specified URL
 * @param {string} url - The URL to navigate to
 * @param {boolean} pushState - Whether to update browser history
 * @returns {void}
 */
function navigateTo(url, pushState = true) {
    // Implementation
}
```

### PHP (WordPress Plugin)

- Follow WordPress Coding Standards
- Use proper indentation (tabs, not spaces)
- Add DocBlocks for all functions
- Prefix functions with `fireline_spa_`
- Sanitize and validate all inputs

Example:
```php
/**
 * Enqueue plugin scripts
 * 
 * @return void
 */
public function enqueue_scripts() {
    // Implementation
}
```

## Testing

### Manual Testing

Before submitting a PR:

1. **Test the build**:
   ```bash
   npm run build
   ```

2. **Test FireLine library** (open in browser):
   ```bash
   cd fireline
   # Open index.html in browser
   ```

3. **Test WordPress plugin**:
   - Install plugin in WordPress
   - Test with different themes
   - Check browser console for errors
   - Test navigation between pages
   - Verify admin links still work
   - Test on mobile devices

### Browser Testing

Test in these browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### WordPress Testing

Test with:
- Different themes (Twenty Twenty-One, Astra, etc.)
- Different WordPress versions (5.0+)
- Different PHP versions (7.2+)
- With and without other plugins

## Pull Request Process

1. **Fork the repository**
   ```bash
   # Click 'Fork' on GitHub
   git clone https://github.com/YOUR_USERNAME/fireline-wp.git
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow coding standards
   - Test thoroughly

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add feature: your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Wait for review

### PR Guidelines

- One feature/fix per PR
- Clear, descriptive title
- Detailed description of changes
- Link related issues
- Update documentation if needed
- Add tests if applicable

## Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**:
   ```
   1. Go to '...'
   2. Click on '...'
   3. See error
   ```
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**:
   - WordPress version
   - PHP version
   - Theme name
   - Browser and version
   - Plugin version
6. **Screenshots**: If applicable
7. **Console Errors**: Browser console errors

## Suggesting Features

When suggesting features:

1. **Use Case**: Describe the problem it solves
2. **Proposed Solution**: How it should work
3. **Alternatives**: Other solutions you considered
4. **Implementation Ideas**: If you have technical insights
5. **Examples**: Links to similar features elsewhere

## Code Review Process

1. Maintainers will review your PR
2. They may request changes
3. Make requested changes and push
4. Once approved, it will be merged
5. Your contribution will be credited

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Issues**: Open a GitHub Issue
- **Chat**: [Coming soon]
- **Email**: [Contact maintainer]

## Recognition

Contributors are credited in:
- CHANGELOG.md
- Release notes
- GitHub contributors page

Thank you for contributing! 🎉
