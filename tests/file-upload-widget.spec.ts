import { test, expect } from '@playwright/test';

test.describe('File Upload Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create file upload widget with default values', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { FileUploadWidget } from '/src/modules/widgets/file-upload-widget.js';
        window.FileUploadWidget = FileUploadWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const FileUploadWidget = window.FileUploadWidget;
      const widgetData = {
        type: 'file',
        props: {
          label: 'Upload Photos',
          buttonText: 'Submit Photos'
        }
      };
      const widget = new FileUploadWidget(widgetData, 'fu-1');
      document.body.appendChild(widget.createElement());
    });

    const label = page.locator('.widget-file-upload-label');
    await expect(label).toHaveText('Upload Photos');

    const dropzone = page.locator('.widget-file-dropzone');
    await expect(dropzone).toBeVisible();

    const submitBtn = page.locator('.widget-file-upload-submit');
    await expect(submitBtn).toHaveText('Submit Photos');
    await expect(submitBtn).toBeDisabled(); // Disabled by default because no files selected
  });

  test('should handle file selection via input', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { FileUploadWidget } from '/src/modules/widgets/file-upload-widget.js';
        window.FileUploadWidget = FileUploadWidget;
      </script>
    `);

    await page.evaluate(() => {
       // @ts-ignore
      const FileUploadWidget = window.FileUploadWidget;
      const widgetData = {
        type: 'file',
        props: { maxFiles: 2 }
      };
      const widget = new FileUploadWidget(widgetData, 'fu-1');
      document.body.appendChild(widget.createElement());
    });

    const fileInput = page.locator('.widget-file-upload-input');
    
    // Playwright handle for file selection
    await fileInput.setInputFiles([
      { name: 'test1.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') },
      { name: 'test2.png', mimeType: 'image/png', buffer: Buffer.from('') }
    ]);

    const fileItems = page.locator('.widget-file-item');
    await expect(fileItems).toHaveCount(2);
    await expect(fileItems.nth(0)).toContainText('test1.txt');
    await expect(fileItems.nth(1)).toContainText('test2.png');

    const submitBtn = page.locator('.widget-file-upload-submit');
    await expect(submitBtn).toBeEnabled();
  });

  test('should handle file removal', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { FileUploadWidget } from '/src/modules/widgets/file-upload-widget.js';
        window.FileUploadWidget = FileUploadWidget;
      </script>
    `);

    await page.evaluate(() => {
       // @ts-ignore
      const FileUploadWidget = window.FileUploadWidget;
      const widget = new FileUploadWidget({ type: 'file' }, 'fu-1');
      document.body.appendChild(widget.createElement());
    });

    const fileInput = page.locator('.widget-file-upload-input');
    await fileInput.setInputFiles([{ name: 'to-remove.txt', mimeType: 'text/plain', buffer: Buffer.from('bye') }]);

    await expect(page.locator('.widget-file-item')).toHaveCount(1);
    
    await page.locator('.widget-file-remove').click();
    
    await expect(page.locator('.widget-file-item')).toHaveCount(0);
    await expect(page.locator('.widget-file-upload-submit')).toBeDisabled();
  });

  test('should handle upload interaction', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { FileUploadWidget } from '/src/modules/widgets/file-upload-widget.js';
        window.FileUploadWidget = FileUploadWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const FileUploadWidget = window.FileUploadWidget;
      const widget = new FileUploadWidget({ type: 'file' }, 'fu-1');
      const element = widget.createElement();
      document.body.appendChild(element);
      window.testWidgetElement = element;
      
      document.addEventListener('widgetInteraction', (e) => {
         window.lastInteraction = (e as CustomEvent).detail;
      });
    });

    const fileInput = page.locator('.widget-file-upload-input');
    await fileInput.setInputFiles([{ name: 'upload.txt', mimeType: 'text/plain', buffer: Buffer.from('data') }]);

    await page.locator('.widget-file-upload-submit').click();

    const interaction = await page.evaluate(() => window.lastInteraction);
    expect(interaction).toEqual({
      action: 'upload',
      files: [{ name: 'upload.txt', size: 4, type: 'text/plain' }],
      count: 1,
      totalSize: 4,
      widgetType: 'file',
      widgetId: 'fu-1'
    });
  });

  test('should trigger onFileSelect when files are added', async ({ page }) => {
     await page.setContent(`
      <script type="module">
        import { FileUploadWidget } from '/src/modules/widgets/file-upload-widget.js';
        window.FileUploadWidget = FileUploadWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const FileUploadWidget = window.FileUploadWidget;
      const widget = new FileUploadWidget({ 
        type: 'file',
        props: { onFileSelect: true }
      }, 'fu-1');
      const element = widget.createElement();
      document.body.appendChild(element);
      
      document.addEventListener('widgetInteraction', (e) => {
         window.lastInteraction = (e as CustomEvent).detail;
      });
    });

    const fileInput = page.locator('.widget-file-upload-input');
    await fileInput.setInputFiles([{ name: 'select.txt', mimeType: 'text/plain', buffer: Buffer.from('select') }]);

    const interaction = await page.evaluate(() => window.lastInteraction);
    expect(interaction).toEqual({
      action: 'fileSelect',
      files: [{ name: 'select.txt', size: 6, type: 'text/plain' }],
      widgetType: 'file',
      widgetId: 'fu-1'
    });
  });
});
