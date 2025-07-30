/**
 * Unified Navbar Component
 * Works the same on all devices, just starts collapsed on mobile
 */
class UnifiedNavbar {
    constructor(options = {}) {
        // Configuration
        this.options = {
            mobileBreakpoint: 768,
            localStorageKey: 'navbar-state',
            autoCollapseOnMobile: true,
            ...options
        };

        // State
        this.isMobile = window.innerWidth < this.options.mobileBreakpoint;
        this.isCollapsed = false;
        this.activePage = null;

        // Elements
        this.elements = {};

        // Initialize
        this.init();
    }

    /**
     * Initialize the navbar component
     */
    init() {
        this.cacheElements();
        this.loadState();
        this.bindEvents();
        this.detectActivePage();
        
        // Apply the initial state
        if (this.isCollapsed) {
            this.elements.navbar.classList.add('navbar--collapsed');
            document.body.classList.add('navbar-collapsed');
        } else {
            // Make sure it's expanded
            this.elements.navbar.classList.remove('navbar--collapsed');
            document.body.classList.remove('navbar-collapsed');
        }
    }

    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        this.elements = {
            navbar: document.getElementById('navbar'),
            collapse: document.getElementById('navbarCollapse'),
            container: document.getElementById('navbarContainer'),
            links: document.querySelectorAll('.navbar__link'),
            userButton: document.querySelector('.navbar__user-button')
        };
    }

    /**
     * Load saved state from localStorage
     */
    loadState() {
        try {
            const savedState = localStorage.getItem(this.options.localStorageKey);
            if (savedState) {
                const state = JSON.parse(savedState);
                // Use saved state only for desktop
                if (!this.isMobile) {
                    this.isCollapsed = state.collapsed || false;
                } else {
                    // Mobile always starts collapsed
                    this.isCollapsed = true;
                }
            } else {
                // No saved state
                this.isCollapsed = this.isMobile; // true for mobile, false for desktop
            }
        } catch (e) {
            console.warn('Failed to load navbar state:', e);
            // Default: collapsed on mobile, expanded on desktop
            this.isCollapsed = this.isMobile;
        }
    }

    /**
     * Save current state to localStorage
     */
    saveState() {
        try {
            const state = {
                collapsed: this.isCollapsed,
                timestamp: Date.now()
            };
            localStorage.setItem(this.options.localStorageKey, JSON.stringify(state));
        } catch (e) {
            console.warn('Failed to save navbar state:', e);
        }
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Collapse button
        if (this.elements.collapse) {
            this.elements.collapse.addEventListener('click', () => this.toggleCollapse());
        }

        // Navigation links
        this.elements.links.forEach(link => {
            link.addEventListener('click', (e) => this.handleLinkClick(e, link));
        });

        // User button
        if (this.elements.userButton) {
            this.elements.userButton.addEventListener('click', () => this.handleUserClick());
        }

        // Navbar click to expand (only when collapsed)
        this.elements.navbar.addEventListener('click', (e) => {
            // Check if click is on empty area (not button or link)
            if (this.isCollapsed && 
                !e.target.closest('.navbar__link') && 
                !e.target.closest('.navbar__user-button') &&
                !e.target.closest('.navbar__collapse')) {
                this.toggleCollapse();
            }
        });

        // Window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.handleResize(), 250);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    /**
     * Toggle collapsed state
     */
    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            this.elements.navbar.classList.add('navbar--collapsed');
            document.body.classList.add('navbar-collapsed');
        } else {
            this.elements.navbar.classList.remove('navbar--collapsed');
            document.body.classList.remove('navbar-collapsed');
        }

        this.saveState();

        // Dispatch custom event
        const event = new CustomEvent('navbar:toggled', {
            detail: { collapsed: this.isCollapsed }
        });
        document.dispatchEvent(event);
    }

    /**
     * Handle navigation link clicks
     */
    handleLinkClick(e, link) {
        const href = link.getAttribute('href');
        const navId = link.dataset.nav;

        // Update active state
        this.setActivePage(navId);

        // If it's a hash link, prevent default
        if (href === '#' || href === '#!') {
            e.preventDefault();
        }

        // Dispatch custom event
        const event = new CustomEvent('navbar:navigate', {
            detail: { page: navId, href }
        });
        document.dispatchEvent(event);
    }

    /**
     * Handle user button click
     */
    handleUserClick() {
        console.log('User menu clicked');
        // Implement user menu functionality
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyboard(e) {
        // Alt+N toggles collapse
        if (e.altKey && e.key === 'n') {
            this.toggleCollapse();
        }

        // Arrow keys for navigation when collapsed
        if (this.isCollapsed && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            const links = Array.from(this.elements.links);
            const currentIndex = links.findIndex(link => link === document.activeElement);
            
            if (e.key === 'ArrowDown' && currentIndex < links.length - 1) {
                links[currentIndex + 1].focus();
                e.preventDefault();
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                links[currentIndex - 1].focus();
                e.preventDefault();
            }
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < this.options.mobileBreakpoint;

        // If switched from desktop to mobile
        if (!wasMobile && this.isMobile) {
            // Save current state before switching to mobile
            this.saveState();
            // Always collapse on mobile
            if (!this.isCollapsed) {
                this.toggleCollapse();
            }
        }
        
        // If switched from mobile to desktop
        if (wasMobile && !this.isMobile) {
            // Restore desktop state from localStorage
            this.loadState();
            // Apply the loaded state
            if (this.isCollapsed) {
                this.elements.navbar.classList.add('navbar--collapsed');
                document.body.classList.add('navbar-collapsed');
            } else {
                this.elements.navbar.classList.remove('navbar--collapsed');
                document.body.classList.remove('navbar-collapsed');
            }
        }
    }

    /**
     * Detect active page from URL
     */
    detectActivePage() {
        const path = window.location.pathname;
        
        this.elements.links.forEach(link => {
            const href = link.getAttribute('href');
            const navId = link.dataset.nav;
            
            if (href && path.includes(href) && href !== '#') {
                this.activePage = navId;
                link.classList.add('active');
            }
        });
    }

    /**
     * Set active page programmatically
     */
    setActivePage(pageId) {
        this.activePage = pageId;
        
        // Update link states
        this.elements.links.forEach(link => {
            if (link.dataset.nav === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Public API Methods
     */
    
    collapse() {
        if (!this.isCollapsed) {
            this.toggleCollapse();
        }
    }

    expand() {
        if (this.isCollapsed) {
            this.toggleCollapse();
        }
    }

    toggle() {
        this.toggleCollapse();
    }

    getActivePage() {
        return this.activePage;
    }

    isNavbarCollapsed() {
        return this.isCollapsed;
    }
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if navbar exists on the page
    const navbarElement = document.getElementById('navbar');
    if (navbarElement && !window.navbarInstance) {
        // Initialize with options from data attributes or defaults
        const options = {
            mobileBreakpoint: parseInt(navbarElement.dataset.breakpoint) || 768,
            autoCollapseOnMobile: navbarElement.dataset.autoCollapse !== 'false'
        };
        
        // Create global instance
        window.navbarInstance = new UnifiedNavbar(options);
        
        console.log('Unified Navbar initialized');
    }
});

// Export for use in modules (if needed)
// export default UnifiedNavbar;