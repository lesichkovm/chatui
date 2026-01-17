import { BaseWidget } from './base-widget.js';

/**
 * File Upload Widget
 * Renders a file upload with drag-and-drop support
 */
export class FileUploadWidget extends BaseWidget {
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid file upload widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === 'file') {
      const uploadContainer = document.createElement("div");
      uploadContainer.className = "widget-file-upload";
      
      const label = document.createElement("label");
      label.className = "widget-file-label";
      label.textContent = this.widgetData.label || 'Upload a file';
      
      const dropZone = document.createElement("div");
      dropZone.className = "widget-file-dropzone";
      
      const dropZoneContent = document.createElement("div");
      dropZoneContent.className = "widget-file-dropzone-content";
      dropZoneContent.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <p>Drag and drop files here or click to select</p>
      `;
      
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.className = "widget-file-input";
      fileInput.setAttribute("data-widget-id", this.widgetId);
      fileInput.style.display = 'none';
      
      if (this.widgetData.accept) {
        fileInput.accept = this.widgetData.accept;
      }
      
      if (this.widgetData.maxFiles) {
        fileInput.multiple = this.widgetData.maxFiles > 1;
      }
      
      const fileList = document.createElement("div");
      fileList.className = "widget-file-list";
      
      let selectedFiles = [];
      const maxFiles = this.widgetData.maxFiles || 1;
      const maxSize = this.widgetData.maxSize || 10 * 1024 * 1024;
      
      const renderFiles = () => {
        fileList.innerHTML = '';
        selectedFiles.forEach((file, index) => {
          const fileItem = document.createElement("div");
          fileItem.className = "widget-file-item";
          
          const fileName = document.createElement("span");
          fileName.className = "widget-file-name";
          fileName.textContent = file.name;
          
          const fileSize = document.createElement("span");
          fileSize.className = "widget-file-size";
          fileSize.textContent = this.formatFileSize(file.size);
          
          const removeButton = document.createElement("button");
          removeButton.className = "widget-file-remove";
          removeButton.textContent = '×';
          removeButton.addEventListener("click", () => {
            selectedFiles.splice(index, 1);
            renderFiles();
          });
          
          fileItem.appendChild(fileName);
          fileItem.appendChild(fileSize);
          fileItem.appendChild(removeButton);
          fileList.appendChild(fileItem);
        });
      };
      
      dropZone.addEventListener("click", () => {
        fileInput.click();
      });
      
      dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add('widget-file-dropzone-active');
      });
      
      dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove('widget-file-dropzone-active');
      });
      
      dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove('widget-file-dropzone-active');
        
        const files = Array.from(e.dataTransfer.files);
        this.addFiles(files);
      });
      
      fileInput.addEventListener("change", () => {
        const files = Array.from(fileInput.files);
        this.addFiles(files);
        fileInput.value = '';
      });
      
      this.addFiles = (files) => {
        files.forEach(file => {
          if (selectedFiles.length >= maxFiles) return;
          if (file.size > maxSize) {
            alert(`File ${file.name} exceeds maximum size of ${this.formatFileSize(maxSize)}`);
            return;
          }
          if (!selectedFiles.some(f => f.name === file.name)) {
            selectedFiles.push(file);
          }
        });
        renderFiles();
      };
      
      const submitButton = document.createElement("button");
      submitButton.className = "widget-file-submit";
      submitButton.textContent = this.widgetData.buttonText || 'Upload';
      
      const handleSubmit = () => {
        if (selectedFiles.length > 0) {
          const fileData = selectedFiles.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
          }));
          
          dropZone.classList.add('widget-file-disabled');
          submitButton.disabled = true;
          submitButton.classList.add('widget-file-disabled');
          
          this.handleInteraction({
            optionId: 'file-upload',
            optionValue: fileData,
            optionText: `${selectedFiles.length} file(s)`,
            widgetType: 'file'
          });
        }
      };
      
      submitButton.addEventListener("click", handleSubmit);
      
      dropZone.appendChild(dropZoneContent);
      uploadContainer.appendChild(label);
      uploadContainer.appendChild(dropZone);
      uploadContainer.appendChild(fileList);
      uploadContainer.appendChild(submitButton);
      uploadContainer.appendChild(fileInput);
      widgetContainer.appendChild(uploadContainer);
    }
    
    return widgetContainer;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === 'file';
  }
}
