// ========================================
// IMPORTS
// ========================================
import '../../components/layout/layout.js';
import '../../components/navbar/navbar.js';
import '../../components/header/header.js';
import api from './api.js';

console.log('📍 Script.js loaded');
console.log('📍 API object:', api);

// ========================================
// ICONS SVG LIBRARY
// ========================================
const ICONS = {
    chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>',
    chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>',
    chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>',
    filter: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    alertTriangle: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    clock: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    checkCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    briefcase: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
    userCheck: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>',
    award: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>'
};

// ========================================
// CONSTANTS
// ========================================
const CONSTANTS = {
    CURRENT_DATE: new Date(),
    CELL_WIDTH: 100,
    EMPLOYEE_COL_WIDTH: 300,
    MOBILE_CELL_WIDTH: 70,
    MOBILE_EMPLOYEE_COL_WIDTH: 80,
    Z_INDEX: { MODAL: 9999, BOTTOM_SHEET: 9990 }
};

const COLORS = {
    BRAND: '#cc6633',
    BACKGROUND: {
        main: '#f0eee7',
        card: 'rgba(255, 255, 255, 0.85)',
        childRow: '#f8f7f4',
        header: '#faf9f6',
        stickyCell: '#fcfcfb'
    },
    STAGES: {
        'Active': 'badge-active',
        'Terminated': 'badge-terminated',
        'Onboarding': 'badge-onboarding'
    }
};

// ========================================
// SHIFT CALENDAR CLASS
// ========================================
class ShiftCalendar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isMobile = window.innerWidth < 784;
        
        // State
        this.state = {
            currentMonth: CONSTANTS.CURRENT_DATE.getMonth(),
            currentYear: CONSTANTS.CURRENT_DATE.getFullYear(),
            viewMode: 'Actual',
            searchTerm: '',
            filters: { project: [], stage: [], position: [] },
            showBottomSheet: false,
            employeeModal: { isOpen: false, employee: null },
            shiftModal: { isOpen: false, shift: null, baselineShift: null, employee: null },
            legendModal: false,
            tooltip: { isVisible: false, x: 0, y: 0, shift: null, baselineShift: null, employee: null },
            legendTooltip: { isVisible: false, x: 0, y: 0 },
            showProjectDropdown: false,
            showStageDropdown: false,
            showPositionDropdown: false,
            bottomSheetTab: 'project'
        };

        // Data from API
        this.shiftsData = [];
        this.employeesData = [];
        this.isLoading = true;

        // Cached computations
        this.cache = {
            days: null,
            employeesInMonth: null,
            filteredEmployees: null,
            analytics: null
        };

        // Initialize
        this.init();
    }

    async init() {
        console.log('📍 Init started');
        try {
            // Show loading
            this.showLoading();
            
            // Load data from Supabase
            console.log('📍 Loading data...');
            await this.loadData();
            
            // Hide loading
            this.hideLoading();
            
            // Render calendar
            console.log('📍 Rendering calendar...');
            this.render();
            this.setupEventListeners();
            this.setupResizeListener();
            
            // Center on today
            setTimeout(() => this.centerTodayInCalendar(), 100);
            console.log('✅ Init completed');
        } catch (error) {
            console.error('❌ Error initializing calendar:', error);
            this.hideLoading();
            this.showError(error);
        }
    }

    // ========================================
    // DATA LOADING
    // ========================================
    async loadData() {
        console.log('📍 loadData called');
        try {
            // Get current month range
            const startDate = `${this.state.currentYear}-${String(this.state.currentMonth + 1).padStart(2, '0')}-01`;
            const endDate = `${this.state.currentYear}-${String(this.state.currentMonth + 1).padStart(2, '0')}-31`;
            
            console.log('📍 Loading data for:', { 
                year: this.state.currentYear, 
                month: this.state.currentMonth + 1,
                startDate,
                endDate 
            });
            
            // Check if api.getShiftsForMonth exists
            if (!api || !api.getShiftsForMonth) {
                console.error('❌ api.getShiftsForMonth is not available');
                throw new Error('API method not found');
            }
            
            // Load shifts for month
            const monthData = await api.getShiftsForMonth(this.state.currentYear, this.state.currentMonth + 1);
            
            console.log('📍 Data received:', monthData);
            
            this.employeesData = monthData.employees || [];
            this.shiftsData = monthData.shifts || [];
            
            console.log('✅ Data loaded:', {
                employees: this.employeesData.length,
                shifts: this.shiftsData.length
            });
        } catch (error) {
            console.error('❌ Error loading data:', error);
            // Fallback to empty data to prevent crash
            this.employeesData = [];
            this.shiftsData = [];
            throw error;
        }
    }

    showLoading() {
        const loadingContainer = document.getElementById('loading-container');
        const calendarContainer = document.getElementById('calendar-container');
        
        if (loadingContainer) loadingContainer.classList.remove('hidden');
        if (calendarContainer) calendarContainer.classList.add('hidden');
    }

    hideLoading() {
        const loadingContainer = document.getElementById('loading-container');
        const calendarContainer = document.getElementById('calendar-container');
        
        if (loadingContainer) loadingContainer.classList.add('hidden');
        if (calendarContainer) calendarContainer.classList.remove('hidden');
    }

    showError(error) {
        const container = document.getElementById('calendar-container');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-content">
                    <div class="empty-state-icon" style="color: #ef4444;">
                        ${ICONS.alertTriangle}
                    </div>
                    <h3 class="empty-state-title">Error Loading Data</h3>
                    <p class="empty-state-text">${error.message || 'Failed to load schedules'}</p>
                    <button class="empty-state-button" onclick="location.reload()">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    formatDate(dateStr) {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    parseTime(timeStr) {
        if (!timeStr) return undefined;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    checkTimeDiscrepancy(plannedTime, actualTime) {
        if (!plannedTime || !actualTime) return false;
        
        const [pStart, pEnd] = plannedTime.split('-');
        const [aStart, aEnd] = actualTime.split('-');
        
        const plannedStartMinutes = this.parseTime(pStart);
        const plannedEndMinutes = this.parseTime(pEnd);
        const actualStartMinutes = this.parseTime(aStart);
        const actualEndMinutes = this.parseTime(aEnd);
        
        if (!plannedStartMinutes || !plannedEndMinutes || !actualStartMinutes || !actualEndMinutes) {
            return false;
        }
        
        const isLate = actualStartMinutes - plannedStartMinutes >= 10;
        const isEarlyLeave = plannedEndMinutes - actualEndMinutes >= 10;
        
        return isLate || isEarlyLeave;
    }

    toDateStr(d) {
        return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
    }

    isToday(d) {
        return d.toDateString() === CONSTANTS.CURRENT_DATE.toDateString();
    }

    isPast(d) {
        return d < CONSTANTS.CURRENT_DATE;
    }

    getAvatarColor(name) {
        const colors = [
            { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#ffffff' },
            { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: '#ffffff' },
            { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: '#ffffff' },
            { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', text: '#ffffff' }
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }

    getMonthName(month) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month];
    }

    getDayName(date) {
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        return days[date.getDay()];
    }

    getDaysInMonth(month, year) {
        const days = [];
        const date = new Date(year, month, 1);
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    getShiftsForEmployeeAndDate(employeeId, date) {
        const dateStr = this.toDateStr(date);
        return this.shiftsData.filter(shift => 
            shift.employee_id === employeeId && shift.shift_date === dateStr
        );
    }

    // Computed values
    getDays() {
        const key = `${this.state.currentMonth}-${this.state.currentYear}`;
        if (!this.cache.days || this.cache.daysKey !== key) {
            this.cache.days = this.getDaysInMonth(this.state.currentMonth, this.state.currentYear);
            this.cache.daysKey = key;
        }
        return this.cache.days;
    }

    getEmployeesInMonth() {
        const key = `${this.state.currentMonth}-${this.state.currentYear}`;
        if (!this.cache.employeesInMonth || this.cache.employeesKey !== key) {
            const monthStart = new Date(this.state.currentYear, this.state.currentMonth, 1);
            const monthEnd = new Date(this.state.currentYear, this.state.currentMonth + 1, 0);
            
            this.cache.employeesInMonth = this.employeesData.filter(emp => {
                const startDate = emp.start_date ? this.formatDate(emp.start_date) : 
                                 emp.interview_date ? this.formatDate(emp.interview_date) : null;
                const endDate = emp.end_date ? this.formatDate(emp.end_date) : null;
                
                if (!startDate) return false;
                
                const startedBeforeOrDuringMonth = startDate <= monthEnd;
                const stillWorkingOrEndedAfterMonthStart = !endDate || endDate >= monthStart;
                
                return startedBeforeOrDuringMonth && stillWorkingOrEndedAfterMonthStart;
            });
            this.cache.employeesKey = key;
        }
        return this.cache.employeesInMonth;
    }

    getFilteredEmployees() {
        const employeesInMonth = this.getEmployeesInMonth();
        const filters = this.state.filters;
        const searchTerm = this.state.searchTerm;
        
        return employeesInMonth
            .filter(emp => {
                const matchesSearch = emp.full_name.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesProject = filters.project.length === 0 || filters.project.includes(emp.project);
                const matchesStage = filters.stage.length === 0 || filters.stage.includes(emp.stage);
                const matchesPosition = filters.position.length === 0 || filters.position.includes(emp.position);
                
                return matchesSearch && matchesProject && matchesStage && matchesPosition;
            })
            .sort((a, b) => {
                const statusOrder = { 'Active': 0, 'Onboarding': 1, 'Terminated': 2 };
                const statusDiff = statusOrder[a.stage] - statusOrder[b.stage];
                if (statusDiff !== 0) return statusDiff;
                
                const positionOrder = (pos) => {
                    if (pos.includes('CTO')) return 0;
                    if (pos.includes('Senior')) return 1;
                    return 2;
                };
                const positionDiff = positionOrder(a.position) - positionOrder(b.position);
                if (positionDiff !== 0) return positionDiff;
                
                return a.full_name.localeCompare(b.full_name);
            });
    }

    getAnalytics() {
        const currentMonthStr = `${this.state.currentYear}-${(this.state.currentMonth + 1).toString().padStart(2, '0')}`;
        
        const currentMonthShifts = this.shiftsData.filter(shift => 
            shift.shift_date.startsWith(currentMonthStr)
        );
        
        const todayStr = this.toDateStr(CONSTANTS.CURRENT_DATE);
        
        const plannedHours = currentMonthShifts
            .filter(shift => shift.schedule_type === 'baseline schedule')
            .reduce((total, shift) => total + (shift.pay_time || 0), 0);
        
        const actualHours = currentMonthShifts
            .filter(shift => 
                shift.schedule_type === 'fact schedule' && 
                shift.status === 'completed' &&
                shift.shift_date < todayStr
            )
            .reduce((total, shift) => total + (shift.pay_time || 0), 0);
        
        const factHoursBeforeToday = currentMonthShifts
            .filter(shift => 
                shift.schedule_type === 'fact schedule' && 
                shift.status === 'completed' &&
                shift.shift_date < todayStr
            )
            .reduce((total, shift) => total + (shift.pay_time || 0), 0);
            
        const baselineHoursFromToday = currentMonthShifts
            .filter(shift => 
                shift.schedule_type === 'baseline schedule' &&
                shift.shift_date >= todayStr
            )
            .reduce((total, shift) => total + (shift.pay_time || 0), 0);
        
        const projectedHours = factHoursBeforeToday + baselineHoursFromToday;

        return [
            { 
                title: 'Planned Hours', 
                mobileTitle: 'Planned', 
                subtitle: 'Monthly', 
                hours: plannedHours, 
                cost: plannedHours * 15, 
                color: '#f59e0b', 
                icon: 'calendar', 
                percentage: 100 
            },
            { 
                title: 'Projected Hours', 
                mobileTitle: 'Projected', 
                subtitle: 'Forecast', 
                hours: projectedHours, 
                cost: projectedHours * 15, 
                color: '#3b82f6', 
                icon: 'clock', 
                percentage: plannedHours > 0 ? Math.round((projectedHours / plannedHours) * 100) : 0 
            },
            { 
                title: 'Actual Hours', 
                mobileTitle: 'Actual', 
                subtitle: 'To date', 
                hours: actualHours, 
                cost: actualHours * 15, 
                color: '#22c55e', 
                icon: 'checkCircle', 
                percentage: plannedHours > 0 ? Math.round((actualHours / plannedHours) * 100) : 0 
            }
        ];
    }

    // ========================================
    // RENDER METHODS
    // ========================================
    render() {
        const html = `
            ${this.renderAnalytics()}
            ${this.renderMainContent()}
        `;
        this.container.innerHTML = html;
        // Re-setup event listeners after render as DOM was replaced
        this.setupEventListeners();
    }

    renderAnalytics() {
        const analytics = this.getAnalytics();
        
        if (this.isMobile) {
            return `
                <div class="mobile-only" style="padding-top: 2rem;">
                    <div style="margin: 0 1rem 1.5rem;">
                        <div class="mobile-carousel" id="analytics-carousel">
                            ${analytics.map((item, index) => `
                                <div class="carousel-item" data-index="${index}">
                                    ${this.createAnalyticsCard(item, true)}
                                </div>
                            `).join('')}
                        </div>
                        <div class="carousel-indicators">
                            ${analytics.map((item, index) => `
                                <div class="indicator-dot ${index === 0 ? 'active' : ''}" 
                                     style="--indicator-color: ${item.color}"
                                     data-index="${index}"></div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="desktop-only" style="padding: 1.5rem 1.5rem 0;">
                    <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem;">
                        ${analytics.map(item => `
                            <div style="flex: 1;">
                                ${this.createAnalyticsCard(item, false)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    createAnalyticsCard(data, isMobile) {
        const title = isMobile && data.mobileTitle ? data.mobileTitle : data.title;
        const value = isMobile ? `${data.hours}h` : `$${data.cost} / ${data.hours}h`;
        
        return `
            <div class="analytics-card" style="background-color: ${data.color}15; border-color: ${data.color}20;">
                <div class="flex items-center gap-3" style="margin-bottom: 0.75rem;">
                    <div style="width: 2rem; height: 2rem; border-radius: 0.5rem; 
                                background-color: ${data.color}15; border: 1px solid ${data.color}30;
                                display: flex; align-items: center; justify-content: center;">
                        <div style="color: ${data.color};">${ICONS[data.icon]}</div>
                    </div>
                    <div>
                        <h3 style="font-size: ${isMobile ? '1.125rem' : '0.875rem'}; font-weight: 600; color: #111827;">
                            ${title}
                        </h3>
                        <p style="font-size: 0.75rem; color: #4b5563;">${data.subtitle}</p>
                    </div>
                </div>
                <div style="font-size: 1.25rem; font-weight: 700; color: ${data.color}; margin-bottom: 0.5rem;">
                    ${value}
                </div>
                <div class="flex items-center justify-between" style="margin-bottom: 0.75rem;">
                    ${!isMobile ? `<div style="font-size: 0.75rem; color: #6b7280;">@ $15/hr</div>` : ''}
                    <div style="font-size: 0.75rem; font-weight: 500; color: ${data.color};">
                        ${data.percentage}%
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" 
                         style="background-color: ${data.hours === 0 ? `${data.color}40` : data.color};
                                width: ${data.hours === 0 ? '100%' : `${Math.min(data.percentage, 100)}%`};">
                    </div>
                </div>
            </div>
        `;
    }

    renderMainContent() {
        return `
            <div class="calendar-wrapper" style="position: relative;">
                ${this.renderNavigation()}
                ${this.renderLegend()}
                ${this.renderCalendar()}
            </div>
        `;
    }

    renderNavigation() {
        if (this.isMobile) {
            return `
                <div class="mobile-only" style="padding: 1rem;">
                    <div class="flex items-center gap-3" style="margin-bottom: 1rem;">
                        <div class="search-container">
                            <span class="search-icon">${ICONS.search}</span>
                            <input type="text" 
                                   class="search-input" 
                                   id="search-input"
                                   placeholder="Search..."
                                   value="${this.state.searchTerm}">
                        </div>
                        <button class="nav-button" id="filter-button" style="padding: 0.75rem;">
                            ${ICONS.filter}
                        </button>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex gap-2">
                            <button class="nav-button" id="prev-month-mobile">${ICONS.chevronLeft}</button>
                            <button class="nav-button" id="next-month-mobile">${ICONS.chevronRight}</button>
                        </div>
                        
                        <h2 style="font-size: 1.125rem; font-weight: 700;">
                            ${this.getMonthName(this.state.currentMonth).slice(0, 3)} '${this.state.currentYear.toString().slice(-2)}
                        </h2>
                        
                        <div class="view-tabs">
                            ${['Baseline', 'Actual', 'All'].map(mode => `
                                <button class="view-tab ${this.state.viewMode === mode ? 'active' : ''}"
                                        data-mode="${mode}">
                                    ${mode === 'Baseline' ? 'Plan' : mode}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else {
            const employeesInMonth = this.getEmployeesInMonth();
            const filteredEmployees = this.getFilteredEmployees();
            
            return `
                <div class="desktop-only" style="padding: 1rem 1.5rem; position: relative; z-index: 100;">
                    <div class="flex items-center gap-4" style="margin-bottom: 1rem;">
                        <div class="search-container" style="width: 20rem;">
                            <span class="search-icon">${ICONS.search}</span>
                            <input type="text" 
                                   class="search-input" 
                                   id="search-input"
                                   placeholder="Search employees by name, position, or project..."
                                   value="${this.state.searchTerm}">
                            ${this.state.searchTerm ? `
                                <button id="clear-search" style="position: absolute; right: 0.75rem; top: 50%; 
                                        transform: translateY(-50%); padding: 0.25rem; border-radius: 50%; 
                                        background: transparent; border: none; cursor: pointer;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            ` : ''}
                        </div>

                        <div class="flex items-center gap-4" style="flex: 1;">
                            ${this.renderFilterDropdown('project')}
                            ${this.renderFilterDropdown('stage')}
                            ${this.renderFilterDropdown('position')}
                        </div>

                        <div style="padding: 0.625rem 1rem; border-radius: 0.5rem; font-size: 0.875rem; 
                                    font-weight: 600; background-color: rgba(248, 247, 244, 0.6); 
                                    color: #111827; white-space: nowrap;">
                            ${filteredEmployees.length} of ${employeesInMonth.length}
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center" 
                         style="border-radius: 0.75rem; padding: 1rem 1.5rem; 
                                background-color: #f9fafb; border: 1px solid #e5e7eb;">
                        <div class="flex gap-2">
                            <button class="nav-button" id="prev-month">${ICONS.chevronLeft}</button>
                            <button class="nav-button" id="next-month">${ICONS.chevronRight}</button>
                            <button class="nav-button" id="today-button" style="padding: 0.5rem 1rem;">Today</button>
                        </div>
                        
                        <h2 style="font-size: 1.5rem; font-weight: 700;">
                            ${this.getMonthName(this.state.currentMonth)} ${this.state.currentYear}
                        </h2>
                        
                        <div class="view-tabs">
                            ${['Baseline', 'Actual', 'All'].map(mode => `
                                <button class="view-tab ${this.state.viewMode === mode ? 'active' : ''}"
                                        data-mode="${mode}">
                                    ${mode === 'Baseline' ? 'Plan' : mode}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    renderFilterDropdown(type) {
        const employeesInMonth = this.getEmployeesInMonth();
        const options = [...new Set(employeesInMonth.map(emp => emp[type]))];
        const selected = this.state.filters[type];
        const isOpen = this.state[`show${type.charAt(0).toUpperCase() + type.slice(1)}Dropdown`];
        
        const label = type.charAt(0).toUpperCase() + type.slice(1);
        const icon = type === 'project' ? 'briefcase' : type === 'stage' ? 'userCheck' : 'award';
        
        return `
            <div class="filter-dropdown">
                <div style="position: relative;">
                    <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); z-index: 30;">
                        ${ICONS[icon]}
                    </span>
                    <button class="filter-button" data-filter-type="${type}">
                        <span>${selected.length === 0 ? `All ${label}s` : `${selected.length} Selected`}</span>
                    </button>
                    ${selected.length > 0 ? `
                        <button class="clear-filter" data-filter-type="${type}"
                                style="position: absolute; right: 1.75rem; top: 50%; transform: translateY(-50%); 
                                       padding: 0.125rem; border-radius: 50%; background: transparent; 
                                       border: none; cursor: pointer; z-index: 50;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    ` : ''}
                    <span style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); pointer-events: none;">
                        ${ICONS.chevronDown}
                    </span>
                </div>
                ${isOpen ? `
                    <div class="filter-dropdown-menu">
                        ${options.map(option => {
                            const color = this.getFilterColor(type, option);
                            return `
                                <label class="filter-option">
                                    <input type="checkbox" 
                                           class="filter-checkbox"
                                           data-filter-type="${type}"
                                           data-option="${option}"
                                           ${selected.includes(option) ? 'checked' : ''}>
                                    <span class="filter-color-dot" style="background-color: ${color};"></span>
                                    <span style="font-size: 0.75rem; font-weight: 500; color: #374151;">
                                        ${option}
                                    </span>
                                </label>
                            `;
                        }).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    getFilterColor(type, option) {
        if (type === 'project') return '#3b82f6';
        if (type === 'stage') {
            return option === 'Active' ? '#22c55e' : option === 'Terminated' ? '#ef4444' : '#eab308';
        }
        return '#a855f7';
    }

    renderLegend() {
        const currentTime = new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });

        return `
            <div style="padding: 0.25rem ${this.isMobile ? '1rem' : '1.5rem'};">
                <div class="flex items-center gap-1" style="color: #374151;">
                    <button id="legend-button" class="flex items-center gap-1" 
                            style="background: none; border: none; cursor: pointer; color: inherit;">
                        <span style="font-size: ${this.isMobile ? '0.75rem' : '0.875rem'}; font-weight: 600;">
                            Legend
                        </span>
                        <div style="width: 1rem; height: 1rem; border-radius: 50%; 
                                    border: 1px solid ${COLORS.BRAND}; color: ${COLORS.BRAND};
                                    display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 0.75rem; font-weight: 700;">?</span>
                        </div>
                    </button>
                    
                    <span style="margin: 0 0.5rem; color: #9ca3af;">|</span>
                    
                    <span style="font-size: ${this.isMobile ? '0.75rem' : '0.875rem'}; font-weight: 600;">
                        EST (UTC-5) • ${currentTime}
                    </span>
                </div>
            </div>
        `;
    }

    renderCalendar() {
        const employeesInMonth = this.getEmployeesInMonth();
        
        if (employeesInMonth.length === 0) {
            return this.renderEmptyState();
        }
        
        const days = this.getDays();
        const cellWidth = this.isMobile ? CONSTANTS.MOBILE_CELL_WIDTH : CONSTANTS.CELL_WIDTH;
        const employeeColWidth = this.isMobile ? CONSTANTS.MOBILE_EMPLOYEE_COL_WIDTH : CONSTANTS.EMPLOYEE_COL_WIDTH;
        const minTableWidth = employeeColWidth + (days.length * cellWidth);
        
        return `
            <div class="calendar-scroll" id="calendar-scroll">
                <table class="calendar-table" style="min-width: ${minTableWidth}px;">
                    ${this.renderCalendarHeader()}
                    ${this.renderCalendarBody()}
                </table>
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-state-content" ${this.isMobile ? 'style="margin: 0 1rem;"' : ''}>
                    <div class="empty-state-icon">${ICONS.calendar}</div>
                    <h3 class="empty-state-title">No employees this month</h3>
                    <p class="empty-state-text">
                        No one was working in ${this.getMonthName(this.state.currentMonth)} ${this.state.currentYear}
                    </p>
                    <button class="empty-state-button" id="go-to-today">
                        ${ICONS.calendar}
                        Go to current month
                    </button>
                </div>
            </div>
        `;
    }

    renderCalendarHeader() {
        const days = this.getDays();
        const cellWidth = this.isMobile ? CONSTANTS.MOBILE_CELL_WIDTH : CONSTANTS.CELL_WIDTH;
        const employeeColWidth = this.isMobile ? CONSTANTS.MOBILE_EMPLOYEE_COL_WIDTH : CONSTANTS.EMPLOYEE_COL_WIDTH;
        
        return `
            <thead>
                <tr>
                    <th class="sticky-cell" style="width: ${employeeColWidth}px; min-width: ${employeeColWidth}px; max-width: ${employeeColWidth}px;"></th>
                    ${days.map((day, index) => `
                        <th style="width: ${cellWidth}px; min-width: ${cellWidth - 20}px; 
                                  color: ${this.isToday(day) ? COLORS.BRAND : '#111827'}; position: relative;">
                            ${this.isToday(day) ? '<div class="today-indicator"></div>' : ''}
                            <div class="flex flex-col items-center justify-center" style="height: 100%; position: relative; z-index: 1;">
                                <div class="flex items-center gap-1" style="font-size: ${this.isMobile ? '1.125rem' : '1.875rem'};">
                                    <span style="font-weight: 700;">${day.getDate()}</span>
                                    <div class="flex flex-col" style="font-size: 0.75rem;">
                                        <span style="font-weight: 700; color: #374151;">
                                            ${this.getDayName(day)}
                                        </span>
                                        ${!this.isMobile ? `
                                            <span style="font-weight: 400; color: #9ca3af;">
                                                ${this.getMonthName(day.getMonth()).slice(0, 3)}
                                            </span>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        </th>
                    `).join('')}
                </tr>
            </thead>
        `;
    }

    renderCalendarBody() {
        const filteredEmployees = this.getFilteredEmployees();
        const days = this.getDays();
        
        return `
            <tbody>
                ${filteredEmployees.map(employee => {
                    if (this.state.viewMode === 'All') {
                        return `
                            <tr style="border-bottom: 1px solid #e5e7eb;">
                                ${this.renderEmployeeCell(employee, false)}
                                ${days.map(day => this.renderDayCell(employee, day, 'Actual', false)).join('')}
                            </tr>
                            <tr class="child-row" style="border-bottom: 1px solid #e5e7eb;">
                                ${this.renderEmployeeCell(employee, true)}
                                ${days.map(day => this.renderDayCell(employee, day, 'Baseline', true)).join('')}
                            </tr>
                        `;
                    } else {
                        return `
                            <tr style="border-bottom: 1px solid #e5e7eb;">
                                ${this.renderEmployeeCell(employee, false)}
                                ${days.map(day => this.renderDayCell(employee, day, 
                                    this.state.viewMode === 'Baseline' ? 'Baseline' : 'Actual', false)).join('')}
                            </tr>
                        `;
                    }
                }).join('')}
            </tbody>
        `;
    }

    renderEmployeeCell(employee, isChildRow) {
        const employeeColWidth = this.isMobile ? CONSTANTS.MOBILE_EMPLOYEE_COL_WIDTH : CONSTANTS.EMPLOYEE_COL_WIDTH;
        
        if (isChildRow) {
            return `
                <td class="sticky-cell" style="width: ${employeeColWidth}px; min-width: ${employeeColWidth}px; max-width: ${employeeColWidth}px; padding: 0.25rem 1rem;">
                    ${this.isMobile ? `
                        <div class="flex flex-col items-center">
                            <span style="font-size: 0.75rem; font-weight: 500; color: #6b7280;">Plan</span>
                        </div>
                    ` : `
                        <div style="margin-left: 3.5rem; display: flex; align-items: center; text-align: left;">
                            <span style="color: #4b5563; font-size: 0.875rem; margin-right: 0.25rem;">└</span>
                            <span style="font-size: 0.75rem; font-weight: 500; color: #6b7280;">Plan</span>
                        </div>
                    `}
                </td>
            `;
        }
        
        const avatar = this.createAvatar(employee, this.isMobile ? 'lg' : 'md', this.isMobile);
        
        return `
            <td class="sticky-cell employee-cell" style="width: ${employeeColWidth}px; min-width: ${employeeColWidth}px; max-width: ${employeeColWidth}px;">
                ${this.isMobile ? `
                    <div class="flex flex-col items-center gap-1">
                        ${avatar}
                    </div>
                ` : `
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        ${avatar}
                        <div style="flex: 1; overflow: hidden; text-align: left;">
                            <div style="font-size: 1rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left;">
                                ${employee.full_name}
                            </div>
                            <div style="font-size: 0.875rem; color: #374151; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left;">
                                ${employee.position}
                            </div>
                            <div class="flex items-center gap-2" style="margin-top: 0.25rem;">
                                <span class="badge ${COLORS.STAGES[employee.stage]}">
                                    ${employee.stage}
                                </span>
                                <span class="badge badge-project">
                                    ${employee.project}
                                </span>
                                ${employee.staffing_type === 'backup' ? `
                                    <span class="badge badge-backup">Backup</span>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `}
            </td>
        `;
    }

    createAvatar(employee, size = 'md', showInfoButton = false) {
        const avatarColor = this.getAvatarColor(employee.full_name);
        const initials = employee.full_name.split(' ').map(n => n[0]).join('');
        
        const sizes = {
            sm: { container: '2rem', text: '0.75rem' },
            md: { container: '2.75rem', text: '0.875rem' },
            lg: { container: '3.5rem', text: '0.875rem' },
            xl: { container: '4rem', text: '1.125rem' }
        };
        
        const sizeConfig = sizes[size];
        
        return `
            <div class="avatar" 
                 style="width: ${sizeConfig.container}; height: ${sizeConfig.container}; 
                        background: ${avatarColor.bg};"
                 data-employee-id="${employee.employee_id}">
                <span style="font-size: ${sizeConfig.text}; font-weight: 700; color: ${avatarColor.text};">
                    ${initials}
                </span>
                ${showInfoButton ? `
                    <div class="avatar-info-btn">i</div>
                ` : ''}
            </div>
        `;
    }

    renderDayCell(employee, day, scheduleType, isChildRow = false) {
        const shifts = this.getShiftsForEmployeeAndDate(employee.employee_id, day);
        const actualShifts = shifts.filter(s => s.schedule_type === 'fact schedule');
        const baselineShifts = shifts.filter(s => s.schedule_type === 'baseline schedule');
        
        let displayShifts = [];
        if (scheduleType === 'Actual') {
            displayShifts = actualShifts.length > 0 ? actualShifts : baselineShifts;
        } else if (scheduleType === 'Baseline') {
            displayShifts = baselineShifts;
        }

        const cellWidth = this.isMobile ? CONSTANTS.MOBILE_CELL_WIDTH : CONSTANTS.CELL_WIDTH;
        const cellHeight = isChildRow ? (this.isMobile ? '54px' : '70px') : (this.isMobile ? '64px' : '80px');

        return `
            <td style="width: ${cellWidth}px; min-width: ${cellWidth}px; max-width: ${cellWidth}px;
                       background-color: ${isChildRow ? COLORS.BACKGROUND.childRow : 'transparent'};
                       height: ${cellHeight}; min-height: ${cellHeight}; max-height: ${cellHeight};
                       padding: ${isChildRow ? '0.125rem' : '0.25rem'} 0.5rem; text-align: center; position: relative;">
                ${this.isToday(day) ? '<div class="today-indicator"></div>' : ''}
                <div class="flex flex-col gap-1 items-center justify-center" style="width: 100%; height: 100%; position: relative; z-index: 1;">
                    ${displayShifts.length > 0 ? displayShifts.map((shift, idx) => {
                        let baselineShift = null;
                        if (shift.schedule_type === 'fact schedule' && baselineShifts.length > 0) {
                            baselineShift = baselineShifts[0];
                        }
                        
                        return this.renderShiftCell(shift, baselineShift, employee, isChildRow);
                    }).join('') : ''}
                </div>
            </td>
        `;
    }

    renderShiftCell(shift, baselineShift, employee, isChildRow) {
        const isPastShift = this.isPast(this.formatDate(shift.shift_date));
        
        let statusCode = null;
        let showDiscrepancy = false;
        
        if (shift.status === 'missed' || shift.status === 'cancelled') {
            statusCode = shift.reason || shift.status;
        }
        
        if (shift.status === 'completed' && baselineShift && 
            baselineShift.start_time && baselineShift.end_time && 
            shift.start_time && shift.end_time) {
            const baselineTime = `${baselineShift.start_time}-${baselineShift.end_time}`;
            const actualTime = `${shift.start_time}-${shift.end_time}`;
            if (baselineTime !== actualTime) {
                showDiscrepancy = this.checkTimeDiscrepancy(baselineTime, actualTime);
            }
        }
        
        let bgColor = '#86efac'; // green-300
        if (shift.schedule_type === 'baseline schedule') {
            bgColor = isPastShift ? '#9ca3af' : '#86efac';
        } else if (shift.status === 'completed') {
            bgColor = '#15803d'; // green-700
        } else if (shift.status === 'missed') {
            bgColor = '#fca5a5'; // red-300
        }

        const timeText = shift.start_time && shift.end_time 
            ? `${shift.start_time}-${shift.end_time}`
            : shift.status === 'missed' ? 'MISSED' : 'NO TIME';

        const hasIssue = statusCode || showDiscrepancy;

        const dimensions = this.isMobile 
            ? (isChildRow ? { height: '2.75rem', width: '3.5rem' } : { height: '3.5rem', width: '4rem' })
            : (isChildRow ? { height: '3rem', width: '4rem' } : { height: '4rem', width: '5rem' });

        const bookmarkHeight = this.isMobile 
            ? (isChildRow ? '0.625rem' : '0.75rem')
            : (isChildRow ? '0.875rem' : '1rem');

        return `
            <div class="shift-cell ${hasIssue ? 'has-issue' : ''}"
                 style="height: ${dimensions.height}; width: ${dimensions.width}; 
                        background-color: ${bgColor};"
                 ${hasIssue ? `
                    data-shift='${JSON.stringify(shift)}'
                    data-baseline='${baselineShift ? JSON.stringify(baselineShift) : ''}'
                    data-employee='${JSON.stringify(employee)}'
                 ` : ''}>
                <div class="shift-bookmark" 
                     style="height: ${bookmarkHeight}; 
                            background-color: ${hasIssue ? (statusCode ? '#ef4444' : '#eab308') : 'rgba(255, 255, 255, 0.15)'}; 
                            border-bottom: 1px solid ${hasIssue ? 'transparent' : 'rgba(255, 255, 255, 0.3)'};">
                    ${hasIssue ? (
                        statusCode === 'sick' ? '<span style="font-size: 0.75rem; font-weight: 700;">SICK</span>' :
                        statusCode === 'cancelled' ? '<span style="font-size: 0.75rem; font-weight: 700;">CANC</span>' :
                        statusCode === 'missed' ? '<span style="font-size: 0.75rem; font-weight: 700;">MISS</span>' :
                        ICONS.alertTriangle
                    ) : ''}
                </div>
                <div class="shift-time">
                    ${this.isMobile && timeText.includes('-') ? 
                        timeText.split('-').map(t => `<div>${t}</div>`).join('') : 
                        timeText
                    }
                </div>
            </div>
        `;
    }

    // ========================================
    // MODAL METHODS
    // ========================================
    showEmployeeModal(employee) {
        const modal = `
            <div class="modal-overlay" id="employee-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 style="font-size: 1.125rem; font-weight: 600;">Employee Info</h3>
                        <button class="modal-close" data-modal="employee-modal">
                            ${ICONS.x}
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="flex items-center gap-4" style="margin-bottom: 1.5rem;">
                            ${this.createAvatar(employee, 'xl')}
                            <div>
                                <h4 style="font-size: 1.25rem; font-weight: 700;">${employee.full_name}</h4>
                                <p style="color: #4b5563;">${employee.position}</p>
                            </div>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            <span class="badge ${COLORS.STAGES[employee.stage]}">${employee.stage}</span>
                            <span class="badge badge-project">${employee.project}</span>
                            ${employee.staffing_type === 'backup' ? '<span class="badge badge-backup">Backup</span>' : ''}
                        </div>
                        <div style="margin-top: 1rem; font-size: 0.875rem; color: #4b5563;">
                            Start Date: ${this.formatDate(employee.start_date).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('modals-container').innerHTML = modal;
    }

    showShiftModal(shift, baselineShift, employee) {
        const shiftInfo = this.createShiftInfo(shift, baselineShift, employee, true, false);
        
        const modal = `
            <div class="modal-overlay" id="shift-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 style="font-size: 1.125rem; font-weight: 600;">Shift Details</h3>
                        <button class="modal-close" data-modal="shift-modal">
                            ${ICONS.x}
                        </button>
                    </div>
                    <div class="modal-body">
                        ${shiftInfo}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('modals-container').innerHTML = modal;
    }

    showLegendModal() {
        const content = this.createLegendContent();
        
        const modal = `
            <div class="modal-overlay" id="legend-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 style="font-size: 1.125rem; font-weight: 600;">Legend</h3>
                        <button class="modal-close" data-modal="legend-modal">
                            ${ICONS.x}
                        </button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('modals-container').innerHTML = modal;
    }

    showBottomSheet() {
        const overlay = document.getElementById('bottom-sheet-overlay');
        const sheet = document.getElementById('bottom-sheet');
        
        if (overlay) overlay.classList.remove('hidden');
        if (sheet) sheet.classList.remove('hidden');
        
        this.updateBottomSheetContent();
    }

    updateBottomSheetContent() {
        const employeesInMonth = this.getEmployeesInMonth();
        const options = {
            project: [...new Set(employeesInMonth.map(emp => emp.project))],
            stage: [...new Set(employeesInMonth.map(emp => emp.stage))],
            position: [...new Set(employeesInMonth.map(emp => emp.position))]
        };
        
        const activeFiltersCount = 
            this.state.filters.project.length + 
            this.state.filters.stage.length + 
            this.state.filters.position.length;
        
        // Update header
        const countEl = document.getElementById('active-filters-count');
        const clearBtn = document.getElementById('clear-all-filters');
        
        if (activeFiltersCount > 0) {
            if (countEl) {
                countEl.textContent = `${activeFiltersCount} active`;
                countEl.classList.remove('hidden');
            }
            if (clearBtn) clearBtn.classList.remove('hidden');
        } else {
            if (countEl) countEl.classList.add('hidden');
            if (clearBtn) clearBtn.classList.add('hidden');
        }
        
        // Update content
        const content = document.getElementById('bottom-sheet-content');
        if (content) {
            content.innerHTML = this.renderBottomSheetContent(options[this.state.bottomSheetTab], this.state.bottomSheetTab);
        }
    }

    renderBottomSheetContent(options, type) {
        return options.map(option => {
            const color = this.getFilterColor(type, option);
            const isChecked = this.state.filters[type].includes(option);
            
            return `
                <label style="display: flex; align-items: center; padding: 0.75rem; 
                             border-radius: 0.5rem; cursor: pointer; transition: background-color 0.2s;"
                       onmouseover="this.style.backgroundColor='#f9fafb'"
                       onmouseout="this.style.backgroundColor='transparent'">
                    <input type="checkbox" 
                           style="width: 1.125rem; height: 1.125rem; margin-right: 0.75rem; 
                                  accent-color: ${COLORS.BRAND};"
                           data-filter-type="${type}"
                           data-option="${option}"
                           ${isChecked ? 'checked' : ''}>
                    <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; 
                               margin-right: 0.75rem; background-color: ${color}; 
                               box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);"></div>
                    <span style="font-weight: 500; color: #374151;">${option}</span>
                </label>
            `;
        }).join('');
    }

    createShiftInfo(shift, baselineShift, employee, showHeader = true, isCompact = false) {
        const calculateDiscrepancies = (planned, actual) => {
            if (!planned || !actual || !planned.start_time || !planned.end_time || 
                !actual.start_time || !actual.end_time) {
                return null;
            }
            
            const plannedStart = this.parseTime(planned.start_time);
            const plannedEnd = this.parseTime(planned.end_time);
            const actualStart = this.parseTime(actual.start_time);
            const actualEnd = this.parseTime(actual.end_time);
            
            const late = Math.max(0, actualStart - plannedStart);
            const earlyLeave = Math.max(0, plannedEnd - actualEnd);
            
            return {
                late: late,
                earlyLeave: earlyLeave,
                totalUndework: late + earlyLeave,
                severity: (late + earlyLeave) >= 30 ? 'high' : 'medium'
            };
        };

        const discrepancies = baselineShift ? calculateDiscrepancies(baselineShift, shift) : null;
        const isAbsence = shift.status === 'missed' || shift.status === 'cancelled';
        const hasDiscrepancy = discrepancies && (discrepancies.late > 0 || discrepancies.earlyLeave > 0);

        const formatShiftDate = (dateStr) => {
            const date = this.formatDate(dateStr);
            return date.toLocaleDateString('en-US', { 
                weekday: isCompact ? 'short' : 'long', 
                year: isCompact ? undefined : 'numeric',
                month: isCompact ? 'short' : 'long', 
                day: 'numeric' 
            });
        };

        let html = '';

        if (showHeader) {
            html += `
                <div style="margin-bottom: 0.75rem;">
                    <h4 style="font-weight: 700; color: #111827; font-size: ${isCompact ? '1rem' : '1.25rem'};">
                        ${employee?.full_name}
                    </h4>
                    <p style="color: #4b5563; font-size: ${isCompact ? '0.875rem' : '1rem'};">
                        ${formatShiftDate(shift.shift_date)}
                    </p>
                </div>
            `;
        }

        // Status indicator
        html += '<div style="margin-bottom: 0.75rem;">';
        if (isAbsence) {
            html += `
                <div style="display: flex; align-items: center; gap: 0.5rem; 
                           padding: ${isCompact ? '0.5rem' : '0.75rem'}; 
                           background-color: #fee2e2; border: 1px solid #fecaca; 
                           border-radius: 0.5rem;">
                    ${ICONS.alertTriangle}
                    <div>
                        <span style="font-weight: 700; color: #991b1b; 
                                    font-size: ${isCompact ? '0.875rem' : '1rem'};">
                            MISSED SHIFT
                        </span>
                        ${shift.reason ? `
                            <div style="color: #dc2626; font-size: ${isCompact ? '0.75rem' : '0.875rem'};">
                                Reason: ${shift.reason.toUpperCase()}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        } else if (hasDiscrepancy) {
            const bgColor = discrepancies.severity === 'high' ? '#ffedd5' : '#fef3c7';
            const borderColor = discrepancies.severity === 'high' ? '#fed7aa' : '#fde68a';
            const textColor = discrepancies.severity === 'high' ? '#9a3412' : '#92400e';
            const iconColor = discrepancies.severity === 'high' ? '#ea580c' : '#f59e0b';
            
            html += `
                <div style="display: flex; align-items: center; gap: 0.5rem; 
                           padding: ${isCompact ? '0.5rem' : '0.75rem'}; 
                           background-color: ${bgColor}; border: 1px solid ${borderColor}; 
                           border-radius: 0.5rem;">
                    <div style="color: ${iconColor};">${ICONS.alertTriangle}</div>
                    <span style="font-weight: 700; font-size: ${isCompact ? '0.875rem' : '1rem'}; 
                                color: ${textColor};">
                        TIME DISCREPANCY
                    </span>
                </div>
            `;
        } else {
            html += `
                <div style="display: flex; align-items: center; gap: 0.5rem; 
                           padding: ${isCompact ? '0.5rem' : '0.75rem'}; 
                           background-color: #dcfce7; border: 1px solid #bbf7d0; 
                           border-radius: 0.5rem;">
                    ${ICONS.checkCircle}
                    <span style="font-weight: 700; color: #166534; 
                                font-size: ${isCompact ? '0.875rem' : '1rem'};">
                        NORMAL SHIFT
                    </span>
                </div>
            `;
        }
        html += '</div>';

        // Shift details
        html += `<div style="font-size: ${isCompact ? '0.875rem' : '1rem'};">`;
        
        if (isAbsence) {
            html += `
                <div style="margin-bottom: 0.5rem;">
                    <span style="font-weight: 500; color: #374151;">Planned:</span>
                    <span style="margin-left: 0.5rem;">
                        ${baselineShift?.start_time && baselineShift?.end_time 
                            ? `${baselineShift.start_time}-${baselineShift.end_time}`
                            : 'Not scheduled'}
                    </span>
                </div>
                <div>
                    <span style="font-weight: 500; color: #374151;">Lost hours:</span>
                    <span style="color: #dc2626; margin-left: 0.5rem; font-weight: 700;">
                        ${baselineShift?.pay_time || 0}h
                    </span>
                </div>
            `;
        } else {
            html += `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: ${isCompact ? '0.75rem' : '1rem'};">
                    <div>
                        <span style="font-weight: 500; color: #374151;">Planned:</span>
                        <div style="color: #2563eb; font-family: 'SF Mono', 'Monaco', monospace; 
                                   font-size: ${isCompact ? '0.875rem' : '1.125rem'};">
                            ${baselineShift?.start_time && baselineShift?.end_time 
                                ? `${baselineShift.start_time}-${baselineShift.end_time}`
                                : 'Not scheduled'}
                        </div>
                    </div>
                    <div>
                        <span style="font-weight: 500; color: #374151;">Actual:</span>
                        <div style="color: #16a34a; font-family: 'SF Mono', 'Monaco', monospace; 
                                   font-size: ${isCompact ? '0.875rem' : '1.125rem'};">
                            ${shift.start_time && shift.end_time 
                                ? `${shift.start_time}-${shift.end_time}`
                                : 'No time recorded'}
                        </div>
                    </div>
                </div>
            `;

            if (hasDiscrepancy) {
                html += `
                    <div style="padding-top: 0.5rem; margin-top: 0.5rem; border-top: 1px solid #e5e7eb;">
                        <span style="font-weight: 500; color: #374151; display: block; 
                                   margin-bottom: 0.5rem; font-size: ${isCompact ? '0.875rem' : '1rem'};">
                            Issues detected:
                        </span>
                        <ul style="list-style: none; padding: 0;">
                            ${discrepancies.late > 0 ? `
                                <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                    <div style="width: 0.5rem; height: 0.5rem; background-color: #f87171; 
                                               border-radius: 50%;"></div>
                                    <span>Late${isCompact ? '' : ' arrival'}: 
                                        <strong>${discrepancies.late} min</strong>
                                    </span>
                                </li>
                            ` : ''}
                            ${discrepancies.earlyLeave > 0 ? `
                                <li style="display: flex; align-items: center; gap: 0.5rem;">
                                    <div style="width: 0.5rem; height: 0.5rem; background-color: #fb923c; 
                                               border-radius: 50%;"></div>
                                    <span>Early${isCompact ? '' : ' departure'}: 
                                        <strong>${discrepancies.earlyLeave} min</strong>
                                    </span>
                                </li>
                            ` : ''}
                        </ul>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; 
                                   margin-top: ${isCompact ? '0.5rem' : '0.75rem'}; 
                                   padding-top: 0.5rem; border-top: 1px solid #f3f4f6;">
                            <span style="font-weight: 500; color: #374151;">
                                Total${isCompact ? '' : ' underwork'}:
                            </span>
                            <span style="font-weight: 700; color: ${
                                discrepancies.totalUndework >= 30 ? '#dc2626' : '#f59e0b'
                            };">
                                ${discrepancies.totalUndework} min
                            </span>
                        </div>
                    </div>
                `;
            }
        }
        
        html += '</div>';
        return html;
    }

    createLegendContent() {
        return `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                    <h4 style="font-weight: 700; color: #111827; margin-bottom: 0.5rem;">Plan layer:</h4>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 1rem; height: 1rem; background-color: #9ca3af; border-radius: 50%;"></div>
                            <span style="font-size: 0.875rem;">Past Planned</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 1rem; height: 1rem; background-color: #86efac; border-radius: 50%;"></div>
                            <span style="font-size: 0.875rem;">Planned Future</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 style="font-weight: 700; color: #111827; margin-bottom: 0.5rem;">Actual layer:</h4>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 1rem; height: 1rem; background-color: #15803d; border-radius: 50%;"></div>
                            <span style="font-size: 0.875rem;">Completed</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 1rem; height: 1rem; background-color: #4ade80; border-radius: 50%;"></div>
                            <span style="font-size: 0.875rem;">Scheduled</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 1rem; height: 1rem; background-color: #fca5a5; border-radius: 50%;"></div>
                            <span style="font-size: 0.875rem;">Absence</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 style="font-weight: 700; color: #111827; margin-bottom: 0.5rem;">Special indicators:</h4>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 2.25rem; height: 1.5rem; background-color: #eab308; 
                                       border-radius: 0.125rem; display: flex; align-items: center; 
                                       justify-content: center;">
                                ${ICONS.alertTriangle}
                            </div>
                            <div>
                                <div style="font-size: 0.875rem; font-weight: 500;">
                                    Time Discrepancy (10+ min)
                                </div>
                                <div style="font-size: 0.75rem; color: #6b7280;">
                                    Late arrival or early departure
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 2.25rem; height: 1.5rem; background-color: #ef4444; 
                                       border-radius: 0.125rem; display: flex; align-items: center; 
                                       justify-content: center;">
                                <span style="font-size: 0.875rem; font-weight: 700; color: white;">SICK</span>
                            </div>
                            <span style="font-size: 0.875rem;">Sick / Cancel / Missed</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 style="font-weight: 700; color: #111827; margin-bottom: 0.5rem;">Labels:</h4>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span class="badge badge-active">Active</span>
                            <span style="font-size: 0.875rem; color: #6b7280;">Stage</span>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span class="badge badge-project">Project</span>
                            <span style="font-size: 0.875rem; color: #6b7280;">Project</span>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span class="badge badge-backup">Backup</span>
                            <span style="font-size: 0.875rem; color: #6b7280;">Non-billable</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ========================================
    // EVENT HANDLING
    // ========================================
    setupEventListeners() {
        // Clear existing listeners on container
        const newContainer = this.container.cloneNode(true);
        this.container.parentNode.replaceChild(newContainer, this.container);
        this.container = newContainer;
        
        // Delegate events
        this.container.addEventListener('click', async (e) => {
            // Navigation
            if (e.target.closest('#prev-month') || e.target.closest('#prev-month-mobile')) {
                await this.navigateMonth('prev');
            }
            if (e.target.closest('#next-month') || e.target.closest('#next-month-mobile')) {
                await this.navigateMonth('next');
            }
            if (e.target.closest('#today-button')) {
                await this.goToToday();
            }
            if (e.target.closest('#go-to-today')) {
                await this.goToToday();
            }

            // View mode tabs
            if (e.target.closest('.view-tab')) {
                const mode = e.target.closest('.view-tab').dataset.mode;
                this.setViewMode(mode);
            }

            // Filter button (mobile)
            if (e.target.closest('#filter-button')) {
                this.showBottomSheet();
            }

            // Filter dropdowns (desktop)
            if (e.target.closest('.filter-button')) {
                const type = e.target.closest('.filter-button').dataset.filterType;
                this.toggleFilterDropdown(type);
            }

            // Clear filter
            if (e.target.closest('.clear-filter')) {
                const type = e.target.closest('.clear-filter').dataset.filterType;
                this.clearFilter(type);
                e.stopPropagation();
            }

            // Clear search
            if (e.target.closest('#clear-search')) {
                this.state.searchTerm = '';
                this.render();
            }

            // Avatar click
            if (e.target.closest('.avatar')) {
                const employeeId = e.target.closest('.avatar').dataset.employeeId;
                const employee = this.employeesData.find(e => e.employee_id === employeeId);
                if (employee) {
                    this.showEmployeeModal(employee);
                }
            }

            // Shift cell click (mobile only)
            if (this.isMobile && e.target.closest('.shift-cell.has-issue')) {
                const cell = e.target.closest('.shift-cell.has-issue');
                const shift = JSON.parse(cell.dataset.shift);
                const baseline = cell.dataset.baseline ? JSON.parse(cell.dataset.baseline) : null;
                const employee = JSON.parse(cell.dataset.employee);
                this.showShiftModal(shift, baseline, employee);
            }

            // Legend button
            if (e.target.closest('#legend-button')) {
                if (this.isMobile) {
                    this.showLegendModal();
                }
            }

            // Modal close
            if (e.target.closest('.modal-close')) {
                const modalId = e.target.closest('.modal-close').dataset.modal;
                this.closeModal(modalId);
            }

            // Modal overlay click
            if (e.target.classList.contains('modal-overlay')) {
                document.getElementById('modals-container').innerHTML = '';
            }

            // Bottom sheet overlay
            if (e.target.id === 'bottom-sheet-overlay') {
                this.closeModal('bottom-sheet');
            }

            // Bottom sheet tabs
            if (e.target.closest('.bottom-sheet-tab')) {
                const tab = e.target.closest('.bottom-sheet-tab').dataset.tab;
                this.setBottomSheetTab(tab);
            }

            // Clear all filters
            if (e.target.id === 'clear-all-filters') {
                this.clearAllFilters();
            }
        });

        // Desktop-only hover events for tooltips
        if (!this.isMobile && window.innerWidth >= 785) {
            // Shift cell hover
            this.container.addEventListener('mouseenter', (e) => {
                if (e.target.closest('.shift-cell.has-issue')) {
                    const cell = e.target.closest('.shift-cell.has-issue');
                    const shift = JSON.parse(cell.dataset.shift);
                    const baseline = cell.dataset.baseline ? JSON.parse(cell.dataset.baseline) : null;
                    const employee = JSON.parse(cell.dataset.employee);
                    this.showShiftTooltip(e.clientX, e.clientY, shift, baseline, employee);
                }
            }, true);

            this.container.addEventListener('mouseleave', (e) => {
                if (e.target.closest('.shift-cell.has-issue')) {
                    this.hideShiftTooltip();
                }
            }, true);
            
            // Legend tooltip setup
            this.setupLegendTooltip();
        }

        // Input events
        this.container.addEventListener('input', (e) => {
            if (e.target.id === 'search-input') {
                this.state.searchTerm = e.target.value;
                this.render();
            }
        });

        // Checkbox changes
        this.container.addEventListener('change', (e) => {
            if (e.target.classList.contains('filter-checkbox')) {
                const type = e.target.dataset.filterType;
                const option = e.target.dataset.option;
                this.toggleFilterOption(type, option);
            }
        });

        // Bottom sheet events (on document level since they're outside container)
        document.addEventListener('click', (e) => {
            // Close dropdowns on outside click
            if (!e.target.closest('.filter-dropdown')) {
                this.closeAllDropdowns();
            }
            
            // Bottom sheet tabs
            if (e.target.closest('.bottom-sheet-tab')) {
                const tab = e.target.closest('.bottom-sheet-tab').dataset.tab;
                this.setBottomSheetTab(tab);
            }
            
            // Bottom sheet checkboxes
            if (e.target.closest('#bottom-sheet-content input[type="checkbox"]')) {
                const checkbox = e.target;
                const type = checkbox.dataset.filterType;
                const option = checkbox.dataset.option;
                this.toggleFilterOption(type, option);
            }
        });

        // Setup carousel scroll listener
        if (this.isMobile) {
            this.setupCarouselScroll();
        }
    }

    showShiftTooltip(x, y, shift, baseline, employee) {
        const existing = document.querySelector('.shift-tooltip');
        if (existing) existing.remove();

        const tooltip = document.createElement('div');
        tooltip.className = 'shift-tooltip tooltip';
        tooltip.innerHTML = this.createShiftInfo(shift, baseline, employee, true, true);
        
        // Calculate position
        const tooltipWidth = 350;
        const tooltipHeight = 250;
        const margin = 30;
        const cursorOffset = 15;

        let adjustedX = x;
        let adjustedY = y;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isInLeftHalf = x < screenWidth / 2;

        if (isInLeftHalf) {
            adjustedX = x + cursorOffset;
            if (adjustedX + tooltipWidth > screenWidth - margin) {
                adjustedX = screenWidth - tooltipWidth - margin;
            }
        } else {
            adjustedX = x - tooltipWidth - cursorOffset;
            if (adjustedX < margin) {
                adjustedX = margin;
            }
        }

        // Vertical positioning
        adjustedY = y - tooltipHeight / 2;
        if (adjustedY < margin) {
            adjustedY = margin;
        } else if (adjustedY + tooltipHeight > screenHeight - margin) {
            adjustedY = screenHeight - tooltipHeight - margin;
        }

        tooltip.style.left = `${adjustedX}px`;
        tooltip.style.top = `${adjustedY}px`;
        
        document.body.appendChild(tooltip);
    }

    hideShiftTooltip() {
        const tooltip = document.querySelector('.shift-tooltip');
        if (tooltip) tooltip.remove();
    }

    setupCarouselScroll() {
        const carousel = document.getElementById('analytics-carousel');
        if (!carousel) return;

        carousel.addEventListener('scroll', () => {
            const scrollLeft = carousel.scrollLeft;
            const containerWidth = carousel.clientWidth;
            const scrollWidth = carousel.scrollWidth;
            
            const scrollProgress = scrollLeft / (scrollWidth - containerWidth);
            const currentIndex = Math.round(scrollProgress * 2); // 3 items
            
            document.querySelectorAll('.indicator-dot').forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });
    }

    setupLegendTooltip() {
        const legendButton = document.getElementById('legend-button');
        if (!legendButton) return;

        legendButton.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'legend-tooltip tooltip';
            tooltip.innerHTML = this.createLegendContent();
            
            const rect = e.target.getBoundingClientRect();
            const tooltipWidth = 380;
            const tooltipHeight = 320;
            const margin = 20;
            
            // Calculate horizontal position (center below button)
            let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            
            // Ensure tooltip doesn't go off screen
            if (left < margin) {
                left = margin;
            } else if (left + tooltipWidth > window.innerWidth - margin) {
                left = window.innerWidth - tooltipWidth - margin;
            }
            
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${rect.bottom + 10}px`;
            
            document.body.appendChild(tooltip);
        });

        legendButton.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.legend-tooltip');
            if (tooltip) tooltip.remove();
        });
    }

    setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth < 784;
                if (wasMobile !== this.isMobile) {
                    // Reset state when switching between mobile/desktop
                    this.state = {
                        ...this.state,
                        showBottomSheet: false,
                        showProjectDropdown: false,
                        showStageDropdown: false,
                        showPositionDropdown: false
                    };
                    this.render();
                }
            }, 250);
        });
    }

    // ========================================
    // STATE MANAGEMENT METHODS
    // ========================================
    async navigateMonth(direction) {
        if (direction === 'prev') {
            if (this.state.currentMonth === 0) {
                this.state.currentMonth = 11;
                this.state.currentYear--;
            } else {
                this.state.currentMonth--;
            }
        } else {
            if (this.state.currentMonth === 11) {
                this.state.currentMonth = 0;
                this.state.currentYear++;
            } else {
                this.state.currentMonth++;
            }
        }
        
        // Clear cache
        this.cache = {};
        
        // Reload data for new month
        this.showLoading();
        await this.loadData();
        this.hideLoading();
        
        this.render();
        
        // Auto-scroll to today if we're in current month
        if (this.state.currentMonth === CONSTANTS.CURRENT_DATE.getMonth() && 
            this.state.currentYear === CONSTANTS.CURRENT_DATE.getFullYear()) {
            setTimeout(() => this.centerTodayInCalendar(), 100);
        }
    }

    async goToToday() {
        const today = CONSTANTS.CURRENT_DATE;
        this.state.currentMonth = today.getMonth();
        this.state.currentYear = today.getFullYear();
        
        // Clear cache
        this.cache = {};
        
        // Reload data for current month
        this.showLoading();
        await this.loadData();
        this.hideLoading();
        
        this.render();
        setTimeout(() => this.centerTodayInCalendar(), 100);
    }

    setViewMode(mode) {
        this.state.viewMode = mode;
        this.render();
        if (this.state.currentMonth === CONSTANTS.CURRENT_DATE.getMonth() && 
            this.state.currentYear === CONSTANTS.CURRENT_DATE.getFullYear()) {
            setTimeout(() => this.centerTodayInCalendar(), 100);
        }
    }

    toggleFilterDropdown(type) {
        const dropdownKey = `show${type.charAt(0).toUpperCase() + type.slice(1)}Dropdown`;
        
        // Close all other dropdowns
        ['showProjectDropdown', 'showStageDropdown', 'showPositionDropdown'].forEach(key => {
            if (key !== dropdownKey) {
                this.state[key] = false;
            }
        });
        
        this.state[dropdownKey] = !this.state[dropdownKey];
        this.render();
    }

    closeAllDropdowns() {
        this.state.showProjectDropdown = false;
        this.state.showStageDropdown = false;
        this.state.showPositionDropdown = false;
        
        const needsRerender = 
            document.querySelector('.filter-dropdown-menu');
            
        if (needsRerender) {
            this.render();
        }
    }

    toggleFilterOption(type, option) {
        const current = this.state.filters[type];
        if (current.includes(option)) {
            this.state.filters[type] = current.filter(item => item !== option);
        } else {
            this.state.filters[type] = [...current, option];
        }
        
        if (this.isMobile) {
            // Update bottom sheet
            this.updateBottomSheetContent();
        } else {
            this.render();
        }
    }

    clearFilter(type) {
        this.state.filters[type] = [];
        this.render();
    }

    clearAllFilters() {
        this.state.filters = { project: [], stage: [], position: [] };
        this.render();
        this.closeModal('bottom-sheet');
    }

    setBottomSheetTab(tab) {
        this.state.bottomSheetTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('.bottom-sheet-tab').forEach(btn => {
            if (btn.dataset.tab === tab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update content
        this.updateBottomSheetContent();
    }

    closeModal(modalId) {
        if (modalId === 'bottom-sheet') {
            const overlay = document.getElementById('bottom-sheet-overlay');
            const sheet = document.getElementById('bottom-sheet');
            if (overlay) overlay.classList.add('hidden');
            if (sheet) sheet.classList.add('hidden');
        } else {
            const modal = document.getElementById(modalId);
            if (modal) modal.remove();
        }
    }

    centerTodayInCalendar() {
        const container = document.getElementById('calendar-scroll');
        if (!container) return;
        
        const todayDate = CONSTANTS.CURRENT_DATE.getDate();
        const todayMonth = CONSTANTS.CURRENT_DATE.getMonth();
        const todayYear = CONSTANTS.CURRENT_DATE.getFullYear();
        
        if (this.state.currentMonth !== todayMonth || this.state.currentYear !== todayYear) return;
        
        const headers = container.querySelectorAll('th');
        let todayElement = null;
        
        for (let header of headers) {
            const text = header.textContent;
            if (text && text.includes(todayDate.toString())) {
                todayElement = header;
                break;
            }
        }
        
        if (todayElement) {
            const containerRect = container.getBoundingClientRect();
            const todayRect = todayElement.getBoundingClientRect();
            
            const todayCenter = todayRect.left - containerRect.left + container.scrollLeft + (todayRect.width / 2);
            
            const employeeColWidth = this.isMobile ? CONSTANTS.MOBILE_EMPLOYEE_COL_WIDTH : CONSTANTS.EMPLOYEE_COL_WIDTH;
            const scrollableAreaWidth = containerRect.width - employeeColWidth;
            const scrollableAreaCenter = employeeColWidth + (scrollableAreaWidth / 2);
            
            const targetScrollLeft = todayCenter - scrollableAreaCenter;
            
            const maxScroll = container.scrollWidth - container.clientWidth;
            const finalScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScroll));
            
            container.scrollTo({
                left: finalScrollLeft,
                behavior: 'smooth'
            });
        }
    }
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM loaded, initializing Schedules page');
    
    const container = document.getElementById('calendar-container');
    if (!container) {
        console.error('❌ Calendar container not found!');
        return;
    }
    
    try {
        const calendar = new ShiftCalendar('calendar-container');
        console.log('📍 ShiftCalendar instance created');
    } catch (error) {
        console.error('❌ Failed to create ShiftCalendar:', error);
    }
});