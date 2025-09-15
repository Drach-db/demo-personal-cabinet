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
    // Fix "today" to September 22 of the current year for demo/UX consistency
    CURRENT_DATE: new Date(new Date().getFullYear(), 8, 22),
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

// Unified, matte typography palette
const THEME = {
    textPrimary: '#374151',   // warm dark gray for headings and primary text
    textSecondary: '#6b7280'  // medium gray for secondary captions
};

// Slightly darker accents for analytics values (non-glossy)
function getDarkerAccent(color) {
    switch (color) {
        case '#f59e0b': return '#b45309'; // amber 700
        case '#3b82f6': return '#1d4ed8'; // blue 700
        case '#22c55e': return '#166534'; // green 800
        default: return THEME.textPrimary;
    }
}

// ========================================
// SHIFT CALENDAR CLASS
// ========================================
class ShiftCalendar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isMobile = window.innerWidth < 784;
        this._resizeHandlerBound = null;
        this._scrollHandlerBound = null; // not used now
        this._windowLoadBound = null;
        this._calendarTopOffset = null; // Зафиксированная верхняя позиция scroller относительно вьюпорта
        this._calendarBaseTop = null;   // Базовая верхняя точка scроллера для расчёта высоты
        this._navBusy = false; // защита от двойных навигаций при одном клике
        this._scrollRaf = 0;
        
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
            bottomSheetTab: 'project',
            // Local month loading overlay flag
            isMonthLoading: false
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

        // Month data cache (per YYYY-MM)
        this.monthCache = new Map();

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
            this.setupResizeListener();
            // Выставляем высоту скролл-контейнера и центрируем сегодня
            this.fitCalendarScrollHeight(true);
            // Доп. пересчёт после макета/ресурсов
            requestAnimationFrame(() => this.fitCalendarScrollHeight(true));
            if (!this._windowLoadBound) {
                this._windowLoadBound = () => this.fitCalendarScrollHeight(true);
                window.addEventListener('load', this._windowLoadBound, { once: true });
            }
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => this.fitCalendarScrollHeight(true)).catch(() => {});
            }
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
            
            const key = `${this.state.currentYear}-${String(this.state.currentMonth + 1).padStart(2, '0')}`;
            if (this.monthCache.has(key)) {
                const { employees, shifts } = this.monthCache.get(key);
                this.employeesData = employees;
                this.shiftsData = shifts;
                console.log('📍 Loaded data from cache for', key);
            } else {
                // Load shifts for month
                const monthData = await api.getShiftsForMonth(this.state.currentYear, this.state.currentMonth + 1);
                
                console.log('📍 Data received:', monthData);
                
                const pickId = (...vals) => {
                    for (const v of vals) {
                        const t = (v === undefined || v === null) ? '' : String(v).trim();
                        if (t) return t;
                    }
                    return '';
                };
                const employees = (monthData.employees || []).map(e => ({
                    ...e,
                    // Normalize id to non-empty trimmed string
                    employee_id: pickId(e.employee_id, e.id, e.contacts_id)
                }));
                const rawShifts = monthData.shifts || [];
                // Normalize to canonical names (per schema)
                const normalizeDate = (v) => this.canonicalDate(v);
                const toCanonType = (v) => {
                    const t = String(v || '').toLowerCase();
                    if (t.includes('fact') || t.includes('actual')) return 'fact schedule';
                    if (t.includes('baseline') || t.includes('plan')) return 'baseline schedule';
                    return String(v || '');
                };
                const shifts = rawShifts.map(s => ({
                    ...s,
                    employee_id: pickId(s.employee_id, s.emp_id, s.contact_id, s.contacts_id),
                    start_shift_date: normalizeDate(s.start_shift_date || s.shift_date || s.date || s.day),
                    start_shift_time: s.start_shift_time || s.start_time || null,
                    end_shift_time: s.end_shift_time || s.end_time || null,
                    day_status: s.day_status || s.status || null,
                    absence_reason: s.absence_reason || s.reason || null,
                    schedule_type: toCanonType(s.schedule_type || s.type)
                }));
                this.monthCache.set(key, { employees, shifts });
                this.employeesData = employees;
                this.shiftsData = shifts;
            }
            
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
                    <button type="button" class="empty-state-button" onclick="location.reload()">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }

// ========================================
// UTILITY FUNCTIONS
// ========================================
    // Canonicalize date-like value to YYYY-MM-DD (zero-padded)
    canonicalDate(v) {
        if (!v) return null;
        const s = String(v);
        // Try to extract y-m-d parts
        const m = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (m) {
            const y = Number(m[1]);
            const mo = String(Number(m[2])).padStart(2, '0');
            const d = String(Number(m[3])).padStart(2, '0');
            return `${y}-${mo}-${d}`;
        }
        // Fallback: parse as Date
        const d = new Date(s);
        if (!isNaN(d)) {
            return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
        }
        // Last resort: trim first 10 chars
        return s.slice(0, 10);
    }
    formatDate(dateStr) {
        if (!dateStr) return null;
        const canon = this.canonicalDate(dateStr);
        const [year, month, day] = canon.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    parseTime(timeStr) {
        if (!timeStr) return undefined;
        const parts = String(timeStr).split(':').map(Number);
        const hours = Number.isFinite(parts[0]) ? parts[0] : undefined;
        const minutes = Number.isFinite(parts[1]) ? parts[1] : 0;
        if (!Number.isFinite(hours)) return undefined;
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
        
        // Treat 00:00 (0 minutes) as valid, only fail if undefined/NaN
        if (![plannedStartMinutes, plannedEndMinutes, actualStartMinutes, actualEndMinutes]
              .every(v => Number.isFinite(v))) {
            return false;
        }
        
        const isLate = actualStartMinutes - plannedStartMinutes >= 10;
        const isEarlyLeave = plannedEndMinutes - actualEndMinutes >= 10;
        
        return isLate || isEarlyLeave;
    }

    // Special employment status for a given employee/day
    // Returns one of: 'not_hired' | 'onboarding' | 'terminated' | null
    getSpecialStatus(record, date) {
        if (!record) return null;
        const interviewDate = record.interview_date ? this.formatDate(record.interview_date) : null;
        const startDate = record.start_date ? this.formatDate(record.start_date) : null;
        const endDate = record.end_date ? this.formatDate(record.end_date) : null;

        if (interviewDate && date < interviewDate) return 'not_hired';
        if (interviewDate && startDate && date >= interviewDate && date < startDate) return 'onboarding';
        // From the termination date and later
        if (endDate && date >= endDate) return 'terminated';
        return null;
    }

    toDateStr(d) {
        return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
    }

    isToday(d) {
        return d.toDateString() === CONSTANTS.CURRENT_DATE.toDateString();
    }

    isPast(d) {
        // Compare by calendar day only (ignore time) to avoid treating "today" as past
        if (!d) return false;
        const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const today = new Date(
            CONSTANTS.CURRENT_DATE.getFullYear(),
            CONSTANTS.CURRENT_DATE.getMonth(),
            CONSTANTS.CURRENT_DATE.getDate()
        );
        return day < today;
    }

    getAvatarColor(name) {
        // Warm matte palette (no glossy gradients)
        const colors = [
            { bg: '#F4EDE6', text: '#374151' }, // warm cream
            { bg: '#E9F2EE', text: '#166534' }, // soft green
            { bg: '#EEF2FB', text: '#1E3A8A' }, // soft blue
            { bg: '#FDEEE7', text: '#92400E' }, // soft amber
            { bg: '#F3F4F6', text: '#374151' }  // soft gray
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

    // Number formatting helpers
    formatThousands(value) {
        const v = Math.round(Number(value || 0));
        if (Math.abs(v) >= 1000) {
            return Math.floor(v / 1000).toLocaleString('en-US');
        }
        return v.toLocaleString('en-US');
    }

    formatCurrency(value) {
        return `$${this.formatThousands(value)}`;
    }

    formatInt(value) {
        return this.formatThousands(value);
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
        const norm = (v) => (v === undefined || v === null) ? '' : String(v).trim();
        const id = norm(employeeId);
        return this.shiftsData.filter(shift => {
            const sid = norm(shift.employee_id);
            const sdate = this.canonicalDate(shift.start_shift_date);
            return sid === id && sdate === dateStr;
        });
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
            const monthStartStr = this.toDateStr(monthStart);
            const monthEndStr = this.toDateStr(monthEnd);

            // Helper: check if employee has any shift within the month window
            const hasShiftsInMonth = (empId) => this.shiftsData.some(s => {
                const norm = (v) => (v === undefined || v === null) ? '' : String(v).trim();
                if (norm(s.employee_id) !== norm(empId)) return false;
                const d = s.start_shift_date;
                return d >= monthStartStr && d <= monthEndStr;
            });

            // Build candidate employees set from current API payload + any cached months (to avoid API omissions)
            const byId = new Map();
            (this.employeesData || []).forEach(e => byId.set(String(e.employee_id).trim(), e));
            for (const entry of this.monthCache.values()) {
                const arr = entry && entry.employees ? entry.employees : [];
                arr.forEach(e => {
                    const key = String(e.employee_id).trim();
                    if (!byId.has(key)) byId.set(key, e);
                });
            }
            const candidates = Array.from(byId.values());

            this.cache.employeesInMonth = candidates.filter(emp => {
                const interviewDate = emp.interview_date ? this.formatDate(emp.interview_date) : null;
                const startDate = emp.start_date ? this.formatDate(emp.start_date) : null;
                const endDate = emp.end_date ? this.formatDate(emp.end_date) : null;

                // If has any shifts inside month — include regardless of dates
                if (hasShiftsInMonth(emp.employee_id)) return true;

                // Normalize employee interval to month boundaries:
                // - start at the 1st day of interview/start month (prefer interview_date if present)
                // - end at the last day of end_date month (inclusive); open-ended if no end_date
                const startAnchor = interviewDate || startDate;
                if (!startAnchor) return false; // no interval info
                const normalizedStart = new Date(startAnchor.getFullYear(), startAnchor.getMonth(), 1);
                const normalizedEnd = endDate ? new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0)
                                              : new Date(8640000000000000);

                // Compare by month end: include if monthEnd is within [normalizedStart .. normalizedEnd]
                if (monthEnd >= normalizedStart && monthEnd <= normalizedEnd) return true;

                return false;
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
                // 0) Pin project "Sales team" to top
                const PIN = 'sales team';
                const projA = (a.project || '').toString();
                const projB = (b.project || '').toString();
                const aPinned = projA.toLowerCase() === PIN;
                const bPinned = projB.toLowerCase() === PIN;
                if (aPinned !== bPinned) return aPinned ? -1 : 1;
                // 1) By project name
                const projDiff = projA.localeCompare(projB);
                if (projDiff !== 0) return projDiff;
                // 2) Within project: non-backup first, then backup
                const aBackup = String(a.staffing_type || '').toLowerCase() === 'backup';
                const bBackup = String(b.staffing_type || '').toLowerCase() === 'backup';
                if (aBackup !== bBackup) return aBackup ? 1 : -1;
                // 3) Alphabetically by full name
                return a.full_name.localeCompare(b.full_name);
            });
    }

    // Compute available options per filter dimension, taking into account the other active filters
    getFilterOptions() {
        const employees = this.getEmployeesInMonth();
        const { project, stage, position } = this.state.filters;

        // Employees available for each dimension under constraints of other dimensions
        const employeesForProjects = employees.filter(emp => {
            const matchesStage = stage.length === 0 || stage.includes(emp.stage);
            const matchesPosition = position.length === 0 || position.includes(emp.position);
            return matchesStage && matchesPosition;
        });

        const employeesForStages = employees.filter(emp => {
            const matchesProject = project.length === 0 || project.includes(emp.project);
            const matchesPosition = position.length === 0 || position.includes(emp.position);
            return matchesProject && matchesPosition;
        });

        const employeesForPositions = employees.filter(emp => {
            const matchesProject = project.length === 0 || project.includes(emp.project);
            const matchesStage = stage.length === 0 || stage.includes(emp.stage);
            return matchesProject && matchesStage;
        });

        return {
            projects: [...new Set(employeesForProjects.map(emp => emp.project))],
            stages: [...new Set(employeesForStages.map(emp => emp.stage))],
            positions: [...new Set(employeesForPositions.map(emp => emp.position))]
        };
    }

    // Remove selected values that are no longer available given the other filters
    enforceConsistentSelections() {
        const opts = this.getFilterOptions();
        this.state.filters.project = (this.state.filters.project || []).filter(v => opts.projects.includes(v));
        this.state.filters.stage = (this.state.filters.stage || []).filter(v => opts.stages.includes(v));
        this.state.filters.position = (this.state.filters.position || []).filter(v => opts.positions.includes(v));
    }

    getAnalytics() {
        const currentMonthStr = `${this.state.currentYear}-${(this.state.currentMonth + 1).toString().padStart(2, '0')}`;
        
        const currentMonthShifts = this.shiftsData.filter(shift => 
            (shift.start_shift_date || '').startsWith(currentMonthStr)
        );
        
        const today = new Date(CONSTANTS.CURRENT_DATE.getFullYear(), CONSTANTS.CURRENT_DATE.getMonth(), CONSTANTS.CURRENT_DATE.getDate());
        const todayStr = this.toDateStr(today);
        const selectedYM = this.state.currentYear * 12 + this.state.currentMonth;
        const todayYM = today.getFullYear() * 12 + today.getMonth();
        
        // Planned: весь месяц baseline schedule
        const plannedHours = currentMonthShifts
            .filter(shift => shift.schedule_type === 'baseline schedule')
            .reduce((total, shift) => total + (shift.pay_time || 0), 0);

        // Actual: весь месяц fact schedule (без ограничений по статусу/дате)
        const actualHours = currentMonthShifts
            .filter(shift => shift.schedule_type === 'fact schedule')
            .reduce((total, shift) => total + (shift.pay_time || 0), 0);

        // Projected:
        // - Если выбранный месяц в прошлом: весь месяц fact
        // - Если в будущем: весь месяц baseline
        // - Если текущий: baseline до today (строго < today) + fact от today (>= today)
        let projectedHours;
        if (selectedYM < todayYM) {
            projectedHours = currentMonthShifts
                .filter(s => s.schedule_type === 'fact schedule')
                .reduce((t, s) => t + (s.pay_time || 0), 0);
        } else if (selectedYM > todayYM) {
            projectedHours = currentMonthShifts
                .filter(s => s.schedule_type === 'baseline schedule')
                .reduce((t, s) => t + (s.pay_time || 0), 0);
        } else {
            const baselineHoursBeforeToday = currentMonthShifts
                .filter(s => s.schedule_type === 'baseline schedule' && s.start_shift_date < todayStr)
                .reduce((t, s) => t + (s.pay_time || 0), 0);
            const factHoursFromToday = currentMonthShifts
                .filter(s => s.schedule_type === 'fact schedule' && s.start_shift_date >= todayStr)
                .reduce((t, s) => t + (s.pay_time || 0), 0);
            projectedHours = baselineHoursBeforeToday + factHoursFromToday;
        }

        return [
            { 
                title: 'Planned Hours', 
                mobileTitle: 'Planned', 
                subtitle: 'Monthly', 
                hours: plannedHours, 
                cost: plannedHours * 15, 
                // Align with Billing: warning (amber)
                color: '#eab308', 
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
            <div id="analytics-section">${this.renderAnalytics()}</div>
            ${this.renderMainContent()}
        `;
        this.container.innerHTML = html;
        // Re-setup event listeners after render as DOM was replaced
        this.setupEventListeners();
        // Attach listeners for elements created within partial sections
        this.afterPartialUpdateSetup();
        // После полной перерисовки сбрасываем кеш top и пересчитываем высоту
        this._calendarTopOffset = null;
        this.fitCalendarScrollHeight(true);
    }

    renderAnalytics() {
        const analytics = this.getAnalytics();
        
        if (this.isMobile) {
            return `
                <div class="mobile-only" style="padding-top: 0;">
                    <div style="margin: 0 0 1.5rem;">
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
                <div class="desktop-only" style="padding: 0; margin-bottom: 1.5rem;">
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
        const formattedCost = this.formatCurrency(data.cost);
        const formattedHours = `${this.formatInt(data.hours)}h`;
        const value = isMobile ? formattedHours : `${formattedCost} / ${formattedHours}`;
        const acc = this.getAnalyticAccent ? this.getAnalyticAccent(data.color) : [THEME.textPrimary, 'rgba(55,65,81,0.55)'];
        const accent = acc[0];
        const accentFill = acc[1];
        
        // Use Billing-like background/border opacities via rgba
        const toRgb = (hex) => {
            const v = hex.replace('#','');
            const r = parseInt(v.slice(0,2), 16);
            const g = parseInt(v.slice(2,4), 16);
            const b = parseInt(v.slice(4,6), 16);
            return `${r}, ${g}, ${b}`;
        };
        const rgb = toRgb(data.color);
        const cardBg = `rgba(${rgb}, 0.05)`;      // matches billing card bg alpha
        const cardBorder = `rgba(${rgb}, 0.20)`;  // matches billing card border alpha
        const iconBg = `rgba(${rgb}, 0.10)`;      // icon tile bg
        const iconBorder = `rgba(${rgb}, 0.25)`;  // icon tile border

        return `
            <div class="analytics-card" style="--accent: ${accent}; --accent-fill: ${accentFill}; background-color: ${cardBg}; border-color: ${cardBorder};">
                <div class="flex items-center gap-3" style="margin-bottom: 0.25rem;">
                    <div style="width: 2rem; height: 2rem; border-radius: 0.5rem; 
                                background-color: ${iconBg}; border: 1px solid ${iconBorder};
                                display: flex; align-items: center; justify-content: center; line-height: 0; box-sizing: border-box;">
                        <div style="color: ${data.color}; display:flex; align-items:center; justify-content:center; line-height:0;">${ICONS[data.icon]}</div>
                    </div>
                    <div>
                        <h3 class="analytics-title" style="margin:0; font-size: ${isMobile ? '1.125rem' : '0.875rem'}; font-weight: 600;">
                            ${title}
                        </h3>
                        <p style="margin:2px 0 0; font-size: 0.75rem; color: #6b7280;">${data.subtitle}</p>
                    </div>
                </div>
                <div class="analytics-value" style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">
                    ${value}
                </div>
                <div class="flex items-center justify-between" style="margin-bottom: 0.75rem;">
                    ${!isMobile ? `<div style=\"font-size: 0.75rem; color: #6b7280;\">@ $15/hr</div>` : ''}
                    <div style="font-size: 0.75rem; font-weight: 600; color: #6b7280;">
                        ${data.percentage}%
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" 
                         style="background-color: ${data.hours === 0 ? accentFill : accent};
                                width: ${data.hours === 0 ? '100%' : `${Math.min(data.percentage, 100)}%`};">
                    </div>
                </div>
            </div>
        `;
    }

    // Return [accent, accentFill] – match Billing palette directly
    getAnalyticAccent(base) {
        switch (base) {
            case '#eab308': return ['#eab308', 'rgba(234,179,8,0.55)'];   // warning
            case '#3b82f6': return ['#3b82f6', 'rgba(59,130,246,0.55)']; // info
            case '#22c55e': return ['#22c55e', 'rgba(34,197,94,0.55)'];  // success
            default: return [THEME.textPrimary, 'rgba(55,65,81,0.55)'];
        }
    }

    renderMainContent() {
        return `
            <div class="calendar-wrapper" style="position: relative;">
                <div id="navigation-section">${this.renderNavigation()}</div>
                <div id="legend-section">${this.renderLegend()}</div>
                <div id="calendar-section" style="position: relative;">
                    ${this.state.isMonthLoading ? `
                        <div class="calendar-overlay">
                            <div class="loading-spinner"></div>
                        </div>
                    ` : ''}
                    ${this.renderCalendar()}
                </div>
            </div>
        `;
    }

    renderNavigation() {
        if (this.isMobile) {
            const activeFiltersCount = this.state.filters.project.length + this.state.filters.stage.length + this.state.filters.position.length;
            const hasActiveFilters = activeFiltersCount > 0;
            return `
                <div class="mobile-only" style="padding: 0;">
                    <div class="flex items-center gap-3" style="margin-bottom: 1rem;">
                        <div class="search-container" style="flex: 1;">
                            <span class="search-icon">${ICONS.search}</span>
                            <input type="text" 
                                   class="search-input" 
                                   id="search-input"
                                   placeholder="Search..."
                                   value="${this.state.searchTerm}">
                        </div>
                        <div class="flex items-center gap-2">
                            ${hasActiveFilters ? `
                                <button type="button" class="mobile-clear-icon" id="clear-mobile-filters" aria-label="Clear filters">
                                    ${ICONS.x}
                                </button>
                            ` : ''}
                            <button type="button" class="mobile-filters-btn ${hasActiveFilters ? 'active' : ''} only-icon" id="filter-button" aria-label="Open filters">
                                ${ICONS.filter}
                                ${hasActiveFilters ? `<span class="mobile-filters-badge">${activeFiltersCount}</span>` : ''}
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex gap-2">
                            <button type="button" class="nav-button" id="prev-month-mobile" ${this.state.isMonthLoading ? 'disabled' : ''}>${ICONS.chevronLeft}</button>
                            <button type="button" class="nav-button" id="next-month-mobile" ${this.state.isMonthLoading ? 'disabled' : ''}>${ICONS.chevronRight}</button>
                        </div>
                        
                        <div class="view-tabs">
                            ${['Baseline', 'Actual', 'All'].map(mode => `
                                <button type="button" class="view-tab ${this.state.viewMode === mode ? 'active' : ''}"
                                        data-mode="${mode}">
                                    ${mode === 'Baseline' ? 'Plan' : mode}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div style="text-align: center; margin: 8px 0 0;">
                        <h2 style="font-size: 1.25rem; font-weight: 600; color:#374151;">
                            ${this.getMonthName(this.state.currentMonth)} ${this.state.currentYear}
                        </h2>
                    </div>
                </div>
            `;
        } else {
            const employeesInMonth = this.getEmployeesInMonth();
            const filteredEmployees = this.getFilteredEmployees();
            
            return `
                <div class="desktop-only" style="padding: 0; position: relative; z-index: 100;">
                    <div class="flex items-center gap-4" style="margin-bottom: 1rem;">
                        <div class="search-container" style="width: 100%; min-width: 320px;">
                            <span class="search-icon">${ICONS.search}</span>
                            <input type="text" 
                                   class="search-input" 
                                   id="search-input"
                                   placeholder="Search employees by name, position, or project..."
                                   value="${this.state.searchTerm}">
                            ${this.state.searchTerm ? `
                                <button type="button" id="clear-search" style="position: absolute; right: 0.75rem; top: 50%; 
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

                        <div class="count-pill" id="results-count">
                            ${filteredEmployees.length} of ${employeesInMonth.length}
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center" 
                         style="border-radius: 0.75rem; padding: 1rem 1.5rem; 
                                background-color: rgba(248,247,244,0.92); border: 1px solid rgba(220,215,205,0.4);">
                        <div class="flex gap-2">
                            <button type="button" class="nav-button" id="prev-month" ${this.state.isMonthLoading ? 'disabled' : ''}>${ICONS.chevronLeft}</button>
                            <button type="button" class="nav-button" id="next-month" ${this.state.isMonthLoading ? 'disabled' : ''}>${ICONS.chevronRight}</button>
                    <button type="button" class="nav-button" id="today-button" ${this.state.isMonthLoading ? 'disabled' : ''} style="padding: 0.5rem 1rem; color: rgba(204,102,51,0.85); border-color: rgba(204,102,51,0.25);">Today</button>
                        </div>
                        
                        <h2 style="font-size: 1.5rem; font-weight: 600; color:#374151;">
                            ${this.getMonthName(this.state.currentMonth)} ${this.state.currentYear}
                        </h2>
                        
                        <div class="view-tabs">
                            ${['Baseline', 'Actual', 'All'].map(mode => `
                                <button type="button" class="view-tab ${this.state.viewMode === mode ? 'active' : ''}"
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
        const optionsMap = this.getFilterOptions();
        const options = type === 'project' ? optionsMap.projects : type === 'stage' ? optionsMap.stages : optionsMap.positions;
        const selected = this.state.filters[type];
        const isOpen = this.state[`show${type.charAt(0).toUpperCase() + type.slice(1)}Dropdown`];
        
        const label = type.charAt(0).toUpperCase() + type.slice(1);
        const icon = type === 'project' ? 'briefcase' : type === 'stage' ? 'userCheck' : 'award';
        const isActive = selected.length > 0;
        
        return `
            <div class="filter-dropdown ${isActive ? 'active' : ''}">
                <div style="position: relative;">
                    <span class="filter-icon" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); z-index: 30;">
                        ${ICONS[icon]}
                    </span>
                    <button type="button" class="filter-button" data-filter-type="${type}">
                        <span>${selected.length === 0 ? `All ${label}s` : `${selected.length} Selected`}</span>
                    </button>
                    ${selected.length > 0 ? `
                        <button type="button" class="clear-filter" data-filter-type="${type}"
                                style="position: absolute; right: 1.75rem; top: 50%; transform: translateY(-50%); 
                                       padding: 0.125rem; border-radius: 50%; background: transparent; 
                                       border: none; cursor: pointer; z-index: 50;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    ` : ''}
                    <span class="filter-chevron" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); pointer-events: none;">
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
                                    <span class="filter-option-label">${option}</span>
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
        // Fixed demo time for consistency
        const currentTime = '3:30 PM';

        return `
            <div style="padding: 0.5rem 0; margin-top: 8px;">
                <div class="flex items-center gap-1" style="color: #374151;">
                    <button type="button" id="legend-button" class="flex items-center gap-1" 
                            style="background: none; border: none; cursor: pointer; color: inherit;">
                        <span style="font-size: ${this.isMobile ? '0.75rem' : '0.875rem'}; font-weight: 600;">
                        Legend
                        </span>
                        <div style="width: 1rem; height: 1rem; border-radius: 50%; 
                                    border: 1px solid rgba(204,102,51,0.45); color: rgba(204,102,51,0.85);
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
        const filteredEmployees = this.getFilteredEmployees();
        
        if (employeesInMonth.length === 0) {
            return this.renderEmptyState();
        }
        // If search term is present and nothing found, show an empty notice similar to month-empty
        if ((this.state.searchTerm || '').trim().length > 0 && filteredEmployees.length === 0) {
            return this.renderNoSearchResults();
        }
        
        const days = this.getDays();
        const cellWidth = this.isMobile ? CONSTANTS.MOBILE_CELL_WIDTH : CONSTANTS.CELL_WIDTH;
        const employeeColWidth = this.isMobile ? CONSTANTS.MOBILE_EMPLOYEE_COL_WIDTH : CONSTANTS.EMPLOYEE_COL_WIDTH;
        const minTableWidth = employeeColWidth + (days.length * cellWidth);
        
        return `
            <div class="calendar-scroll-container">
                <div class="calendar-hscroll" id="calendar-hscroll">
                    <div class="calendar-hscroll-rail">
                        <div class="calendar-hscroll-thumb" id="calendar-hscroll-thumb"></div>
                    </div>
                </div>
                <div class="calendar-scroll" id="calendar-scroll">
                    <table class="calendar-table" style="min-width: ${minTableWidth}px;">
                        ${this.renderCalendarHeader()}
                        ${this.renderCalendarBody()}
                    </table>
                </div>
            </div>
        `;
    }

    // ========================================
    // PARTIAL UPDATE HELPERS
    // ========================================
    updateCalendarContent() {
        // Ensure selected filters remain consistent with available options
        this.enforceConsistentSelections();

        // Update analytics, navigation, legend, and calendar separately
        const analytics = document.getElementById('analytics-section');
        if (analytics) {
            analytics.innerHTML = this.renderAnalytics();
        }

        const nav = document.getElementById('navigation-section');
        if (nav) {
            nav.innerHTML = this.renderNavigation();
        }

        const legend = document.getElementById('legend-section');
        if (legend) {
            legend.innerHTML = this.renderLegend();
        }

        const calendar = document.getElementById('calendar-section');
        if (calendar) {
            // Try to update the existing table in-place to avoid flicker
            const scroller = document.getElementById('calendar-scroll');
            const table = scroller ? scroller.querySelector('.calendar-table') : null;
            const employeesInMonth = this.getEmployeesInMonth();
            const filteredEmployees = this.getFilteredEmployees();
            const canPatchInPlace = !!(scroller && table && employeesInMonth.length > 0 && (!(this.state.searchTerm||'').trim() || filteredEmployees.length > 0));

            // Preserve current horizontal scroll
            const savedLeft = scroller ? scroller.scrollLeft : 0;

            if (canPatchInPlace) {
                const newThead = this.renderCalendarHeader();
                const newTbody = this.renderCalendarBody();
                const theadEl = table.querySelector('thead');
                const tbodyEl = table.querySelector('tbody');
                if (theadEl) theadEl.outerHTML = newThead;
                if (tbodyEl) tbodyEl.outerHTML = newTbody;
                // Restore scroll and refresh thumb without rebuilding containers
                if (scroller) scroller.scrollLeft = savedLeft;
                if (typeof this.updateHScrollThumb === 'function') this.updateHScrollThumb();
            } else {
                // Fall back to full render (empty states or first paint). Keep scroll position if possible.
                calendar.innerHTML = this.renderCalendar();
                const sc = document.getElementById('calendar-scroll');
                if (sc && savedLeft) sc.scrollLeft = savedLeft;
            }
        }

        // Reattach listeners that bind to specific nodes
        this.afterPartialUpdateSetup();
        // Применяем защиту от «резинки» на мобильных
        this.applyRubberBandGuard();
        // Пересчитываем доступную высоту скроллера после частичного обновления
        this.fitCalendarScrollHeight();
    }

    afterPartialUpdateSetup() {
        // Legend tooltip needs rebinding
        this.setupLegendTooltip();
        // Mobile analytics carousel indicators need rebinding
        if (this.isMobile) {
            this.setupCarouselScroll();
        }
        // Sync desktop horizontal scrollbar with main scroller
        this.setupHorizontalScrollbarSync();
        // (removed) mini horizontal scrollbar interactions
    }

    setupHorizontalScrollbarSync() {
        const scroller = document.getElementById('calendar-scroll');
        const hscroll = document.getElementById('calendar-hscroll');
        const rail = hscroll ? hscroll.querySelector('.calendar-hscroll-rail') : null;
        const thumb = hscroll ? hscroll.querySelector('.calendar-hscroll-thumb') : null;
        if (!scroller || !hscroll || !rail || !thumb) return;

        // Avoid duplicate setup
        if (hscroll.__syncInstalled) {
            // refresh on rerender
            requestAnimationFrame(() => this.updateHScrollThumb());
            return;
        }

        const update = () => this.updateHScrollThumb();
        scroller.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update, { passive: true });

        // Drag support
        let dragging = false;
        let dragOffsetX = 0;

        const onPointerDown = (e) => {
            e.preventDefault();
            const railRect = rail.getBoundingClientRect();
            const thumbRect = thumb.getBoundingClientRect();
            const x = e.clientX;
            if (x < thumbRect.left || x > thumbRect.right) {
                // Jump to click position (center the thumb)
                const pos = x - railRect.left - thumbRect.width / 2;
                this.setScrollByThumbPos(pos);
                this.updateHScrollThumb();
            }
            dragging = true;
            dragOffsetX = x - thumb.getBoundingClientRect().left;
            document.addEventListener('mousemove', onPointerMove, { passive: false });
            document.addEventListener('mouseup', onPointerUp, { passive: true });
        };
        const onPointerMove = (e) => {
            if (!dragging) return;
            e.preventDefault();
            const railRect = rail.getBoundingClientRect();
            const newLeft = e.clientX - railRect.left - dragOffsetX;
            this.setScrollByThumbPos(newLeft);
            this.updateHScrollThumb();
        };
        const onPointerUp = () => {
            dragging = false;
            document.removeEventListener('mousemove', onPointerMove);
            document.removeEventListener('mouseup', onPointerUp);
        };

        rail.addEventListener('mousedown', onPointerDown);

        hscroll.__syncInstalled = true;
        // initial position
        requestAnimationFrame(() => this.updateHScrollThumb());
    }

    setScrollByThumbPos(posPx) {
        const scroller = document.getElementById('calendar-scroll');
        const hscroll = document.getElementById('calendar-hscroll');
        const rail = hscroll ? hscroll.querySelector('.calendar-hscroll-rail') : null;
        const thumb = hscroll ? hscroll.querySelector('.calendar-hscroll-thumb') : null;
        if (!scroller || !rail || !thumb) return;
        const railWidth = rail.clientWidth;
        const content = scroller.scrollWidth;
        const viewport = scroller.clientWidth;
        const maxThumb = Math.max(24, Math.round(railWidth * (viewport / content)));
        const maxLeft = Math.max(0, railWidth - maxThumb);
        const clamped = Math.max(0, Math.min(posPx, maxLeft));
        const ratio = maxLeft > 0 ? clamped / maxLeft : 0;
        const maxScroll = content - viewport;
        scroller.scrollLeft = Math.round(ratio * maxScroll);
    }

    updateHScrollThumb() {
        const scroller = document.getElementById('calendar-scroll');
        const hscroll = document.getElementById('calendar-hscroll');
        if (!scroller || !hscroll) return;
        const rail = hscroll.querySelector('.calendar-hscroll-rail');
        const thumb = hscroll.querySelector('.calendar-hscroll-thumb');
        if (!rail || !thumb) return;
        const railWidth = rail.clientWidth;
        const content = scroller.scrollWidth;
        const viewport = scroller.clientWidth;
        const maxScroll = Math.max(0, content - viewport);
        const minThumb = 24; // px
        const thumbWidth = Math.max(minThumb, Math.round(railWidth * (viewport / content)));
        const maxLeft = Math.max(0, railWidth - thumbWidth);
        const left = maxScroll > 0 ? Math.round((scroller.scrollLeft / maxScroll) * maxLeft) : 0;
        thumb.style.width = `${thumbWidth}px`;
        thumb.style.left = `${left}px`;
    }


    renderEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-state-content" ${this.isMobile ? 'style="margin: 0;"' : ''}>
                    <div class="empty-state-icon">${ICONS.calendar}</div>
                    <h3 class="empty-state-title">No employees this month</h3>
                    <p class="empty-state-text">
                        No one was working in ${this.getMonthName(this.state.currentMonth)} ${this.state.currentYear}
                    </p>
                    <button type="button" class="empty-state-button" id="go-to-today">
                        ${ICONS.calendar}
                        Go to current month
                    </button>
                </div>
            </div>
        `;
    }

    renderNoSearchResults() {
        const term = (this.state.searchTerm || '').trim();
        return `
            <div class="empty-state">
                <div class="empty-state-content" ${this.isMobile ? 'style="margin: 0;"' : ''}>
                    <div class="empty-state-icon">${ICONS.search}</div>
                    <h3 class="empty-state-title">No matches found</h3>
                    <p class="empty-state-text">Nothing matches “${term.replace(/</g,'&lt;').replace(/>/g,'&gt;')}” in ${this.getMonthName(this.state.currentMonth)} ${this.state.currentYear}</p>
                    <button type="button" class="empty-state-button" id="clear-search-empty">
                        ${ICONS.x}
                        Clear search
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
                                  color: ${this.isToday(day) ? COLORS.BRAND : '#374151'}; position: relative;
                                  background-color: rgba(248,247,244,0.92);">
                            ${this.isToday(day) ? '<div class="today-indicator"></div>' : ''}
                            <div class="flex flex-col items-center justify-center" style="height: 100%; position: relative; z-index: 1;">
                                <div class="flex items-center gap-1" style="font-size: ${this.isMobile ? '1.125rem' : '1.875rem'};">
                                    <span style="font-weight: 600;">${day.getDate()}</span>
                                    <div class="flex flex-col" style="font-size: 0.75rem;">
                                        <span style="font-weight: 600; color: #374151;">
                                            ${this.getDayName(day)}
                                        </span>
                                        ${!this.isMobile ? `
                                            <span style="font-weight: 500; color: #9ca3af;">
                                                ${this.getMonthName(day.getMonth()).slice(0, 3)}
                                            </span>
                                        ` : ''}
                                    </div>
                                </div>
                                ${this.isToday(day) ? '<span class="today-badge">ToDay</span>' : ''}
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
                            <div style="font-size: 1rem; font-weight: 600; color:${THEME.textPrimary}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left;">
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
                                ${employee.staffing_type === 'Backup' ? `
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
        const stageColor = this.getStageColor && this.getStageColor(employee.stage) || '#6b7280';

        return `
            <div class="avatar" 
                 style="width: ${sizeConfig.container}; height: ${sizeConfig.container}; 
                        background: ${avatarColor.bg}; position: relative;"
                 data-employee-id="${employee.employee_id}">
                <span style="font-size: ${sizeConfig.text}; font-weight: 700; color: ${avatarColor.text};">
                    ${initials}
                </span>
                <div class="employee-status-dot" style="background-color: ${stageColor};"></div>
                ${showInfoButton ? `
                    <div class="avatar-info-btn">i</div>
                ` : ''}
            </div>
        `;
    }

    getStageColor(stage) {
        const map = {
            active: '#22c55e',
            onboarding: '#eab308',
            terminated: '#ef4444'
        };
        if (!stage) return '#6b7280';
        return map[String(stage).toLowerCase()] || '#6b7280';
    }

    renderDayCell(employee, day, scheduleType, isChildRow = false) {
        const shifts = this.getShiftsForEmployeeAndDate(employee.employee_id, day);
        const actualShifts = shifts.filter(s => s.schedule_type === 'fact schedule');
        const baselineShifts = shifts.filter(s => s.schedule_type === 'baseline schedule');

        // Decide what to show based on date boundary logic
        const dateStr = this.toDateStr(day);
        const todayStr = this.toDateStr(CONSTANTS.CURRENT_DATE);
        const isBeforeToday = dateStr < todayStr;
        // const isToday = dateStr === todayStr; // reserved if needed
        // const isAfterOrToday = dateStr >= todayStr;

        let displayShifts = [];
        if (scheduleType === 'Actual') {
            // Actual view: if ACTUAL exists, it overrides BASELINE for any date.
            // Otherwise, fall back to BASELINE.
            displayShifts = actualShifts.length > 0 ? actualShifts : baselineShifts;
        } else if (scheduleType === 'Baseline') {
            displayShifts = baselineShifts;
        }

        const cellWidth = this.isMobile ? CONSTANTS.MOBILE_CELL_WIDTH : CONSTANTS.CELL_WIDTH;
        const cellHeight = isChildRow ? (this.isMobile ? '54px' : '70px') : (this.isMobile ? '64px' : '80px');

        // If no shifts, check employment special status for this date
        let specialStatus = null;
        if (displayShifts.length === 0) {
            specialStatus = this.getSpecialStatus(employee, day);
            // In Plan view we never show 'terminated' badges; keep cells empty instead
            if (scheduleType === 'Baseline' && specialStatus === 'terminated') {
                specialStatus = null;
            }
        }

        // Terminated days in Actual view: show only FACT shifts; baseline after end_date should not mask termination
        if (scheduleType === 'Actual') {
            const statusForDay = this.getSpecialStatus(employee, day);
            if (statusForDay === 'terminated') {
                displayShifts = actualShifts;
                if (displayShifts.length === 0) specialStatus = 'terminated'; else specialStatus = null;
            }
        }

        const renderSpecialBadge = (code) => {
            if (!code) return '';
            const label = code === 'not_hired' ? 'Not Hired' : code === 'terminated' ? 'Terminated' : code === 'onboarding' ? 'Onboarding' : String(code);
            const cls = code === 'terminated' ? 'badge badge-terminated'
                      : code === 'onboarding' ? 'badge badge-onboarding'
                      : code === 'not_hired' ? 'badge badge-nothired'
                      : 'badge';
            const cellStyle = `background-image: repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(156,163,175,0.08) 6px, rgba(156,163,175,0.08) 7px); background-color: #fafafa; border-radius: 6px;`;
            return `<div class="special-cell" style="${cellStyle}; width:100%; height:100%; display:flex; align-items:center; justify-content:center; padding:2px;">
                <span class="${cls}" style="font-size:${this.isMobile ? '10.5px' : '10px'}; line-height:1;">${label}</span>
            </div>`;
        };

        return `
            <td style="width: ${cellWidth}px; min-width: ${cellWidth}px; max-width: ${cellWidth}px;
                       background-color: ${isChildRow ? COLORS.BACKGROUND.childRow : 'transparent'};
                       height: ${cellHeight}; min-height: ${cellHeight}; max-height: ${cellHeight};
                       padding: ${isChildRow ? '0.125rem' : '0.25rem'} ${this.isMobile ? '0.25rem' : '0.5rem'}; text-align: center; position: relative;">
                ${this.isToday(day) ? '<div class="today-indicator"></div>' : ''}
                <div class="flex flex-col gap-1 items-center justify-center" style="width: 100%; height: 100%; position: relative; z-index: 1;">
                    ${displayShifts.length > 0 ? displayShifts.map((shift, idx) => {
                        let baselineShift = null;
                        if (shift.schedule_type === 'fact schedule' && baselineShifts.length > 0) {
                            baselineShift = baselineShifts[0];
                        }
                        return this.renderShiftCell(shift, baselineShift, employee, isChildRow, scheduleType);
                    }).join('') : renderSpecialBadge(specialStatus)}
                </div>
            </td>
        `;
    }

    renderShiftCell(shift, baselineShift, employee, isChildRow, viewType = 'Actual') {
        const shiftDate = this.formatDate(shift.start_shift_date);
        const isPastShift = this.isPast(shiftDate);
        const isTodayShift = this.isToday(shiftDate);
        
        let statusCode = null;
        let showDiscrepancy = false;
        
        if (shift.day_status === 'missed' || shift.day_status === 'cancelled') {
            statusCode = shift.absence_reason || shift.day_status;
        } else if (shift.schedule_type === 'fact schedule' && (!baselineShift || !baselineShift.start_shift_time || !baselineShift.end_shift_time) && shift.start_shift_time && shift.end_shift_time) {
            statusCode = 'extra';
        }
        
        // Compare ACTUAL vs BASELINE for discrepancy regardless of completion status
        if (shift.schedule_type === 'fact schedule' && baselineShift &&
            baselineShift.start_shift_time && baselineShift.end_shift_time &&
            shift.start_shift_time && shift.end_shift_time) {
            const baselineTime = `${baselineShift.start_shift_time}-${baselineShift.end_shift_time}`;
            const actualTime = `${shift.start_shift_time}-${shift.end_shift_time}`;
            if (baselineTime !== actualTime) {
                showDiscrepancy = this.checkTimeDiscrepancy(baselineTime, actualTime);
            }
        }
        
        // Visual style aligned with Onboarding approve/reject (muted fills + border)
        let bgColor = '#86efac';
        let borderColor = 'transparent';
        let textColor = THEME.textPrimary;
        if (shift.schedule_type === 'baseline schedule') {
            // Baseline rendering differs between Actual view and Baseline (Plan) view
            if (isPastShift) {
                // Past plan stays neutral gray
                bgColor = '#e5e7eb';
                borderColor = 'transparent';
            } else {
                if (String(viewType).toLowerCase() === 'baseline') {
                    // Plan view: future plan = paler green, no border
                    bgColor = 'rgba(22, 163, 74, 0.10)';
                    borderColor = 'transparent';
                } else {
                    // Actual view: future plan = light green with subtle green border
                    bgColor = '#dcfce7';
                    borderColor = 'rgba(22, 163, 74, 0.35)';
                }
            }
            textColor = THEME.textPrimary;
        } else if (shift.schedule_type === 'fact schedule') {
            // Actual (FACT) shifts: past or today = darker; future = light
            if (isPastShift || isTodayShift) {
                bgColor = 'rgba(22, 163, 74, 0.15)';   // darker, warmer green fill
                borderColor = 'rgba(22, 163, 74, 0.45)';
                textColor = '#166534';                 // dark green text
            } else {
                bgColor = '#dcfce7';                   // light future style
                borderColor = 'rgba(22, 163, 74, 0.35)';
                textColor = '#166534';
            }
        } else if (shift.day_status === 'missed') {
            // danger: muted red like reject
            bgColor = 'rgba(239, 68, 68, 0.10)';
            borderColor = 'rgba(239, 68, 68, 0.40)';
            textColor = '#ef4444';
        } else if (shift.day_status === 'cancelled') {
            // cancelled: keep normal actual shift styling (same as completed),
            // only the top ribbon shows CANC in red
            bgColor = 'rgba(22, 163, 74, 0.15)';
            borderColor = 'rgba(22, 163, 74, 0.45)';
            textColor = '#166534';
        }

        const timeText = shift.start_shift_time && shift.end_shift_time 
            ? `${shift.start_shift_time.slice(0,5)}-${shift.end_shift_time.slice(0,5)}`
            : shift.day_status === 'missed' ? 'MISSED' : 'NO TIME';

        const hasIssue = statusCode || showDiscrepancy;

        const dimensions = this.isMobile 
            ? (isChildRow ? { height: '2.75rem', width: '3.5rem' } : { height: '3.5rem', width: '4rem' })
            : (isChildRow ? { height: '3rem', width: '4rem' } : { height: '4rem', width: '5rem' });

        const bookmarkHeight = this.isMobile 
            ? (isChildRow ? '0.625rem' : '0.75rem')
            : (isChildRow ? '0.875rem' : '1rem');

        const bookmarkColor = (statusCode ? (statusCode === 'extra' ? '#22c55e' : '#ef4444') : (showDiscrepancy ? '#eab308' : 'rgba(255, 255, 255, 0.15)'));

        return `
            <div class="shift-cell ${hasIssue ? 'has-issue' : ''}"
                 style="height: ${dimensions.height}; width: ${dimensions.width}; 
                        background-color: ${bgColor}; border: 1px solid ${borderColor}; color: ${textColor};"
                 ${hasIssue ? `
                    data-shift='${JSON.stringify(shift)}'
                    data-baseline='${baselineShift ? JSON.stringify(baselineShift) : ''}'
                    data-employee='${JSON.stringify(employee)}'
                 ` : ''}>
                <div class="shift-bookmark" 
                     style="height: ${bookmarkHeight}; 
                            background-color: ${bookmarkColor}; 
                            border-bottom: 1px solid ${hasIssue ? 'transparent' : 'rgba(255, 255, 255, 0.3)'};">
                    ${hasIssue ? (
                        statusCode === 'sick' ? '<span class="bookmark-text">SICK</span>' :
                        statusCode === 'cancelled' ? '<span class="bookmark-text">CANCELLED</span>' :
                        statusCode === 'missed' ? '<span class="bookmark-text">MISSED</span>' :
                        statusCode === 'extra' ? '<span class="bookmark-text">EXTRA</span>' :
                        ICONS.alertTriangle
                    ) : ''}
                </div>
                <div class="shift-time" style="color: ${textColor};">
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
                        <button type="button" class="modal-close" data-modal="employee-modal">
                            ${ICONS.x}
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="employee-modal-header" style="margin-bottom: 1rem;">
                            ${this.createAvatar(employee, this.isMobile ? 'lg' : 'xl')}
                            <div style="min-width: 0;">
                                <h4 class="employee-modal-name" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${employee.full_name}</h4>
                                <p class="employee-modal-position" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${employee.position}</p>
                            </div>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            <span class="badge ${COLORS.STAGES[employee.stage]}">${employee.stage}</span>
                            <span class="badge badge-project">${employee.project}</span>
                            ${employee.staffing_type === 'Backup' ? '<span class="badge badge-backup">Backup</span>' : ''}
                        </div>
                        <div style="margin-top: 1rem; font-size: 0.875rem; color: #4b5563;">
                            Start Date: ${this.formatDate(employee.start_date).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('modals-container').innerHTML = modal;
        document.body.classList.add('modal-open');
    }

    showShiftModal(shift, baselineShift, employee) {
        const shiftInfo = this.createShiftInfo(shift, baselineShift, employee, true, false);
        
        const modal = `
            <div class="modal-overlay" id="shift-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 style="font-size: 1.125rem; font-weight: 600;">Shift Details</h3>
                        <button type="button" class="modal-close" data-modal="shift-modal">
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
        document.body.classList.add('modal-open');
    }

    showLegendModal() {
        const content = this.createLegendContent();
        
        const modal = `
            <div class="modal-overlay" id="legend-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 style="font-size: 1.125rem; font-weight: 600;">Legend</h3>
                        <button type="button" class="modal-close" data-modal="legend-modal">
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
        document.body.classList.add('modal-open');
    }

    showBottomSheet() {
        const overlay = document.getElementById('bottom-sheet-overlay');
        const sheet = document.getElementById('bottom-sheet');
        document.body.classList.add('modal-open');
        
        if (overlay) overlay.classList.remove('hidden');
        if (sheet) sheet.classList.remove('hidden');
        
        this.updateBottomSheetContent();
    }

    updateBottomSheetContent() {
        const optionsMap = this.getFilterOptions();
        const options = {
            project: optionsMap.projects,
            stage: optionsMap.stages,
            position: optionsMap.positions
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

        // Keep mobile navigation indicators (icon color, badge, clear-icon) in sync while bottom sheet is open
        const nav = document.getElementById('navigation-section');
        if (nav && this.isMobile) {
            nav.innerHTML = this.renderNavigation();
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
            if (!planned || !actual || !planned.start_shift_time || !planned.end_shift_time || 
                !actual.start_shift_time || !actual.end_shift_time) {
                return null;
            }
            
            const plannedStart = this.parseTime(planned.start_shift_time);
            const plannedEnd = this.parseTime(planned.end_shift_time);
            const actualStart = this.parseTime(actual.start_shift_time);
            const actualEnd = this.parseTime(actual.end_shift_time);
            
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
        const isMissed = shift.day_status === 'missed';
        const isCancelled = shift.day_status === 'cancelled';
        const isAbsence = isMissed || isCancelled;
        const isExtra = (!baselineShift || !baselineShift.start_shift_time || !baselineShift.end_shift_time)
            && !!(shift.start_shift_time && shift.end_shift_time) && !isAbsence;
        const hasDiscrepancy = discrepancies && (discrepancies.late >= 10 || discrepancies.earlyLeave >= 10);

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
                    <h4 style="font-weight: 700; color: ${THEME.textPrimary}; font-size: ${isCompact ? '1rem' : '1.25rem'};">
                        ${employee?.full_name}
                    </h4>
                    <p style="color: #4b5563; font-size: ${isCompact ? '0.875rem' : '1rem'};">
                        ${formatShiftDate(shift.start_shift_date)}
                    </p>
                </div>
            `;
        }

        // Status indicator
        html += '<div style="margin-bottom: 0.75rem;">';
        if (isAbsence) {
            // MISSED and CANCELLED — use red palette in tooltip
            const palette = { bg:'#fee2e2', border:'#fecaca', text:'#991b1b', reason:'#dc2626', label: isMissed ? 'MISSED SHIFT' : 'CANCELLED SHIFT' };
            html += `
                <div style="display:flex;align-items:center;gap:0.5rem; 
                            padding:${isCompact ? '0.5rem' : '0.75rem'}; 
                            background-color:${palette.bg}; border:1px solid ${palette.border}; 
                            border-radius:0.5rem;">
                    ${ICONS.alertTriangle}
                    <div>
                        <span style="font-weight:700;color:${palette.text};font-size:${isCompact ? '0.875rem' : '1rem'};">${palette.label}</span>
                        ${shift.absence_reason ? `
                            <div style="color:${palette.reason};font-size:${isCompact ? '0.75rem' : '0.875rem'};">
                                Reason: ${shift.absence_reason.toUpperCase()}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        } else if (isExtra) {
            // Extra shift indicator
            html += `
                <div style="display:flex;align-items:center;gap:0.5rem; 
                            padding:${isCompact ? '0.5rem' : '0.75rem'}; 
                            background-color:#dcfce7; border:1px solid #bbf7d0; border-radius:0.5rem;">
                    ${ICONS.checkCircle}
                    <span style="font-weight:700;color:#166534;font-size:${isCompact ? '0.875rem' : '1rem'};">
                        EXTRA SHIFT
                    </span>
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
                        ${baselineShift?.start_shift_time && baselineShift?.end_shift_time 
                            ? `${baselineShift.start_shift_time}-${baselineShift.end_shift_time}`
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
                            ${baselineShift?.start_shift_time && baselineShift?.end_shift_time 
                                ? `${baselineShift.start_shift_time}-${baselineShift.end_shift_time}`
                                : 'Not scheduled'}
                        </div>
                    </div>
                    <div>
                        <span style="font-weight: 500; color: #374151;">Actual:</span>
                        <div style="color: #16a34a; font-family: 'SF Mono', 'Monaco', monospace; 
                                   font-size: ${isCompact ? '0.875rem' : '1.125rem'};">
                            ${shift.start_shift_time && shift.end_shift_time 
                                ? `${shift.start_shift_time}-${shift.end_shift_time}`
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
                            ${discrepancies.late >= 10 ? `
                                <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                    <div style="width: 0.5rem; height: 0.5rem; background-color: #f87171; 
                                               border-radius: 50%;"></div>
                                    <span>Late${isCompact ? '' : ' arrival'}: 
                                        <strong>${discrepancies.late} min</strong>
                                    </span>
                                </li>
                            ` : ''}
                            ${discrepancies.earlyLeave >= 10 ? `
                                <li style="display: flex; align-items: center; gap: 0.5rem;">
                                    <div style="width: 0.5rem; height: 0.5rem; background-color: #fb923c; 
                                               border-radius: 50%;"></div>
                                    <span>Early${isCompact ? '' : ' departure'}: 
                                        <strong>${discrepancies.earlyLeave} min</strong>
                                    </span>
                                </li>
                            ` : ''}
                        </ul>
                        
                        <div style="display:flex;justify-content:space-between;align-items:center; 
                                   margin-top:${isCompact ? '0.5rem' : '0.75rem'}; 
                                   padding-top:0.5rem;border-top:1px solid #f3f4f6;">
                            <span style="font-weight:500;color:#374151;">
                                Total${hasDiscrepancy ? ' underwork' : ''}:
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
        // Warm, matte, restrained tones: soft backgrounds + subtle borders
        const pill = (bg, text, label) => `
            <span style="display:inline-flex;align-items:center;gap:0.375rem;padding:0.25rem 0.625rem;border-radius:9999px;font-size:0.75rem;font-weight:600;background:${bg.bg};color:${bg.fg};border:1px solid ${bg.border};">
              ${label}
            </span>`;
        const tone = (hex) => {
            const v = hex.replace('#','');
            const r = parseInt(v.slice(0,2),16), g = parseInt(v.slice(2,4),16), b = parseInt(v.slice(4,6),16);
            return {
                bg: `rgba(${r},${g},${b},0.10)`,
                border: `rgba(${r},${g},${b},0.20)`,
                fg: `rgb(${r},${g},${b})`
            };
        };

        const amber = tone('#eab308');
        const blue = tone('#3b82f6');
        const green = tone('#22c55e');
        const red = tone('#ef4444');
        const gray = tone('#6b7280');

        return `
            <div style="display:flex;flex-direction:column;gap:1rem;">
                <div>
                    <h4 style="font-weight:700;color:${THEME.textPrimary};margin-bottom:0.5rem;">Plan layer:</h4>
                    <div style="display:flex;flex-direction:column;gap:0.5rem;">
                        <div style="display:flex;align-items:center;gap:0.5rem;">
                            <div style="width:1rem;height:1rem;border-radius:0.25rem;background:rgba(156,163,175,0.35);"></div>
                            <span style="font-size:0.875rem;color:#374151;">Past Planned</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:0.5rem;">
                            <div style="width:1rem;height:1rem;border-radius:0.25rem;background:rgba(34,197,94,0.25);"></div>
                            <span style="font-size:0.875rem;color:#374151;">Planned Future</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 style="font-weight:700;color:${THEME.textPrimary};margin-bottom:0.5rem;">Actual layer:</h4>
                    <div style="display:flex;flex-direction:column;gap:0.5rem;">
                        <div style="display:flex;align-items:center;gap:0.5rem;">
                            <div style="width:1rem;height:1rem;border-radius:0.25rem;background:rgba(21,128,61,0.85);"></div>
                            <span style="font-size:0.875rem;color:#374151;">Completed</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:0.5rem;">
                            <div style="width:1rem;height:1rem;border-radius:0.25rem;background:rgba(74,222,128,0.65);"></div>
                            <span style="font-size:0.875rem;color:#374151;">Scheduled</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:0.5rem;">
                            <div style="width:1rem;height:1rem;border-radius:0.25rem;background:rgba(239,68,68,0.35);"></div>
                            <span style="font-size:0.875rem;color:#374151;">Absence</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 style="font-weight:700;color:${THEME.textPrimary};margin-bottom:0.5rem;">Stages:</h4>
                    <div class="legend-stages">
                        <div class="legend-stage-row">
                            <div>${pill(green, 'white', 'Active')}</div>
                            <span class="legend-stage-desc">Currently employed</span>
                        </div>
                        <div class="legend-stage-row">
                            <div>${pill(amber, 'white', 'Onboarding')}</div>
                            <span class="legend-stage-desc">From interview/start until fully onboarded</span>
                        </div>
                        <div class="legend-stage-row">
                            <div>${pill(red, 'white', 'Terminated')}</div>
                            <span class="legend-stage-desc">Employment ended</span>
                        </div>
                        <div class="legend-stage-row">
                            <div>${pill(gray, 'white', 'Not Hired')}</div>
                            <span class="legend-stage-desc">Before interview/offer</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 style="font-weight:700;color:${THEME.textPrimary};margin-bottom:0.5rem;">Labels:</h4>
                    <div style="display:flex;flex-direction:column;gap:0.5rem;">
                        <div style="display:flex;align-items:center;justify-content:space-between;">
                            <span class="badge badge-project">Project</span>
                            <span style="font-size:0.875rem;color:#6b7280;">Project</span>
                        </div>
                        <div style="display:flex;align-items:center;justify-content:space-between;">
                            <span class="badge badge-backup">Backup</span>
                            <span style="font-size:0.875rem;color:#6b7280;">Non-billable</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 style="font-weight:700;color:${THEME.textPrimary};margin-bottom:0.5rem;">Special indicators:</h4>
                    <div style="display:flex;flex-direction:column;gap:0.5rem;">
                        <div style="display:flex;align-items:center;gap:0.5rem;">
                            <div style="width:2.25rem;height:1.5rem;border-radius:0.25rem;background:${amber.bg};border:1px solid ${amber.border};display:flex;align-items:center;justify-content:center;color:${amber.fg}">
                                ${ICONS.alertTriangle}
                            </div>
                            <div>
                                <div style="font-size:0.875rem;font-weight:500;color:#374151;">Time Discrepancy (10+ min)</div>
                                <div style="font-size:0.75rem;color:#6b7280;">Late arrival or early departure</div>
                            </div>
                        </div>
                        <div style="display:flex;align-items:center;gap:0.5rem;">
                            <div style="width:2.25rem;height:1.5rem;border-radius:0.25rem;background:${red.bg};border:1px solid ${red.border};display:flex;align-items:center;justify-content:center;color:${red.fg};font-weight:700;font-size:0.8rem;">SICK</div>
                            <span style="font-size:0.875rem;color:#374151;">Sick / Cancel / Missed</span>
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
        // Контейнер заменён — сбрасываем кеш верхней границы
        this._calendarTopOffset = null;
        
        // Delegate events
        this.container.addEventListener('click', async (e) => {
            // Navigation
            if (e.target.closest('#prev-month') || e.target.closest('#prev-month-mobile')) {
                e.preventDefault();
                e.stopPropagation();
                await this.navigateMonth('prev');
            }
            if (e.target.closest('#next-month') || e.target.closest('#next-month-mobile')) {
                e.preventDefault();
                e.stopPropagation();
                await this.navigateMonth('next');
            }
            if (e.target.closest('#today-button')) {
                e.preventDefault();
                e.stopPropagation();
                await this.goToToday();
            }
            if (e.target.closest('#go-to-today')) {
                e.preventDefault();
                e.stopPropagation();
                await this.goToToday();
            }

            // View mode tabs
            if (e.target.closest('.view-tab')) {
                e.preventDefault();
                e.stopPropagation();
                const mode = e.target.closest('.view-tab').dataset.mode;
                this.setViewMode(mode);
            }

            // Filter button (mobile)
            if (e.target.closest('#filter-button')) {
                e.preventDefault();
                e.stopPropagation();
                this.showBottomSheet();
            }

            // Quick clear mobile filters
            if (e.target.closest('#clear-mobile-filters')) {
                e.preventDefault();
                e.stopPropagation();
                this.clearAllFilters();
            }

            // Filter dropdowns (desktop)
            if (e.target.closest('.filter-button')) {
                e.preventDefault();
                e.stopPropagation();
                const type = e.target.closest('.filter-button').dataset.filterType;
                this.toggleFilterDropdown(type);
            }

            // Clear filter
            if (e.target.closest('.clear-filter')) {
                e.preventDefault();
                const type = e.target.closest('.clear-filter').dataset.filterType;
                this.clearFilter(type);
                e.stopPropagation();
            }

            // Clear search
            if (e.target.closest('#clear-search')) {
                e.preventDefault();
                this.state.searchTerm = '';
                this.updateCalendarContent();
            }
            // Clear search from empty-state card
            if (e.target.closest('#clear-search-empty')) {
                e.preventDefault();
                this.state.searchTerm = '';
                this.updateCalendarContent();
            }

            // Avatar click
            if (e.target.closest('.avatar')) {
                const employeeId = e.target.closest('.avatar').dataset.employeeId;
                const employee = this.employeesData.find(e => String(e.employee_id).trim() === String(employeeId).trim());
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
                document.body.classList.remove('modal-open');
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

        // Safety net: intercept nav clicks at capture phase to prevent any default navigation
        if (!this._boundDocNavHandler) {
            this._boundDocNavHandler = async (e) => {
                // Если клик пришёл изнутри контейнера — обрабатывает локальный делегат, здесь выходим
                if (this.container && this.container.contains(e.target)) return;
                const prev = e.target.closest('#prev-month') || e.target.closest('#prev-month-mobile');
                const next = e.target.closest('#next-month') || e.target.closest('#next-month-mobile');
                const todayBtn = e.target.closest('#today-button') || e.target.closest('#go-to-today');
                if (prev) {
                    e.preventDefault();
                    e.stopPropagation();
                    await this.navigateMonth('prev');
                } else if (next) {
                    e.preventDefault();
                    e.stopPropagation();
                    await this.navigateMonth('next');
                } else if (todayBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    await this.goToToday();
                }
            };
        }
        // Rebind to avoid duplicates
        document.removeEventListener('click', this._boundDocNavHandler, true);
        document.addEventListener('click', this._boundDocNavHandler, true);

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
                const el = e.target;
                this.state.searchTerm = el.value;

                // Preserve calendar scroll while updating only the necessary parts
                const scroller = document.getElementById('calendar-scroll');
                const savedLeft = scroller ? scroller.scrollLeft : null;
                const savedTop = scroller ? scroller.scrollTop : null;

                // Update count pill like on Team (without re-rendering toolbar)
                const employeesInMonth = this.getEmployeesInMonth();
                const filteredEmployees = this.getFilteredEmployees();
                const countEl = document.getElementById('results-count');
                if (countEl) countEl.textContent = `${filteredEmployees.length} of ${employeesInMonth.length}`;

                // Update only calendar section (no toolbar flicker)
                const calendar = document.getElementById('calendar-section');
                if (calendar) calendar.innerHTML = this.renderCalendar();

                // Restore scroll position
                requestAnimationFrame(() => {
                    const sc = document.getElementById('calendar-scroll');
                    if (sc) {
                        if (savedLeft !== null) sc.scrollLeft = savedLeft;
                        if (savedTop !== null) sc.scrollTop = savedTop;
                    }
                });
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

        // Bottom sheet + modal events (on document level since they're outside container)
        if (!this._boundGlobalClickHandler) {
            this._boundGlobalClickHandler = (e) => {
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

                // Close bottom sheet by overlay click
                if (e.target.id === 'bottom-sheet-overlay') {
                    e.preventDefault();
                    this.closeModal('bottom-sheet');
                }

                // Clear all filters button in bottom sheet
                if (e.target && (e.target.id === 'clear-all-filters' || e.target.closest('#clear-all-filters'))) {
                    e.preventDefault();
                    this.clearAllFilters();
                }

                // Done button in bottom sheet
                if (e.target && (e.target.id === 'done-filters' || e.target.closest('#done-filters'))) {
                    e.preventDefault();
                    this.closeModal('bottom-sheet');
                }

                // Close any modal by clicking the close button
                if (e.target.closest('.modal-close')) {
                    e.preventDefault();
                    const btn = e.target.closest('.modal-close');
                    const modalId = btn && btn.dataset.modal;
                    if (modalId) this.closeModal(modalId);
                }

                // Close any modal by clicking its overlay
                if (e.target.classList && e.target.classList.contains('modal-overlay')) {
                    e.preventDefault();
                    const overlayId = e.target.id;
                    if (overlayId) this.closeModal(overlayId);
                }
            };
        }
        // Rebind to avoid duplicates
        document.removeEventListener('click', this._boundGlobalClickHandler);
        document.addEventListener('click', this._boundGlobalClickHandler);

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
            const existing = document.querySelector('.legend-tooltip');
            if (existing) existing.remove();
            const tooltip = document.createElement('div');
            tooltip.className = 'legend-tooltip tooltip';
            tooltip.innerHTML = this.createLegendContent();
            
            // Add to DOM first to measure
            document.body.appendChild(tooltip);

            const tooltipWidth = 380; // matches .legend-tooltip
            const margin = 20;
            const maxHeight = Math.max(160, window.innerHeight - margin * 2);
            const measuredHeight = Math.min(tooltip.offsetHeight || 0, maxHeight);

            // Blend between viewport center and anchor position (closer to the question icon)
            const rect = e.target.getBoundingClientRect();
            const centerLeft = Math.round((window.innerWidth - tooltipWidth) / 2);
            const centerTop = Math.round((window.innerHeight - measuredHeight) / 2);
            const anchorLeft = Math.round(rect.left + rect.width / 2 - tooltipWidth / 2);
            const anchorTop = Math.round(rect.bottom + 12); // prefer below the icon
            const weight = 0.3; // 30% pull toward the icon

            let left = Math.round(centerLeft * (1 - weight) + anchorLeft * weight);
            let top = Math.round(centerTop * (1 - weight) + anchorTop * weight);

            // Clamp to viewport
            left = Math.max(margin, Math.min(window.innerWidth - tooltipWidth - margin, left));
            top = Math.max(margin, Math.min(window.innerHeight - measuredHeight - margin, top));

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            tooltip.style.maxHeight = `${maxHeight}px`;
            tooltip.style.overflowY = 'auto';
        });

        legendButton.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.legend-tooltip');
            if (tooltip) tooltip.remove();
        });
    }

    setupResizeListener() {
        let resizeTimeout;
        const onResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth < 784;
                if (wasMobile !== this.isMobile) {
                    // Смена брейкпоинта — полностью перерисуем
                    this.state = {
                        ...this.state,
                        showBottomSheet: false,
                        showProjectDropdown: false,
                        showStageDropdown: false,
                        showPositionDropdown: false
                    };
                    this.render();
                    // После смены брейкпоинта пересчитываем верхнюю точку
                    requestAnimationFrame(() => this.fitCalendarScrollHeight(true));
                } else {
                    // Брейкпоинт тот же — просто подгоняем высоту
                    this.fitCalendarScrollHeight();
                }
            }, 150);
        };
        window.addEventListener('resize', onResize);
        this._resizeHandlerBound = onResize;

        // Пересчёт высоты при скролле страницы (throttle через rAF)
        const onScroll = () => {
            if (this._scrollRaf) return;
            this._scrollRaf = requestAnimationFrame(() => {
                this._scrollRaf = 0;
                this.fitCalendarScrollHeight();
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        this._scrollHandlerBound = onScroll;
    }

    // scroll sync больше не нужен — фиксированная высота из CSS

    // Removed scroll listener to avoid container "endless growth" while page scrolls

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    fitCalendarScrollHeight() {
        const scroller = document.getElementById('calendar-scroll');
        if (!scroller) return;

        // Visible header height inside scroller (calendar table header)
        const headerHeight = this.isMobile ? 60 : 88;
        // Row heights must match renderDayCell values
        const mainRow = this.isMobile ? 64 : 80;
        const childRow = this.isMobile ? 54 : 70; // kept for reference

        // Keep container height consistent across views (Plan/Actual/All)
        // Use only the main row height as the baseline; All will scroll more if needed
        const perEmployeeBlock = mainRow;
        const VISIBLE_EMPLOYEES = 7;
        const target = headerHeight + perEmployeeBlock * VISIBLE_EMPLOYEES;

        scroller.style.height = `${target}px`;
        scroller.style.maxHeight = `${target}px`;
        scroller.style.overflowY = 'auto';
    }

    // Настройки для комфортного скролл-ченинга (не блокируем прокрутку страницы)
    applyRubberBandGuard() {
        const scroller = document.getElementById('calendar-scroll');
        if (!scroller) return;
        // Разрешаем скролл-ченинг по вертикали: при упоре в верх/низ — скролл переходит странице
        scroller.style.overscrollBehavior = 'auto';
        scroller.style.overscrollBehaviorY = 'auto';
        scroller.style.overscrollBehaviorX = 'contain';
        scroller.style.webkitOverflowScrolling = 'touch'; // сохранить инерцию внутри

        // iOS Safari: принудительно гасим резинку на краях жестами
        if (!scroller.__overscrollLockInstalled) {
            let startX = 0, startY = 0;
            scroller.addEventListener('touchstart', (e) => {
                const t = e.touches && e.touches[0];
                if (!t) return;
                startX = t.clientX; startY = t.clientY;
            }, { passive: true });
            scroller.addEventListener('touchmove', (e) => {
                const t = e.touches && e.touches[0];
                if (!t) return;
                const dx = t.clientX - startX;
                const dy = t.clientY - startY;
                const atTop = scroller.scrollTop <= 0;
                const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
                const atLeft = scroller.scrollLeft <= 0;
                const atRight = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;
                // Блокируем только горизонтальные края; вертикальные оставляем для скролл-ченинга
                if ((atLeft && dx > 0) || (atRight && dx < 0)) {
                    e.preventDefault();
                }
            }, { passive: false });
            scroller.__overscrollLockInstalled = true;
        }
    }

    // ========================================
    // STATE MANAGEMENT METHODS
    // ========================================
    async navigateMonth(direction) {
        if (this.state.isMonthLoading || this._navBusy) return;
        this._navBusy = true;
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
        
        // Local overlay loading (only if not cached)
        const key = `${this.state.currentYear}-${String(this.state.currentMonth + 1).padStart(2, '0')}`;
        const needsOverlay = !this.monthCache.has(key);
        if (needsOverlay) {
            this.state.isMonthLoading = true;
            this.updateCalendarContent();
        }
        try {
            await this.loadData();
        } finally {
            this.state.isMonthLoading = false;
            this.updateCalendarContent();
            this._navBusy = false;
        }
        
        // Auto-scroll to today if we're in current month
        if (this.state.currentMonth === CONSTANTS.CURRENT_DATE.getMonth() && 
            this.state.currentYear === CONSTANTS.CURRENT_DATE.getFullYear()) {
            setTimeout(() => this.centerTodayInCalendar(), 100);
        }
    }

    async goToToday() {
        if (this.state.isMonthLoading || this._navBusy) return;
        this._navBusy = true;
        const today = CONSTANTS.CURRENT_DATE;
        this.state.currentMonth = today.getMonth();
        this.state.currentYear = today.getFullYear();
        
        // Clear cache
        this.cache = {};
        
        // Local overlay loading (only if not cached)
        const key = `${this.state.currentYear}-${String(this.state.currentMonth + 1).padStart(2, '0')}`;
        const needsOverlay = !this.monthCache.has(key);
        if (needsOverlay) {
            this.state.isMonthLoading = true;
            this.updateCalendarContent();
        }
        try {
            await this.loadData();
        } finally {
            this.state.isMonthLoading = false;
            this.updateCalendarContent();
            this._navBusy = false;
        }
        setTimeout(() => this.centerTodayInCalendar(), 100);
    }

    setViewMode(mode) {
        // Preserve current scroll position (both axes) when switching views
        const scroller = document.getElementById('calendar-scroll');
        const savedLeft = scroller ? scroller.scrollLeft : null;
        const savedTop = scroller ? scroller.scrollTop : null;
        this.state.viewMode = mode;
        this.updateCalendarContent();
        // Restore previous scroll position (do not auto-center to today)
        requestAnimationFrame(() => {
            const sc = document.getElementById('calendar-scroll');
            if (!sc) return;
            if (savedLeft !== null) sc.scrollLeft = savedLeft;
            if (savedTop !== null) sc.scrollTop = savedTop;
        });
    }

    toggleFilterDropdown(type) {
        const dropdownKey = `show${type.charAt(0).toUpperCase() + type.slice(1)}Dropdown`;
        // Preserve scroll before re-render
        const scroller = document.getElementById('calendar-scroll');
        const savedLeft = scroller ? scroller.scrollLeft : null;
        const savedTop = scroller ? scroller.scrollTop : null;

        // Close all other dropdowns
        ['showProjectDropdown', 'showStageDropdown', 'showPositionDropdown'].forEach(key => {
            if (key !== dropdownKey) {
                this.state[key] = false;
            }
        });
        
        this.state[dropdownKey] = !this.state[dropdownKey];
        this.updateCalendarContent();
        // Restore scroll
        requestAnimationFrame(() => {
            const sc = document.getElementById('calendar-scroll');
            if (!sc) return;
            if (savedLeft !== null) sc.scrollLeft = savedLeft;
            if (savedTop !== null) sc.scrollTop = savedTop;
        });
    }

    closeAllDropdowns() {
        this.state.showProjectDropdown = false;
        this.state.showStageDropdown = false;
        this.state.showPositionDropdown = false;
        
        const needsRerender = 
            document.querySelector('.filter-dropdown-menu');
            
        if (needsRerender) {
            this.updateCalendarContent();
        }
    }

    toggleFilterOption(type, option) {
        const current = this.state.filters[type];
        const isAdd = !current.includes(option);
        this.state.filters[type] = isAdd ? [...current, option] : current.filter(item => item !== option);

        if (isAdd) {
            const hasResults = this.getFilteredEmployees().length > 0;
            if (!hasResults) {
                // Revert if the new combination yields no employees
                this.state.filters[type] = current;
                return;
            }
        }

        // Drop now-invalid selections in other dimensions
        this.enforceConsistentSelections();

        if (this.isMobile) {
            this.updateBottomSheetContent();
        } else {
            this.updateCalendarContent();
        }
    }

    clearFilter(type) {
        this.state.filters[type] = [];
        this.enforceConsistentSelections();
        this.updateCalendarContent();
    }

    clearAllFilters() {
        this.state.filters = { project: [], stage: [], position: [] };
        this.enforceConsistentSelections();
        this.updateCalendarContent();
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
            document.body.classList.remove('modal-open');
        } else {
            const modal = document.getElementById(modalId);
            if (modal) modal.remove();
            document.body.classList.remove('modal-open');
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
        // Expose for quick debugging in DevTools
        window.shiftCalendar = calendar;
        window.debugShifts = (empId) => {
            const out = { ok: false };
            try {
                const id = String(empId).trim();
                const cal = window.shiftCalendar;
                const days = cal.getDays();
                const emp = (cal.employeesData || []).find(e => String(e.employee_id).trim() === id);
                const all = (cal.shiftsData || []).filter(s => String(s.employee_id).trim() === id);
                const perFirstWeek = (days && days.length)
                  ? days.slice(0, 7).map(d => ({ day: cal.toDateStr(d), count: cal.getShiftsForEmployeeAndDate(id, d).length }))
                  : [];
                out.ok = true;
                out.id = id;
                out.employee = emp || null;
                out.shiftCount = all.length;
                out.firstWeek = perFirstWeek;
                out.sample = all.slice(0, 3);
            } catch (e) { out.error = e?.message || String(e); }
            console.log('[debugShifts]', out);
            return out;
        };

        window.debugShiftsByName = (name) => {
            const cal = window.shiftCalendar;
            const emp = (cal.employeesData || []).find(e => String(e.full_name || '').trim().toLowerCase() === String(name || '').trim().toLowerCase());
            if (!emp) return { ok: false, error: 'employee not found' };
            return window.debugShifts(emp.employee_id);
        };

        window.listShiftIds = () => {
            const cal = window.shiftCalendar;
            const map = new Map();
            (cal.shiftsData || []).forEach(s => {
                const key = String(s.employee_id).trim();
                map.set(key, (map.get(key) || 0) + 1);
            });
            const arr = Array.from(map.entries()).map(([id, count]) => ({ id, count }));
            console.table(arr);
            return arr;
        };
        console.log('📍 ShiftCalendar instance created');
    } catch (error) {
        console.error('❌ Failed to create ShiftCalendar:', error);
    }
});
