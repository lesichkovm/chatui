import { BaseWidget } from './base-widget.js';

/**
 * Tags Widget
 * Renders a tag input with autocomplete for multiple keywords
 */
export class TagsWidget extends BaseWidget {
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid tags widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === 'tags') {
      const tagsContainer = document.createElement("div");
      tagsContainer.className = "widget-tags";
      
      const label = document.createElement("label");
      label.className = "widget-tags-label";
      label.textContent = this.widgetData.label || 'Add tags';
      
      const inputWrapper = document.createElement("div");
      inputWrapper.className = "widget-tags-input-wrapper";
      
      const tagsDisplay = document.createElement("div");
      tagsDisplay.className = "widget-tags-display";
      
      const input = document.createElement("input");
      input.type = "text";
      input.className = "widget-tags-input";
      input.placeholder = this.widgetData.placeholder || 'Type and press Enter to add tag';
      input.setAttribute("data-widget-id", this.widgetId);
      
      const suggestionsList = document.createElement("ul");
      suggestionsList.className = "widget-tags-suggestions";
      suggestionsList.style.display = 'none';
      
      const maxTags = this.widgetData.maxTags || 10;
      let tags = [];
      
      const renderTags = () => {
        tagsDisplay.innerHTML = '';
        tags.forEach((tag, index) => {
          const tagElement = document.createElement("span");
          tagElement.className = "widget-tag";
          tagElement.textContent = tag;
          
          const removeButton = document.createElement("button");
          removeButton.className = "widget-tag-remove";
          removeButton.textContent = '×';
          removeButton.addEventListener("click", () => {
            tags.splice(index, 1);
            renderTags();
          });
          
          tagElement.appendChild(removeButton);
          tagsDisplay.appendChild(tagElement);
        });
      };
      
      const showSuggestions = (query) => {
        if (!this.widgetData.suggestions || !query) {
          suggestionsList.style.display = 'none';
          return;
        }
        
        const filtered = this.widgetData.suggestions.filter(s => 
          s.toLowerCase().includes(query.toLowerCase()) && !tags.includes(s)
        );
        
        if (filtered.length > 0) {
          suggestionsList.innerHTML = '';
          filtered.forEach(suggestion => {
            const li = document.createElement("li");
            li.className = "widget-tags-suggestion";
            li.textContent = suggestion;
            li.addEventListener("click", () => {
              if (tags.length < maxTags) {
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
      
      input.addEventListener("input", () => {
        showSuggestions(input.value);
      });
      
      input.addEventListener("keydown", (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const value = input.value.trim();
          if (value && tags.length < maxTags && !tags.includes(value)) {
            tags.push(value);
            renderTags();
            input.value = '';
            suggestionsList.style.display = 'none';
          }
        } else if (e.key === 'Backspace' && !input.value && tags.length > 0) {
          tags.pop();
          renderTags();
        }
      });
      
      const submitButton = document.createElement("button");
      submitButton.className = "widget-tags-submit";
      submitButton.textContent = this.widgetData.buttonText || 'Submit';
      
      const handleSubmit = () => {
        if (tags.length > 0) {
          input.disabled = true;
          input.classList.add('widget-tags-disabled');
          submitButton.disabled = true;
          submitButton.classList.add('widget-tags-disabled');
          
          this.handleInteraction({
            optionId: 'tags-submit',
            optionValue: tags,
            optionText: tags.join(', '),
            widgetType: 'tags'
          });
        }
      };
      
      submitButton.addEventListener("click", handleSubmit);
      
      inputWrapper.appendChild(tagsDisplay);
      inputWrapper.appendChild(input);
      inputWrapper.appendChild(suggestionsList);
      tagsContainer.appendChild(label);
      tagsContainer.appendChild(inputWrapper);
      tagsContainer.appendChild(submitButton);
      widgetContainer.appendChild(tagsContainer);
    }
    
    return widgetContainer;
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === 'tags';
  }
}
