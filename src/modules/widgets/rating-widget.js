import { BaseWidget } from './base-widget.js';

/**
 * Rating Widget (Composable)
 * A standalone rating widget with stars or emojis
 * Can be used in containers or standalone
 */
export class RatingWidget extends BaseWidget {
  /**
   * Create the DOM element for the rating widget
   * @returns {HTMLElement|Comment} Rating container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid rating widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-rating-container';
    
    const props = this.widgetData.props || {};
    const label = props.label || 'Rate this';
    const buttonText = props.buttonText || 'Submit';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    const maxRating = props.maxRating || 5;
    const iconType = props.iconType || 'stars';
    let selectedRating = props.defaultValue || 0;
    const showSubmitButton = props.showSubmitButton !== false; // Default to true for backward compatibility
    
    // Create label
    const labelElement = document.createElement('div');
    labelElement.className = 'widget-rating-label';
    labelElement.textContent = label;
    labelElement.classList.add(`variant-${variant}`);
    labelElement.classList.add(`size-${size}`);
    
    // Create stars container
    const starsContainer = document.createElement('div');
    starsContainer.className = 'widget-rating-stars';
    
    // Create rating buttons
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      const star = document.createElement('button');
      star.className = 'widget-rating-star';
      star.setAttribute('data-rating', i);
      star.classList.add(`variant-${variant}`);
      star.classList.add(`size-${size}`);
      
      // Set icon content
      if (iconType === 'emojis') {
        star.textContent = this.getEmojiForRating(i, maxRating);
      } else if (iconType === 'hearts') {
        star.textContent = '♥';
      } else {
        star.textContent = '★';
      }
      
      // Set disabled state
      if (props.disabled) {
        star.disabled = true;
        star.classList.add('widget-rating-disabled');
      }
      
      // Add hover effect
      star.addEventListener('mouseenter', () => {
        if (!props.disabled) {
          this.highlightStars(stars, i);
        }
      });
      
      star.addEventListener('mouseleave', () => {
        if (!props.disabled) {
          this.highlightStars(stars, selectedRating);
        }
      });
      
      // Handle click
      star.addEventListener('click', () => {
        if (!props.disabled) {
          selectedRating = i;
          this.highlightStars(stars, selectedRating);
        }
      });
      
      stars.push(star);
      starsContainer.appendChild(star);
    }
    
    // Create current rating display
    let ratingDisplay = null;
    if (props.showRating !== false) {
      ratingDisplay = document.createElement('div');
      ratingDisplay.className = 'widget-rating-display';
      ratingDisplay.textContent = `Rating: ${selectedRating}/${maxRating}`;
      ratingDisplay.classList.add(`variant-${variant}`);
      ratingDisplay.classList.add(`size-${size}`);
    }
    
    // Create submit button conditionally
    let submitButton = null;
    if (showSubmitButton) {
      submitButton = document.createElement('button');
      submitButton.className = 'widget-rating-submit';
      submitButton.textContent = buttonText;
      submitButton.classList.add(`variant-${variant}`);
      submitButton.classList.add(`size-${size}`);
      
      if (props.disabled) {
        submitButton.disabled = true;
        submitButton.classList.add('widget-rating-disabled');
      }
    }
    
    // Highlight stars helper
    this.highlightStars = (stars, rating) => {
      stars.forEach((star, index) => {
        if (index < rating) {
          star.classList.add('active');
        } else {
          star.classList.remove('active');
        }
      });
      
      // Update rating display
      if (ratingDisplay) {
        ratingDisplay.textContent = `Rating: ${rating}/${maxRating}`;
      }
    };
    
    // Handle submission
    const handleSubmit = () => {
      if ((!submitButton || !submitButton.disabled) && selectedRating > 0) {
        // Disable all stars and submit button if specified
        if (props.disableOnSubmit !== false) {
          stars.forEach(star => {
            star.disabled = true;
            star.classList.add('widget-rating-disabled');
          });
          if (submitButton) {
            submitButton.disabled = true;
            submitButton.classList.add('widget-rating-disabled');
          }
        }
        
        this.handleInteraction({
          rating: selectedRating,
          maxRating: maxRating,
          iconType: iconType,
          widgetType: 'rating'
        });
      }
    };
    
    // Add event listener
    if (submitButton) {
      submitButton.addEventListener('click', handleSubmit);
    }
    
    // Set initial rating
    if (selectedRating > 0) {
      this.highlightStars(stars, selectedRating);
    }
    
    // Apply custom styles if provided
    if (props.starsStyle) {
      Object.assign(starsContainer.style, props.starsStyle);
    }
    
    if (props.buttonStyle && submitButton) {
      Object.assign(submitButton.style, props.buttonStyle);
    }
    
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    // Assemble the widget
    container.appendChild(labelElement);
    container.appendChild(starsContainer);
    if (ratingDisplay) {
      container.appendChild(ratingDisplay);
    }
    if (submitButton) {
      container.appendChild(submitButton);
    }
    
    return container;
  }

  /**
   * Get emoji for rating based on position
   * @private
   * @param {number} rating - Current rating position
   * @param {number} maxRating - Maximum rating
   * @returns {string} Emoji character
   */
  getEmojiForRating(rating, maxRating) {
    const emojis = ['😢', '😕', '😐', '🙂', '😊'];
    const index = Math.floor((rating - 1) / maxRating * (emojis.length - 1));
    return emojis[Math.min(index, emojis.length - 1)];
  }

  /**
   * Validate rating widget data structure
   * @returns {boolean} True if data contains required properties for rating widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'rating';
  }

  /**
   * Get the current value of the rating widget
   * @returns {number} Current rating value
   */
  getValue() {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const activeStars = container.querySelectorAll('.widget-rating-star.active');
      return activeStars.length;
    }
    return 0;
  }

  /**
   * Set the value of the rating widget
   * @param {number} value - Rating value to set
   */
  setValue(value) {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const stars = container.querySelectorAll('.widget-rating-star');
      const ratingDisplay = container.querySelector('.widget-rating-display');
      const maxRating = stars.length;
      
      // Highlight stars based on value
      stars.forEach((star, index) => {
        if (index < value) {
          star.classList.add('active');
        } else {
          star.classList.remove('active');
        }
      });
      
      // Update rating display
      if (ratingDisplay) {
        ratingDisplay.textContent = `Rating: ${value}/${maxRating}`;
      }
    }
  }
}
