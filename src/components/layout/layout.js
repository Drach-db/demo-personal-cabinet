/**
 * Layout Controller - координирует navbar и header
 */
class LayoutController {
    constructor() {
        this.state = {
            navbarCollapsed: false,
            mobileMenuOpen: false,
            isMobile: window.innerWidth < 768
        };
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.loadState();
        this.bindEvents();
        this.applyInitialState();
    }
    
    cacheElements() {
        this.elements = {
            layout: document.querySelector('.app-layout'),
            navbar: document.querySelector('.app-navbar'),
            header: document.querySelector('.app-header'),
            overlay: document.querySelector('.app-overlay'),
            mobileToggle: document.querySelector('.header__mobile-toggle'),
            navbarToggle: document.querySelector('.navbar__toggle')
        };
    }
    
    loadState() {
        if (!this.state.isMobile) {
            const saved = localStorage.getItem('layout-state');
            if (saved) {
                const state = JSON.parse(saved);
                this.state.navbarCollapsed = state.navbarCollapsed || false;
            }
        } else {
            // На мобильных всегда начинаем со скрытым меню
            this.state.navbarCollapsed = true;
        }
    }
    
    saveState() {
        if (!this.state.isMobile) {
            localStorage.setItem('layout-state', JSON.stringify({
                navbarCollapsed: this.state.navbarCollapsed
            }));
        }
    }
    
    bindEvents() {
        // Desktop navbar toggle
        if (this.elements.navbarToggle) {
            this.elements.navbarToggle.addEventListener('click', () => {
                this.toggleNavbar();
            });
        }
        
        // Mobile menu toggle
        if (this.elements.mobileToggle) {
            this.elements.mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Overlay click
        if (this.elements.overlay) {
            this.elements.overlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
        
        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Listen for navbar state changes
        document.addEventListener('navbar:toggled', (e) => {
            this.state.navbarCollapsed = e.detail.collapsed;
            this.updateLayout();
        });
    }
    
    toggleNavbar() {
        this.state.navbarCollapsed = !this.state.navbarCollapsed;
        this.updateLayout();
        this.saveState();
        
        // Notify navbar component
        document.dispatchEvent(new CustomEvent('layout:navbar-toggle', {
            detail: { collapsed: this.state.navbarCollapsed }
        }));
    }
    
    toggleMobileMenu() {
        this.state.mobileMenuOpen = !this.state.mobileMenuOpen;
        this.updateMobileMenu();
    }
    
    closeMobileMenu() {
        this.state.mobileMenuOpen = false;
        this.updateMobileMenu();
    }
    
    updateLayout() {
        if (this.state.navbarCollapsed) {
            this.elements.layout.classList.add('navbar-collapsed');
        } else {
            this.elements.layout.classList.remove('navbar-collapsed');
        }
    }
    
    updateMobileMenu() {
        if (this.state.mobileMenuOpen) {
            this.elements.navbar.classList.add('mobile-open');
            this.elements.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            this.elements.navbar.classList.remove('mobile-open');
            this.elements.overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    handleResize() {
        const wasMobile = this.state.isMobile;
        this.state.isMobile = window.innerWidth < 768;
        
        if (wasMobile !== this.state.isMobile) {
            if (this.state.isMobile) {
                // Switching to mobile
                this.closeMobileMenu();
            } else {
                // Switching to desktop
                this.loadState();
                this.updateLayout();
            }
        }
    }
    
    applyInitialState() {
        this.updateLayout();
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    window.layoutController = new LayoutController();
});