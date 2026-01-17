import { BaseWidget } from './base-widget.js';

/**
 * Rating Widget
 * Renders a star or emoji-based rating system
 */
export class RatingWidget extends BaseWidget {
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid rating widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === 'rating') {
      const ratingContainer = document.createElement("div");
      ratingContainer.className = "widget-rating";
      
      const label = document.createElement("div");
      label.className = "widget-rating-label";
      label.textContent = this.widgetData.label || 'Rate this';
      
      const starsContainer = document.createElement("div");
      starsContainer.className = "widget-rating-stars";
      
      const maxRating = this.widgetData.maxRating || 5;
      const iconType = this.widgetData.iconType || 'stars';
      
      for (let i = 1; i <= maxRating; i++) {
        const star = document.createElement("button");
        star.className = "widget-rating-star";
        star.setAttribute("data-rating", i);
        star.setAttribute("data-widget-id", this.widgetId);
        
        if (iconType === 'emojis') {
          star.textContent = '⭐';
        } else {
          star.innerHTML = '★';
        }
        
        star.addEventListener("mouseenter", () => {
          this.highlightStars(starsContainer, i);
        });
        
        star.addEventListener("mouseleave", () => {
          this.resetStars(starsContainer);
        });
        
        star.addEventListener("click", () => {
          this.selectRating(starsContainer, i);
          
          const allStars = starsContainer.querySelectorAll('.widget-rating-star');
          allStars.forEach(s => {
            s.disabled = true;
            s.classList.add('widget-rating-disabled');
          });
          
          this.handleInteraction({
            optionId: 'rating-submit',
            optionValue: i,
            optionText: `${i} star${i > 1 ? 's' : ''}`,
            widgetType: 'rating'
          });
        });
        
        starsContainer.appendChild(star);
      }
      
      ratingContainer.appendChild(label);
      ratingContainer.appendChild(starsContainer);
      widgetContainer.appendChild(ratingContainer);
    }
    
    return widgetContainer;
  }

  highlightStars(container, rating) {
    const stars = container.querySelectorAll('.widget-rating-star');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('widget-rating-star-hover');
      } else {
        star.classList.remove('widget-rating-star-hover');
      }
    });
  }

  resetStars(container) {
    const stars = container.querySelectorAll('.widget-rating-star');
    stars.forEach(star => {
      star.classList.remove('widget-rating-star-hover');
    });
  }

  selectRating(container, rating) {
    const stars = container.querySelectorAll('.widget-rating-star');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('widget-rating-star-selected');
      } else {
        star.classList.remove('widget-rating-star-selected');
      }
    });
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === 'rating' &&
           typeof this.widgetData.maxRating === 'number' &&
           this.widgetData.maxRating > 0;
  }
}
