import { test, expect } from '@playwright/test';

test.describe('Chat Widget - Request Timeout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/programmatic-test.html');
  });

  test('should default to 5000ms when no timeout is configured', async ({ page }) => {
    const timeout = await page.evaluate(() => {
      const widget = (window as any).ChatUI.init({ id: 'timeout-default' });
      return widget.api.timeout;
    });

    expect(timeout).toBe(5000);
  });

  test('should respect programmatic timeout config', async ({ page }) => {
    const result = await page.evaluate(() => {
      const widget = (window as any).ChatUI.init({ id: 'timeout-prog', timeout: 30000 });
      return { api: widget.api.timeout, cors: widget.api.corsApi.timeout, config: widget.config.timeout };
    });

    expect(result.config).toBe(30000);
    expect(result.api).toBe(30000);
    expect(result.cors).toBe(30000);
  });

  test('should read timeout from data-timeout attribute', async ({ page }) => {
    const timeout = await page.evaluate(() => {
      const script = document.createElement('script');
      script.id = 'timeout-attr';
      script.setAttribute('data-timeout', '45000');
      document.body.appendChild(script);
      const widget = (window as any).createChatWidget(script);
      return widget.api.timeout;
    });

    expect(timeout).toBe(45000);
  });

  test('should fall back to 5000ms for invalid data-timeout values', async ({ page }) => {
    const timeout = await page.evaluate(() => {
      const script = document.createElement('script');
      script.id = 'timeout-invalid';
      script.setAttribute('data-timeout', 'not-a-number');
      document.body.appendChild(script);
      const widget = (window as any).createChatWidget(script);
      return widget.api.timeout;
    });

    expect(timeout).toBe(5000);
  });
});
