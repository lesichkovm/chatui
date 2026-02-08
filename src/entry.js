import { ChatWidget } from './modules/chat-widget.class.js';

// Global factory function (legacy support)
window.createChatWidget = function(scriptElement) {
    return new ChatWidget(scriptElement);
};

// Store widget instances and observer for cleanup
const widgetInstances = [];
let autoInitObserver = null;

// Programmatic API
window.ChatUI = {
    init: function(config) {
        const widget = new ChatWidget(config);
        widgetInstances.push(widget);
        return widget;
    },
    
    /**
     * Destroy all ChatUI widgets and cleanup resources
     * Disconnects MutationObserver and destroys all widget instances
     */
    destroy: function() {
        // Destroy all widget instances
        widgetInstances.forEach(widget => {
            if (widget && typeof widget.destroy === 'function') {
                widget.destroy();
            }
        });
        widgetInstances.length = 0;
        
        // Disconnect the MutationObserver
        if (autoInitObserver) {
            autoInitObserver.disconnect();
            autoInitObserver = null;
        }
        
        // Clean up global references
        delete window.createChatWidget;
        delete window.ChatUI;
    },
    
    /**
     * Get all active widget instances
     * @returns {Array} Array of ChatWidget instances
     */
    getWidgets: function() {
        return [...widgetInstances];
    }
};

// Auto-initialize based on script tags
document.addEventListener("DOMContentLoaded", function () {
    const scripts = document.querySelectorAll('script[id^="chat-widget"]');
    scripts.forEach((script) => {
        if (script.src && script.src !== window.location.href) {
            return;
        }
        const widget = window.createChatWidget(script);
        widgetInstances.push(widget);
    });
});

autoInitObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
            if (node.nodeName === "SCRIPT" && node.id && node.id.startsWith("chat-widget")) {
                if (node.src && node.src !== window.location.href) {
                    return;
                }
                const widget = window.createChatWidget(node);
                widgetInstances.push(widget);
            }
        });
    });
});

autoInitObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
});

if (document.currentScript && document.currentScript.id && document.currentScript.id.startsWith("chat-widget")) {
    const widget = window.createChatWidget(document.currentScript);
    widgetInstances.push(widget);
}