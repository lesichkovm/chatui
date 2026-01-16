import { ChatWidget } from './modules/chat-widget.class.js';

// Global factory function (legacy support)
window.createChatWidget = function(scriptElement) {
    return new ChatWidget(scriptElement);
};

// Programmatic API
window.ChatUI = {
    init: function(config) {
        return new ChatWidget(config);
    }
};

// Auto-initialize based on script tags
document.addEventListener("DOMContentLoaded", function () {
    const scripts = document.querySelectorAll('script[id^="chat-widget"]');
    scripts.forEach((script) => {
        if (script.src && script.src !== window.location.href) {
            return;
        }
        window.createChatWidget(script);
    });
});

const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
            if (node.nodeName === "SCRIPT" && node.id && node.id.startsWith("chat-widget")) {
                if (node.src && node.src !== window.location.href) {
                    return;
                }
                window.createChatWidget(node);
            }
        });
    });
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
});

if (document.currentScript && document.currentScript.id && document.currentScript.id.startsWith("chat-widget")) {
    window.createChatWidget(document.currentScript);
}