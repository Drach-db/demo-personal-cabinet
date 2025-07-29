// Navbar Component
class Navbar {
    constructor(options = {}) {
        // Default options
        this.options = {
            containerId: 'navbar',
            onNavigate: null,
            activeItem: null,
            ...options
        };
        
        // Elements
        this.navbar = null;
        this.collapseBtn = null;
        this.initialGlow = null;
        this.navLinks = null;
        
        // State
        this.activeItem = this.options.activeItem || this.detectActiveItem();
        
        // Initialize
        this.init();
    }

    init() {
        // Find elements
        this.navbar = document.getElementById(this.options.containerId);
        if (!this.navbar) {
            console.error('Navbar element not found');
            return;
        }
        
        this.collapseBtn = this.navbar.querySelector('#collapseBtn');
        this.initialGlow = this.navbar.querySelector('#initialGlow');
        this.navLinks = this.navbar.querySelectorAll('.nav-link');
        
        // Load saved state
        this.loadState();
        
        // Set initial active item
        if (this.activeItem) {
            this.setActiveItem(this.activeItem);
        }
        
        // Event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Collapse button
        if (this.collapseBtn) {
            this.collapseBtn.addEventListener('click', (e) => this.toggleNavbar(e));
        }
        
        // Navbar click (for collapse)
        this.navbar.addEventListener('click', (e) => this.handleNavbarClick(e));
        
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e, link));
        });
        
        // Handle body class for collapsed state
        this.updateBodyClass();
    }

    detectActiveItem() {
        // Try to detect active item from current URL
        const path = window.location.pathname;
        
        // Check each nav link
        for (const link of this.navLinks || []) {
            const href = link.getAttribute('href');
            const navId = link.getAttribute('data-nav-id');
            
            if (href && path.includes(href) && href !== '#') {
                return navId;
            }
        }
        
        // Check for specific page patterns
        if (path.includes('/team')) return 'team';
        if (path.includes('/dashboard')) return 'dashboard';
        if (path.includes('/schedules')) return 'schedules';
        if (path.includes('/onboarding')) return 'onboarding';
        if (path.includes('/billing')) return 'billing';
        if (path.includes('/today')) return 'today';
        
        return null;
    }

    loadState() {
        const savedState = localStorage.getItem('navbar-collapsed');
        if (savedState === 'true') {
            this.navbar.classList.add('collapsed');
            this.showInitialGlow();
        }
    }

    saveState() {
        const isCollapsed = this.navbar.classList.contains('collapsed');
        localStorage.setItem('navbar-collapsed', isCollapsed);
    }

    showInitialGlow() {
        if (!this.initialGlow) return;
        
        this.initialGlow.style.display = 'block';
        setTimeout(() => {
            this.initialGlow.style.display = 'none';
        }, 2000);
    }

    toggleNavbar(e) {
        if (e) e.stopPropagation();
        
        const isCollapsed = this.navbar.classList.toggle('collapsed');
        this.saveState();
        this.updateBodyClass();
        
        // Dispatch custom event
        const event = new CustomEvent('navbar-toggled', { 
            detail: { collapsed: isCollapsed } 
        });
        document.dispatchEvent(event);
    }

    updateBodyClass() {
        if (this.navbar.classList.contains('collapsed')) {
            document.body.classList.add('navbar-collapsed');
        } else {
            document.body.classList.remove('navbar-collapsed');
        }
    }

    handleNavbarClick(e) {
        // Check if click is on empty area (not button or nav link)
        const isButton = e.target.tagName === 'BUTTON' || e.target.closest('button');
        const isNavLink = e.target.closest('.nav-link');
        const isUserSection = e.target.closest('.user-section');
        
        if (!isButton && !isNavLink && !isUserSection) {
            this.toggleNavbar();
        }
    }

    handleNavClick(e, link) {
        const href = link.getAttribute('href');
        const navId = link.getAttribute('data-nav-id');
        
        // If it's a real link and not "#", let it navigate
        if (href && href !== '#') {
            // Set active state before navigation
            this.setActiveItem(navId);
            
            // Call callback if provided
            if (this.options.onNavigate) {
                this.options.onNavigate(navId, href);
            }
            
            // Let the default navigation happen
            return;
        }
        
        // For "#" links, prevent default and just update active state
        e.preventDefault();
        e.stopPropagation();
        
        this.setActiveItem(navId);
        
        // Call callback
        if (this.options.onNavigate) {
            this.options.onNavigate(navId, href);
        }
    }

    setActiveItem(itemId) {
        if (!itemId) return;
        
        // Remove active state from all links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const indicator = link.querySelector('.nav-indicator');
            if (indicator) indicator.remove();
        });
        
        // Add active state to selected link
        const activeLink = this.navbar.querySelector(`[data-nav-id="${itemId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            
            // Add indicator
            const indicator = document.createElement('div');
            indicator.className = 'nav-indicator';
            activeLink.insertBefore(indicator, activeLink.firstChild);
        }
        
        this.activeItem = itemId;
    }

    // Public methods
    collapse() {
        this.navbar.classList.add('collapsed');
        this.saveState();
        this.updateBodyClass();
    }

    expand() {
        this.navbar.classList.remove('collapsed');
        this.saveState();
        this.updateBodyClass();
    }

    isCollapsed() {
        return this.navbar.classList.contains('collapsed');
    }

    setActive(itemId) {
        this.setActiveItem(itemId);
    }
}

// Auto-initialize if navbar exists on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const navbarElement = document.getElementById('navbar');
    if (navbarElement && !window.navbarInstance) {
        window.navbarInstance = new Navbar();
    }
});