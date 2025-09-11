// ========================================
// ОБЯЗАТЕЛЬНЫЕ ИМПОРТЫ
// ========================================
import '../../components/layout/layout.js';
import '../../components/navbar/navbar.js';
import '../../components/header/header.js';
import api from './api.js';
window.api = api;

// ========================================
// CONFIGURATION & CONSTANTS
// ========================================
const CONFIG = {
    // Payment status configuration
    paymentStatus: {
        paid: { color: 'success', icon: 'checkCircle' },
        pending: { color: 'warning', icon: 'clock' },
        overdue: { color: 'danger', icon: 'alertCircle' }
    },
    
    // Period types
    periodTypes: {
        regular: { color: 'success', icon: 'checkCircle', label: 'Regular' },
        custom: { color: 'primary', icon: 'alertCircle', label: 'Custom' }
    },
    
    // Analytics card configurations
    analyticsCards: {
        planned: { icon: 'fileText', color: 'warning', label: 'Planned' },
        projected: { icon: 'calendar', color: 'info', label: 'Projected' },
        current: { icon: 'checkCircle', color: 'success', label: 'Current' }
    }
};

// ========================================
// STATE MANAGEMENT
// ========================================
const state = {
    billingData: [],
    loading: true,
    activeCardIndex: 0,
    windowWidth: window.innerWidth,
    historyLimit: 10
};
window.state = state;

// ========================================
// ICON SYSTEM
// ========================================
const iconPaths = {
    dollarSign: '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',
    fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
    checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
    alertCircle: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>',
    clock: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
    xCircle: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
};

// ========================================
// UTILITY FUNCTIONS
// ========================================
const utils = {
    // Device detection
    device: {
        isMobile: () => state.windowWidth < 768,
        isTablet: () => state.windowWidth < 1024,
        isDesktop: () => state.windowWidth >= 1024
    },

    // Formatters
    formatters: {
        date: (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-GB').format(date);
        },
        
        period: (start, end) => `${utils.formatters.date(start)}—${utils.formatters.date(end)}`,
        
        currency: (amount) => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount),
        
        number: (num) => num.toLocaleString()
    }
};

// ========================================
// ICON CREATION
// ========================================
function createIcon(name, size = 18) {
    const path = iconPaths[name];
    if (!path) return '';
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

// ========================================
// COMPONENT BUILDERS
// ========================================
const components = {
    // Section header component
    sectionHeader: ({ icon, title, subtitle, badge }) => `
        <div class="billing-section-header">
            <div class="billing-section-header__main">
                ${icon ? `<div class="billing-icon-wrapper billing-icon-wrapper--primary">${icon}</div>` : ''}
                <div class="billing-section-header__text">
                    <h2>${title}</h2>
                    ${subtitle ? `<p>${subtitle}</p>` : ''}
                </div>
            </div>
            ${badge || ''}
        </div>
    `,

    // Badge component
    badge: (text, type = 'primary', icon = null) => `
        <div class="billing-badge billing-badge--${type}">
            ${icon ? createIcon(icon, 14) : ''}
            ${text}
        </div>
    `,

    // Status badge component
    statusBadge: (status) => `
        <div class="billing-status-badge billing-status-badge--${status}">
            ${status}
        </div>
    `,

    // Action button component
    actionButton: (type, icon, onClick) => `
        <button class="billing-action-button billing-action-button--${type}" onclick="${onClick}">
            ${createIcon(icon, 14)}
        </button>
    `,

    // Analytics card component
    analyticsCard: (type, data) => {
        const config = CONFIG.analyticsCards[type];
        let value, hours;
        
        switch(type) {
            case 'planned':
                value = data.plannedMonthTotal;
                hours = data.plannedHoursMonth;
                break;
            case 'projected':
                value = data.projectedMonthTotal;
                hours = Math.round(data.projectedMonthTotal / data.hourlyRate);
                break;
            case 'current':
                value = data.currentTotal;
                hours = data.hoursWorkedSoFar;
                break;
        }

        const iconBg = `rgba(var(--billing-color-${config.color}-rgb), 0.15)`;
        
        return `
            <div class="billing-analytics-card billing-analytics-card--${config.color}">
                <div class="billing-flex billing-flex-col billing-gap-sm">
                    <span style="font-size: 0.875rem; font-weight: 600; color: var(--billing-color-gray);">
                        ${config.label}
                    </span>
                    <div style="width: 3.5rem; height: 3rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; background-color: ${iconBg};">
                        <span class="billing-text-${config.color}">${createIcon(config.icon)}</span>
                    </div>
                </div>
                <div class="billing-text-right">
                    <div style="font-size: 1.875rem; font-weight: 700;" class="billing-text-${config.color}">
                        ${utils.formatters.currency(value)}
                    </div>
                    <div style="font-size: 0.9375rem; font-weight: 500; color: var(--billing-color-gray); margin-top: 0.25rem;">
                        ${hours} hours
                    </div>
                </div>
            </div>
        `;
    },

    // Table row component
    tableRow: (item, index, isLast) => {
        const periodType = CONFIG.periodTypes[item.period_type] || CONFIG.periodTypes.regular;
        const total = item.actual_hours * item.hourly_rate;
        
        return `
            <div class="billing-table-grid billing-table-row" style="border-bottom: ${isLast ? 'none' : '1px solid rgba(0, 0, 0, 0.04)'};">
                <div class="billing-text-center" style="font-size: 0.875rem; font-weight: 600; color: #374151;">
                    ${utils.formatters.period(item.start_date, item.end_date)}
                </div>

                <div class="billing-flex billing-items-center" style="justify-content: center;">
                    ${components.badge(periodType.label, periodType.color, periodType.icon)}
                </div>

                <div class="billing-text-center" style="font-size: 0.875rem; font-weight: 500; color: var(--billing-color-gray);">
                    ${utils.formatters.number(item.planned_hours)} hrs
                </div>

                <div class="billing-text-center" style="font-size: 0.875rem; font-weight: 600; color: #374151;">
                    ${utils.formatters.number(item.actual_hours)} hrs
                </div>

                <div class="billing-text-center" style="font-size: 0.875rem; font-weight: 600; color: #374151;">
                    $${item.hourly_rate}
                </div>

                <div class="billing-flex billing-items-center billing-justify-between" style="justify-content: center; gap: 0.5rem;">
                    ${components.actionButton('success', 'fileText', `handleView('${item.invoice_url}')`)}
                    ${components.actionButton('info', 'download', `handleDownload('${item.invoice_url}', 'invoice-${item.id}.pdf')`)}
                </div>

                <div class="billing-flex billing-items-center billing-justify-between" style="justify-content: center; gap: 0.5rem;">
                    ${components.actionButton('success', 'fileText', `handleView('${item.report_url}')`)}
                    ${components.actionButton('info', 'download', `handleDownload('${item.report_url}', 'report-${item.id}.pdf')`)}
                </div>

                <div class="billing-flex billing-items-center" style="justify-content: center;">
                    ${components.statusBadge(item.payment_status)}
                </div>

                <div class="billing-text-center billing-flex billing-flex-col billing-items-center">
                    <div style="font-size: 1rem; font-weight: 700; color: #374151;">
                        ${utils.formatters.currency(total)}
                    </div>
                    <div style="font-size: 0.75rem; font-weight: 500; color: var(--billing-color-gray);">
                        ${item.actual_hours}h × $${item.hourly_rate}
                    </div>
                </div>

                <div class="billing-text-center" style="font-size: 0.875rem; font-weight: 500; color: var(--billing-color-gray);">
                    ${utils.formatters.date(item.created_date)}
                </div>
            </div>
        `;
    }
};

// ========================================
// DATA FUNCTIONS
// ========================================
function getCurrentMonthData(billingData) {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const currentDay = currentDate.getDate();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    // Calculate from actual data
    let hoursWorkedSoFar = 0;
    let plannedHoursMonth = 0;
    let hourlyRate = 18.5; // Default rate
    
    // Get current month records
    const currentMonthRecords = billingData.filter(record => {
        const recordDate = new Date(record.start_date);
        return recordDate.getMonth() === currentDate.getMonth() && 
               recordDate.getFullYear() === currentDate.getFullYear();
    });
    
    if (currentMonthRecords.length > 0) {
        hoursWorkedSoFar = currentMonthRecords.reduce((sum, record) => sum + record.actual_hours, 0);
        plannedHoursMonth = currentMonthRecords.reduce((sum, record) => sum + record.planned_hours, 0);
        hourlyRate = currentMonthRecords[0].hourly_rate || hourlyRate;
    }
    
    const currentTotal = hoursWorkedSoFar * hourlyRate;
    const plannedMonthTotal = plannedHoursMonth * hourlyRate;
    const projectedMonthTotal = (plannedMonthTotal / currentDay) * daysInMonth;
    
    return {
        month: currentMonth,
        hoursWorkedSoFar,
        plannedHoursMonth,
        hourlyRate,
        currentTotal,
        plannedMonthTotal,
        projectedMonthTotal,
        currentDay,
        daysInMonth,
        teamMembers: 25,
        teamMembersCost: 9350,
        progressPercentage: (currentDay / daysInMonth) * 100
    };
}

const includedServices = [
    { label: 'Team Lead', count: 1, originalPrice: 2800 },
    { label: 'Buffer Staff', count: 3, originalPrice: 1680 },
    { label: 'Software & Tools', count: null, originalPrice: 450 },
    { label: 'Management', count: null, originalPrice: 1200 }
];

// ========================================
// ГЛОБАЛЬНЫЕ ФУНКЦИИ для onclick
// ========================================
window.handleDownload = function(url, filename) {
    if (!url) {
        console.warn('No URL provided for download');
        return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.handleView = function(url) {
    if (!url) {
        console.warn('No URL provided for view');
        return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
};

window.scrollToCard = function(index) {
    const container = document.getElementById('analyticsCards');
    if (container) {
        const cards = container.children;
        if (cards[index]) {
            const cardWidth = cards[index].offsetWidth;
            const gap = 16;
            const scrollPosition = index * (cardWidth + gap);
            container.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            updateActiveCard(index);
        }
    }
};

// ========================================
// CAROUSEL FUNCTIONS
// ========================================
function updateActiveCard(index) {
    state.activeCardIndex = index;
    const dots = document.querySelectorAll('.billing-carousel-dot');
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function setupCarousel() {
    const container = document.getElementById('analyticsCards');
    if (container) {
        container.addEventListener('scroll', () => {
            const cards = Array.from(container.children);
            if (cards.length === 0) return;
            
            const containerRect = container.getBoundingClientRect();
            const containerCenter = containerRect.left + containerRect.width / 2;
            
            let closestIndex = 0;
            let closestDistance = Infinity;
            
            cards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distance = Math.abs(containerCenter - cardCenter);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });
            
            updateActiveCard(closestIndex);
        });
    }
}

// ========================================
// RENDER FUNCTIONS
// ========================================
function renderDashboard(currentMonthData) {
    return `
        ${components.sectionHeader({
            icon: createIcon('dollarSign'),
            title: 'Current Month Overview',
            subtitle: `${currentMonthData.month} • Live Data`,
            badge: `
                <div class="billing-live-indicator billing-hide-mobile">
                    <div class="billing-live-dot"></div>
                    <span style="font-size: 0.75rem; font-weight: 500; color: var(--billing-color-success);">
                        LIVE
                    </span>
                </div>
            `
        })}

        <!-- Cost Breakdown + Analytics Cards -->
        <div class="billing-cost-analytics-grid">
            <!-- Cost Breakdown Card -->
            <div class="billing-cost-breakdown-card">
                <div class="billing-flex billing-items-center billing-gap-md" style="margin-bottom: 1.5rem;">
                    <h3 style="font-size: 0.9375rem; font-weight: 600; color: #374151; margin: 0;">
                        Cost Breakdown
                    </h3>
                    <div class="billing-hide-mobile" style="margin-left: auto;">
                        ${components.badge('PAY 1 • GET 5', 'success')}
                    </div>
                </div>

                <!-- Team Members -->
                <div style="padding: 0.75rem; border-radius: 0.75rem; margin-bottom: 1rem; background-color: rgba(var(--billing-color-primary-rgb), 0.05);">
                    <div class="billing-flex billing-justify-between billing-items-center" style="margin-bottom: 0.75rem;">
                        <span style="font-size: 0.9375rem; font-weight: 600; color: #374151;">
                            Team Members (${currentMonthData.teamMembers})
                        </span>
                        <span style="font-size: 1rem; font-weight: 700; color: var(--billing-color-primary);">
                            ${utils.formatters.currency(currentMonthData.teamMembersCost)}
                        </span>
                    </div>
                    <div style="width: 100%; height: 0.5rem; border-radius: 9999px; background-color: rgba(var(--billing-color-primary-rgb), 0.2);">
                        <div style="width: 100%; height: 0.5rem; border-radius: 9999px; background-color: var(--billing-color-primary);"></div>
                    </div>
                </div>

                <!-- Included Services -->
                <div style="margin-bottom: 1rem;">
                    ${includedServices.map(item => `
                        <div class="billing-flex billing-items-center billing-justify-between" style="padding: 0.375rem 0;">
                            <div class="billing-flex billing-items-center billing-gap-sm">
                                <div style="width: 0.75rem; height: 0.375rem; border-radius: 9999px; background-color: rgba(var(--billing-color-gray-rgb), 0.3);"></div>
                                <span style="font-size: 0.875rem; font-weight: 500; color: var(--billing-color-gray);">
                                    ${item.label} ${item.count ? `(${item.count})` : ''}
                                </span>
                            </div>
                            <div class="billing-flex billing-items-center billing-gap-sm">
                                <span style="font-size: 0.875rem; font-weight: 600; color: #9ca3af; text-decoration: line-through; text-decoration-color: var(--billing-color-danger); text-decoration-thickness: 2px;">
                                    ${utils.formatters.currency(item.originalPrice)}
                                </span>
                                <span style="font-size: 0.75rem; font-weight: 600; color: var(--billing-color-success);">
                                    FREE
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Total -->
                <div style="border-top: 1px solid rgba(0, 0, 0, 0.1); padding-top: 1rem;">
                    <div class="billing-flex billing-justify-between billing-items-center" style="margin-bottom: 0.75rem;">
                        <span style="font-size: 0.9375rem; font-weight: 700; color: #374151;">
                            Total This Month
                        </span>
                        <span style="font-size: 1.125rem; font-weight: 700; color: #374151;">
                            ${utils.formatters.currency(currentMonthData.currentTotal)}
                        </span>
                    </div>
                    
                    <div style="text-align: center; padding: 0.75rem; border-radius: 0.75rem; background-color: rgba(var(--billing-color-success-rgb), 0.05);">
                        <span style="font-size: 0.75rem; font-weight: 600; color: var(--billing-color-success);">
                            🎉 You save ${utils.formatters.currency(6130)} in additional services • 
                            <span style="color: var(--billing-color-primary);">${Math.round((6130 / (currentMonthData.currentTotal + 6130)) * 100)}% extra value!</span>
                        </span>
                    </div>
                </div>
            </div>
            
            <!-- Analytics Cards Container -->
            <div class="billing-flex billing-flex-col" style="flex: 1;">
                <div class="billing-analytics-cards-container" id="analyticsCards">
                    ${components.analyticsCard('planned', currentMonthData)}
                    ${components.analyticsCard('projected', currentMonthData)}
                    ${components.analyticsCard('current', currentMonthData)}
                </div>
                
                <!-- Carousel Indicators -->
                <div class="billing-carousel-indicators">
                    ${['warning', 'info', 'success'].map((color, i) => `
                        <div class="billing-carousel-dot ${state.activeCardIndex === i ? 'active' : ''}" 
                             style="background-color: var(--billing-color-${color});" 
                             onclick="scrollToCard(${i})"></div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderHistory() {
    const total = state.billingData.length;
    
    // ✅ Безопасное использование historyLimit с fallback
    const limit = state.historyLimit || 10;
    const rows = state.billingData.slice(0, limit);
    const showing = rows.length;
    
    console.log('📊 Rendering history:', { total, limit, showing }); // Для отладки
    
    return `
        ${components.sectionHeader({
            icon: createIcon('fileText'),
            title: 'Billing History',
            subtitle: 'Invoice and report management',
            badge: `
                <div class="billing-hide-mobile">
                    ${components.badge(`${showing} of ${total} Records`, 'primary')}
                </div>
            `
        })}

        <!-- Table Container -->
        <div class="billing-table-scroll">
            <!-- Horizontal Scroll Hint (mobile/tablet) -->
            <div class="billing-scroll-hint">
                <span style="font-size: 1rem;">↔</span>
                <span>Scroll horizontally</span>
            </div>
            <!-- Column Headers -->
            <div class="billing-table-grid billing-table-header">
                ${['Billing Period', 'Type', 'Planned', 'Actual', 'Rate', 'Invoice', 'Report', 'Status', 'Total', 'Created'].map((header) => `
                    <div style="font-size: 0.75rem; font-weight: 600; color: var(--billing-color-gray); text-transform: uppercase; letter-spacing: 0.05em; text-align: center;">
                        ${header}
                    </div>
                `).join('')}
            </div>

            <!-- Table Rows -->
            <div>
                ${total === 0 ? `
                    <div style="padding: 4rem; text-align: center;">
                        <div style="width: 3.5rem; height: 3.5rem; border-radius: 1rem; margin: 0 auto 1rem auto; display: flex; align-items: center; justify-content: center; background-color: rgba(var(--billing-color-gray-rgb), 0.1);">
                            ${createIcon('fileText', 28)}
                        </div>
                        <h3 style="font-size: 1.125rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                            No billing records found
                        </h3>
                        <p style="font-size: 0.875rem; color: var(--billing-color-gray);">
                            No invoices found in the database
                        </p>
                    </div>
                ` : rows.map((item, index) => 
                    components.tableRow(item, index, index === showing - 1)
                ).join('')}
            </div>
        </div>
        ${total > showing ? `
            <div class="billing-flex billing-justify-center" style="margin-top: 1rem;">
                <button class="billing-action-button billing-action-button--primary" onclick="showMoreHistory()" style="padding: 0.5rem 0.75rem;">
                    Load more (${Math.min(total - showing, 25)})
                </button>
            </div>
        ` : ''}
    `;
}

function renderLoading() {
    return `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading billing data...</p>
        </div>
    `;
}

// ========================================
// MAIN RENDER FUNCTION
// ========================================
function render() {
    const dashboardSection = document.getElementById('dashboardSection');
    const historySection = document.getElementById('historySection');
    
    if (state.loading) {
        // Show top-level loading and hide both cards for clean view
        const loadingEl = document.getElementById('billingLoadingContainer');
        if (loadingEl) loadingEl.classList.remove('hidden');

        const dashboardCard = dashboardSection ? dashboardSection.closest('.billing-card') : null;
        const historyCard = historySection ? historySection.closest('.billing-card') : null;
        if (dashboardCard) dashboardCard.style.display = 'none';
        if (historyCard) historyCard.style.display = 'none';
        return;
    }
    
    const currentMonthData = getCurrentMonthData(state.billingData);
    
    // Hide top-level loading when data ready
    const loadingEl = document.getElementById('billingLoadingContainer');
    if (loadingEl) loadingEl.classList.add('hidden');

    if (dashboardSection) {
        dashboardSection.innerHTML = renderDashboard(currentMonthData);
    }
    
    if (historySection) {
        historySection.innerHTML = renderHistory();
    }

    // Show cards (both) when content is ready
    const dashboardCard = dashboardSection ? dashboardSection.closest('.billing-card') : null;
    const historyCard = historySection ? historySection.closest('.billing-card') : null;
    if (dashboardCard) dashboardCard.style.display = '';
    if (historyCard) historyCard.style.display = '';
    
    // Set up event listeners after render
    if (utils.device.isMobile()) {
        setupCarousel();
    }
}

// ========================================
// DATA LOADING
// ========================================
// Simple cache helpers
const CACHE_TTL_MS = 5 * 60 * 1000;
const cacheKeyBilling = () => 'billing_records_v1';
function cacheGet(key, ttlMs = CACHE_TTL_MS) {
    try {
        const raw = sessionStorage.getItem(key);
        if (!raw) return null;
        const { ts, data } = JSON.parse(raw);
        if (Date.now() - ts > ttlMs) return null;
        return data;
    } catch { return null; }
}
function cacheSet(key, data) {
    try { sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch {}
}
async function loadBillingData() {
    try {
        console.log('📊 Loading billing data...');
        const data = await api.getBillingRecords();
        
        // ✅ Добавим валидацию и логирование
        if (!Array.isArray(data)) {
            console.error('❌ Data is not an array:', data);
            state.billingData = [];
            return [];
        }
        
        console.log(`✅ Loaded ${data.length} billing records:`, data);
        
        // ✅ Проверим первую запись для отладки
        if (data.length > 0) {
            console.log('First record structure:', data[0]);
        }
        
        state.billingData = data;
        cacheSet(cacheKeyBilling(), data);
        return data;
    } catch (error) {
        console.error('❌ Error loading billing data:', error);
        state.billingData = [];
        throw error;
    }
}

// ========================================
// ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('✅ Billing page loaded');
    
    try {
        // 1) cache-first render
        const cached = cacheGet(cacheKeyBilling());
        if (cached) {
            state.billingData = cached;
            state.loading = false;
            render();
        } else {
            state.loading = true;
            render();
        }

        // 2) refresh in background
        await loadBillingData();
        state.loading = false;
        render();
        
    } catch (error) {
        console.error('❌ Error initializing billing page:', error);
        state.loading = false;
        // Still render to show empty state
        render();
    }
});

// ========================================
// EVENT LISTENERS
// ========================================
window.addEventListener('resize', () => {
    state.windowWidth = window.innerWidth;
    render();
});

// Load more history rows
window.showMoreHistory = function() {
    state.historyLimit += 25;
    const historySection = document.getElementById('historySection');
    if (historySection) historySection.innerHTML = renderHistory();
};
