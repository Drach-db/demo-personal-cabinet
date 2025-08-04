/**
 * Header Component - CLEANED VERSION
 * Управляет header и координирует с navbar
 */
class HeaderComponent {
    constructor() {
        this.elements = {};
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
    }
    
    cacheElements() {
        this.elements = {
            header: document.querySelector('.header'),
            mobileToggle: document.getElementById('headerMobileToggle')
        };
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.elements.mobileToggle) {
            this.elements.mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Listen for navbar state changes
        document.addEventListener('navbar:toggled', (e) => {
            this.handleNavbarToggle(e.detail.collapsed);
        });
    }
    
    toggleMobileMenu() {
        // Dispatch event to layout controller
        document.dispatchEvent(new CustomEvent('header:mobile-toggle'));
    }
    
    handleNavbarToggle(isCollapsed) {
        // Можем добавить дополнительную логику при изменении navbar
        console.log('Navbar is', isCollapsed ? 'collapsed' : 'expanded');
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!window.headerInstance) {
        window.headerInstance = new HeaderComponent();
    }
});