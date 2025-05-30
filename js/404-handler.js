// Handle 404 errors for broken links
document.addEventListener('DOMContentLoaded', function() {
    // Handle all links
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (!target) return;

        const href = target.getAttribute('href');
        if (!href) return;

        // Don't handle external links, anchors, or javascript: links
        if (href.startsWith('http') || 
            href.startsWith('#') || 
            href.startsWith('javascript:') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:')) {
            return;
        }

        // Prevent the default action
        e.preventDefault();

        // Check if the file exists
        fetch(href)
            .then(response => {
                if (response.ok) {
                    // If file exists, proceed with navigation
                    window.location.href = href;
                } else {
                    // If file doesn't exist, redirect to 404
                    window.location.href = '/404.html';
                }
            })
            .catch(() => {
                // On any error, redirect to 404
                window.location.href = '/404.html';
            });
    });
}); 