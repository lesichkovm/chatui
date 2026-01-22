import { BaseWidget } from './base-widget.js';
import { sanitizeHTML, sanitizeStyleProps } from '../../utils/security.js';

/**
 * List Widget
 * Renders dynamic lists with various item types and layouts
 * Extends BaseWidget to provide list-based data display
 */
export class ListWidget extends BaseWidget {
  /**
   * Create the DOM element for the list widget
   * @returns {HTMLElement|Comment} List container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid list widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-list-container';
    
    const props = this.widgetData.props || {};
    const items = props.items || [];
    const itemTemplate = props.itemTemplate;
    const layout = props.layout || 'vertical';
    const variant = props.variant || 'default';
    const size = props.size || 'medium';
    const selectable = props.selectable || false;
    const multiSelect = props.multiSelect || false;
    
    // Apply variant and size classes
    container.classList.add(`variant-${variant}`);
    container.classList.add(`size-${size}`);
    container.classList.add(`layout-${layout}`);
    
    // Create list header if provided
    let headerElement = null;
    if (props.header) {
      headerElement = document.createElement('div');
      headerElement.className = 'widget-list-header';
      headerElement.textContent = props.header;
      container.appendChild(headerElement);
    }
    
    // Create list content
    const listContent = document.createElement('div');
    listContent.className = 'widget-list-content';
    
    // Apply layout styles
    this.applyLayoutStyles(listContent, layout);
    
    // Track selected items
    this.selectedItems = new Set();
    
    // Render items
    this.renderItems(listContent, items, itemTemplate, selectable, multiSelect);
    
    // Create list footer if provided
    let footerElement = null;
    if (props.footer) {
      footerElement = document.createElement('div');
      footerElement.className = 'widget-list-footer';
      footerElement.textContent = props.footer;
      container.appendChild(footerElement);
    }
    
    // Create action buttons if provided
    let actionsContainer = null;
    if (props.actions && props.actions.length > 0) {
      actionsContainer = document.createElement('div');
      actionsContainer.className = 'widget-list-actions';
      
      props.actions.forEach(action => {
        const button = document.createElement('button');
        button.className = 'widget-list-action';
        button.textContent = action.text;
        button.classList.add(`variant-${action.variant || 'primary'}`);
        button.classList.add(`size-${action.size || size}`);
        
        button.addEventListener('click', () => {
          this.handleAction(action, this.getSelectedItems());
        });
        
        actionsContainer.appendChild(button);
      });
    }
    
    // Apply custom styles
    if (props.style) {
      const sanitizedStyle = sanitizeStyleProps(props.style);
      Object.assign(container.style, sanitizedStyle);
    }
    
    if (props.contentStyle) {
      const sanitizedContentStyle = sanitizeStyleProps(props.contentStyle);
      Object.assign(listContent.style, sanitizedContentStyle);
    }
    
    // Assemble the widget
    if (headerElement) container.appendChild(headerElement);
    container.appendChild(listContent);
    if (footerElement) container.appendChild(footerElement);
    if (actionsContainer) container.appendChild(actionsContainer);
    
    return container;
  }

  /**
   * Apply layout styles to list content
   * @param {HTMLElement} content - List content element
   * @param {string} layout - Layout type
   */
  applyLayoutStyles(content, layout) {
    switch (layout) {
      case 'vertical':
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '8px';
        break;
      
      case 'horizontal':
        content.style.display = 'flex';
        content.style.flexDirection = 'row';
        content.style.flexWrap = 'wrap';
        content.style.gap = '12px';
        break;
      
      case 'grid':
        content.style.display = 'grid';
        content.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        content.style.gap = '16px';
        break;
      
      case 'masonry':
        content.style.display = 'flex';
        content.style.flexWrap = 'wrap';
        content.style.alignContent = 'flex-start';
        content.style.gap = '16px';
        break;
      
      default:
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '8px';
    }
  }

  /**
   * Render list items
   * @param {HTMLElement} container - Container to render into
   * @param {Array} items - Items to render
   * @param {Object} itemTemplate - Item template configuration
   * @param {boolean} selectable - Whether items are selectable
   * @param {boolean} multiSelect - Whether multiple items can be selected
   */
  renderItems(container, items, itemTemplate, selectable, multiSelect) {
    // Clear existing items
    container.innerHTML = '';
    
    items.forEach((item, index) => {
      const itemElement = this.createItemElement(item, index, itemTemplate, selectable, multiSelect);
      container.appendChild(itemElement);
    });
  }

  /**
   * Create individual list item element
   * @param {*} item - Item data
   * @param {number} index - Item index
   * @param {Object} itemTemplate - Item template configuration
   * @param {boolean} selectable - Whether item is selectable
   * @param {boolean} multiSelect - Whether multiple selection is allowed
   * @returns {HTMLElement} Item element
   */
  createItemElement(item, index, itemTemplate, selectable, multiSelect) {
    const itemElement = document.createElement('div');
    itemElement.className = 'widget-list-item';
    itemElement.setAttribute('data-item-index', index);
    
    // Create item content based on template
    const content = this.renderItemContent(item, itemTemplate);
    itemElement.appendChild(content);
    
    // Add selection handling
    if (selectable) {
      itemElement.classList.add('selectable');
      
      itemElement.addEventListener('click', () => {
        this.handleItemSelection(itemElement, item, index, multiSelect);
      });
      
      // Add checkbox for multi-select
      if (multiSelect) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'widget-list-item-checkbox';
        checkbox.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleItemSelection(itemElement, item, index, multiSelect);
        });
        itemElement.insertBefore(checkbox, itemElement.firstChild);
      }
    }
    
    return itemElement;
  }

  /**
   * Render item content based on template
   * @param {*} item - Item data
   * @param {Object} template - Item template configuration
   * @returns {HTMLElement} Content element
   */
  renderItemContent(item, template) {
    const content = document.createElement('div');
    content.className = 'widget-list-item-content';
    
    if (!template) {
      // Default rendering
      content.textContent = typeof item === 'string' ? item : JSON.stringify(item);
      return content;
    }
    
    // Render based on template type
    if (template.type === 'text') {
      const textElement = document.createElement('div');
      textElement.className = 'widget-list-item-text';
      textElement.textContent = this.interpolateTemplate(template.text, item);
      content.appendChild(textElement);
    }
    
    if (template.type === 'card') {
      content.classList.add('widget-list-item-card');
      
      if (template.title) {
        const titleElement = document.createElement('div');
        titleElement.className = 'widget-list-item-title';
        titleElement.textContent = this.interpolateTemplate(template.title, item);
        content.appendChild(titleElement);
      }
      
      if (template.subtitle) {
        const subtitleElement = document.createElement('div');
        subtitleElement.className = 'widget-list-item-subtitle';
        subtitleElement.textContent = this.interpolateTemplate(template.subtitle, item);
        content.appendChild(subtitleElement);
      }
      
      if (template.description) {
        const descElement = document.createElement('div');
        descElement.className = 'widget-list-item-description';
        descElement.textContent = this.interpolateTemplate(template.description, item);
        content.appendChild(descElement);
      }
    }
    
    if (template.type === 'custom' && template.render) {
      // Custom rendering function
      const customContent = template.render(item);
      if (customContent instanceof HTMLElement) {
        content.appendChild(customContent);
      } else {
        // Sanitize custom HTML content
        content.innerHTML = sanitizeHTML(customContent);
      }
    }
    
    return content;
  }

  /**
   * Interpolate template string with item data
   * @param {string} template - Template string
   * @param {*} item - Item data
   * @returns {string} Interpolated string
   */
  interpolateTemplate(template, item) {
    if (typeof template !== 'string') return template;
    
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return item[key] !== undefined ? item[key] : match;
    });
  }

  /**
   * Handle item selection
   * @param {HTMLElement} itemElement - Item element
   * @param {*} item - Item data
   * @param {number} index - Item index
   * @param {boolean} multiSelect - Whether multi-select is enabled
   */
  handleItemSelection(itemElement, item, index, multiSelect) {
    if (!multiSelect) {
      // Clear previous selection
      this.selectedItems.clear();
      document.querySelectorAll('.widget-list-item.selected').forEach(el => {
        el.classList.remove('selected');
      });
    }
    
    // Toggle selection
    if (this.selectedItems.has(index)) {
      this.selectedItems.delete(index);
      itemElement.classList.remove('selected');
      
      // Update checkbox
      const checkbox = itemElement.querySelector('.widget-list-item-checkbox');
      if (checkbox) checkbox.checked = false;
    } else {
      this.selectedItems.add(index);
      itemElement.classList.add('selected');
      
      // Update checkbox
      const checkbox = itemElement.querySelector('.widget-list-item-checkbox');
      if (checkbox) checkbox.checked = true;
    }
    
    // Trigger selection event
    this.handleInteraction({
      action: 'selectionChange',
      selectedItems: Array.from(this.selectedItems).map(i => this.widgetData.props.items[i]),
      selectedIndices: Array.from(this.selectedItems),
      widgetType: 'list'
    });
  }

  /**
   * Handle action button click
   * @param {Object} action - Action configuration
   * @param {Array} selectedItems - Selected items
   */
  handleAction(action, selectedItems) {
    this.handleInteraction({
      action: action.action || 'custom',
      selectedItems: selectedItems,
      actionData: action.data,
      widgetType: 'list'
    });
  }

  /**
   * Update list items
   * @param {Array} newItems - New items array
   */
  updateItems(newItems) {
    const container = document.querySelector('.widget-list-content');
    if (container) {
      const props = this.widgetData.props || {};
      this.renderItems(container, newItems, props.itemTemplate, props.selectable, props.multiSelect);
    }
  }

  /**
   * Get selected items
   * @returns {Array} Selected items
   */
  getSelectedItems() {
    return Array.from(this.selectedItems).map(i => this.widgetData.props.items[i]);
  }

  /**
   * Validate list widget data structure
   * @returns {boolean} True if data contains required properties for list widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'list' &&
           this.widgetData.props &&
           Array.isArray(this.widgetData.props.items);
  }
}
