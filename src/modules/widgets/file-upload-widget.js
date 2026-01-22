import { BaseWidget } from './base-widget.js';

/**
 * File Upload Widget (Composable)
 * A standalone file upload widget with drag-and-drop support
 * Can be used in containers or standalone
 */
export class FileUploadWidget extends BaseWidget {
  /**
   * Create the DOM element for the file upload widget
   * @returns {HTMLElement|Comment} File upload container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid file upload widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-file-upload-container';
    
    const props = this.widgetData.props || {};
    const label = props.label || 'Upload a file';
    const buttonText = props.buttonText || 'Upload';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    const maxFiles = props.maxFiles || 1;
    const maxSize = props.maxSize || 10 * 1024 * 1024;
    const accept = props.accept || '';
    const showSubmitButton = props.showSubmitButton !== false; // Default to true for backward compatibility
    
    let selectedFiles = [];
    
    // Create label
    const labelElement = document.createElement('label');
    labelElement.className = 'widget-file-upload-label';
    labelElement.textContent = label;
    labelElement.classList.add(`variant-${variant}`);
    labelElement.classList.add(`size-${size}`);
    
    // Create drop zone
    const dropZone = document.createElement('div');
    dropZone.className = 'widget-file-dropzone';
    dropZone.classList.add(`variant-${variant}`);
    dropZone.classList.add(`size-${size}`);
    
    // Create drop zone content
    const dropZoneContent = document.createElement('div');
    dropZoneContent.className = 'widget-file-dropzone-content';
    dropZoneContent.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
      <p>Drag and drop files here or click to select</p>
    `;
    
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.className = 'widget-file-upload-input';
    fileInput.style.display = 'none';
    
    if (accept) {
      fileInput.accept = accept;
    }
    
    if (maxFiles > 1) {
      fileInput.multiple = true;
    }
    
    // Create file list
    const fileList = document.createElement('div');
    fileList.className = 'widget-file-list';
    
    // Format file size utility
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };
    
    // Render files function
    const renderFiles = () => {
      fileList.innerHTML = '';
      selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'widget-file-item';
        fileItem.classList.add(`variant-${variant}`);
        fileItem.classList.add(`size-${size}`);
        
        const fileName = document.createElement('span');
        fileName.className = 'widget-file-name';
        fileName.textContent = file.name;
        
        const fileSize = document.createElement('span');
        fileSize.className = 'widget-file-size';
        fileSize.textContent = formatFileSize(file.size);
        
        const removeButton = document.createElement('button');
        removeButton.className = 'widget-file-remove';
        removeButton.textContent = '×';
        removeButton.addEventListener('click', () => {
          if (!props.disabled) {
            selectedFiles.splice(index, 1);
            renderFiles();
            updateSubmitButton();
          }
        });
        
        fileItem.appendChild(fileName);
        fileItem.appendChild(fileSize);
        fileItem.appendChild(removeButton);
        fileList.appendChild(fileItem);
      });
    };
    
    // Add files function
    const addFiles = (files) => {
      const newFiles = [];
      
      files.forEach(file => {
        if (selectedFiles.length >= maxFiles) return;
        if (file.size > maxSize) {
          alert(`File ${file.name} exceeds maximum size of ${formatFileSize(maxSize)}`);
          return;
        }
        if (!selectedFiles.some(f => f.name === file.name)) {
          selectedFiles.push(file);
          newFiles.push(file);
        }
      });
      
      renderFiles();
      updateSubmitButton();
      
      // Trigger file selection event if needed
      if (newFiles.length > 0 && props.onFileSelect) {
        const fileData = newFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }));
        
        this.handleInteraction({
          action: 'fileSelect',
          files: fileData,
          widgetType: 'file'
        });
      }
    };
    
    // Update submit button state
    const updateSubmitButton = () => {
      if (submitButton) {
        submitButton.disabled = props.disabled || selectedFiles.length === 0;
        submitButton.classList.toggle('widget-file-upload-disabled', submitButton.disabled);
      }
    };
    
    // Event listeners
    dropZone.addEventListener('click', () => {
      if (!props.disabled) {
        fileInput.click();
      }
    });
    
    dropZone.addEventListener('dragover', (e) => {
      if (!props.disabled) {
        e.preventDefault();
        dropZone.classList.add('widget-file-dropzone-active');
      }
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('widget-file-dropzone-active');
    });
    
    dropZone.addEventListener('drop', (e) => {
      if (!props.disabled) {
        e.preventDefault();
        dropZone.classList.remove('widget-file-dropzone-active');
        
        const files = Array.from(e.dataTransfer.files);
        addFiles(files);
      }
    });
    
    fileInput.addEventListener('change', () => {
      const files = Array.from(fileInput.files);
      addFiles(files);
      fileInput.value = '';
    });
    
    // Create submit button conditionally
    let submitButton = null;
    if (showSubmitButton) {
      submitButton = document.createElement('button');
      submitButton.className = 'widget-file-upload-submit';
      submitButton.textContent = buttonText;
      submitButton.classList.add(`variant-${variant}`);
      submitButton.classList.add(`size-${size}`);
      
      if (props.disabled) {
        submitButton.disabled = true;
        submitButton.classList.add('widget-file-upload-disabled');
      }
    }
    
    // Handle submission
    const handleSubmit = () => {
      if ((!submitButton || !submitButton.disabled) && selectedFiles.length > 0) {
        const fileData = selectedFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }));
        
        // Disable drop zone and submit button if specified
        if (props.disableOnSubmit !== false) {
          dropZone.classList.add('widget-file-upload-disabled');
          if (submitButton) {
            submitButton.disabled = true;
            submitButton.classList.add('widget-file-upload-disabled');
          }
        }
        
        this.handleInteraction({
          action: 'upload',
          files: fileData,
          count: selectedFiles.length,
          totalSize: selectedFiles.reduce((sum, file) => sum + file.size, 0),
          widgetType: 'file'
        });
      }
    };
    
    if (submitButton) {
      submitButton.addEventListener('click', handleSubmit);
    }
    
    // Apply custom styles if provided
    if (props.dropzoneStyle) {
      Object.assign(dropZone.style, props.dropzoneStyle);
    }
    
    if (props.fileListStyle) {
      Object.assign(fileList.style, props.fileListStyle);
    }
    
    if (props.buttonStyle && submitButton) {
      Object.assign(submitButton.style, props.buttonStyle);
    }
    
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    // Assemble the widget
    dropZone.appendChild(dropZoneContent);
    
    container.appendChild(labelElement);
    container.appendChild(dropZone);
    container.appendChild(fileList);
    if (submitButton) {
      container.appendChild(submitButton);
    }
    container.appendChild(fileInput);
    
    // Initial state
    updateSubmitButton();
    
    return container;
  }

  /**
   * Validate file upload widget data structure
   * @returns {boolean} True if data contains required properties for file upload widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'file';
  }

  /**
   * Get the current value of the file upload widget
   * @returns {Array} Array of selected file objects
   */
  getValue() {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      // This would need to be stored in the widget instance for proper access
      // For now, return empty array - actual implementation would track selected files
      return [];
    }
    return [];
  }

  /**
   * Set the value of the file upload widget
   * @param {Array} files - Array of file objects to set
   */
  setValue(files) {
    // File input values cannot be set programmatically for security reasons
    // This method would typically update the file list display
    console.warn('FileUploadWidget values cannot be set programmatically for security reasons');
  }
}
