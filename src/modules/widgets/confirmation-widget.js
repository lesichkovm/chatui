import { BaseWidget } from './base-widget.js';

/**
 * Confirmation Widget
 * Renders a confirm/cancel action dialog
 * Extends BaseWidget to provide confirmation-based interaction
 */
export class ConfirmationWidget extends BaseWidget {
  /**
   * Create the DOM element for the confirmation widget
   * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid confirmation widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === 'confirmation') {
      const confirmationContainer = document.createElement("div");
      confirmationContainer.className = "widget-confirmation";
      
      const message = document.createElement("div");
      message.className = "widget-confirmation-message";
      message.textContent = this.widgetData.message || 'Are you sure?';
      
      const buttonsContainer = document.createElement("div");
      buttonsContainer.className = "widget-confirmation-buttons";
      
      const cancelButton = document.createElement("button");
      cancelButton.className = "widget-confirmation-cancel";
      cancelButton.textContent = this.widgetData.cancelText || 'Cancel';
      
      const confirmButton = document.createElement("button");
      confirmButton.className = "widget-confirmation-confirm";
      confirmButton.textContent = this.widgetData.confirmText || 'Confirm';
      
      const handleCancel = () => {
        cancelButton.disabled = true;
        cancelButton.classList.add('widget-confirmation-disabled');
        confirmButton.disabled = true;
        confirmButton.classList.add('widget-confirmation-disabled');
        
        this.handleInteraction({
          optionId: 'confirmation-cancel',
          optionValue: false,
          optionText: 'cancelled',
          widgetType: 'confirmation'
        });
      };
      
      const handleConfirm = () => {
        cancelButton.disabled = true;
        cancelButton.classList.add('widget-confirmation-disabled');
        confirmButton.disabled = true;
        confirmButton.classList.add('widget-confirmation-disabled');
        
        this.handleInteraction({
          optionId: 'confirmation-confirm',
          optionValue: true,
          optionText: 'confirmed',
          widgetType: 'confirmation'
        });
      };
      
      cancelButton.addEventListener("click", handleCancel);
      confirmButton.addEventListener("click", handleConfirm);
      
      buttonsContainer.appendChild(cancelButton);
      buttonsContainer.appendChild(confirmButton);
      confirmationContainer.appendChild(message);
      confirmationContainer.appendChild(buttonsContainer);
      widgetContainer.appendChild(confirmationContainer);
    }
    
    return widgetContainer;
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === 'confirmation' &&
           this.widgetData.message;
  }
}
