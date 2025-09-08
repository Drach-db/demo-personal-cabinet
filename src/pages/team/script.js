// ========================================
// IMPORTS
// ========================================
import '../../components/layout/layout.js';
import '../../components/navbar/navbar.js';
import '../../components/header/header.js';
import api from './api.js';

// ========================================
// CONSTANTS
// ========================================
const COLORS = {
    primary: '#cc6633',
    primaryDark: '#b85c2e',
    secondary: '#9ca3af',
    secondaryDark: '#6b7280',
    white: '#ffffff',
    background: 'rgba(255, 255, 255, 0.8)',
    backgroundHover: 'rgba(255, 255, 255, 0.9)',
    stages: {
        active: '#22c55e',
        onboarding: '#eab308',
        terminated: '#ef4444'
    },
    projects: {
        Sber: '#3b82f6',
        Tbank: '#3b82f6',
        Alfabank: '#3b82f6',
        VTB: '#3b82f6'
    },
    timeline: {
        interview: '#8b5cf6',
        transfer_planned: '#eab308',
        transfer_fact: '#3b82f6',
        start: '#22c55e',
        end: '#ef4444'
    },
    proficiency: {
        high: '#22c55e',
        medium: '#eab308',
        low: '#ef4444'
    }
};

const AVATAR_COLORS = [
    { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#ffffff' },
    { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: '#ffffff' },
    { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: '#ffffff' },
    { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', text: '#ffffff' },
    { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', text: '#ffffff' }
];

// ========================================
// STATE MANAGEMENT
// ========================================
const state = {
    selectedEmployee: null,
    employees: [],
    loading: true,
    searchTerm: '',
    filterProject: [],
    filterStage: [],
    filterPosition: [],
    hoveredTooltip: null,
    showProjectDropdown: false,
    showStageDropdown: false,
    showPositionDropdown: false,
    showMobileFilters: false,
    activeFilterTab: 'project',
    isMobile: false,
    activeIndicator: 0
};

// ========================================
// UTILITY FUNCTIONS
// ========================================
function getAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getStageColor(stage) {
    return COLORS.stages[stage.toLowerCase()] || '#6b7280';
}

function getProjectColor(project) {
    return COLORS.projects[project] || '#6b7280';
}

function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth.split('.').reverse().join('-'));
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function getExperienceLevel(years) {
    if (years === 0) return 'Entry Level';
    if (years <= 2) return 'Junior';
    if (years <= 5) return 'Middle';
    return 'Senior';
}

function getProficiencyColor(level) {
    if (level >= 90) return COLORS.proficiency.high;
    if (level >= 70) return COLORS.proficiency.medium;
    return COLORS.proficiency.low;
}

function getSpeedColor(speed) {
    if (speed >= 80) return COLORS.proficiency.high;
    if (speed >= 60) return COLORS.proficiency.medium;
    return COLORS.proficiency.low;
}

// ========================================
// ICON RENDERING
// ========================================
function renderIcon(iconName, className = '', style = '') {
    const icons = {
        'users': `<svg class="icon ${className}" style="${style}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
        'eye': `<svg class="icon ${className}" style="${style}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
        'download': `<svg class="icon ${className}" style="${style}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
        'clock': `<svg class="icon ${className}" style="${style}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
        'user-check': `<svg class="icon ${className}" style="${style}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>`,
        'search': `<svg class="icon ${className}" style="${style}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>`,
        'briefcase': `<svg class="icon ${className}" style="${style}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
        'award': `<svg class="icon ${className}" style="${style}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,
        'trending-up': `<svg class="icon ${className}" style="${style}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
        'user-minus': `<svg class="icon ${className}" style="${style}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line></svg>`,
        'calendar': `<svg class="icon ${className}" style="${style}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
        'chevron-down': `<svg class="icon ${className}" style="${style}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
        'chevron-up': `<svg class="icon ${className}" style="${style}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`,
        'filter': `<svg class="icon ${className}" style="${style}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
        'x': `<svg class="icon ${className}" style="${style}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
    };
    return icons[iconName] || '';
}

// ========================================
// FILTER FUNCTIONS
// ========================================
function toggleFilter(value, filterType) {
    const currentFilters = state[filterType];
    if (currentFilters.includes(value)) {
        state[filterType] = currentFilters.filter(item => item !== value);
    } else {
        state[filterType] = [...currentFilters, value];
    }
    render();
}

function clearAllFilters() {
    state.filterProject = [];
    state.filterStage = [];
    state.filterPosition = [];
    render();
}

function getFilteredEmployees() {
    return state.employees.filter(employee => {
        const matchesSearch = employee.full_name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                             employee.position.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                             employee.project.toLowerCase().includes(state.searchTerm.toLowerCase());
        const matchesProject = state.filterProject.length === 0 || state.filterProject.includes(employee.project);
        const matchesStage = state.filterStage.length === 0 || state.filterStage.includes(employee.stage);
        const matchesPosition = state.filterPosition.length === 0 || state.filterPosition.includes(employee.position);
        
        return matchesSearch && matchesProject && matchesStage && matchesPosition;
    });
}

function getFilterOptions() {
    const employeesForProjects = state.employees.filter(employee => {
        const matchesStage = state.filterStage.length === 0 || state.filterStage.includes(employee.stage);
        const matchesPosition = state.filterPosition.length === 0 || state.filterPosition.includes(employee.position);
        return matchesStage && matchesPosition;
    });

    const employeesForStages = state.employees.filter(employee => {
        const matchesProject = state.filterProject.length === 0 || state.filterProject.includes(employee.project);
        const matchesPosition = state.filterPosition.length === 0 || state.filterPosition.includes(employee.position);
        return matchesProject && matchesPosition;
    });

    const employeesForPositions = state.employees.filter(employee => {
        const matchesProject = state.filterProject.length === 0 || state.filterProject.includes(employee.project);
        const matchesStage = state.filterStage.length === 0 || state.filterStage.includes(employee.stage);
        return matchesProject && matchesStage;
    });

    return {
        projects: [...new Set(employeesForProjects.map(emp => emp.project))],
        stages: [...new Set(employeesForStages.map(emp => emp.stage))],
        positions: [...new Set(employeesForPositions.map(emp => emp.position))]
    };
}

function getTeamStats() {
    return {
        active: state.employees.filter(emp => emp.stage === 'Active').length,
        onboarding: state.employees.filter(emp => emp.stage === 'Onboarding').length,
        terminated: state.employees.filter(emp => emp.stage === 'Terminated').length,
        backup: state.employees.filter(emp => emp.staffing_type === 'Backup').length
    };
}

function hasActiveFilters() {
    return state.filterProject.length > 0 || 
           state.filterStage.length > 0 || 
           state.filterPosition.length > 0;
}

function getActiveFiltersCount() {
    return state.filterProject.length + 
           state.filterStage.length + 
           state.filterPosition.length;
}

// ========================================
// RENDER FUNCTIONS
// ========================================
function renderAnalytics() {
    const stats = getTeamStats();
    const container = document.getElementById('analyticsGrid');
    if (!container) return;

    // Clear previous indicators to avoid duplicates
    const prevIndicators = container.parentElement.querySelector('.analytics-indicators');
    if (prevIndicators) prevIndicators.remove();

    container.innerHTML = `
        <div class="analytics-card">
            <div class="analytics-card-content">
                <div class="analytics-card-info">
                    <h3 class="analytics-card-title">Active</h3>
                    <p class="analytics-card-value">${stats.active}</p>
                </div>
                <div class="analytics-card-icon-container">
                    ${renderIcon('user-check', '', 'color: #22c55e;')}
                </div>
            </div>
        </div>

        <div class="analytics-card">
            <div class="analytics-card-content">
                <div class="analytics-card-info">
                    <h3 class="analytics-card-title">Onboarding</h3>
                    <p class="analytics-card-value">${stats.onboarding}</p>
                </div>
                <div class="analytics-card-icon-container">
                    ${renderIcon('clock', '', `color: ${COLORS.primary};`)}
                </div>
            </div>
        </div>

        <div class="analytics-card">
            <div class="analytics-card-content">
                <div class="analytics-card-info">
                    <h3 class="analytics-card-title">Terminated</h3>
                    <p class="analytics-card-value">${stats.terminated}</p>
                </div>
                <div class="analytics-card-icon-container">
                    ${renderIcon('user-minus', '', 'color: #ef4444;')}
                </div>
            </div>
        </div>

        <div class="analytics-card">
            <div class="analytics-card-content">
                <div class="analytics-card-info">
                    <h3 class="analytics-card-title">Backup</h3>
                    <p class="analytics-card-value">${stats.backup}</p>
                </div>
                <div class="analytics-card-icon-container">
                    ${renderIcon('users', '', 'color: #3b82f6;')}
                </div>
            </div>
        </div>
    `;

    // Mobile indicators similar to Onboarding
    if (state.isMobile) {
        const indicators = document.createElement('div');
        indicators.className = 'analytics-indicators';
        indicators.innerHTML = [0,1,2,3].map(i => `
            <button class="indicator ${state.activeIndicator === i ? 'active' : ''}" onclick="window.scrollToAnalyticsCard(${i})"></button>
        `).join('');
        container.parentElement.insertBefore(indicators, container.nextSibling);
    }
}

function renderDesktopFilters() {
    const container = document.getElementById('desktopFilters');
    const filteredEmployees = getFilteredEmployees();
    const filterOptions = getFilterOptions();
    
    container.innerHTML = `
        <div class="filters-row">
            <div class="search-container">
                <div class="search-icon">
                    ${renderIcon('search', '', 'width: 20px; height: 20px;')}
                </div>
                <input
                    type="text"
                    class="search-input"
                    placeholder="Search employees by name, position, or project..."
                    value="${state.searchTerm}"
                    onchange="window.updateSearch(this.value)"
                    oninput="window.updateSearch(this.value)"
                />
                ${state.searchTerm ? `
                    <button class="search-clear" onclick="window.clearSearch()">
                        ${renderIcon('x', '', 'width: 16px; height: 16px; color: #9ca3af;')}
                    </button>
                ` : ''}
            </div>

            <div class="filters-group">
                ${renderDropdownFilter('project', 'Projects', filterOptions.projects, 'briefcase')}
                ${renderDropdownFilter('stage', 'Stages', filterOptions.stages, 'user-check')}
                ${renderDropdownFilter('position', 'Positions', filterOptions.positions, 'award')}
            </div>

            <div class="results-count">
                ${filteredEmployees.length} of ${state.employees.length}
            </div>
        </div>
    `;
}

function renderDropdownFilter(type, label, options, icon) {
    const filterState = state[`filter${type.charAt(0).toUpperCase() + type.slice(1)}`];
    const dropdownState = state[`show${type.charAt(0).toUpperCase() + type.slice(1)}Dropdown`];
    
    return `
        <div class="dropdown-container">
            <div style="position: relative;">
                <div class="dropdown-icon">
                    ${renderIcon(icon, '', 'width: 16px; height: 16px;')}
                </div>
                <button
                    class="dropdown-trigger"
                    onclick="window.toggleDropdown('${type}')"
                >
                    <span class="dropdown-text">
                        ${filterState.length === 0 ? `All ${label}` : `${filterState.length} Selected`}
                    </span>
                </button>
                ${filterState.length > 0 ? `
                    <button
                        class="dropdown-clear"
                        onclick="event.stopPropagation(); window.clearFilter('${type}')"
                    >
                        ${renderIcon('x', '', 'width: 12px; height: 12px; color: #9ca3af;')}
                    </button>
                ` : ''}
                <div class="dropdown-chevron">
                    ${renderIcon('chevron-down', '', 'width: 14px; height: 14px; color: #9ca3af;')}
                </div>
            </div>
            ${dropdownState ? `
                <div class="dropdown-menu">
                    ${options.map(option => `
                        <label class="dropdown-item">
                            <input
                                type="checkbox"
                                ${filterState.includes(option) ? 'checked' : ''}
                                onchange="window.toggleFilter('${option}', 'filter${type.charAt(0).toUpperCase() + type.slice(1)}')"
                            />
                            <span class="dropdown-item-dot" style="background-color: ${
                                type === 'project' ? '#3b82f6' :
                                type === 'stage' ? getStageColor(option) : '#8b5cf6'
                            };"></span>
                            <span class="dropdown-item-label">${option}</span>
                        </label>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

function renderMobileFilters() {
    const container = document.getElementById('mobileFilters');
    const filteredEmployees = getFilteredEmployees();
    const activeFiltersCount = getActiveFiltersCount();
    
    container.innerHTML = `
        <div class="mobile-search-row">
            <div class="mobile-search-container">
                <div class="search-icon">
                    ${renderIcon('search', '', 'width: 20px; height: 20px;')}
                </div>
                <input
                    type="text"
                    class="search-input"
                    placeholder="Search by name, position, project..."
                    value="${state.searchTerm}"
                    onchange="window.updateSearch(this.value)"
                    oninput="window.updateSearch(this.value)"
                />
                ${state.searchTerm ? `
                    <button class="search-clear" onclick="window.clearSearch()">
                        ${renderIcon('x', '', 'width: 16px; height: 16px; color: #9ca3af;')}
                    </button>
                ` : ''}
            </div>
        </div>
        
        <div class="mobile-filters-row">
            <div class="results-count">
                ${filteredEmployees.length} of ${state.employees.length}
            </div>
            
            <div class="flex items-center gap-2">
                ${hasActiveFilters() ? `
                    <button onclick=\"window.clearAllFilters()\" class=\"mobile-clear-icon\" aria-label=\"Clear filters\">
                        ${renderIcon('x', '', 'width: 16px; height: 16px;')}
                    </button>
                ` : ''}
                
                <button
                    onclick=\"window.openMobileFilters()\"
                    class=\"mobile-filters-btn ${hasActiveFilters() ? 'active' : ''} only-icon\"
                    aria-label=\"Open filters\"
                >
                    ${renderIcon('filter', '', 'width: 16px; height: 16px;')}
                    ${hasActiveFilters() ? `
                        <span class=\"mobile-filters-badge\">
                            ${activeFiltersCount}
                        </span>
                    ` : ''}
                </button>
            </div>
        </div>
    `;
}

function renderMobileFilterContent() {
    const container = document.getElementById('filterContent');
    const filterOptions = getFilterOptions();
    
    let content = '';
    
    if (state.activeFilterTab === 'project') {
        content = filterOptions.projects.map(project => `
            <label class="filter-option" onclick="event.preventDefault(); window.toggleFilter('${project}', 'filterProject');">
                <input
                    class="filter-checkbox"
                    type="checkbox"
                    ${state.filterProject.includes(project) ? 'checked' : ''}
                    onclick="event.stopPropagation();"
                />
                <span class="filter-dot" style="background-color: #3b82f6;"></span>
                <span class="filter-label">${project}</span>
            </label>
        `).join('');
    } else if (state.activeFilterTab === 'stage') {
        content = filterOptions.stages.map(stage => `
            <label class="filter-option" onclick="event.preventDefault(); window.toggleFilter('${stage}', 'filterStage');">
                <input
                    class="filter-checkbox"
                    type="checkbox"
                    ${state.filterStage.includes(stage) ? 'checked' : ''}
                    onclick="event.stopPropagation();"
                />
                <span class="filter-dot" style="background-color: ${getStageColor(stage)};"></span>
                <span class="filter-label">${stage}</span>
            </label>
        `).join('');
    } else if (state.activeFilterTab === 'position') {
        content = filterOptions.positions.map(position => `
            <label class="filter-option" onclick="event.preventDefault(); window.toggleFilter('${position}', 'filterPosition');">
                <input
                    class="filter-checkbox"
                    type="checkbox"
                    ${state.filterPosition.includes(position) ? 'checked' : ''}
                    onclick="event.stopPropagation();"
                />
                <span class="filter-dot" style="background-color: #8b5cf6;"></span>
                <span class="filter-label">${position}</span>
            </label>
        `).join('');
    }
    
    container.innerHTML = `<div style="display: flex; flex-direction: column; gap: 8px;">${content}</div>`;
}

function renderTimeline(employee) {
    const timelineEvents = [
        { date: employee.interview_date || '', type: 'interview', label: 'Interview', short: 'Int.' },
        { date: employee.transfer_planned_date || '', type: 'transfer_planned', label: 'Transfer Plan', short: 'T.Plan' },
        { date: employee.transfer_fact_date || '', type: 'transfer_fact', label: 'Transfer Fact', short: 'T.Fact' },
        { date: employee.start_date || '', type: 'start', label: 'Start', short: 'Start' },
        { date: employee.end_date || '', type: 'end', label: 'End', short: 'End' }
    ];

    return `
        <div class="timeline-container">
            <div class="timeline-track"></div>
            
            <div class="timeline-events">
                ${timelineEvents.map((event, index) => `
                    <div class="timeline-event">
                        <div 
                            class="timeline-event-label"
                            onmouseover="window.showTooltip('${employee.id}-${index}')"
                            onmouseout="window.hideTooltip()"
                        >
                            <span>${event.short}</span>
                            ${(event.short.includes('.') || event.short !== event.label) ? `
                                <div class="timeline-event-info">i</div>
                            ` : ''}
                            
                            ${state.hoveredTooltip === `${employee.id}-${index}` && (event.short.includes('.') || event.short !== event.label) ? `
                                <div class="timeline-tooltip">
                                    <div class="timeline-tooltip-content">
                                        ${event.label}
                                        <div class="timeline-tooltip-arrow"></div>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="timeline-event-dot ${event.date ? 'active' : ''}" 
                             style="background-color: ${event.date ? COLORS.timeline[event.type] : '#e5e7eb'};"></div>
                        
                        <div class="timeline-event-date">
                            ${event.date || '—'}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderMobileTimeline(employee) {
    const eventConfig = {
        interview: { label: 'Interview', date: employee.interview_date, color: COLORS.timeline.interview },
        transfer_planned: { label: 'Transfer Plan', date: employee.transfer_planned_date, color: COLORS.timeline.transfer_planned },
        transfer_fact: { label: 'Transfer Fact', date: employee.transfer_fact_date, color: COLORS.timeline.transfer_fact },
        start: { label: 'Start Date', date: employee.start_date, color: COLORS.timeline.start },
        end: { label: 'End Date', date: employee.end_date, color: COLORS.timeline.end }
    };

    const events = ['interview', 'start', 'end'];

    return `
        <div class="mobile-timeline">
            <div class="timeline-line"></div>
            
            <div style="display: flex; flex-direction: column; gap: 24px;">
                ${events.map(eventType => {
                    const config = eventConfig[eventType];
                    const hasDate = !!config.date;

                    return `
                        <div class="mobile-timeline-event">
                            <div class="mobile-timeline-dot" style="background-color: ${hasDate ? config.color : COLORS.white};">
                                ${hasDate ? '<div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>' : ''}
                            </div>
                            <div class="mobile-timeline-content">
                                <span class="mobile-timeline-label" style="color: ${hasDate ? '#374151' : '#9ca3af'};">
                                    ${config.label}
                                </span>
                                <span class="mobile-timeline-date" style="color: ${hasDate ? '#111827' : '#d1d5db'};">
                                    ${config.date || '—'}
                                </span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderEmployeeCard(employee) {
    const age = calculateAge(employee.date_of_birth);
    const experienceLevel = getExperienceLevel(employee.bpo_experience);
    const avatarColor = getAvatarColor(employee.full_name);
    const stageColor = getStageColor(employee.stage);
    const projectColor = getProjectColor(employee.project);
    const englishColor = getProficiencyColor(employee.english_level);
    const typingColor = getSpeedColor(employee.typing_speed);
    const isSelected = state.selectedEmployee === employee.id;

    if (state.isMobile) {
        return renderMobileEmployeeCard(employee);
    }

    return `
        <div
            class="employee-card ${isSelected ? 'selected' : ''}"
            onclick="window.toggleEmployee(${employee.id})"
        >
            <div class="employee-stage-indicator" style="background-color: ${stageColor};"></div>
            
            <div class="employee-header">
                <div class="employee-avatar-container">
                    <div class="employee-avatar" style="background: ${avatarColor.bg};">
                        <span class="employee-avatar-text" style="color: ${avatarColor.text};">
                            ${employee.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                    </div>
                    <div class="employee-status-dot" style="background-color: ${stageColor};"></div>
                </div>
                
                <div class="employee-info">
                    <h3 class="employee-name">${employee.full_name}</h3>
                    
                    <div class="employee-meta">
                        <div class="employee-tags">
                            <p class="employee-position">${employee.position}</p>
                            <span class="tag" style="background-color: ${stageColor}20; color: ${stageColor};">
                                ${employee.stage}
                            </span>
                            <span class="tag" style="background-color: #3b82f620; color: #3b82f6;">
                                ${employee.project}
                            </span>
                            ${employee.staffing_type === 'Backup' ? `
                                <span class="tag" style="background-color: #6366f120; color: #6366f1;">
                                    Backup
                                </span>
                            ` : ''}
                        </div>
                        
                        <div class="employee-details-toggle">
                            <button 
                                class="employee-details-btn"
                                style="color: ${isSelected ? COLORS.primary : '#6b7280'};"
                                onclick="event.stopPropagation(); window.toggleEmployee(${employee.id})"
                            >
                                <span style="font-weight: 500;">
                                    ${isSelected ? 'Hide Details' : 'View Details'}
                                </span>
                                ${isSelected ? renderIcon('chevron-up', '', 'width: 12px; height: 12px;') : renderIcon('chevron-down', '', 'width: 12px; height: 12px;')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            ${isSelected ? `
                <div class="employee-details">
                    <div class="employee-details-grid">
                        <div class="details-divider" style="left: 0;"></div>
                        <div class="details-divider" style="left: calc(25% - 1px);"></div>
                        <div class="details-divider" style="left: calc(50% - 1px);"></div>
                        <div class="details-divider" style="right: 0;"></div>
                        
                        <div class="details-section" style="grid-column: span 3;">
                            <h4 class="details-section-title">
                                ${renderIcon('trending-up', '', 'width: 16px; height: 16px; margin-right: 8px; color: ' + COLORS.primary + ';')}
                                Skills & Experience
                            </h4>
                            <div class="details-list">
                                <div class="detail-row">
                                    <span class="detail-label">English Level:</span>
                                    <div class="detail-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${employee.english_level}%; background-color: ${englishColor};"></div>
                                        </div>
                                        <span class="detail-value" style="color: #8b5cf6;">${employee.english_level}%</span>
                                    </div>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Typing Speed:</span>
                                    <div class="detail-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${Math.min(employee.typing_speed, 100)}%; background-color: ${typingColor};"></div>
                                        </div>
                                        <span class="detail-value" style="color: #8b5cf6;">
                                            ${employee.typing_speed} <span style="font-size: 10px; opacity: 0.75;">WPM</span>
                                        </span>
                                    </div>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">BPO Experience:</span>
                                    <span class="detail-value" style="color: #6366f1;">${employee.bpo_experience}y (${experienceLevel})</span>
                                </div>
                            </div>
                        </div>

                        <div class="details-section" style="grid-column: span 3;">
                            <h4 class="details-section-title">
                                ${renderIcon('users', '', 'width: 16px; height: 16px; margin-right: 8px; color: ' + COLORS.primary + ';')}
                                Personal Info
                            </h4>
                            <div class="details-list">
                                <div class="detail-row">
                                    <span class="detail-label">Age:</span>
                                    <span class="detail-value" style="color: #374151;">${age} years</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Date of Birth:</span>
                                    <span class="detail-value">${employee.date_of_birth}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Gender:</span>
                                    <span class="detail-value" style="text-transform: capitalize;">${employee.gender}</span>
                                </div>
                            </div>
                        </div>

                        <div class="details-section" style="grid-column: span 6;">
                            <h4 class="details-section-title">
                                ${renderIcon('calendar', '', 'width: 16px; height: 16px; margin-right: 8px; color: ' + COLORS.primary + ';')}
                                Timeline
                            </h4>
                            ${renderTimeline(employee)}
                        </div>
                    </div>

                    <div class="employee-actions">
                        <span class="employee-actions-label">Assessment Results:</span>
                        <div class="employee-actions-buttons">
                            <button
                                onclick="event.stopPropagation(); window.open('${employee.english_proficiency_test}', '_blank');"
                                class="btn-primary"
                                style="font-size: 12px; padding: 8px 12px;"
                            >
                                ${renderIcon('eye', '', 'width: 12px; height: 12px;')}
                                <span>View Assessment</span>
                            </button>
                            <a
                                href="${employee.english_proficiency_test}"
                                download="${employee.full_name.replace(/\s+/g, '-').toLowerCase()}-test-results.pdf"
                                onclick="event.stopPropagation();"
                                class="btn-secondary"
                                style="font-size: 12px; padding: 8px 12px;"
                            >
                                ${renderIcon('download', '', 'width: 12px; height: 12px;')}
                                <span>Download Report</span>
                            </a>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function renderMobileEmployeeCard(employee) {
    const age = calculateAge(employee.date_of_birth);
    const experienceLevel = getExperienceLevel(employee.bpo_experience);
    const avatarColor = getAvatarColor(employee.full_name);
    const stageColor = getStageColor(employee.stage);
    const projectColor = getProjectColor(employee.project);
    const englishColor = getProficiencyColor(employee.english_level);
    const typingColor = getSpeedColor(employee.typing_speed);
    const isSelected = state.selectedEmployee === employee.id;

    return `
        <div 
            class="employee-card-mobile ${isSelected ? 'expanded' : ''}"
            onclick="window.toggleEmployee(${employee.id})"
        >
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                    <div class="employee-avatar-container">
                        <div class="employee-avatar" style="background: ${avatarColor.bg};">
                            <span class="employee-avatar-text" style="color: ${avatarColor.text};">
                                ${employee.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                        </div>
                        <div class="employee-status-dot" style="background-color: ${stageColor};"></div>
                    </div>
                    
                    <div style="flex: 1;">
                        <h3 style="font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 4px;">${employee.full_name}</h3>
                        <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">${employee.position}</p>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <span style="padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; background-color: ${stageColor}20; color: ${stageColor};">
                                ${employee.stage}
                            </span>
                            <span style="padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; background-color: #3b82f620; color: #3b82f6;">
                                ${employee.project}
                            </span>
                            ${employee.staffing_type === 'Backup' ? `
                                <span style="padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; background-color: #6366f120; color: #6366f1;">
                                    Backup
                                </span>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div style="padding: 8px;">
                    ${isSelected ? renderIcon('chevron-up', '', 'width: 20px; height: 20px; color: #9ca3af;') : renderIcon('chevron-down', '', 'width: 20px; height: 20px; color: #9ca3af;')}
                </div>
            </div>
            
            ${isSelected ? `
                <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; padding-top: 8px; margin-top: 8px; border-top: 1px solid #e5e7eb;">
                    <div>
                        <h4 style="font-weight: 600; font-size: 14px; margin-bottom: 12px; display: flex; align-items: center; color: ${COLORS.primary};">
                            ${renderIcon('users', '', 'width: 16px; height: 16px; margin-right: 8px;')}
                            Personal Info
                        </h4>
                        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #6b7280;">Age</span>
                                <span style="font-weight: 500;">${age} years</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #6b7280;">Gender</span>
                                <span style="font-weight: 500; text-transform: capitalize;">${employee.gender}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #6b7280;">Date of Birth</span>
                                <span style="font-weight: 500;">${employee.date_of_birth}</span>
                            </div>
                        </div>
                    </div>

                    <div style="border-top: 1px solid #e5e7eb;"></div>

                    <div>
                        <h4 style="font-weight: 600; font-size: 14px; margin-bottom: 12px; display: flex; align-items: center; color: ${COLORS.primary};">
                            ${renderIcon('trending-up', '', 'width: 16px; height: 16px; margin-right: 8px;')}
                            Skills & Experience
                        </h4>
                        <div style="display: flex; flex-direction: column; gap: 12px; font-size: 14px;">
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                    <span style="color: #6b7280;">English Level</span>
                                    <span style="font-weight: 500; color: #8b5cf6;">${employee.english_level}%</span>
                                </div>
                                <div class="progress-bar" style="width: 100%; height: 0.5rem; background-color: #e5e7eb; border-radius: 9999px; overflow: hidden;">
                                    <div class="progress-fill" style="width: ${employee.english_level}%; background-color: ${englishColor}; height: 100%; border-radius: 9999px; transition: width 0.3s ease;"></div>
                                </div>
                            </div>
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                    <span style="color: #6b7280;">Typing Speed</span>
                                    <span style="font-weight: 500; color: #8b5cf6;">${employee.typing_speed} WPM</span>
                                </div>
                                <div class="progress-bar" style="width: 100%; height: 0.5rem; background-color: #e5e7eb; border-radius: 9999px; overflow: hidden;">
                                    <div class="progress-fill" style="width: ${Math.min(employee.typing_speed, 100)}%; background-color: ${typingColor}; height: 100%; border-radius: 9999px; transition: width 0.3s ease;"></div>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #6b7280;">BPO Experience</span>
                                <span style="font-weight: 500; color: #6366f1;">
                                    ${employee.bpo_experience}y (${experienceLevel})
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style="border-top: 1px solid #e5e7eb;"></div>

                    <div>
                        <h4 style="font-weight: 600; font-size: 14px; margin-bottom: 16px; display: flex; align-items: center; color: ${COLORS.primary};">
                            ${renderIcon('calendar', '', 'width: 16px; height: 16px; margin-right: 8px;')}
                            Timeline
                        </h4>
                        ${renderMobileTimeline(employee)}
                    </div>

                    <div style="border-top: 1px solid #e5e7eb;"></div>

                    <div>
                        <h4 style="font-weight: 600; font-size: 14px; margin-bottom: 12px;">Assessment Results</h4>
                        <div style="display: flex; gap: 12px;">
                            <button
                                onclick="event.stopPropagation(); window.open('${employee.english_proficiency_test}', '_blank');"
                                class="btn-primary"
                                style="flex: 1;"
                            >
                                ${renderIcon('eye', '', 'width: 16px; height: 16px;')}
                                <span>View</span>
                            </button>
                            <a
                                href="${employee.english_proficiency_test}"
                                download
                                onclick="event.stopPropagation();"
                                class="btn-secondary"
                                style="flex: 1;"
                            >
                                ${renderIcon('download', '', 'width: 16px; height: 16px;')}
                                <span>Download</span>
                            </a>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function renderEmployeeGrid() {
    const container = document.getElementById('employeeGrid');
    const filteredEmployees = getFilteredEmployees();

    if (filteredEmployees.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 48px; border-radius: 12px; background-color: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2);">
                ${renderIcon('users', '', 'width: 64px; height: 64px; color: #9ca3af; margin: 0 auto 16px;')}
                <h3 style="font-size: 18px; font-weight: 500; color: #111827; margin-bottom: 8px;">No team members found</h3>
                <p style="color: #6b7280;">Try adjusting your search criteria or filters</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredEmployees.map(employee => renderEmployeeCard(employee)).join('');
}

function showLoading() {
    const loading = document.getElementById('loadingContainer');
    const error = document.getElementById('errorContainer');
    const analytics = document.getElementById('analyticsGrid');
    const desktopFilters = document.getElementById('desktopFilters');
    const mobileFilters = document.getElementById('mobileFilters');
    const grid = document.getElementById('employeeGrid');

    if (loading) loading.classList.remove('hidden');
    if (error) error.classList.add('hidden');

    if (analytics) { analytics.innerHTML = ''; analytics.classList.add('hidden'); }
    if (desktopFilters) { desktopFilters.innerHTML = ''; desktopFilters.classList.add('hidden'); }
    if (mobileFilters) { mobileFilters.innerHTML = ''; mobileFilters.classList.add('hidden'); }
    if (grid) { grid.innerHTML = ''; grid.classList.add('hidden'); }
}

function hideLoading() {
    const loading = document.getElementById('loadingContainer');
    if (loading) loading.classList.add('hidden');
}

function showError(message) {
    document.getElementById('errorContainer').classList.remove('hidden');
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('loadingContainer').classList.add('hidden');
}

function render() {
    if (state.loading) {
        showLoading();
        return;
    }

    hideLoading();
    renderAnalytics();
    renderDesktopFilters();
    renderMobileFilters();
    renderEmployeeGrid();

    // Unhide sections after render
    const analytics = document.getElementById('analyticsGrid');
    const desktopFilters = document.getElementById('desktopFilters');
    const mobileFilters = document.getElementById('mobileFilters');
    const grid = document.getElementById('employeeGrid');
    if (analytics) analytics.classList.remove('hidden');
    if (desktopFilters) desktopFilters.classList.remove('hidden');
    if (mobileFilters) mobileFilters.classList.remove('hidden');
    if (grid) grid.classList.remove('hidden');

    // Update mobile filters if open
    if (state.showMobileFilters) {
        updateMobileFiltersUI();
    }

    setupAnalyticsScrollTeam();
}

function setupAnalyticsScrollTeam() {
    if (!state.isMobile) return;
    const grid = document.getElementById('analyticsGrid');
    if (!grid) return;
    grid.addEventListener('scroll', () => {
        const cardWidth = 280;
        const gap = 12;
        const idx = Math.round(grid.scrollLeft / (cardWidth + gap));
        if (idx !== state.activeIndicator) {
            state.activeIndicator = Math.max(0, Math.min(3, idx));
            document.querySelectorAll('.analytics-indicators .indicator').forEach((el, i) => {
                el.classList.toggle('active', i === state.activeIndicator);
            });
        }
    }, { passive: true });
}

window.scrollToAnalyticsCard = function(index) {
    const grid = document.getElementById('analyticsGrid');
    if (!grid) return;
    const cardWidth = 280;
    const gap = 12;
    grid.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' });
    state.activeIndicator = index;
};

function updateMobileFiltersUI() {
    const overlay = document.getElementById('mobileFiltersOverlay');
    const container = document.getElementById('mobileFiltersContainer');
    const countBadge = document.getElementById('activeFiltersCount');
    const clearBtn = document.getElementById('clearAllFiltersBtn');
    
    if (state.showMobileFilters) {
        overlay.classList.add('show');
        container.classList.add('show');
    } else {
        overlay.classList.remove('show');
        container.classList.remove('show');
    }
    
    const activeCount = getActiveFiltersCount();
    if (activeCount > 0) {
        countBadge.textContent = `${activeCount} active`;
        countBadge.style.display = 'inline-block';
        clearBtn.style.display = 'inline-block';
    } else {
        countBadge.style.display = 'none';
        clearBtn.style.display = 'none';
    }
    
    renderMobileFilterContent();
}

// ========================================
// EVENT HANDLERS (Exported to window)
// ========================================
window.toggleEmployee = function(id) {
    state.selectedEmployee = state.selectedEmployee === id ? null : id;
    render();
};

window.updateSearch = function(value) {
    state.searchTerm = value;
    render();
};

window.clearSearch = function() {
    state.searchTerm = '';
    render();
};

window.toggleDropdown = function(type) {
    const dropdownKey = `show${type.charAt(0).toUpperCase() + type.slice(1)}Dropdown`;
    
    // Close all other dropdowns
    state.showProjectDropdown = false;
    state.showStageDropdown = false;
    state.showPositionDropdown = false;
    
    // Toggle the clicked dropdown
    state[dropdownKey] = !state[dropdownKey];
    render();
};

window.toggleFilter = function(value, filterType) {
    toggleFilter(value, filterType);
};

window.clearFilter = function(type) {
    const filterKey = `filter${type.charAt(0).toUpperCase() + type.slice(1)}`;
    state[filterKey] = [];
    render();
};

window.clearAllFilters = function() {
    clearAllFilters();
};

window.openMobileFilters = function() {
    state.showMobileFilters = true;
    updateMobileFiltersUI();
};

window.closeMobileFilters = function() {
    state.showMobileFilters = false;
    updateMobileFiltersUI();
};

window.switchFilterTab = function(tab) {
    state.activeFilterTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.filter-tab').forEach(btn => {
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderMobileFilterContent();
};

window.showTooltip = function(id) {
    state.hoveredTooltip = id;
    render();
};

window.hideTooltip = function() {
    state.hoveredTooltip = null;
    render();
};

window.retryDataLoad = async function() {
    await loadData();
};

// ========================================
// DATA LOADING
// ========================================
async function loadData() {
    try {
        state.loading = true;
        render();
        
        // Load data from Supabase
        const employees = await api.getEmployees();
        
        if (!employees || employees.length === 0) {
            throw new Error('No employee data available');
        }
        
        state.employees = employees;
        state.loading = false;
        render();
        
    } catch (error) {
        console.error('Error loading team data:', error);
        state.loading = false;
        showError(error.message || 'Failed to load team data. Please try again later.');
    }
}

// ========================================
// INITIALIZATION
// ========================================
function checkMobileView() {
    state.isMobile = window.innerWidth <= 1024;
}

function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', () => {
        checkMobileView();
        render();
    });
    
    // Document click for closing dropdowns
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-container')) {
            state.showProjectDropdown = false;
            state.showStageDropdown = false;
            state.showPositionDropdown = false;
            render();
        }
    });
    
    // Mobile filter overlay click
    document.getElementById('mobileFiltersOverlay').addEventListener('click', () => {
        window.closeMobileFilters();
    });
}

// ========================================
// MAIN INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('✅ Team page initialized');
    
    checkMobileView();
    setupEventListeners();
    await loadData();
});
