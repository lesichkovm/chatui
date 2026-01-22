import { BaseWidget } from './base-widget.js';

/**
 * Confirmation Widget (Composable)
 * A standalone confirmation dialog widget with confirm/cancel actions
 * Can be used in containers or standalone
 */
export class ConfirmationWidget extends BaseWidget {
  /**
   * Create the DOM element for the confirmation widget
   * @returns {HTMLElement|Comment} Confirmation container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid confirmation widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-confirmation-container';
    
    const props = this.widgetData.props || {};
    const message = props.message || 'Are you sure?';
    const confirmText = props.confirmText || 'Confirm';
    const cancelText = props.cancelText || 'Cancel';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    const layout = props.layout || 'horizontal';
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'widget-confirmation-message';
    messageElement.textContent = message;
    messageElement.classList.add(`variant-${variant}`);
    messageElement.classList.add(`size-${size}`);
    
    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'widget-confirmation-buttons';
    
    // Apply layout to buttons
    if (layout === 'horizontal') {
      buttonsContainer.style.display = 'flex';
      buttonsContainer.style.gap = '12px';
      buttonsContainer.style.justifyContent = 'center';
    } else {
      buttonsContainer.style.display = 'flex';
      buttonsContainer.style.flexDirection = 'column';
      buttonsContainer.style.gap = '8px';
    }
    
    // Create cancel button
    const cancelButton = document.createElement('button');
    cancelButton.className = 'widget-confirmation-cancel';
    cancelButton.textContent = cancelText;
    cancelButton.classList.add('variant-secondary');
    cancelButton.classList.add(`size-${size}`);
    
    if (props.disabled) {
      cancelButton.disabled = true;
      cancelButton.classList.add('widget-confirmation-disabled');
    }
    
    // Create confirm button
    const confirmButton = document.createElement('button');
    confirmButton.className = 'widget-confirmation-confirm';
    confirmButton.textContent = confirmText;
    confirmButton.classList.add(`variant-${variant}`);
    confirmButton.classList.add(`size-${size}`);
    
    if (props.disabled) {
      confirmButton.disabled = true;
      confirmButton.classList.add('widget-confirmation-disabled');
    }
    
    // Handle cancel action
    const handleCancel = () => {
      if (!cancelButton.disabled && !confirmButton.disabled) {
        // Disable both buttons if specified
        if (props.disableOnAction !== false) {
          cancelButton.disabled = true;
          cancelButton.classList.add('widget-confirmation-disabled');
          confirmButton.disabled = true;
          confirmButton.classList.add('widget-confirmation-disabled');
        }
        
        this.handleInteraction({
          action: 'cancel',
          confirmed: false,
          message: message,
          widgetType: 'confirmation'
        });
      }
    };
    
    // Handle confirm action
    const handleConfirm = () => {
      if (!confirmButton.disabled && !cancelButton.disabled) {
        // Disable both buttons if specified
        if (props.disableOnAction !== false) {
          cancelButton.disabled = true;
          cancelButton.classList.add('widget-confirmation-disabled');
          confirmButton.disabled = true;
          confirmButton.classList.add('widget-confirmation-disabled');
        }
        
        this.handleInteraction({
          action: 'confirm',
          confirmed: true,
          message: message,
          widgetType: 'confirmation'
        });
      }
    };
    
    // Add event listeners
    cancelButton.addEventListener('click', handleCancel);
    confirmButton.addEventListener('click', handleConfirm);
    
    // Add keyboard support
    container.addEventListener('keydown', (e) => {
      if (props.disabled) return;
      
      if (e.key === 'Escape') {
        handleCancel();
      } else if (e.key === 'Enter') {
        handleConfirm();
      }
    });
    
    // Apply custom styles if provided
    if (props.messageStyle) {
      Object.assign(messageElement.style, props.messageStyle);
    }
    
    if (props.buttonsStyle) {
      Object.assign(buttonsContainer.style, props.buttonsStyle);
    }
    
    if (props.cancelStyle) {
      Object.assign(cancelButton.style, props.cancelStyle);
    }
    
    if (props.confirmStyle) {
      Object.assign(confirmButton.style, props.confirmStyle);
    }
    
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    // Assemble the widget
    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(confirmButton);
    
    container.appendChild(messageElement);
    container.appendChild(buttonsContainer);
    
    return container;
  }

  /**
   * Validate confirmation widget data structure
   * @returns {boolean} True if data contains required properties for confirmation widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'confirmation';
  }
}
