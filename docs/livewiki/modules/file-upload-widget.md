---
path: modules/file-upload-widget.md
page-type: module
summary: File upload widget with drag-drop, preview, progress tracking, and validation.
tags: [widget, upload, file, drag-drop, preview, validation]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# File Upload Widget

Advanced file upload component with drag-and-drop functionality, file preview, progress tracking, and comprehensive validation.

## Features

- **Drag & Drop**: Intuitive drag-and-drop file selection
- **File Preview**: Image and document preview capabilities
- **Progress Tracking**: Real-time upload progress indication
- **Validation**: File type, size, and count validation
- **Multiple Files**: Support for single or multiple file uploads
- **Custom Styling**: Flexible appearance customization

## Configuration

```javascript
{
  type: 'file-upload',
  config: {
    placeholder: 'Drop files here or click to browse',
    multiple: false,
    accept: '.jpg,.png,.pdf', // File extensions or MIME types
    maxSize: 5 * 1024 * 1024, // 5MB in bytes
    maxFiles: 1, // For multiple uploads
    showPreview: true,
    showProgress: true,
    autoUpload: false,
    validation: (files) => {
      // Custom validation logic
      return files.every(file => file.size <= 10 * 1024 * 1024);
    },
    onFileSelect: (files) => console.log('Files selected:', files),
    onUpload: (files) => console.log('Uploading:', files),
    onProgress: (progress) => console.log('Progress:', progress),
    onComplete: (result) => console.log('Upload complete:', result),
    onError: (error) => console.log('Upload error:', error)
  }
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placeholder` | string | 'Drop files here' | Drop zone placeholder text |
| `multiple` | boolean | false | Allow multiple file selection |
| `accept` | string | '' | Accepted file types |
| `maxSize` | number | 5242880 | Maximum file size in bytes |
| `maxFiles` | number | 1 | Maximum number of files |
| `showPreview` | boolean | true | Show file preview |
| `showProgress` | boolean | true | Show upload progress |
| `autoUpload` | boolean | false | Auto-upload on file selection |

## Methods

### getFiles()
Returns the selected files.

```javascript
const files = fileUploadWidget.getFiles();
console.log(files); // FileList or array of File objects
```

### setFiles(files)
Sets the selected files.

```javascript
fileUploadWidget.setFiles(fileList);
```

### clearFiles()
Clears all selected files.

```javascript
fileUploadWidget.clearFiles();
```

### upload()
Starts the upload process.

```javascript
fileUploadWidget.upload();
```

### cancelUpload()
Cancels the current upload.

```javascript
fileUploadWidget.cancelUpload();
```

### isUploading()
Returns whether an upload is in progress.

```javascript
const uploading = fileUploadWidget.isUploading();
console.log(uploading); // true
```

### getProgress()
Returns the current upload progress (0-100).

```javascript
const progress = fileUploadWidget.getProgress();
console.log(progress); // 75
```

## Events

### file-select
Fired when files are selected.

```javascript
window.addEventListener('chatwidget:file-upload:file-select', (e) => {
  const { widgetId, files } = e.detail;
  console.log(`Files selected for ${widgetId}:`, files);
});
```

### upload-start
Fired when upload starts.

```javascript
window.addEventListener('chatwidget:file-upload:upload-start', (e) => {
  const { widgetId, files } = e.detail;
  console.log(`Upload started for ${widgetId}:`, files);
});
```

### progress
Fired during upload progress.

```javascript
window.addEventListener('chatwidget:file-upload:progress', (e) => {
  const { widgetId, progress, bytesLoaded, bytesTotal } = e.detail;
  console.log(`Upload progress for ${widgetId}: ${progress}%`);
});
```

### complete
Fired when upload completes successfully.

```javascript
window.addEventListener('chatwidget:file-upload:complete', (e) => {
  const { widgetId, result, files } = e.detail;
  console.log(`Upload complete for ${widgetId}:`, result);
});
```

### error
Fired when upload encounters an error.

```javascript
window.addEventListener('chatwidget:file-upload:error', (e) => {
  const { widgetId, error, files } = e.detail;
  console.log(`Upload error for ${widgetId}:`, error);
});
```

## File Validation

### Built-in Validation
- **File Size**: Checks against `maxSize` limit
- **File Type**: Validates against `accept` attribute
- **File Count**: Enforces `maxFiles` limit for multiple uploads

### Custom Validation
```javascript
{
  type: 'file-upload',
  config: {
    validation: (files) => {
      // Custom validation rules
      const validFiles = files.filter(file => {
        // Check file name pattern
        const validName = /^[a-zA-Z0-9._-]+$/.test(file.name);
        // Check file dimensions for images
        if (file.type.startsWith('image/')) {
          return validateImageDimensions(file);
        }
        return validName;
      });
      
      return validFiles.length === files.length;
    }
  }
}
```

## File Preview

### Image Preview
```javascript
{
  type: 'file-upload',
  config: {
    showPreview: true,
    previewOptions: {
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.8
    }
  }
}
```

### Document Preview
```javascript
{
  type: 'file-upload',
  config: {
    showPreview: true,
    previewOptions: {
      showFileInfo: true,
      showFileIcon: true
    }
  }
}
```

## Styling

The file upload widget uses CSS custom properties:

```css
.chatui-file-upload {
  --upload-bg: #f8f9fa;
  --upload-border: #dee2e6;
  --upload-border-dragover: #007bff;
  --upload-text: #495057;
  --upload-padding: 32px;
  --upload-border-radius: 8px;
  --upload-min-height: 120px;
}

.chatui-file-preview {
  --preview-bg: #ffffff;
  --preview-border: #dee2e6;
  --preview-shadow: 0 2px 8px rgba(0,0,0,0.1);
  --preview-margin: 8px;
  --preview-border-radius: 4px;
}

.chatui-progress-bar {
  --progress-bg: #e9ecef;
  --progress-fill: #007bff;
  --progress-height: 4px;
  --progress-border-radius: 2px;
}
```

## Accessibility

- **ARIA Attributes**: `aria-label`, `aria-describedby`, `aria-busy`
- **Keyboard Navigation**: Tab, Enter, Space, Escape
- **Screen Reader**: Announces file selection and upload status
- **High Contrast**: Supports high contrast mode
- **Focus Management**: Proper focus handling for drop zone

## Examples

### Basic File Upload
```javascript
{
  type: 'file-upload',
  config: {
    placeholder: 'Choose a file to upload',
    accept: '.jpg,.png,.gif',
    maxSize: 2 * 1024 * 1024, // 2MB
    onFileSelect: (files) => {
      console.log('File selected:', files[0].name);
    }
  }
}
```

### Multiple File Upload
```javascript
{
  type: 'file-upload',
  config: {
    placeholder: 'Drop multiple files here',
    multiple: true,
    maxFiles: 5,
    accept: 'image/*,.pdf,.doc,.docx',
    showPreview: true,
    autoUpload: true,
    onUpload: (files) => {
      uploadFiles(files);
    }
  }
}
```

### Image Upload with Preview
```javascript
{
  type: 'file-upload',
  config: {
    placeholder: 'Upload profile picture',
    accept: 'image/*',
    maxSize: 1024 * 1024, // 1MB
    showPreview: true,
    previewOptions: {
      maxWidth: 150,
      maxHeight: 150,
      crop: true
    },
    onComplete: (result) => {
      updateProfilePicture(result.url);
    }
  }
}
```

### Document Upload
```javascript
{
  type: 'file-upload',
  config: {
    placeholder: 'Upload documents',
    accept: '.pdf,.doc,.docx,.txt',
    multiple: true,
    maxFiles: 10,
    showPreview: true,
    validation: (files) => {
      return files.every(file => file.size <= 10 * 1024 * 1024); // 10MB each
    },
    onProgress: (progress) => {
      updateProgressBar(progress);
    }
  }
}
```

## Integration

### Programmatic Creation
```javascript
const fileUpload = chat.addWidget('file-upload', {
  placeholder: 'Upload your resume',
  accept: '.pdf,.doc,.docx',
  maxSize: 5 * 1024 * 1024,
  onFileSelect: (files) => {
    validateResume(files[0]);
  },
  onComplete: (result) => {
    showUploadSuccess(result);
  }
});
```

### Custom Upload Handler
```javascript
{
  type: 'file-upload',
  config: {
    autoUpload: false,
    onUpload: async (files) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        return await response.json();
      } catch (error) {
        throw new Error('Upload failed');
      }
    }
  }
}
```

### Event Handling
```javascript
window.addEventListener('chatwidget:file-upload:progress', (e) => {
  const { progress } = e.detail;
  // Update global progress indicator
  updateGlobalProgress(progress);
});

window.addEventListener('chatwidget:file-upload:complete', (e) => {
  const { result } = e.detail;
  // Handle successful upload
  showSuccessMessage('Files uploaded successfully!');
});
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Mobile**: Touch-friendly with camera access
- **Legacy**: Basic functionality with polyfills

## Performance Considerations

- **File Reading**: Efficient file reading with chunking for large files
- **Preview Generation**: Optimized image preview generation
- **Memory Management**: Proper cleanup of file references
- **Upload Optimization**: Chunked uploads for large files

## Security Considerations

- **File Type Validation**: Server-side validation of file types
- **Size Limits**: Enforce size limits on both client and server
- **Malicious Files**: Scan for malicious file content
- **XSS Prevention**: Proper sanitization of file names

## See Also

- [Input Widget](input-widget.md) - Text input component
- [Button Widget](button-widget.md) - Interactive button component
- [Progress Widget](progress-widget.md) - Progress display component
