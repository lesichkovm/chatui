import { BaseWidget } from './base-widget.js';

/**
 * Tags Widget (Composable)
 * A standalone tag input widget with autocomplete and suggestions
 * Can be used in containers or standalone
 */
export class TagsWidget extends BaseWidget {
  /**
   * Create the DOM element for the tags widget
   * @returns {HTMLElement|Comment} Tags container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid tags widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-tags-container';
    
    const props = this.widgetData.props || {};
    const label = props.label || 'Add tags';
    const buttonText = props.buttonText || 'Submit';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    const placeholder = props.placeholder || 'Type and press Enter to add tag';
    const maxTags = props.maxTags || 10;
    const suggestions = props.suggestions || [];
    let tags = [...(props.initialTags || [])];
    const showSubmitButton = props.showSubmitButton !== false; // Default to true for backward compatibility
    
    // Create label
    const labelElement = document.createElement('label');
    labelElement.className = 'widget-tags-label';
    labelElement.textContent = label;
    labelElement.classList.add(`variant-${variant}`);
    labelElement.classList.add(`size-${size}`);
    
    // Create input wrapper
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'widget-tags-input-wrapper';
    
    // Create tags display
    const tagsDisplay = document.createElement('div');
    tagsDisplay.className = 'widget-tags-display';
    
    // Create input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'widget-tags-input';
    input.placeholder = placeholder;
    
    // Apply variant and size classes
    input.classList.add(`variant-${variant}`);
    input.classList.add(`size-${size}`);
    
    // Set disabled state
    if (props.disabled) {
      input.disabled = true;
      input.classList.add('widget-tags-disabled');
    }
    
    // Create suggestions list
    const suggestionsList = document.createElement('ul');
    suggestionsList.className = 'widget-tags-suggestions';
    suggestionsList.style.display = 'none';
    
    // Update submit button state
    const updateSubmitButton = () => {
      if (submitButton) {
        submitButton.disabled = props.disabled || tags.length === 0;
        submitButton.classList.toggle('widget-tags-disabled', submitButton.disabled);
      }
    };
    
    // Render tags function with submit button update
    const renderTags = () => {
      tagsDisplay.innerHTML = '';
      tags.forEach((tag, index) => {
        const tagElement = document.createElement('span');
        tagElement.className = 'widget-tag';
        tagElement.classList.add(`variant-${variant}`);
        tagElement.classList.add(`size-${size}`);
        tagElement.textContent = tag;
        
        const removeButton = document.createElement('button');
        removeButton.className = 'widget-tag-remove';
        removeButton.textContent = '×';
        removeButton.addEventListener('click', () => {
          if (!props.disabled) {
            tags.splice(index, 1);
            renderTags();
          }
        });
        
        tagElement.appendChild(removeButton);
        tagsDisplay.appendChild(tagElement);
      });
      
      // Update input placeholder based on remaining capacity
      if (tags.length >= maxTags) {
        input.placeholder = 'Maximum tags reached';
        input.disabled = true;
      } else if (!props.disabled) {
        input.disabled = false;
        input.placeholder = placeholder;
      }
      
      // Update submit button state
      updateSubmitButton();
    };
    
    // Show suggestions function
    const showSuggestions = (query) => {
      if (!suggestions.length || !query || props.disabled) {
        suggestionsList.style.display = 'none';
        return;
      }
      
      const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(query.toLowerCase()) && 
        !tags.includes(s) &&
        tags.length < maxTags
      );
      
      if (filtered.length > 0) {
        suggestionsList.innerHTML = '';
        filtered.forEach(suggestion => {
          const li = document.createElement('li');
          li.className = 'widget-tags-suggestion';
          li.textContent = suggestion;
          li.addEventListener('click', () => {
            if (tags.length < maxTags && !props.disabled) {
              tags.push(suggestion);
              renderTags();
              input.value = '';
              suggestionsList.style.display = 'none';
            }
          });
          suggestionsList.appendChild(li);
        });
        suggestionsList.style.display = 'block';
      } else {
        suggestionsList.style.display = 'none';
      }
    };
    
    // Add event listeners
    input.addEventListener('input', () => {
      showSuggestions(input.value);
    });
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = input.value.trim();
        if (value && tags.length < maxTags && !tags.includes(value) && !props.disabled) {
          tags.push(value);
          renderTags();
          input.value = '';
          suggestionsList.style.display = 'none';
        }
      } else if (e.key === 'Backspace' && !input.value && tags.length > 0 && !props.disabled) {
        tags.pop();
        renderTags();
      } else if (e.key === 'Escape') {
        suggestionsList.style.display = 'none';
        input.value = '';
      }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!inputWrapper.contains(e.target)) {
        suggestionsList.style.display = 'none';
      }
    });
    
    // Create submit button conditionally
    let submitButton = null;
    if (showSubmitButton) {
      submitButton = document.createElement('button');
      submitButton.className = 'widget-tags-submit';
      submitButton.textContent = buttonText;
      submitButton.classList.add(`variant-${variant}`);
      submitButton.classList.add(`size-${size}`);
      
      if (props.disabled || tags.length === 0) {
        submitButton.disabled = true;
        submitButton.classList.add('widget-tags-disabled');
      }
    }
    
    // Handle submission
    const handleSubmit = () => {
      if ((!submitButton || !submitButton.disabled) && tags.length > 0) {
        // Disable input and submit button if specified
        if (props.disableOnSubmit !== false) {
          input.disabled = true;
          input.classList.add('widget-tags-disabled');
          if (submitButton) {
            submitButton.disabled = true;
            submitButton.classList.add('widget-tags-disabled');
          }
        }
        
        this.handleInteraction({
          tags: tags,
          count: tags.length,
          joinedTags: tags.join(', '),
          widgetType: 'tags'
        });
      }
    };
    
    // Add event listener
    if (submitButton) {
      submitButton.addEventListener('click', handleSubmit);
    }
    
    // Apply custom styles if provided
    if (props.inputStyle) {
      Object.assign(input.style, props.inputStyle);
    }
    
    if (props.tagsStyle) {
      Object.assign(tagsDisplay.style, props.tagsStyle);
    }
    
    if (props.buttonStyle && submitButton) {
      Object.assign(submitButton.style, props.buttonStyle);
    }
    
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    // Assemble the widget
    inputWrapper.appendChild(tagsDisplay);
    inputWrapper.appendChild(input);
    inputWrapper.appendChild(suggestionsList);
    
    container.appendChild(labelElement);
    container.appendChild(inputWrapper);
    if (submitButton) {
      container.appendChild(submitButton);
    }
    
    // Initial render
    renderTags();
    
    return container;
  }

  /**
   * Validate tags widget data structure
   * @returns {boolean} True if data contains required properties for tags widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'tags';
  }

  /**
   * Get the current value of the tags widget
   * @returns {Array} Array of tag strings
   */
  getValue() {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const tagElements = container.querySelectorAll('.widget-tag');
      const tags = [];
      tagElements.forEach(tagElement => {
        // Get text content excluding the remove button
        const text = tagElement.textContent.replace('×', '').trim();
        if (text) {
          tags.push(text);
        }
      });
      return tags;
    }
    return [];
  }

  /**
   * Set the value of the tags widget
   * @param {Array} value - Array of tag strings to set
   */
  setValue(value) {
    // This would require re-implementing the tag rendering logic
    // For now, just log a warning as this is complex to implement without full context
    console.warn('TagsWidget.setValue() requires full re-rendering implementation');
  }
}
