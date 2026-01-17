import { test, expect } from '@playwright/test';

test.describe('Theme System', () => {
    test.beforeEach(async ({ page }) => {
        // Clear localStorage before each test
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
    });

    test('should apply default light theme by default', async ({ page }) => {
        const widgetId = 'chat-widget-default';
        await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <script 
            id="${widgetId}"
            src="../dist/chat-widget.js"
            data-server-url="http://localhost:3000"
            data-position="bottom-right"
            data-title="Test Chat">
          </script>
        </body>
      </html>
    `);

        await page.waitForSelector(`script#${widgetId}`, { state: 'attached' });
        await page.waitForSelector(`div#${widgetId}`, { state: 'attached' });

        // Check data attributes on container
        const theme = await page.getAttribute(`div#${widgetId}`, 'data-theme');
        const mode = await page.getAttribute(`div#${widgetId}`, 'data-mode');

        expect(theme).toBe('default');
        expect(mode).toBe('light');

        // Check CSS variables
        const primaryColor = await page.evaluate((id) => {
            const widget = document.querySelector(`div#${id}`);
            return getComputedStyle(widget).getPropertyValue('--chat-primary').trim();
        }, widgetId);

        expect(primaryColor).toBe('#007bff');
    });

    test('should apply dark mode when specified', async ({ page }) => {
        const widgetId = 'chat-widget-dark';
        await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <script 
            id="${widgetId}"
            src="../dist/chat-widget.js"
            data-server-url="http://localhost:3000"
            data-position="bottom-right"
            data-theme="default"
            data-theme-mode="dark"
            data-title="Test Chat">
          </script>
        </body>
      </html>
    `);

        await page.waitForSelector(`div#${widgetId}`, { state: 'attached' });

        const mode = await page.getAttribute(`div#${widgetId}`, 'data-mode');
        expect(mode).toBe('dark');

        const primaryColor = await page.evaluate((id) => {
            const widgetDiv = document.querySelector(`div#${id}`);
            return getComputedStyle(widgetDiv).getPropertyValue('--chat-primary').trim();
        }, widgetId);

        expect(primaryColor).toBe('#4dabf7');
    });

    test('should apply branded theme', async ({ page }) => {
        const widgetId = 'chat-widget-branded';
        await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <script 
            id="${widgetId}"
            src="../dist/chat-widget.js"
            data-server-url="http://localhost:3000"
            data-position="bottom-right"
            data-theme="branded"
            data-theme-mode="light"
            data-title="Test Chat">
          </script>
        </body>
      </html>
    `);

        await page.waitForSelector(`div#${widgetId}`, { state: 'attached' });

        const theme = await page.getAttribute(`div#${widgetId}`, 'data-theme');
        expect(theme).toBe('branded');

        const primaryColor = await page.evaluate((id) => {
            const widget = document.querySelector(`div#${id}`);
            return getComputedStyle(widget).getPropertyValue('--chat-primary').trim();
        }, widgetId);

        expect(primaryColor).toBe('#6366f1');
    });

    test('should apply custom colors via data attributes', async ({ page }) => {
        const widgetId = 'chat-widget-colors';
        await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <script 
            id="${widgetId}"
            src="../dist/chat-widget.js"
            data-server-url="http://localhost:3000"
            data-position="bottom-right"
            data-theme="default"
            data-theme-mode="light"
            data-color-light="#ff6b6b"
            data-bg-color-light="#ffffff"
            data-surface-color-light="#ffe5e5"
            data-text-color-light="#2d2d2d"
            data-border-color-light="#ffcccc"
            data-title="Test Chat">
          </script>
        </body>
      </html>
    `);

        await page.waitForSelector(`script#${widgetId}`, { state: 'attached' });

        const colors = await page.evaluate((id) => {
            const widget = document.querySelector(`div#${id}`);
            const styles = getComputedStyle(widget);
            return {
                primary: styles.getPropertyValue('--chat-primary').trim(),
                bg: styles.getPropertyValue('--chat-bg').trim(),
                surface: styles.getPropertyValue('--chat-surface').trim(),
                text: styles.getPropertyValue('--chat-text').trim(),
                border: styles.getPropertyValue('--chat-border').trim(),
            };
        }, widgetId);

        expect(['rgb(255, 107, 107)', '#ff6b6b']).toContain(colors.primary);
        expect(['rgb(255, 255, 255)', '#ffffff']).toContain(colors.bg);
        expect(['rgb(255, 229, 229)', '#ffe5e5']).toContain(colors.surface);
    });

    test('should switch theme programmatically', async ({ page }) => {
        const widgetId = 'chat-widget-switch-theme';
        await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <script 
            id="${widgetId}"
            src="../dist/chat-widget.js"
            data-server-url="http://localhost:3000"
            data-position="bottom-right"
            data-theme="default"
            data-theme-mode="light"
            data-title="Test Chat">
          </script>
        </body>
      </html>
    `);

        await page.waitForSelector(`script#${widgetId}`, { state: 'attached' });

        // Get widget instance and switch theme
        await page.evaluate((id) => {
            const script = document.querySelector(`script#${id}`);
            const widget = script._chatWidgetInstance;
            widget.setTheme('branded');
        }, widgetId);

        await page.waitForTimeout(100);

        const theme = await page.getAttribute(`div#${widgetId}`, 'data-theme');
        expect(theme).toBe('branded');

        const primaryColor = await page.evaluate((id) => {
            const widget = document.querySelector(`div#${id}`);
            return getComputedStyle(widget).getPropertyValue('--chat-primary').trim();
        }, widgetId);

        expect(primaryColor).toBe('#6366f1');
    });

    test('should switch mode programmatically', async ({ page }) => {
        const widgetId = 'chat-widget-switch-mode';
        await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <script 
            id="${widgetId}"
            src="../dist/chat-widget.js"
            data-server-url="http://localhost:3000"
            data-position="bottom-right"
            data-theme="default"
            data-theme-mode="light"
            data-title="Test Chat">
          </script>
        </body>
      </html>
    `);

        await page.waitForSelector(`script#${widgetId}`, { state: 'attached' });

        // Switch to dark mode
        await page.evaluate((id) => {
            const script = document.querySelector(`script#${id}`);
            const widget = script._chatWidgetInstance;
            widget.setThemeMode('dark');
        }, widgetId);

        await page.waitForTimeout(100);

        const mode = await page.getAttribute(`div#${widgetId}`, 'data-mode');
        expect(mode).toBe('dark');

        const primaryColor = await page.evaluate((id) => {
            const widget = document.querySelector(`div#${id}`);
            return getComputedStyle(widget).getPropertyValue('--chat-primary').trim();
        }, widgetId);

        expect(primaryColor).toBe('#4dabf7');
    });

    test('should toggle mode programmatically', async ({ page }) => {
        const widgetId = 'chat-widget-toggle';
        await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <script 
            id="${widgetId}"
            src="../dist/chat-widget.js"
            data-server-url="http://localhost:3000"
            data-position="bottom-right"
            data-theme="default"
            data-theme-mode="light"
            data-title="Test Chat">
          </script>
        </body>
      </html>
    `);

        await page.waitForSelector(`script#${widgetId}`, { state: 'attached' });

        // Toggle mode
        const newMode = await page.evaluate((id) => {
            const script = document.querySelector(`script#${id}`);
            const widget = script._chatWidgetInstance;
            return widget.toggleThemeMode();
        }, widgetId);

        expect(newMode).toBe('dark');

        const mode = await page.getAttribute(`div#${widgetId}`, 'data-mode');
        expect(mode).toBe('dark');

        await page.waitForTimeout(100);

        // Toggle back
        const newMode2 = await page.evaluate((id) => {
            const script = document.querySelector(`script#${id}`);
            const widget = script._chatWidgetInstance;
            return widget.toggleThemeMode();
        }, widgetId);

        expect(newMode2).toBe('light');
    });

    test('should persist theme preference to localStorage', async ({ page }) => {
        const widgetId = 'chat-widget-persist';
        await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <script 
            id="${widgetId}"
            src="../dist/chat-widget.js"
            data-server-url="http://localhost:3000"
            data-position="bottom-right"
            data-title="Test Chat">
          </script>
        </body>
      </html>
    `);

        await page.waitForSelector(`script#${widgetId}`, { state: 'attached' });

        // Set theme
        await page.evaluate((id) => {
            const script = document.querySelector(`script#${id}`);
            const widget = script._chatWidgetInstance;
            widget.setTheme('branded');
            widget.setThemeMode('dark');
        }, widgetId);

        // Check localStorage
        const storedTheme = await page.evaluate((id) => {
            return localStorage.getItem(`chat-widget-${id}-theme`);
        }, widgetId);

        const storedMode = await page.evaluate((id) => {
            return localStorage.getItem(`chat-widget-${id}-mode`);
        }, widgetId);

        expect(storedTheme).toBe('branded');
        expect(storedMode).toBe('dark');
    });

    test('should apply custom colors for both light and dark modes', async ({ page }) => {
        const widgetId = 'chat-widget-dual-colors';
        await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <script 
            id="${widgetId}"
            src="../dist/chat-widget.js"
            data-server-url="http://localhost:3000"
            data-position="bottom-right"
            data-theme="default"
            data-theme-mode="light"
            data-color-light="#ff6b6b"
            data-color-dark="#ff8787"
            data-title="Test Chat">
          </script>
        </body>
      </html>
    `);

        await page.waitForSelector(`script#${widgetId}`, { state: 'attached' });

        // Check light mode color
        let primaryColor = await page.evaluate((id) => {
            const widget = document.querySelector(`div#${id}`);
            return getComputedStyle(widget).getPropertyValue('--chat-primary').trim();
        }, widgetId);

        expect(['rgb(255, 107, 107)', '#ff6b6b']).toContain(primaryColor); // #ff6b6b

        // Switch to dark mode
        await page.evaluate((id) => {
            const script = document.querySelector(`script#${id}`);
            const widget = script._chatWidgetInstance;
            widget.setThemeMode('dark');
        }, widgetId);

        await page.waitForTimeout(100);

        // Check dark mode color
        primaryColor = await page.evaluate((id) => {
            const widget = document.querySelector(`div#${id}`);
            return getComputedStyle(widget).getPropertyValue('--chat-primary').trim();
        }, widgetId);

        expect(['rgb(255, 135, 135)', '#ff8787']).toContain(primaryColor); // #ff8787
    });

    test('should get theme configuration', async ({ page }) => {
        const widgetId = 'chat-widget-config';
        await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <script 
            id="${widgetId}"
            src="../dist/chat-widget.js"
            data-server-url="http://localhost:3000"
            data-position="bottom-right"
            data-theme="branded"
            data-theme-mode="dark"
            data-title="Test Chat">
          </script>
        </body>
      </html>
    `);

        await page.waitForSelector(`script#${widgetId}`, { state: 'attached' });

        const config = await page.evaluate((id) => {
            const script = document.querySelector(`script#${id}`);
            const widget = script._chatWidgetInstance;
            return widget.getThemeConfig();
        }, widgetId);

        expect(config.theme).toBe('branded');
        expect(config.mode).toBe('dark');
        expect(config.colors).toBeDefined();
        expect(config.colors.primary).toBeDefined();
    });

    test('should apply theme to all UI elements', async ({ page }) => {
        const widgetId = 'chat-widget-ui-elements';
        await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <script 
            id="${widgetId}"
            src="../dist/chat-widget.js"
            data-server-url="http://localhost:3000"
            data-position="bottom-right"
            data-theme="default"
            data-theme-mode="dark"
            data-title="Test Chat">
          </script>
        </body>
      </html>
    `);

        await page.waitForSelector(`#${widgetId}-button`, { state: 'visible' });

        // Open the chat
        await page.click(`#${widgetId}-button`);
        await page.waitForSelector(`#${widgetId}-window`, { state: 'visible' });

        // Check that dark mode colors are applied to UI elements
        const bgColor = await page.evaluate((id) => {
            const window = document.querySelector(`#${id}-window`);
            return getComputedStyle(window).backgroundColor;
        }, widgetId);

        // Dark mode background should be dark
        expect(bgColor).toContain('rgb(26, 26, 26)'); // #1a1a1a
    });

    test('should handle multiple widgets with different themes', async ({ page }) => {
        await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <script 
            id="chat-widget-1"
            src="../dist/chat-widget.js"
            data-server-url="http://localhost:3000"
            data-position="bottom-right"
            data-theme="default"
            data-theme-mode="light"
            data-title="Widget 1">
          </script>
          <script 
            id="chat-widget-2"
            src="../dist/chat-widget.js"
            data-server-url="http://localhost:3000"
            data-position="bottom-left"
            data-theme="branded"
            data-theme-mode="dark"
            data-title="Widget 2">
          </script>
        </body>
      </html>
    `);

        await page.waitForSelector('script#chat-widget-1', { state: 'attached' });
        await page.waitForSelector('script#chat-widget-2', { state: 'attached' });

        // Check first widget
        const theme1 = await page.getAttribute('script#chat-widget-1', 'data-theme');
        const mode1 = await page.getAttribute('script#chat-widget-1', 'data-theme-mode');
        expect(theme1).toBe('default');
        expect(mode1).toBe('light');

        // Check second widget
        const theme2 = await page.getAttribute('script#chat-widget-2', 'data-theme');
        const mode2 = await page.getAttribute('script#chat-widget-2', 'data-theme-mode');
        expect(theme2).toBe('branded');
        expect(mode2).toBe('dark');
    });
});
