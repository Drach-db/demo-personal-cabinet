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
        this.updateTodayBadge();
        // Listen storage updates (from Today page or other tabs)
        window.addEventListener('storage', (e) => {
            if (e && e.key === 'today-unread-count') {
                this.updateTodayBadge();
            }
        });
        
        // Apply the initial state ТОЛЬКО для десктопа
        if (!this.isMobile) {
            if (this.isCollapsed) {
                this.elements.navbar.classList.add('navbar--collapsed');
                document.body.classList.add('navbar-collapsed');
            } else {
                this.elements.navbar.classList.remove('navbar--collapsed');
                document.body.classList.remove('navbar-collapsed');
            }
            // Remove pre-collapsed class set early in <head>
            document.documentElement.classList.remove('navbar-pre-collapsed');
        }
    }

    /**
     * Update Today badge using persisted unread count
     */
    updateTodayBadge() {
        const el = document.getElementById('navbar-today-badge');
        if (!el) return;
        let count = 0;
        try {
            const raw = localStorage.getItem('today-unread-count');
            count = raw ? parseInt(raw, 10) : 0;
        } catch (e) { /* ignore */ }
        if (count > 0) {
            el.textContent = count > 99 ? '99+' : String(count);
            el.style.display = '';
            el.setAttribute('aria-label', `${count} unread`);
            el.classList.remove('badge--empty');
            el.classList.add('badge--filled');
        } else {
            el.textContent = '0';
            el.style.display = '';
            el.setAttribute('aria-label', '0 unread');
            el.classList.remove('badge--filled');
            el.classList.add('badge--empty');
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
        // На мобильных НЕ загружаем состояние из localStorage
        if (this.isMobile) {
            this.isCollapsed = false; // Navbar всегда развернут на мобильных (но скрыт через CSS)
            return;
        }
        
        try {
            const savedState = localStorage.getItem(this.options.localStorageKey);
            if (savedState) {
                const state = JSON.parse(savedState);
                this.isCollapsed = state.collapsed || false;
            } else {
                this.isCollapsed = false; // Desktop по умолчанию развернут
            }
        } catch (e) {
            console.warn('Failed to load navbar state:', e);
            this.isCollapsed = false;
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
        // Collapse button - только для десктопа
        if (this.elements.collapse) {
            this.elements.collapse.addEventListener('click', () => {
                if (!this.isMobile) this.toggleCollapse();
            });
        }
        // Logo toggle (Claude-like icon) — desktop only
        const logoToggle = document.getElementById('navbarLogoToggle');
        if (logoToggle) {
            logoToggle.addEventListener('click', (e) => {
                if (this.isMobile) return;
                e.stopPropagation();
                this.toggleCollapse();
            });
            logoToggle.addEventListener('keydown', (e) => {
                if (this.isMobile) return;
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleCollapse();
                }
            });
        }

        // Navigation links
        this.elements.links.forEach(link => {
            link.addEventListener('click', (e) => this.handleLinkClick(e, link));
        });

        // User button
        if (this.elements.userButton) {
            this.elements.userButton.addEventListener('click', () => this.handleUserClick());
        }

        // Navbar click to expand/collapse - ТОЛЬКО для десктопа
        this.elements.navbar.addEventListener('click', (e) => {
            if (this.isMobile) return; // Не обрабатываем на мобильных
            
            // Если клик по стрелочке — не обрабатываем тут (уже есть отдельный обработчик)
            if (e.target.closest('.navbar__collapse')) return;
            // Если клик по ссылке меню или по кнопке пользователя — не обрабатываем
            if (e.target.closest('.navbar__link') || e.target.closest('.navbar__user-button')) return;

            // Клик по не кликабельной области
            if (this.isCollapsed) {
                this.expand();
            } else {
                this.collapse();
            }
        });

        // Window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.handleResize(), 250);
        });

        // Keyboard navigation - только для десктопа
        document.addEventListener('keydown', (e) => {
            if (!this.isMobile) {
                this.handleKeyboard(e);
            }
        });

        // User toggle - только для десктопа
        const userToggle = document.querySelector('.navbar__user-toggle');
        if (userToggle) {
            userToggle.addEventListener('click', (e) => {
                if (this.isMobile) return; // Не обрабатываем на мобильных
                
                e.stopPropagation();
                if (this.isCollapsed) {
                    this.expand();
                } else {
                    this.collapse();
                }
            });
            // Доступность: по Enter/Space
            userToggle.addEventListener('keydown', (e) => {
                if (this.isMobile) return; // Не обрабатываем на мобильных
                
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (this.isCollapsed) {
                        this.expand();
                    } else {
                        this.collapse();
                    }
                }
            });
        }
    }

    /**
     * Toggle collapsed state
     */
    toggleCollapse() {
        // На мобильных не делаем toggle
        if (this.isMobile) return;
        
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
            // Убираем все collapsed классы при переходе на мобильную версию
            this.elements.navbar.classList.remove('navbar--collapsed');
            document.body.classList.remove('navbar-collapsed');
            this.isCollapsed = false;
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
        if (!this.isMobile && !this.isCollapsed) {
            this.toggleCollapse();
        }
    }

    expand() {
        if (!this.isMobile && this.isCollapsed) {
            this.toggleCollapse();
        }
    }

    toggle() {
        if (!this.isMobile) {
            this.toggleCollapse();
        }
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
