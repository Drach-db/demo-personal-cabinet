// Импортируем компоненты layout системы
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

const ICONS = {
    'users': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    'eye': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    'download': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
    'clock': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    'user-check': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>',
    'search': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>',
    'briefcase': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
    'award': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
    'trending-up': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
    'user-minus': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line></svg>',
    'calendar': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    'chevron-down': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>',
    'chevron-up': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>',
    'filter': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>',
    'x': '<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
};

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
    isMobile: false
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

function renderIcon(iconName, className = '', style = '') {
    const icon = ICONS[iconName];
    if (!icon) return '';
    
    // Добавляем класс и стиль к SVG
    return icon.replace('<svg class="icon"', `<svg class="icon ${className}" style="${style}"`);
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
function renderLoading() {
    return `
        <div class="main-content" style="display: flex; align-items: center; justify-content: center;">
            <div class="text-center">
                <div class="animate-spin rounded-full" style="height: 48px; width: 48px; border: 2px solid #e5e7eb; border-top-color: #3b82f6; margin: 0 auto 16px;"></div>
                <p style="color: #6b7280;">Loading team data...</p>
            </div>
        </div>
    `;
}

function renderAnalytics() {
    const stats = getTeamStats();
    return `
        <div class="analytics-grid">
            <div class="stat-card">
                <div class="flex items-center justify-between gap-2">
                    <div style="flex: 1; min-width: 0;">
                        <h3 class="stat-label">Active</h3>
                        <p class="stat-value">${stats.active}</p>
                    </div>
                    <div class="icon-container">
                        ${renderIcon('user-check', '', 'color: #22c55e;')}
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="flex items-center justify-between gap-2">
                    <div style="flex: 1; min-width: 0;">
                        <h3 class="stat-label">Onboarding</h3>
                        <p class="stat-value">${stats.onboarding}</p>
                    </div>
                    <div class="icon-container">
                        ${renderIcon('clock', '', 'color: ' + COLORS.primary + ';')}
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="flex items-center justify-between gap-2">
                    <div style="flex: 1; min-width: 0;">
                        <h3 class="stat-label">Terminated</h3>
                        <p class="stat-value">${stats.terminated}</p>
                    </div>
                    <div class="icon-container">
                        ${renderIcon('user-minus', '', 'color: #ef4444;')}
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="flex items-center justify-between gap-2">
                    <div style="flex: 1; min-width: 0;">
                        <h3 class="stat-label">Backup</h3>
                        <p class="stat-value">${stats.backup}</p>
                    </div>
                    <div class="icon-container">
                        ${renderIcon('users', '', 'color: #3b82f6;')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderDesktopFilters() {
    const filteredEmployees = getFilteredEmployees();
    const filterOptions = getFilterOptions();

    return `
        <div class="search-filters-container search-filters-desktop">
            <div class="filters-content">
                <div class="search-container">
                    ${renderIcon('search', 'search-icon', '')}
                    <input
                        type="text"
                        class="search-input"
                        placeholder="Search employees by name, position, or project..."
                        value="${state.searchTerm}"
                        id="searchInput"
                    />
                    ${state.searchTerm ? `
                        <button class="clear-search" id="clearSearchBtn">
                            ${renderIcon('x', '', 'width: 16px; height: 16px; color: #9ca3af;')}
                        </button>
                    ` : ''}
                </div>

                <div class="filters-group">
                    <!-- Project Filter -->
                    <div class="filter-dropdown">
                        ${renderIcon('briefcase', 'filter-icon', '')}
                        <button class="filter-button" id="projectFilterBtn">
                            <span>${state.filterProject.length === 0 ? 'All Projects' : `${state.filterProject.length} Selected`}</span>
                        </button>
                        ${state.filterProject.length > 0 ? `
                            <button class="filter-clear" id="clearProjectFilter">
                                ${renderIcon('x', '', 'width: 12px; height: 12px; color: #9ca3af;')}
                            </button>
                        ` : ''}
                        <div class="dropdown-arrow">
                            ${renderIcon('chevron-down', '', 'width: 14px; height: 14px; color: #9ca3af;')}
                        </div>
                        ${state.showProjectDropdown ? `
                            <div class="dropdown-menu">
                                ${filterOptions.projects.map(project => `
                                    <label class="dropdown-item">
                                        <input
                                            type="checkbox"
                                            ${state.filterProject.includes(project) ? 'checked' : ''}
                                            data-filter-type="filterProject"
                                            data-filter-value="${project}"
                                        />
                                        <span class="dropdown-color" style="background-color: ${getProjectColor(project)};"></span>
                                        <span class="dropdown-label">${project}</span>
                                    </label>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Stage Filter -->
                    <div class="filter-dropdown">
                        ${renderIcon('user-check', 'filter-icon', '')}
                        <button class="filter-button" id="stageFilterBtn">
                            <span>${state.filterStage.length === 0 ? 'All Stages' : `${state.filterStage.length} Selected`}</span>
                        </button>
                        ${state.filterStage.length > 0 ? `
                            <button class="filter-clear" id="clearStageFilter">
                                ${renderIcon('x', '', 'width: 12px; height: 12px; color: #9ca3af;')}
                            </button>
                        ` : ''}
                        <div class="dropdown-arrow">
                            ${renderIcon('chevron-down', '', 'width: 14px; height: 14px; color: #9ca3af;')}
                        </div>
                        ${state.showStageDropdown ? `
                            <div class="dropdown-menu">
                                ${filterOptions.stages.map(stage => `
                                    <label class="dropdown-item">
                                        <input
                                            type="checkbox"
                                            ${state.filterStage.includes(stage) ? 'checked' : ''}
                                            data-filter-type="filterStage"
                                            data-filter-value="${stage}"
                                        />
                                        <span class="dropdown-color" style="background-color: ${getStageColor(stage)};"></span>
                                        <span class="dropdown-label">${stage}</span>
                                    </label>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Position Filter -->
                    <div class="filter-dropdown">
                        ${renderIcon('award', 'filter-icon', '')}
                        <button class="filter-button" id="positionFilterBtn">
                            <span>${state.filterPosition.length === 0 ? 'All Positions' : `${state.filterPosition.length} Selected`}</span>
                        </button>
                        ${state.filterPosition.length > 0 ? `
                            <button class="filter-clear" id="clearPositionFilter">
                                ${renderIcon('x', '', 'width: 12px; height: 12px; color: #9ca3af;')}
                            </button>
                        ` : ''}
                        <div class="dropdown-arrow">
                            ${renderIcon('chevron-down', '', 'width: 14px; height: 14px; color: #9ca3af;')}
                        </div>
                        ${state.showPositionDropdown ? `
                            <div class="dropdown-menu" style="min-width: 280px;">
                                <div style="max-height: 240px; overflow-y: auto;">
                                    ${filterOptions.positions.map(position => `
                                        <label class="dropdown-item">
                                            <input
                                                type="checkbox"
                                                ${state.filterPosition.includes(position) ? 'checked' : ''}
                                                data-filter-type="filterPosition"
                                                data-filter-value="${position}"
                                            />
                                            <span class="dropdown-color" style="background-color: #8b5cf6;"></span>
                                            <span class="dropdown-label">${position}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="results-count">
                    ${filteredEmployees.length} of ${state.employees.length}
                </div>
            </div>
        </div>
    `;
}

function renderMobileFilters() {
    const filteredEmployees = getFilteredEmployees();
    const hasActiveFilters = hasActiveFilters();
    const activeFiltersCount = getActiveFiltersCount();

    return `
        <div class="search-filters-container search-filters-mobile">
            <div class="mobile-search-row">
                <div class="search-container">
                    ${renderIcon('search', 'search-icon', '')}
                    <input
                        type="text"
                        class="search-input"
                        placeholder="Search by name, position, project..."
                        value="${state.searchTerm}"
                        id="searchInputMobile"
                    />
                    ${state.searchTerm ? `
                        <button class="clear-search" id="clearSearchBtnMobile">
                            ${renderIcon('x', '', 'width: 16px; height: 16px; color: #9ca3af;')}
                        </button>
                    ` : ''}
                </div>
            </div>
            
            <div class="mobile-controls">
                <div class="mobile-results-count">
                    ${filteredEmployees.length} of ${state.employees.length}
                </div>
                
                <div class="mobile-filter-buttons">
                    ${hasActiveFilters ? `
                        <button class="mobile-clear-button" id="mobileClearAll">
                            ${renderIcon('x', '', 'width: 16px; height: 16px;')}
                            Clear
                        </button>
                    ` : ''}
                    
                    <button class="mobile-filter-button ${hasActiveFilters ? 'active' : ''}" id="mobileFilterBtn">
                        ${renderIcon('filter', '', 'width: 16px; height: 16px;')}
                        Filters
                        ${hasActiveFilters ? `
                            <span class="mobile-filter-count">${activeFiltersCount}</span>
                        ` : ''}
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Bottom Sheet -->
        <div class="mobile-filters-overlay ${state.showMobileFilters ? 'show' : ''}" id="mobileFiltersOverlay"></div>
        <div class="mobile-filters-container ${state.showMobileFilters ? 'show' : ''}" id="mobileFiltersContainer">
            <div class="mobile-filters-header">
                <div class="mobile-filters-title">
                    <h3>Filters</h3>
                    ${hasActiveFilters ? `
                        <span class="active-filters-badge">${activeFiltersCount} active</span>
                    ` : ''}
                </div>
                <div class="mobile-filters-actions">
                    ${hasActiveFilters ? `
                        <button class="clear-all-mobile" id="clearAllMobile">Clear all</button>
                    ` : ''}
                    <button class="close-filters" id="closeFilters">
                        ${renderIcon('x', '', 'width: 20px; height: 20px;')}
                    </button>
                </div>
            </div>

            <div class="filter-tabs">
                <button class="filter-tab ${state.activeFilterTab === 'project' ? 'active' : ''}" data-tab="project">
                    Projects
                </button>
                <button class="filter-tab ${state.activeFilterTab === 'stage' ? 'active' : ''}" data-tab="stage">
                    Stages
                </button>
                <button class="filter-tab ${state.activeFilterTab === 'position' ? 'active' : ''}" data-tab="position">
                    Positions
                </button>
            </div>

            <div class="filter-content">
                ${renderMobileFilterContent()}
            </div>
        </div>
    `;
}

function renderMobileFilterContent() {
    const filterOptions = getFilterOptions();
    
    if (state.activeFilterTab === 'project') {
        return `
            <div class="mobile-filter-list">
                ${filterOptions.projects.map(project => `
                    <label class="mobile-filter-option">
                        <input
                            type="checkbox"
                            class="mobile-filter-checkbox"
                            ${state.filterProject.includes(project) ? 'checked' : ''}
                            data-filter-type="filterProject"
                            data-filter-value="${project}"
                        />
                        <span class="mobile-filter-color" style="background-color: ${getProjectColor(project)};"></span>
                        <span class="mobile-filter-label">${project}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    if (state.activeFilterTab === 'stage') {
        return `
            <div class="mobile-filter-list">
                ${filterOptions.stages.map(stage => `
                    <label class="mobile-filter-option">
                        <input
                            type="checkbox"
                            class="mobile-filter-checkbox"
                            ${state.filterStage.includes(stage) ? 'checked' : ''}
                            data-filter-type="filterStage"
                            data-filter-value="${stage}"
                        />
                        <span class="mobile-filter-color" style="background-color: ${getStageColor(stage)};"></span>
                        <span class="mobile-filter-label">${stage}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    if (state.activeFilterTab === 'position') {
        return `
            <div class="mobile-filter-list">
                ${filterOptions.positions.map(position => `
                    <label class="mobile-filter-option">
                        <input
                            type="checkbox"
                            class="mobile-filter-checkbox"
                            ${state.filterPosition.includes(position) ? 'checked' : ''}
                            data-filter-type="filterPosition"
                            data-filter-value="${position}"
                        />
                        <span class="mobile-filter-color" style="background-color: #8b5cf6;"></span>
                        <span class="mobile-filter-label">${position}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }
}

function renderEmployeeCard(employee) {
    if (state.isMobile) {
        return renderMobileEmployeeCard(employee);
    }

    const age = calculateAge(employee.date_of_birth);
    const experienceLevel = getExperienceLevel(employee.bpo_experience);
    const avatarColor = getAvatarColor(employee.full_name);
    const stageColor = getStageColor(employee.stage);
    const projectColor = getProjectColor(employee.project);
    const englishColor = getProficiencyColor(employee.english_level);
    const typingColor = getSpeedColor(employee.typing_speed);
    const isSelected = state.selectedEmployee === employee.id;

    return `
        <div class="employee-card ${isSelected ? 'selected' : ''}" data-employee-id="${employee.id}">
            <div class="stage-indicator" style="background-color: ${stageColor};"></div>
            
            <div class="employee-header">
                <div class="avatar-container">
                    <div class="employee-avatar" style="background: ${avatarColor.bg};">
                        <span class="avatar-text" style="color: ${avatarColor.text};">
                            ${employee.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                    </div>
                    <div class="status-indicator" style="background-color: ${stageColor};"></div>
                </div>
                
                <div class="employee-info">
                    <h3 class="employee-name">${employee.full_name}</h3>
                    
                    <div class="employee-position-line">
                        <p class="employee-position">${employee.position}</p>
                        <span class="tag" style="background-color: ${stageColor}20; color: ${stageColor};">
                            ${employee.stage}
                        </span>
                        <span class="tag" style="background-color: ${projectColor}20; color: ${projectColor};">
                            ${employee.project}
                        </span>
                        ${employee.staffing_type === 'Backup' ? `
                            <span class="tag" style="background-color: #6366f120; color: #6366f1;">
                                Backup
                            </span>
                        ` : ''}
                        
                        <button class="view-button ${isSelected ? 'selected' : ''}">
                            <span>${isSelected ? 'Hide Details' : 'View Details'}</span>
                            ${isSelected ? renderIcon('chevron-up', '', 'width: 12px; height: 12px;') : renderIcon('chevron-down', '', 'width: 12px; height: 12px;')}
                        </button>
                    </div>
                </div>
            </div>

            ${isSelected ? renderEmployeeDetails(employee, age, experienceLevel, englishColor, typingColor) : ''}
        </div>
    `;
}

function renderEmployeeDetails(employee, age, experienceLevel, englishColor, typingColor) {
    return `
        <div class="employee-details">
            <div class="details-grid">
                <div class="detail-section">
                    <h4>
                        ${renderIcon('trending-up', '', 'width: 16px; height: 16px; margin-right: 8px; color: ' + COLORS.primary + ';')}
                        Skills & Experience
                    </h4>
                    <div class="detail-items">
                        <div class="detail-item">
                            <span class="detail-label">English Level:</span>
                            <div class="progress-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${employee.english_level}%; background-color: ${englishColor};"></div>
                                </div>
                                <span class="detail-value" style="color: #8b5cf6;">${employee.english_level}%</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Typing Speed:</span>
                            <div class="progress-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${Math.min(employee.typing_speed, 100)}%; background-color: ${typingColor};"></div>
                                </div>
                                <span class="detail-value" style="color: #8b5cf6;">${employee.typing_speed} WPM</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">BPO Experience:</span>
                            <span class="detail-value" style="color: #6366f1;">${employee.bpo_experience}y (${experienceLevel})</span>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>
                        ${renderIcon('users', '', 'width: 16px; height: 16px; margin-right: 8px; color: ' + COLORS.primary + ';')}
                        Personal Info
                    </h4>
                    <div class="detail-items">
                        <div class="detail-item">
                            <span class="detail-label">Age:</span>
                            <span class="detail-value">${age} years</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Date of Birth:</span>
                            <span class="detail-value">${employee.date_of_birth}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Gender:</span>
                            <span class="detail-value" style="text-transform: capitalize;">${employee.gender}</span>
                        </div>
                    </div>
                </div>

                <div class="detail-section timeline-section">
                    <h4>
                        ${renderIcon('calendar', '', 'width: 16px; height: 16px; margin-right: 8px; color: ' + COLORS.primary + ';')}
                        Timeline
                    </h4>
                    ${renderTimeline(employee)}
                </div>
            </div>

            <div class="assessment-section">
                <span class="assessment-label">Assessment Results:</span>
                <div class="action-buttons">
                    <button class="btn-primary view-assessment" data-url="${employee.english_proficiency_test}">
                        ${renderIcon('eye', '', 'width: 12px; height: 12px;')}
                        <span>View Assessment</span>
                    </button>
                    <a href="${employee.english_proficiency_test}" download="${employee.full_name.replace(/\s+/g, '-').toLowerCase()}-test-results.pdf" class="btn-secondary">
                        ${renderIcon('download', '', 'width: 12px; height: 12px;')}
                        <span>Download Report</span>
                    </a>
                </div>
            </div>
        </div>
    `;
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
            <div class="timeline-line"></div>
            
            <div class="timeline-events">
                ${timelineEvents.map((event, index) => `
                    <div class="timeline-event">
                        <div class="event-label ${event.short.includes('.') ? 'has-tooltip' : ''}" data-tooltip="${event.label}">
                            <span>${event.short}</span>
                            ${event.short.includes('.') ? `<div class="event-info">i</div>` : ''}
                        </div>
                        
                        <div class="event-dot" style="background-color: ${event.date ? COLORS.timeline[event.type] : '#e5e7eb'}; opacity: ${event.date ? '1' : '0.5'};"></div>
                        
                        <div class="event-date ${!event.date ? 'empty' : ''}">
                            ${event.date || '—'}
                        </div>
                    </div>
                `).join('')}
            </div>
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
        <div class="employee-card-mobile ${isSelected ? 'expanded' : ''}" data-employee-id="${employee.id}">
            <div class="mobile-employee-header">
                <div class="mobile-employee-left">
                    <div class="mobile-avatar-container">
                        <div class="mobile-avatar" style="background: ${avatarColor.bg};">
                            <span style="color: ${avatarColor.text};">
                                ${employee.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                        </div>
                        <div class="mobile-status-dot" style="background-color: ${stageColor};"></div>
                    </div>
                    
                    <div class="mobile-employee-info">
                        <h3 class="mobile-employee-name">${employee.full_name}</h3>
                        <p class="mobile-employee-position">${employee.position}</p>
                        <div class="mobile-tags">
                            <span class="mobile-tag" style="background-color: ${stageColor}20; color: ${stageColor};">
                                ${employee.stage}
                            </span>
                            <span class="mobile-tag" style="background-color: ${projectColor}20; color: ${projectColor};">
                                ${employee.project}
                            </span>
                            ${employee.staffing_type === 'Backup' ? `
                                <span class="mobile-tag" style="background-color: #6366f120; color: #6366f1;">
                                    Backup
                                </span>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="mobile-expand-icon">
                    ${isSelected ? renderIcon('chevron-up', '', 'width: 20px; height: 20px; color: #9ca3af;') : renderIcon('chevron-down', '', 'width: 20px; height: 20px; color: #9ca3af;')}
                </div>
            </div>
            
            ${isSelected ? renderMobileEmployeeDetails(employee, age, experienceLevel, englishColor, typingColor) : ''}
        </div>
    `;
}

function renderMobileEmployeeDetails(employee, age, experienceLevel, englishColor, typingColor) {
    return `
        <div class="mobile-employee-details">
            <div class="mobile-detail-section">
                <h4>
                    ${renderIcon('users', '', 'width: 16px; height: 16px; margin-right: 8px;')}
                    Personal Info
                </h4>
                <div class="mobile-detail-items">
                    <div class="mobile-detail-item">
                        <span>Age</span>
                        <span>${age} years</span>
                    </div>
                    <div class="mobile-detail-item">
                        <span>Gender</span>
                        <span style="text-transform: capitalize;">${employee.gender}</span>
                    </div>
                    <div class="mobile-detail-item">
                        <span>Date of Birth</span>
                        <span>${employee.date_of_birth}</span>
                    </div>
                </div>
            </div>

            <div class="mobile-detail-section">
                <h4>
                    ${renderIcon('trending-up', '', 'width: 16px; height: 16px; margin-right: 8px;')}
                    Skills & Experience
                </h4>
                <div class="mobile-skill-items">
                    <div class="mobile-skill-item">
                        <div class="mobile-skill-header">
                            <span>English Level</span>
                            <span style="color: #8b5cf6; font-weight: 600;">${employee.english_level}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${employee.english_level}%; background-color: ${englishColor};"></div>
                        </div>
                    </div>
                    <div class="mobile-skill-item">
                        <div class="mobile-skill-header">
                            <span>Typing Speed</span>
                            <span style="color: #8b5cf6; font-weight: 600;">${employee.typing_speed} WPM</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(employee.typing_speed, 100)}%; background-color: ${typingColor};"></div>
                        </div>
                    </div>
                    <div class="mobile-detail-item">
                        <span>BPO Experience</span>
                        <span style="color: #6366f1; font-weight: 600;">
                            ${employee.bpo_experience}y (${experienceLevel})
                        </span>
                    </div>
                </div>
            </div>

            <div class="mobile-detail-section">
                <h4>
                    ${renderIcon('calendar', '', 'width: 16px; height: 16px; margin-right: 8px;')}
                    Timeline
                </h4>
                ${renderMobileTimeline(employee)}
            </div>

            <div class="mobile-assessment-section">
                <h4>Assessment Results</h4>
                <div class="mobile-assessment-actions">
                    <button class="btn-primary view-assessment" data-url="${employee.english_proficiency_test}">
                        ${renderIcon('eye', '', 'width: 16px; height: 16px;')}
                        <span>View</span>
                    </button>
                    <a href="${employee.english_proficiency_test}" download class="btn-secondary">
                        ${renderIcon('download', '', 'width: 16px; height: 16px;')}
                        <span>Download</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function renderMobileTimeline(employee) {
    const eventConfig = {
        interview: { label: 'Interview', date: employee.interview_date, color: COLORS.timeline.interview },
        start: { label: 'Start Date', date: employee.start_date, color: COLORS.timeline.start },
        end: { label: 'End Date', date: employee.end_date, color: COLORS.timeline.end }
    };

    const events = ['interview', 'start', 'end'];

    return `
        <div class="mobile-timeline">
            <div class="mobile-timeline-line"></div>
            
            <div class="mobile-timeline-events">
                ${events.map(eventType => {
                    const config = eventConfig[eventType];
                    const hasDate = !!config.date;

                    return `
                        <div class="timeline-event">
                            <div class="mobile-timeline-dot" style="background-color: ${hasDate ? config.color : COLORS.white};">
                                ${hasDate ? '<div class="timeline-dot-inner"></div>' : ''}
                            </div>
                            <div class="mobile-timeline-content">
                                <span class="mobile-timeline-label ${!hasDate ? 'no-date' : ''}">
                                    ${config.label}
                                </span>
                                <span class="mobile-timeline-date ${!hasDate ? 'no-date' : ''}">
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

function renderEmployeeGrid() {
    const filteredEmployees = getFilteredEmployees();

    if (filteredEmployees.length === 0) {
        return `
            <div class="empty-state">
                ${renderIcon('users', '', 'width: 64px; height: 64px; color: #9ca3af; margin: 0 auto 16px;')}
                <h3 class="empty-title">No team members found</h3>
                <p class="empty-text">Try adjusting your search criteria or filters</p>
            </div>
        `;
    }

    return `
        <div class="employee-grid">
            ${filteredEmployees.map(employee => renderEmployeeCard(employee)).join('')}
        </div>
    `;
}

function render() {
    const app = document.getElementById('appMain');
    if (!app) return;
    
    if (state.loading) {
        app.innerHTML = renderLoading();
        return;
    }

    app.innerHTML = `
        <div id="mainContainer" class="content-wrapper">
            ${renderAnalytics()}
            ${state.isMobile ? renderMobileFilters() : renderDesktopFilters()}
            ${renderEmployeeGrid()}
        </div>
    `;

    // Bind event listeners after render
    bindEventListeners();
}

// ========================================
// EVENT LISTENERS
// ========================================
function bindEventListeners() {
    // Search input
    const searchInput = document.getElementById(state.isMobile ? 'searchInputMobile' : 'searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchTerm = e.target.value;
            render();
        });
    }

    // Clear search
    const clearSearchBtn = document.getElementById(state.isMobile ? 'clearSearchBtnMobile' : 'clearSearchBtn');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            state.searchTerm = '';
            render();
        });
    }

    // Employee cards
    document.querySelectorAll('.employee-card, .employee-card-mobile').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.view-assessment') || e.target.closest('.btn-secondary')) return;
            
            const employeeId = parseInt(card.dataset.employeeId);
            state.selectedEmployee = state.selectedEmployee === employeeId ? null : employeeId;
            render();
        });
    });

    // View button (desktop)
    document.querySelectorAll('.view-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.employee-card');
            const employeeId = parseInt(card.dataset.employeeId);
            state.selectedEmployee = state.selectedEmployee === employeeId ? null : employeeId;
            render();
        });
    });

    // View assessment buttons
    document.querySelectorAll('.view-assessment').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(btn.dataset.url, '_blank');
        });
    });

    // Filter dropdowns (desktop)
    if (!state.isMobile) {
        // Project filter
        const projectFilterBtn = document.getElementById('projectFilterBtn');
        if (projectFilterBtn) {
            projectFilterBtn.addEventListener('click', () => {
                state.showProjectDropdown = !state.showProjectDropdown;
                state.showStageDropdown = false;
                state.showPositionDropdown = false;
                render();
            });
        }

        // Stage filter
        const stageFilterBtn = document.getElementById('stageFilterBtn');
        if (stageFilterBtn) {
            stageFilterBtn.addEventListener('click', () => {
                state.showStageDropdown = !state.showStageDropdown;
                state.showProjectDropdown = false;
                state.showPositionDropdown = false;
                render();
            });
        }

        // Position filter
        const positionFilterBtn = document.getElementById('positionFilterBtn');
        if (positionFilterBtn) {
            positionFilterBtn.addEventListener('click', () => {
                state.showPositionDropdown = !state.showPositionDropdown;
                state.showProjectDropdown = false;
                state.showStageDropdown = false;
                render();
            });
        }

        // Clear filter buttons
        const clearProjectFilter = document.getElementById('clearProjectFilter');
        if (clearProjectFilter) {
            clearProjectFilter.addEventListener('click', (e) => {
                e.stopPropagation();
                state.filterProject = [];
                render();
            });
        }

        const clearStageFilter = document.getElementById('clearStageFilter');
        if (clearStageFilter) {
            clearStageFilter.addEventListener('click', (e) => {
                e.stopPropagation();
                state.filterStage = [];
                render();
            });
        }

        const clearPositionFilter = document.getElementById('clearPositionFilter');
        if (clearPositionFilter) {
            clearPositionFilter.addEventListener('click', (e) => {
                e.stopPropagation();
                state.filterPosition = [];
                render();
            });
        }

        // Filter checkboxes
        document.querySelectorAll('.dropdown-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const filterType = e.target.dataset.filterType;
                const filterValue = e.target.dataset.filterValue;
                toggleFilter(filterValue, filterType);
            });
        });
    }

    // Mobile filters
    if (state.isMobile) {
        // Open mobile filters
        const mobileFilterBtn = document.getElementById('mobileFilterBtn');
        if (mobileFilterBtn) {
            mobileFilterBtn.addEventListener('click', () => {
                state.showMobileFilters = true;
                render();
            });
        }

        // Close mobile filters
        const closeFilters = document.getElementById('closeFilters');
        if (closeFilters) {
            closeFilters.addEventListener('click', () => {
                state.showMobileFilters = false;
                render();
            });
        }

        // Mobile filters overlay
        const mobileFiltersOverlay = document.getElementById('mobileFiltersOverlay');
        if (mobileFiltersOverlay) {
            mobileFiltersOverlay.addEventListener('click', () => {
                state.showMobileFilters = false;
                render();
            });
        }

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                state.activeFilterTab = tab.dataset.tab;
                render();
            });
        });

        // Mobile filter checkboxes
        document.querySelectorAll('.mobile-filter-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const filterType = e.target.dataset.filterType;
                const filterValue = e.target.dataset.filterValue;
                toggleFilter(filterValue, filterType);
            });
        });

        // Clear all mobile
        const mobileClearAll = document.getElementById('mobileClearAll');
        if (mobileClearAll) {
            mobileClearAll.addEventListener('click', clearAllFilters);
        }

        const clearAllMobile = document.getElementById('clearAllMobile');
        if (clearAllMobile) {
            clearAllMobile.addEventListener('click', clearAllFilters);
        }
    }
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-dropdown')) {
        if (state.showProjectDropdown || state.showStageDropdown || state.showPositionDropdown) {
            state.showProjectDropdown = false;
            state.showStageDropdown = false;
            state.showPositionDropdown = false;
            render();
        }
    }
});

// Handle window resize
function checkMobileView() {
    const wasMobile = state.isMobile;
    state.isMobile = window.innerWidth <= 1024;
    
    if (wasMobile !== state.isMobile) {
        // Reset mobile-specific states when switching
        state.showMobileFilters = false;
        state.showProjectDropdown = false;
        state.showStageDropdown = false;
        state.showPositionDropdown = false;
        render();
    }
}

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(checkMobileView, 250);
});

// ========================================
// INITIALIZATION
// ========================================
async function loadData() {
    try {
        // Показываем загрузку
        state.loading = true;
        render();
        
        // Загружаем данные из Supabase
        const employees = await api.getEmployees();
        
        // Сохраняем в state
        state.employees = employees;
        state.loading = false;
        
        // Рендерим с реальными данными
        render();
    } catch (error) {
        console.error('Error loading team data:', error);
        
        // Показываем ошибку
        const app = document.getElementById('appMain');
        if (app) {
            app.innerHTML = `
                <div class="error-state">
                    <div class="error-content">
                        ${renderIcon('x', '', 'width: 64px; height: 64px; color: #ef4444; margin: 0 auto 16px;')}
                        <h3 class="error-title">Error loading data</h3>
                        <p class="error-text">${error.message || 'Failed to connect to database'}</p>
                        <button class="btn-primary" onclick="location.reload()">
                            Try Again
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    checkMobileView();
    loadData();
});

// Export functions for global access
window.teamApp = {
    toggleFilter,
    clearAllFilters,
    state
};