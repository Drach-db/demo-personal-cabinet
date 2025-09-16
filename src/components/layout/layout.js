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
        this.mountMeetingWidget();
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

    // ========================================
    // Floating Meeting Widget (Apollo)
    // ========================================
    mountMeetingWidget() {
        try {
            // Avoid duplicates
            if (document.getElementById('meet-widget-fab')) return;

            const link = 'https://app.apollo.io/#/meet/pjz-lax-iol/30-min';

            // Button
            const btn = document.createElement('button');
            btn.id = 'meet-widget-fab';
            btn.className = 'meet-fab';
            btn.setAttribute('type', 'button');
            btn.setAttribute('aria-label', 'Book a discovery meeting');
            // Meeting-themed calendar + clock icon (inline SVG for crispness)
            btn.innerHTML = `
                <span class="meet-fab__icon" aria-hidden="true">
                  <svg class="meet-fab__svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <circle cx="16" cy="16" r="4" fill="none"></circle>
                    <line x1="16" y1="16" x2="16" y2="14"></line>
                    <line x1="16" y1="16" x2="18" y2="16"></line>
                  </svg>
                </span>
                <span class="meet-fab__text">Book a meeting</span>
            `;
            document.body.appendChild(btn);

            // Overlay (desktop modal)
            const overlay = document.createElement('div');
            overlay.id = 'meet-widget-overlay';
            overlay.className = 'meet-overlay';
            overlay.innerHTML = `
                <div class="meet-dialog" role="dialog" aria-modal="true" aria-label="Discovery meeting">
                    <button class="meet-close" aria-label="Close">×</button>
                    <iframe class="meet-iframe" src="${link}" title="Discovery Meeting"></iframe>
                </div>`;
            document.body.appendChild(overlay);

            const openModal = () => {
                // Apollo blocks embedding via X-Frame-Options/CSP on many domains.
                // Always open in a new tab/window for maximum compatibility.
                try {
                    const w = window.open(link, '_blank', 'noopener');
                    if (!w) {
                        // Popup blocked — fallback to same-tab navigation
                        window.location.href = link;
                    }
                } catch (_) {
                    window.location.href = link;
                }
            };
            const closeModal = () => {
                overlay.classList.remove('open');
                document.body.classList.remove('modal-open');
            };

            btn.addEventListener('click', openModal);
            // Keep overlay assets for future use, but do not show modal anymore
            overlay.addEventListener('click', (e) => { /* no-op: modal disabled */ });
            const closeBtn = overlay.querySelector('.meet-close');
            if (closeBtn) closeBtn.addEventListener('click', (e) => e.preventDefault());

            // Animation & hint on mobile for better CTA clarity
            btn.classList.add('pulse', 'shake');
            if (window.innerWidth < 1024) {
                const hintKey = 'meet-widget-hint-dismissed-v1';
                const dismissed = (() => { try { return localStorage.getItem(hintKey) === '1'; } catch { return false; }})();
                if (!dismissed) {
                    const hint = document.createElement('div');
                    hint.className = 'meet-hint';
                    hint.innerHTML = '<span>Book a meeting</span>';
                    document.body.appendChild(hint);
                    const hide = () => { hint.remove(); try { localStorage.setItem(hintKey, '1'); } catch {} };
                    setTimeout(hide, 6000);
                    btn.addEventListener('click', hide, { once: true });
                }
            }
        } catch (e) {
            console.warn('Meeting widget mount failed:', e);
        }
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
