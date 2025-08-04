/**
 * Header Component
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
            mobileToggle: document.getElementById('headerMobileToggle'),
            searchBtn: document.querySelector('.header__action[aria-label="Search"]'),
            notificationsBtn: document.querySelector('.header__action[aria-label="Notifications"]'),
            userBtn: document.querySelector('.header__user')
        };
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.elements.mobileToggle) {
            this.elements.mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Search button
        if (this.elements.searchBtn) {
            this.elements.searchBtn.addEventListener('click', () => {
                console.log('Search clicked');
                // Implement search functionality
            });
        }
        
        // Notifications
        if (this.elements.notificationsBtn) {
            this.elements.notificationsBtn.addEventListener('click', () => {
                console.log('Notifications clicked');
                // Implement notifications dropdown
            });
        }
        
        // User menu
        if (this.elements.userBtn) {
            this.elements.userBtn.addEventListener('click', () => {
                console.log('User menu clicked');
                // Implement user dropdown menu
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