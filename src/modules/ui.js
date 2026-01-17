import { adjustColor } from './utils.js';
import { WidgetFactory } from './widgets/index.js';

/**
 * Inject CSS styles for the chat widget
 * @param {string} widgetId - Unique identifier for the widget instance
 * @param {Object} themeConfig - Theme configuration object
 * @param {string} themeConfig.theme - Theme name
 * @param {string} themeConfig.mode - Theme mode ('light' or 'dark')
 * @param {Object} themeConfig.colors - Color configuration
 */
export function injectStyles(widgetId, themeConfig) {
  const styleElement = document.createElement("style");
  styleElement.id = `${widgetId}-styles`;
  styleElement.textContent = `
    /* Scope all styles to the widget ID */
    #${widgetId} {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    /* Theme: Default - Light Mode */
    #${widgetId}[data-theme="default"][data-mode="light"] {
      --chat-primary: #007bff;
      --chat-bg: #ffffff;
      --chat-surface: #f8f9fa;
      --chat-text: #212529;
      --chat-border: #e9ecef;
      --chat-primary-dark: ${adjustColor('#007bff', -20)};
    }

    /* Theme: Default - Dark Mode */
    #${widgetId}[data-theme="default"][data-mode="dark"] {
      --chat-primary: #4dabf7;
      --chat-bg: #1a1a1a;
      --chat-surface: #2d2d2d;
      --chat-text: #ffffff;
      --chat-border: #404040;
      --chat-primary-dark: ${adjustColor('#4dabf7', -20)};
    }

    /* Theme: Branded - Light Mode */
    #${widgetId}[data-theme="branded"][data-mode="light"] {
      --chat-primary: #6366f1;
      --chat-bg: #ffffff;
      --chat-surface: #f5f3ff;
      --chat-text: #1e1b4b;
      --chat-border: #e0e7ff;
      --chat-primary-dark: ${adjustColor('#6366f1', -20)};
    }

    /* Theme: Branded - Dark Mode */
    #${widgetId}[data-theme="branded"][data-mode="dark"] {
      --chat-primary: #818cf8;
      --chat-bg: #0f172a;
      --chat-surface: #1e293b;
      --chat-text: #f1f5f9;
      --chat-border: #334155;
      --chat-primary-dark: ${adjustColor('#818cf8', -20)};
    }

    /* Scoped CSS Reset */
    #${widgetId} * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      line-height: 1.5;
    }
    
    #${widgetId} .button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      background-color: var(--chat-primary);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
      position: fixed;
      z-index: 10000;
    }
    
    #${widgetId} .button:hover {
      transform: scale(1.1);
      background-color: var(--chat-primary-dark);
    }
    
    #${widgetId} .window {
      display: none;
      width: 350px;
      height: 500px;
      background: var(--chat-bg);
      border-radius: 12px;
      box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
      flex-direction: column;
      overflow: hidden;
      position: fixed;
      z-index: 9998;
    }

    #${widgetId}.fullpage {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    #${widgetId}.fullpage .window {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      border-radius: 0;
      box-shadow: none;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    
    #${widgetId} .window-open {
      display: flex;
    }
    
    #${widgetId} .header {
      padding: 16px;
      background: var(--chat-surface);
      border-bottom: 1px solid var(--chat-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    
    #${widgetId} .header h3 {
      margin: 0;
      font-size: 16px;
      color: var(--chat-text);
    }
    
    #${widgetId} .close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--chat-text);
      opacity: 0.6;
      padding: 0;
      line-height: 1;
      display: block;
    }
    
    #${widgetId}.fullpage .close {
      display: none;
    }
    
    #${widgetId} .messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 0;
    }
    
    #${widgetId} .message {
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
    #${widgetId} .user-message {
      background: var(--chat-primary);
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    
    #${widgetId} .bot-message {
      background: var(--chat-surface);
      color: var(--chat-text);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    
    #${widgetId} .input {
      padding: 16px;
      border-top: 1px solid var(--chat-border);
      display: flex;
      gap: 8px;
      align-items: flex-end;
      flex-shrink: 0;
      background: var(--chat-bg);
    }
    
    #${widgetId} .textarea {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      resize: none;
      min-height: 38px;
      max-height: 150px;
      font-family: inherit;
      line-height: 1.4;
      overflow-y: auto;
      background: var(--chat-bg);
      color: var(--chat-text);
    }
    
    #${widgetId} .textarea:focus {
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .send {
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
      height: 38px;
      white-space: nowrap;
    }
    
    #${widgetId} .send:hover {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget {
      margin-top: 8px;
      padding: 12px;
      background: var(--chat-surface);
      border-radius: 8px;
      border: 1px solid var(--chat-border);
    }
    
    #${widgetId} .widget-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    #${widgetId} .widget-button {
      padding: 8px 12px;
      background: var(--chat-bg);
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      text-align: left;
      transition: all 0.2s ease;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-button:hover {
      background: var(--chat-primary);
      color: white;
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-button:active {
      transform: translateY(1px);
    }
    
    #${widgetId} .widget-button:disabled,
    #${widgetId} .widget-button-disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--chat-surface);
      color: var(--chat-text);
      border-color: var(--chat-border);
    }
    
    #${widgetId} .widget-button:disabled:hover,
    #${widgetId} .widget-button-disabled:hover {
      background: var(--chat-surface);
      color: var(--chat-text);
      border-color: var(--chat-border);
      transform: none;
    }
    
    #${widgetId} .widget-select {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-select-element {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      font-size: 14px;
      background: var(--chat-bg);
      color: var(--chat-text);
      outline: none;
      cursor: pointer;
    }
    
    #${widgetId} .widget-select-element:focus {
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-select-element:disabled,
    #${widgetId} .widget-select-disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--chat-surface);
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-select-element:disabled:hover,
    #${widgetId} .widget-select-disabled:hover {
      background: var(--chat-surface);
      border-color: var(--chat-border);
    }
    
    #${widgetId} .widget-rating {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-rating-label {
      font-size: 14px;
      margin-bottom: 8px;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-rating-stars {
      display: flex;
      gap: 4px;
    }
    
    #${widgetId} .widget-rating-star {
      background: var(--chat-bg);
      border: 1px solid var(--chat-border);
      border-radius: 4px;
      cursor: pointer;
      font-size: 24px;
      padding: 0px 10px 4px 10px;
      color: var(--chat-text);
      transition: all 0.2s ease;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      min-height: 40px;
      vertical-align: middle;
      box-sizing: border-box;
    }
    
    #${widgetId} .widget-rating-star:hover,
    #${widgetId} .widget-rating-star-hover {
      background: var(--chat-surface);
      border-color: var(--chat-primary);
      color: var(--chat-primary);
      transform: scale(1.05);
    }
    
    #${widgetId} .widget-rating-star-selected {
      background: var(--chat-primary) !important;
      color: white !important;
      border-color: var(--chat-primary) !important;
    }
    
    #${widgetId} .widget-rating-disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }
    
    #${widgetId} .widget-input {
      margin-top: 8px;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    #${widgetId} .widget-input-element {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      font-size: 14px;
      background: var(--chat-bg);
      color: var(--chat-text);
      outline: none;
    }
    
    #${widgetId} .widget-input-element:focus {
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-input-submit {
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-input-submit:hover {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-input-element:disabled,
    #${widgetId} .widget-input-element.widget-input-disabled,
    #${widgetId} .widget-input-submit:disabled,
    #${widgetId} .widget-input-submit.widget-input-disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--chat-surface);
      color: var(--chat-text);
      border-color: var(--chat-border);
    }
    
    #${widgetId} .widget-input-element:disabled:hover,
    #${widgetId} .widget-input-element.widget-input-disabled:hover,
    #${widgetId} .widget-input-submit:disabled:hover,
    #${widgetId} .widget-input-submit.widget-input-disabled:hover {
      background: var(--chat-surface);
      border-color: var(--chat-border);
    }
    
    #${widgetId} .widget-confirmation {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-confirmation-message {
      font-size: 14px;
      margin-bottom: 12px;
      color: var(--chat-text);
      line-height: 1.4;
    }
    
    #${widgetId} .widget-confirmation-buttons {
      display: flex;
      gap: 8px;
      justify-content: space-between;
    }
    
    #${widgetId} .widget-confirmation-cancel,
    #${widgetId} .widget-confirmation-confirm {
      padding: 6px 12px;
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
      background: var(--chat-bg);
      color: var(--chat-text);
      flex: 1;
      min-width: 80px;
    }
    
    #${widgetId} .widget-confirmation-cancel:hover,
    #${widgetId} .widget-confirmation-confirm:hover {
      background: var(--chat-surface);
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-confirmation-confirm {
      background: var(--chat-primary);
      color: white;
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-confirmation-confirm:hover {
      background: var(--chat-primary-dark);
      border-color: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-confirmation-cancel:disabled,
    #${widgetId} .widget-confirmation-confirm:disabled,
    #${widgetId} .widget-confirmation-disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--chat-surface);
      color: var(--chat-text);
      border-color: var(--chat-border);
    }
    
    #${widgetId} .widget-confirmation-cancel:disabled:hover,
    #${widgetId} .widget-confirmation-confirm:disabled:hover,
    #${widgetId} .widget-confirmation-disabled:hover {
      background: var(--chat-surface);
      border-color: var(--chat-border);
    }
    
    #${widgetId} .widget-checkbox {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-checkbox-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    
    #${widgetId} .widget-checkbox-element {
      margin-right: 8px;
    }
    
    #${widgetId} .widget-checkbox-submit {
      margin-top: 12px;
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-checkbox-submit:hover {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-textarea {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-textarea-element {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      line-height: 1.4;
      resize: vertical;
      min-height: 80px;
      background: var(--chat-bg);
      color: var(--chat-text);
      outline: none;
    }
    
    #${widgetId} .widget-textarea-element:focus {
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-textarea-submit {
      margin-top: 8px;
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-textarea-submit:hover {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-slider {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-slider-label {
      font-size: 14px;
      margin-bottom: 8px;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-slider-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    #${widgetId} .widget-slider-element {
      flex: 1;
      height: 6px;
      background: var(--chat-border);
      border-radius: 3px;
      outline: none;
      -webkit-appearance: none;
    }
    
    #${widgetId} .widget-slider-element::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: var(--chat-primary);
      border-radius: 50%;
      cursor: pointer;
    }
    
    #${widgetId} .widget-slider-element::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: var(--chat-primary);
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }
    
    #${widgetId} .widget-slider-value {
      font-size: 14px;
      color: var(--chat-text);
      min-width: 40px;
      text-align: center;
    }
    
    #${widgetId} .widget-slider-submit {
      margin-top: 12px;
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-slider-submit:hover {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-toggle {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-toggle-label {
      font-size: 14px;
      margin-bottom: 8px;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-toggle-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    #${widgetId} .widget-toggle-input {
      display: none;
    }
    
    #${widgetId} .widget-toggle-slider {
      position: relative;
      width: 50px;
      height: 26px;
      background: var(--chat-border);
      border-radius: 13px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-toggle-slider::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.2s ease;
    }
    
    #${widgetId} .widget-toggle-input:checked + .widget-toggle-slider {
      background: var(--chat-primary);
    }
    
    #${widgetId} .widget-toggle-input:checked + .widget-toggle-slider::before {
      transform: translateX(24px);
    }
    
    #${widgetId} .widget-toggle-submit {
      margin-top: 12px;
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-toggle-submit:hover {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-date {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-date-element {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      font-size: 14px;
      background: var(--chat-bg);
      color: var(--chat-text);
      outline: none;
    }
    
    #${widgetId} .widget-date-element:focus {
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-tags {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-tags-label {
      font-size: 14px;
      margin-bottom: 8px;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-tags-input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    #${widgetId} .widget-tags-display {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
    }
    
    #${widgetId} .widget-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: var(--chat-surface);
      border: 1px solid var(--chat-border);
      border-radius: 4px;
      font-size: 12px;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-tag-remove {
      background: none;
      border: none;
      color: var(--chat-text);
      cursor: pointer;
      font-size: 14px;
      padding: 0;
      line-height: 1;
      opacity: 0.7;
    }
    
    #${widgetId} .widget-tag-remove:hover {
      opacity: 1;
    }
    
    #${widgetId} .widget-tags-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      font-size: 14px;
      background: var(--chat-bg);
      color: var(--chat-text);
      outline: none;
    }
    
    #${widgetId} .widget-tags-input:focus {
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-tags-suggestions {
      list-style: none;
      margin: 4px 0 0 0;
      padding: 0;
      border: 1px solid var(--chat-border);
      border-radius: 4px;
      background: var(--chat-bg);
      max-height: 120px;
      overflow-y: auto;
    }
    
    #${widgetId} .widget-tags-suggestion {
      padding: 6px 12px;
      cursor: pointer;
      font-size: 14px;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-tags-suggestion:hover {
      background: var(--chat-surface);
    }
    
    #${widgetId} .widget-tags-submit {
      margin-top: 12px;
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-tags-submit:hover {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-file {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-file-upload {
      border: 2px dashed var(--chat-border);
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: var(--chat-bg);
    }
    
    #${widgetId} .widget-file-upload:hover {
      border-color: var(--chat-primary);
      background: var(--chat-surface);
    }
    
    #${widgetId} .widget-file-upload.dragover {
      border-color: var(--chat-primary);
      background: var(--chat-surface);
    }
    
    #${widgetId} .widget-file-input {
      display: none;
    }
    
    #${widgetId} .widget-file-info {
      margin-top: 12px;
      font-size: 14px;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-color {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-color-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    #${widgetId} .widget-color-element {
      width: 50px;
      height: 40px;
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      cursor: pointer;
      padding: 2px;
      background: var(--chat-bg);
    }
    
    #${widgetId} .widget-color-element::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    
    #${widgetId} .widget-color-element::-webkit-color-swatch {
      border: none;
      border-radius: 4px;
    }
    
    #${widgetId} .widget-color-value {
      font-size: 14px;
      color: var(--chat-text);
      font-family: monospace;
    }
    
    #${widgetId} .widget-radio {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-radio-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    
    #${widgetId} .widget-radio-element {
      margin-right: 8px;
    }
    
    #${widgetId} .widget-radio-submit {
      margin-top: 12px;
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-radio-submit:hover {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-progress {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-progress-bar {
      width: 100%;
      height: 8px;
      background: var(--chat-border);
      border-radius: 4px;
      overflow: hidden;
    }
    
    #${widgetId} .widget-progress-fill {
      height: 100%;
      background: var(--chat-primary);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    
    #${widgetId} .widget-progress-label {
      font-size: 14px;
      margin-bottom: 8px;
      color: var(--chat-text);
    }

    /* Waiting message styles */
    #${widgetId} .waiting-message {
      background: var(--chat-surface);
      color: var(--chat-text);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      padding: 12px 16px;
      min-width: 60px;
    }

    #${widgetId} .waiting-dots {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    #${widgetId} .waiting-dots .dot {
      width: 8px;
      height: 8px;
      background: var(--chat-text);
      border-radius: 50%;
      opacity: 0.3;
      animation: waitingDotPulse 1.4s infinite ease-in-out both;
    }

    #${widgetId} .waiting-dots .dot:nth-child(1) {
      animation-delay: -0.32s;
    }

    #${widgetId} .waiting-dots .dot:nth-child(2) {
      animation-delay: -0.16s;
    }

    #${widgetId} .waiting-dots .dot:nth-child(3) {
      animation-delay: 0s;
    }

    @keyframes waitingDotPulse {
      0%, 80%, 100% {
        opacity: 0.3;
        transform: scale(0.8);
      }
      40% {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(styleElement);
}

/**
 * Create the DOM structure for the chat widget
 * @param {string} widgetId - Unique identifier for the widget instance
 * @param {Object} config - Widget configuration
 * @param {string} config.displayMode - Display mode ('popup' or 'fullpage')
 * @param {string} config.position - Position for popup mode
 * @param {string} config.title - Widget title
 * @param {string} config.targetSelector - Target element selector for fullpage mode
 * @returns {Object} Object containing container, chatWindow, and chatButton elements
 */
export function createWidgetDOM(widgetId, config) {
  const { displayMode, position, title, targetSelector } = config;

  // Create the widget container
  const container = document.createElement("div");
  container.id = widgetId;
  container.className = displayMode;

  // Create chat window
  const chatWindow = document.createElement("div");
  chatWindow.className = "window";
  chatWindow.id = `${widgetId}-window`;

  if (displayMode === "popup") {
    chatWindow.style.cssText = `
      ${position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
      ${position.includes("right") ? "right: 20px;" : "left: 20px;"}
    `;
  }

  chatWindow.innerHTML = `
    <div class="header" id="${widgetId}-header">
      <h3>${title}</h3>
      ${displayMode === "popup" ? `<button type="button" class="close" id="${widgetId}-close" aria-label="Close chat">×</button>` : ""
    }
    </div>
    <div class="messages" id="${widgetId}-messages" role="log" aria-live="polite" aria-atomic="false"></div>
    <div class="input">
      <textarea class="textarea" id="${widgetId}-input" placeholder="Type your message... (Shift+Enter for new line)" rows="1" aria-label="Type a message"></textarea>
      <button type="button" class="send" id="${widgetId}-send" aria-label="Send message">Send</button>
    </div>
  `;

  let chatButton = null;

  if (displayMode === "popup") {
    // Create chat button for popup mode
    chatButton = document.createElement("button");
    chatButton.className = "button";
    chatButton.id = `${widgetId}-button`;
    chatButton.type = "button";
    chatButton.setAttribute("aria-label", "Toggle chat window");
    chatButton.style.cssText = `
      ${position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
      ${position.includes("right") ? "right: 20px;" : "left: 20px;"}
    `;
    chatButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/>
      </svg>
    `;
    container.appendChild(chatButton);
  }

  container.appendChild(chatWindow);

  // Append the widget to the target element or body
  if (displayMode === "fullpage" && targetSelector) {
    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
      targetElement.appendChild(container);
    } else {
      console.error(`Target element "${targetSelector}" not found`);
      document.body.appendChild(container);
    }
  } else {
    document.body.appendChild(container);
  }

  return { container, chatWindow, chatButton };
}

/**
 * Append a message to the messages container
 * @param {HTMLElement} container - Messages container element
 * @param {string} text - Message text
 * @param {string} sender - Message sender ('user' or 'bot')
 * @param {string} widgetId - Widget ID for generating unique message IDs
 * @param {Object} [widgetData] - Optional widget data for bot messages
 */
export function appendMessage(container, text, sender, widgetId, widgetData = null) {
  const messageElement = document.createElement("div");
  messageElement.className = `message ${sender}-message`;
  messageElement.id = `${widgetId}-message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create message content
  const messageContent = document.createElement("div");
  messageContent.innerHTML = text.replace(/\n/g, "<br>");
  messageElement.appendChild(messageContent);

  // Add widget if present
  if (widgetData && sender === "bot") {
    const widgetElement = createWidgetElement(widgetData, widgetId);
    messageElement.appendChild(widgetElement);
  }

  container.appendChild(messageElement);
  container.scrollTop = container.scrollHeight;
}

/**
 * Create a widget element from widget data
 * @private
 * @param {Object} widgetData - Widget configuration data
 * @param {string} widgetId - Widget ID for scoping
 * @returns {HTMLElement|Comment} Widget element or comment for unsupported types
 */
function createWidgetElement(widgetData, widgetId) {
  const widget = WidgetFactory.createWidget(widgetData, widgetId);

  if (!widget) {
    return document.createComment(`Unsupported widget type: ${widgetData?.type}`);
  }

  return widget.createElement();
}
