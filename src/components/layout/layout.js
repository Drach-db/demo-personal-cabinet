/**
 * Layout Controller - координирует navbar и header
 * ИСПРАВЛЕННАЯ ВЕРСИЯ с правильным управлением классами
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
            navbarElement: document.getElementById('navbar')
        };
    }
    
    loadState() {
        if (!this.state.isMobile) {
            const saved = localStorage.getItem('layout-state');
            if (saved) {
                try {
                    const state = JSON.parse(saved);
                    this.state.navbarCollapsed = state.navbarCollapsed || false;
                } catch (e) {
                    console.warn('Failed to parse saved state');
                }
            }
        }
    }
    
    saveState() {
        if (!this.state.isMobile) {
            localStorage.setItem('layout-state', JSON.stringify({
                navbarCollapsed: this.state.navbarCollapsed,
                timestamp: Date.now()
            }));
        }
    }
    
    bindEvents() {
        // Listen for navbar toggle from navbar component
        document.addEventListener('navbar:toggled', (e) => {
            this.state.navbarCollapsed = e.detail.collapsed;
            this.updateLayout();
            this.saveState();
        });
        
        // Listen for mobile menu toggle from header
        document.addEventListener('header:mobile-toggle', () => {
            this.toggleMobileMenu();
        });
        
        // Overlay click (close mobile menu)
        if (this.elements.overlay) {
            this.elements.overlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
        
        // Window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.handleResize(), 250);
        });
        
        // ESC key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        // Проверяем, что мы на мобильном устройстве
        if (!this.state.isMobile) return;
        
        this.state.mobileMenuOpen = !this.state.mobileMenuOpen;
        this.updateMobileMenu();
    }
    
    closeMobileMenu() {
        this.state.mobileMenuOpen = false;
        this.updateMobileMenu();
    }
    
    updateLayout() {
        // На мобильных не применяем collapsed классы
        if (this.state.isMobile) return;
        
        // ВАЖНО: Обновляем классы на ВСЕХ необходимых элементах (только для десктопа)
        if (this.state.navbarCollapsed) {
            // Добавляем класс на body для глобального доступа
            document.body.classList.add('navbar-collapsed');
            // Добавляем класс на layout контейнер
            this.elements.layout.classList.add('navbar-collapsed');
            // Добавляем класс на сам navbar
            if (this.elements.navbarElement) {
                this.elements.navbarElement.classList.add('navbar--collapsed');
            }
        } else {
            // Убираем класс с body
            document.body.classList.remove('navbar-collapsed');
            // Убираем класс с layout контейнера
            this.elements.layout.classList.remove('navbar-collapsed');
            // Убираем класс с navbar
            if (this.elements.navbarElement) {
                this.elements.navbarElement.classList.remove('navbar--collapsed');
            }
        }
    }
    
    updateMobileMenu() {
        const toggle = document.getElementById('headerMobileToggle');
        
        if (this.state.mobileMenuOpen) {
            this.elements.navbar.classList.add('mobile-open');
            this.elements.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Добавляем класс для кнопки
            if (toggle) {
                toggle.classList.add('menu-open');
                // Анимация бургер-меню в X
                toggle.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                `;
            }
        } else {
            this.elements.navbar.classList.remove('mobile-open');
            this.elements.overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Убираем класс с кнопки
            if (toggle) {
                toggle.classList.remove('menu-open');
                // Вернуть бургер-меню
                toggle.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                `;
            }
        }
    }
    
    handleResize() {
        const wasMobile = this.state.isMobile;
        this.state.isMobile = window.innerWidth < 768;
        
        if (wasMobile !== this.state.isMobile) {
            if (this.state.isMobile) {
                // Switching to mobile
                this.closeMobileMenu();
                // Убираем все collapsed классы при переходе на мобильную версию
                document.body.classList.remove('navbar-collapsed');
                this.elements.layout.classList.remove('navbar-collapsed');
                if (this.elements.navbarElement) {
                    this.elements.navbarElement.classList.remove('navbar--collapsed');
                }
            } else {
                // Switching to desktop
                this.closeMobileMenu();
                this.loadState();
                this.updateLayout();
            }
        }
    }
    
    applyInitialState() {
        // Применяем layout только для десктопа
        if (!this.state.isMobile) {
            this.updateLayout();
            
            // Синхронизируем navbar с layout состоянием
            if (window.navbarInstance) {
                if (this.state.navbarCollapsed && !window.navbarInstance.isNavbarCollapsed()) {
                    window.navbarInstance.collapse();
                } else if (!this.state.navbarCollapsed && window.navbarInstance.isNavbarCollapsed()) {
                    window.navbarInstance.expand();
                }
            }
        }
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!window.layoutController) {
        window.layoutController = new LayoutController();
    }
});
