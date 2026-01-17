# ChatUI Widget - Netlify Deployment

This folder contains the Netlify-ready deployment configuration for the ChatUI Widget project.

## 🚀 Deployment URL

**Live Site**: https://chatui.lesichkov.co.uk

## 📁 Project Structure

```
netlify/
├── index.html              # Main landing page with project description
├── demo/                   # Demo showcase
│   ├── index.html          # Demo index page
│   ├── popup.html          # Popup chat demo
│   ├── full_page.htm       # Full page chat demo
│   ├── widget-demo.html    # Interactive widgets demo
│   ├── theme-demo.html     # Theme system demo
│   └── widgets/            # Individual widget demos
├── dist/                   # Built chat widget files
│   ├── chat-widget.js      # Main widget bundle
│   └── chat-widget.min.js # Minified version
├── functions/              # Netlify Functions (serverless backend)
│   ├── chat-api.js         # Main chat API endpoint
│   └── widget-api.js       # Widget data API endpoint
└── netlify.toml           # Netlify configuration
```

## 🔧 Configuration

### Netlify Functions

The deployment uses Netlify Functions to provide a serverless backend for the demos:

- **`chat-api.js`**: Handles chat messages, handshakes, and real-time features
- **`widget-api.js`**: Provides data for all 15+ interactive widgets

Both functions support:
- JSONP requests (for cross-domain compatibility)
- REST API requests
- CORS headers
- WebSocket-like message handling

### Routing

The `netlify.toml` configuration includes:
- API redirects (`/api/*` → `/.netlify/functions/*`)
- SPA fallback routing
- Function directory configuration

## 🎨 Features Demonstrated

### Main Demos
- **Popup Chat**: Floating chat widget in corner
- **Full Page Chat**: Dedicated chat interface
- **Widget Showcase**: All 15+ interactive widgets
- **Theme System**: Light/dark modes with customization

### Interactive Widgets
- Buttons, Input, Select, Checkbox, Radio
- Textarea, Slider, Toggle, Date Picker
- Rating, Tags, File Upload, Color Picker
- Confirmation dialogs, Progress indicators

### Theme Capabilities
- Default and Branded themes
- Light/Dark mode switching
- Custom color schemes
- System preference detection

## 🛠️ Development

### Local Development

To test locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to netlify folder
cd netlify

# Start local development server
netlify dev
```

The site will be available at `http://localhost:8888` with functions at `/.netlify/functions/`.

### Building

The project uses pre-built files from the `dist/` directory. To rebuild:

```bash
# From project root
npm run build

# Copy built files to netlify folder
cp dist/*.js netlify/dist/
```

## 📊 Analytics & Monitoring

Netlify provides built-in:
- Site analytics
- Function invocation metrics
- Performance monitoring
- Error tracking

## 🔒 Security

- All functions include CORS headers
- JSONP callback validation
- Input sanitization
- XSS prevention in the widget itself

## 🚀 Deployment

The site is configured for automatic deployment from the main branch. Any changes pushed to the repository will be automatically deployed to:

**https://chatui.lesichkov.co.uk**

### Manual Deployment

```bash
# Deploy manually
netlify deploy --prod --dir=netlify
```

## 📝 Notes

- The demo backend is simulated and provides mock responses
- All widget interactions are fully functional
- Theme preferences are saved to localStorage
- The widget is production-ready and can be embedded on any site

## 🤝 Contributing

When making changes:

1. Test locally with `netlify dev`
2. Update demo files if adding new widgets
3. Update function handlers if adding new API endpoints
4. Ensure all paths use relative references for portability

## 📞 Support

For issues or questions:
- Check the main project README
- Open an issue on GitHub
- Test the live demos at the deployment URL
