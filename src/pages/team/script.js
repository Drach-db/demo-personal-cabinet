// Импортируем компоненты layout системы
import '../../components/layout/layout.js';
import '../../components/navbar/navbar.js';
import '../../components/header/header.js';
import api from './api.js';

// ========================================
// STATE MANAGEMENT
// ========================================
const state = {
    employees: [],
    filteredEmployees: [],
    selectedEmployee: null,
    searchTerm: '',
    filterProject: [],
    filterStage: [],
    filterPosition: [],
    hoveredTooltip: null,
    showProjectDropdown: false,
    showStageDropdown: false,
    showPositionDropdown: false,
    // Mobile specific state
    isMobile: window.innerWidth < 768,
    showMobileFilters: false,
    activeMobileFilterTab: 'project',
    isBottomSheetAnimating: false,
    // Device type для более точного определения
    deviceType: getDeviceType()
};

// Глобальная переменная для таймера
let resizeTimer;

// ========================================
// UTILITY FUNCTIONS
// ========================================
function getDeviceType() {
    const width = window.innerWidth;
    if (width < 380) return 'ultra-mobile';
    if (width < 480) return 'small-mobile';
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
}

function getAvatarColor(name) {
    const colors = [
        { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#ffffff' },
        { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: '#ffffff' },
        { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: '#ffffff' },
        { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', text: '#ffffff' },
        { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', text: '#ffffff' }
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

function getStageColor(stage) {
    const colors = { active: '#22c55e', onboarding: '#eab308', terminated: '#ef4444' };
    return colors[stage.toLowerCase()] || '#6b7280';
}

function getProjectColor(project) {
    return '#3b82f6'; // All projects use blue color now
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
    if (years === 0) return 'Entry';
    if (years <= 2) return 'Junior';
    if (years <= 5) return 'Middle';
    return 'Senior';
}

// ========================================
// FILTER AND SEARCH LOGIC
// ========================================
function filterEmployees() {
    state.filteredEmployees = state.employees.filter(employee => {
        const matchesSearch = employee.full_name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                             employee.position.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                             employee.project.toLowerCase().includes(state.searchTerm.toLowerCase());
        const matchesProject = state.filterProject.length === 0 || state.filterProject.includes(employee.project);
        const matchesStage = state.filterStage.length === 0 || state.filterStage.includes(employee.stage);
        const matchesPosition = state.filterPosition.length === 0 || state.filterPosition.includes(employee.position);
        
        return matchesSearch && matchesProject && matchesStage && matchesPosition;
    });
    
    updateUI();
}

function getFilterOptions() {
    // For projects: filter by stages + positions only
    const employeesForProjects = state.employees.filter(employee => {
        const matchesStage = state.filterStage.length === 0 || state.filterStage.includes(employee.stage);
        const matchesPosition = state.filterPosition.length === 0 || state.filterPosition.includes(employee.position);
        return matchesStage && matchesPosition;
    });

    // For stages: filter by projects + positions only
    const employeesForStages = state.employees.filter(employee => {
        const matchesProject = state.filterProject.length === 0 || state.filterProject.includes(employee.project);
        const matchesPosition = state.filterPosition.length === 0 || state.filterPosition.includes(employee.position);
        return matchesProject && matchesPosition;
    });

    // For positions: filter by projects + stages only
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

// ========================================
// UI UPDATE FUNCTIONS
// ========================================
function updateStats() {
    const stats = {
        active: state.employees.filter(emp => emp.stage === 'Active').length,
        onboarding: state.employees.filter(emp => emp.stage === 'Onboarding').length,
        terminated: state.employees.filter(emp => emp.stage === 'Terminated').length,
        backup: state.employees.filter(emp => emp.staffing_type === 'Backup').length
    };

    document.getElementById('statActive').textContent = stats.active;
    document.getElementById('statOnboarding').textContent = stats.onboarding;
    document.getElementById('statTerminated').textContent = stats.terminated;
    document.getElementById('statBackup').textContent = stats.backup;
}

function updateResultsCount() {
    const resultsText = `${state.filteredEmployees.length} of ${state.employees.length}`;
    document.getElementById('resultsCount').textContent = resultsText;
    
    // Update mobile results count too
    const mobileResultsCount = document.getElementById('mobileResultsCount');
    if (mobileResultsCount) {
        mobileResultsCount.textContent = resultsText;
    }
}

function updateFilterButtons() {
    if (state.isMobile) {
        updateMobileFilterButtons();
    } else {
        updateDesktopFilterButtons();
    }
}

function updateDesktopFilterButtons() {
    // Project filter
    const projectText = state.filterProject.length === 0 ? 'All Projects' : `${state.filterProject.length} Selected`;
    document.getElementById('projectFilterText').textContent = projectText;
    document.getElementById('clearProjectFilter').style.display = state.filterProject.length > 0 ? 'block' : 'none';

    // Stage filter
    const stageText = state.filterStage.length === 0 ? 'All Stages' : `${state.filterStage.length} Selected`;
    document.getElementById('stageFilterText').textContent = stageText;
    document.getElementById('clearStageFilter').style.display = state.filterStage.length > 0 ? 'block' : 'none';

    // Position filter
    const positionText = state.filterPosition.length === 0 ? 'All Positions' : `${state.filterPosition.length} Selected`;
    document.getElementById('positionFilterText').textContent = positionText;
    document.getElementById('clearPositionFilter').style.display = state.filterPosition.length > 0 ? 'block' : 'none';
}

function updateMobileFilterButtons() {
    const totalFilters = state.filterProject.length + state.filterStage.length + state.filterPosition.length;
    const hasFilters = totalFilters > 0;
    
    // Update filter button
    const filterButton = document.getElementById('mobileFilterButton');
    const filterCount = document.getElementById('mobileFilterCount');
    const clearAllButton = document.getElementById('mobileClearAllFilters');
    
    if (filterButton) {
        filterButton.style.backgroundColor = hasFilters ? 'rgba(204, 102, 51, 0.1)' : 'rgba(255, 255, 255, 0.95)';
        filterButton.style.borderColor = hasFilters ? '#cc6633' : 'rgba(204, 102, 51, 0.25)';
        filterButton.style.color = hasFilters ? '#cc6633' : '#6b7280';
    }
    
    if (filterCount) {
        filterCount.style.display = hasFilters ? 'inline-flex' : 'none';
        filterCount.textContent = totalFilters;
    }
    
    if (clearAllButton) {
        clearAllButton.style.display = hasFilters ? 'flex' : 'none';
    }
    
    // Update tab counts in bottom sheet
    updateBottomSheetTabCounts();
}

function updateBottomSheetTabCounts() {
    // Project tab
    const projectTabCount = document.getElementById('projectTabCount');
    if (projectTabCount) {
        projectTabCount.style.display = state.filterProject.length > 0 ? 'inline-block' : 'none';
        projectTabCount.textContent = state.filterProject.length;
    }
    
    // Stage tab
    const stageTabCount = document.getElementById('stageTabCount');
    if (stageTabCount) {
        stageTabCount.style.display = state.filterStage.length > 0 ? 'inline-block' : 'none';
        stageTabCount.textContent = state.filterStage.length;
    }
    
    // Position tab
    const positionTabCount = document.getElementById('positionTabCount');
    if (positionTabCount) {
        positionTabCount.style.display = state.filterPosition.length > 0 ? 'inline-block' : 'none';
        positionTabCount.textContent = state.filterPosition.length;
    }
    
    // Footer
    const filterPanelFooter = document.getElementById('bottomSheetFooter');
    const hasFilters = state.filterProject.length + state.filterStage.length + state.filterPosition.length > 0;
    if (filterPanelFooter) {
        filterPanelFooter.style.display = hasFilters ? 'block' : 'none';
        const totalCount = document.getElementById('bottomSheetTotalCount');
        if (totalCount) {
            totalCount.textContent = state.filterProject.length + state.filterStage.length + state.filterPosition.length;
        }
    }
}

function renderDropdowns() {
    if (state.isMobile) {
        renderMobileFilterTabs();
    } else {
        renderDesktopDropdowns();
    }
}

function renderDesktopDropdowns() {
    const options = getFilterOptions();

    // Render project dropdown
    const projectDropdown = document.getElementById('projectDropdown');
    if (projectDropdown) {
        projectDropdown.innerHTML = '<div class="dropdown-content">' +
            options.projects.map(project => `
                <label class="dropdown-item">
                    <input type="checkbox" class="dropdown-checkbox" value="${project}" 
                        ${state.filterProject.includes(project) ? 'checked' : ''}
                        onchange="toggleFilter('project', '${project}')">
                    <span class="dropdown-color" style="background-color: ${getProjectColor(project)}"></span>
                    <span class="dropdown-label">${project}</span>
                </label>
            `).join('') +
            '</div>';
    }

    // Render stage dropdown
    const stageDropdown = document.getElementById('stageDropdown');
    if (stageDropdown) {
        stageDropdown.innerHTML = '<div class="dropdown-content">' +
            options.stages.map(stage => `
                <label class="dropdown-item">
                    <input type="checkbox" class="dropdown-checkbox" value="${stage}" 
                        ${state.filterStage.includes(stage) ? 'checked' : ''}
                        onchange="toggleFilter('stage', '${stage}')">
                    <span class="dropdown-color" style="background-color: ${getStageColor(stage)}"></span>
                    <span class="dropdown-label">${stage}</span>
                </label>
            `).join('') +
            '</div>';
    }

    // Render position dropdown
    const positionDropdown = document.getElementById('positionDropdown');
    if (positionDropdown) {
        positionDropdown.innerHTML = '<div class="dropdown-content">' +
            options.positions.map(position => `
                <label class="dropdown-item">
                    <input type="checkbox" class="dropdown-checkbox" value="${position}" 
                        ${state.filterPosition.includes(position) ? 'checked' : ''}
                        onchange="toggleFilter('position', '${position}')">
                    <span class="dropdown-color" style="background-color: #c4b5fd"></span>
                    <span class="dropdown-label">${position}</span>
                </label>
            `).join('') +
            '</div>';
    }
}

function renderMobileFilterTabs() {
    const options = getFilterOptions();
    
    // Render project tab content
    const projectTabContent = document.getElementById('projectTabContent');
    if (projectTabContent) {
        projectTabContent.innerHTML = options.projects.map(project => {
            const count = state.employees.filter(emp => {
                const matchesProject = emp.project === project;
                const matchesStage = state.filterStage.length === 0 || state.filterStage.includes(emp.stage);
                const matchesPosition = state.filterPosition.length === 0 || state.filterPosition.includes(emp.position);
                return matchesProject && matchesStage && matchesPosition;
            }).length;
            
            return `
                <label class="mobile-filter-option">
                    <input type="checkbox" class="mobile-filter-checkbox" value="${project}"
                        ${state.filterProject.includes(project) ? 'checked' : ''}
                        onchange="toggleFilter('project', '${project}')">
                    <span class="mobile-filter-color" style="background-color: ${getProjectColor(project)}"></span>
                    <span class="mobile-filter-label">${project}</span>
                    <span class="mobile-filter-count">${count}</span>
                </label>
            `;
        }).join('');
    }
    
    // Render stage tab content
    const stageTabContent = document.getElementById('stageTabContent');
    if (stageTabContent) {
        stageTabContent.innerHTML = options.stages.map(stage => {
            const count = state.employees.filter(emp => {
                const matchesStage = emp.stage === stage;
                const matchesProject = state.filterProject.length === 0 || state.filterProject.includes(emp.project);
                const matchesPosition = state.filterPosition.length === 0 || state.filterPosition.includes(emp.position);
                return matchesStage && matchesProject && matchesPosition;
            }).length;
            
            return `
                <label class="mobile-filter-option">
                    <input type="checkbox" class="mobile-filter-checkbox" value="${stage}"
                        ${state.filterStage.includes(stage) ? 'checked' : ''}
                        onchange="toggleFilter('stage', '${stage}')">
                    <span class="mobile-filter-color" style="background-color: ${getStageColor(stage)}"></span>
                    <span class="mobile-filter-label">${stage}</span>
                    <span class="mobile-filter-count">${count}</span>
                </label>
            `;
        }).join('');
    }
    
    // Render position tab content
    const positionTabContent = document.getElementById('positionTabContent');
    if (positionTabContent) {
        positionTabContent.innerHTML = options.positions.map(position => {
            const count = state.employees.filter(emp => {
                const matchesPosition = emp.position === position;
                const matchesProject = state.filterProject.length === 0 || state.filterProject.includes(emp.project);
                const matchesStage = state.filterStage.length === 0 || state.filterStage.includes(emp.stage);
                return matchesPosition && matchesProject && matchesStage;
            }).length;
            
            return `
                <label class="mobile-filter-option">
                    <input type="checkbox" class="mobile-filter-checkbox" value="${position}"
                        ${state.filterPosition.includes(position) ? 'checked' : ''}
                        onchange="toggleFilter('position', '${position}')">
                    <span class="mobile-filter-color" style="background-color: #c4b5fd"></span>
                    <span class="mobile-filter-label">${position}</span>
                    <span class="mobile-filter-count">${count}</span>
                </label>
            `;
        }).join('');
    }
}

// ========================================
// DESKTOP RENDER FUNCTIONS
// ========================================
function renderDesktopEmployeeCard(employee) {
    const avatarColor = getAvatarColor(employee.full_name);
    const isSelected = state.selectedEmployee === employee.id;
    
    const timelineEvents = [
        { date: employee.interview_date || '', type: 'interview', label: 'Interview', short: 'Int.' },
        { date: employee.transfer_planned_date || '', type: 'transfer_planned', label: 'Transfer Plan', short: 'T.Plan' },
        { date: employee.transfer_fact_date || '', type: 'transfer_fact', label: 'Transfer Fact', short: 'T.Fact' },
        { date: employee.start_date || '', type: 'start', label: 'Start', short: 'Start' },
        { date: employee.end_date || '', type: 'end', label: 'End', short: 'End' }
    ];

    const getEventColor = (type) => {
        switch (type) {
            case 'interview': return '#8b5cf6';
            case 'transfer_planned': return '#eab308';
            case 'transfer_fact': return '#3b82f6';
            case 'start': return '#22c55e';
            case 'end': return '#ef4444';
            default: return '#6b7280';
        }
    };

    return `
        <div class="employee-card ${isSelected ? 'selected' : ''}" 
             style="--stage-color: ${getStageColor(employee.stage)}"
             onclick="toggleEmployee(${employee.id})"
             onmouseenter="handleCardHover(this, true)" 
             onmouseleave="handleCardHover(this, false)">
            
            <!-- Employee Header -->
            <div class="employee-header">
                <div class="avatar-container">
                    ${employee.avatar ? 
                        `<img src="${employee.avatar}" alt="${employee.full_name}" class="avatar-img" 
                              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
                    <div class="avatar" style="background: ${avatarColor.bg}; ${employee.avatar ? 'display: none;' : ''}">
                        <span class="avatar-text">${employee.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                    </div>
                    <div class="status-indicator" style="background-color: ${getStageColor(employee.stage)}"></div>
                </div>
                
                <div class="employee-info">
                    <h3 class="employee-name">${employee.full_name}</h3>
                    
                    <div class="employee-position-line">
                        <p class="employee-position">${employee.position}</p>
                        <span class="tag tag-stage" style="background-color: ${getStageColor(employee.stage)}20; color: ${getStageColor(employee.stage)}">
                            ${employee.stage}
                        </span>
                        <span class="tag tag-project" style="background-color: ${getProjectColor(employee.project)}20; color: ${getProjectColor(employee.project)}">
                            ${employee.project}
                        </span>
                        ${employee.staffing_type === 'Backup' ? 
                            '<span class="tag tag-backup">Backup</span>' : ''}
                        
                        <button class="view-button ${isSelected ? 'selected' : ''}" 
                                onclick="event.stopPropagation(); toggleEmployee(${employee.id})"
                                onmouseenter="this.style.color='#cc6633'"
                                onmouseleave="this.style.color='${isSelected ? '#cc6633' : '#6b7280'}'">
                            <span>${isSelected ? 'Hide Details' : 'View Details'}</span>
                            ${isSelected ? 
                                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>' :
                                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>'}
                        </button>
                    </div>
                </div>
            </div>

            ${isSelected ? `
                <!-- Employee Details -->
                <div class="employee-details">
                    <div class="details-grid">
                        
                        <!-- Skills & Experience -->
                        <div class="detail-section">
                            <h4>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                                Skills & Experience
                            </h4>
                            <div>
                                <div class="detail-item">
                                    <span class="detail-label">English Level:</span>
                                    <div class="progress-container">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${employee.english_level}%; background-color: ${employee.english_level >= 90 ? '#22c55e' : employee.english_level >= 70 ? '#eab308' : '#ef4444'}"></div>
                                        </div>
                                        <span class="detail-value" style="color: #7c3aed">${employee.english_level}%</span>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Typing Speed:</span>
                                    <div class="progress-container">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${Math.min(employee.typing_speed, 100)}%; background-color: ${employee.typing_speed >= 80 ? '#22c55e' : employee.typing_speed >= 60 ? '#eab308' : '#ef4444'}"></div>
                                        </div>
                                        <span class="detail-value" style="color: #7c3aed">${employee.typing_speed} WPM</span>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">BPO Experience:</span>
                                    <span class="detail-value" style="color: #4f46e5">${employee.bpo_experience}y (${getExperienceLevel(employee.bpo_experience)})</span>
                                </div>
                            </div>
                            <i class="bottom-corners"></i>
                        </div>

                        <!-- Personal Info -->
                        <div class="detail-section">
                            <h4>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                Personal Info
                            </h4>
                            <div>
                                <div class="detail-item">
                                    <span class="detail-label">Age:</span>
                                    <span class="detail-value">${calculateAge(employee.date_of_birth)} years</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Date of Birth:</span>
                                    <span class="detail-value">${employee.date_of_birth}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Gender:</span>
                                    <span class="detail-value" style="text-transform: capitalize">${employee.gender}</span>
                                </div>
                            </div>
                            <i class="bottom-corners"></i>
                        </div>

                        <!-- Timeline -->
                        <div class="detail-section">
                            <h4>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                Timeline
                            </h4>
                            <div class="timeline">
                                <div class="timeline-line"></div>
                                <div class="timeline-events">
                                    ${timelineEvents.map((event, index) => `
                                        <div class="timeline-event">
                                            <div class="event-label" 
                                                 ${(event.short.includes('.') || event.short !== event.label) ? 
                                                   `onmouseenter="showTooltip(this, '${event.label}')" 
                                                    onmouseleave="hideTooltip()"` : ''}>
                                                <span>${event.short}</span>
                                                ${(event.short.includes('.') || event.short !== event.label) ? 
                                                  '<div class="event-info">i</div>' : ''}
                                            </div>
                                            <div class="event-dot" style="background-color: ${event.date ? getEventColor(event.type) : '#e5e7eb'}; opacity: ${event.date ? 1 : 0.5}"></div>
                                            <div class="event-date">${event.date || '—'}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <i class="bottom-corners"></i>
                        </div>
                    </div>

                    <!-- Assessment Actions -->
                    <div class="assessment-section">
                        <span class="assessment-label">Assessment Results:</span>
                        <div class="assessment-actions">
                            <button class="action-button primary" 
                                    onclick="event.stopPropagation(); window.open('${employee.english_proficiency_test}', '_blank')">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View Assessment
                            </button>
                            <a href="${employee.english_proficiency_test}" 
                               download="${employee.full_name.replace(/\s+/g, '-').toLowerCase()}-test-results.pdf"
                               class="action-button secondary"
                               onclick="event.stopPropagation()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Download Report
                            </a>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// ========================================
// MOBILE RENDER FUNCTIONS
// ========================================
function renderMobileEmployeeCard(employee) {
    const avatarColor = getAvatarColor(employee.full_name);
    const isSelected = state.selectedEmployee === employee.id;
    
    const timelineEvents = [
        { date: employee.interview_date || '', type: 'interview', label: 'Interview', color: '#8b5cf6' },
        { date: employee.start_date || '', type: 'start', label: 'Start Date', color: '#22c55e' },
        { date: employee.end_date || '', type: 'end', label: 'End Date', color: '#ef4444' }
    ];

    return `
        <div class="mobile-employee-card ${isSelected ? 'selected' : ''}" 
             onclick="toggleEmployee(${employee.id})">
            
            <!-- Employee Header -->
            <div class="mobile-employee-header">
                <div class="mobile-employee-left">
                    <div class="mobile-avatar-container">
                        ${employee.avatar ? 
                            `<img src="${employee.avatar}" alt="${employee.full_name}" class="mobile-avatar-img">` :
                            `<div class="mobile-avatar" style="background: ${avatarColor.bg}">
                                <span style="color: ${avatarColor.text}">
                                    ${employee.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </span>
                            </div>`
                        }
                        <div class="mobile-status-dot" style="background-color: ${getStageColor(employee.stage)}"></div>
                    </div>
                    <div class="mobile-employee-info">
                        <h3 class="mobile-employee-name">${employee.full_name}</h3>
                        <p class="mobile-employee-position">${employee.position}</p>
                    </div>
                </div>
                
                <!-- Expand Icon -->
                <svg class="mobile-expand-icon ${isSelected ? 'expanded' : ''}" 
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>

            <!-- Tags -->
            <div class="mobile-tags">
                <span class="mobile-tag" style="background-color: ${getStageColor(employee.stage)}20; color: ${getStageColor(employee.stage)}">
                    ${employee.stage}
                </span>
                <span class="mobile-tag" style="background-color: ${getProjectColor(employee.project)}20; color: ${getProjectColor(employee.project)}">
                    ${employee.project}
                </span>
                ${employee.staffing_type === 'Backup' ? 
                    '<span class="mobile-tag" style="background-color: #f1f5f9; color: #475569">Backup</span>' : ''}
            </div>

            ${isSelected ? `
                <!-- Mobile Employee Details -->
                <div class="mobile-employee-details">
                    
                    <!-- Personal Info - FIRST -->
                    <div class="mobile-detail-section">
                        <h4 class="mobile-detail-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                            </svg>
                            Personal Info
                        </h4>
                        <div class="mobile-detail-items">
                            <div class="mobile-detail-item">
                                <span class="mobile-detail-label">Age</span>
                                <span class="mobile-detail-value">${calculateAge(employee.date_of_birth)} years</span>
                            </div>
                            <div class="mobile-detail-item">
                                <span class="mobile-detail-label">Gender</span>
                                <span class="mobile-detail-value">${employee.gender}</span>
                            </div>
                            <div class="mobile-detail-item">
                                <span class="mobile-detail-label">Date of Birth</span>
                                <span class="mobile-detail-value">${employee.date_of_birth}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Skills & Experience - SECOND -->
                    <div class="mobile-detail-section">
                        <h4 class="mobile-detail-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                            Skills & Experience
                        </h4>
                        <div class="mobile-detail-items">
                            <div class="mobile-skill-item">
                                <div class="mobile-skill-header">
                                    <span class="mobile-skill-label">English Level</span>
                                    <span class="mobile-skill-value">${employee.english_level}%</span>
                                </div>
                                <div class="mobile-progress-bar">
                                    <div class="mobile-progress-fill" 
                                         style="width: ${employee.english_level}%; 
                                                background-color: ${employee.english_level >= 90 ? '#22c55e' : 
                                                                   employee.english_level >= 70 ? '#eab308' : '#ef4444'}">
                                    </div>
                                </div>
                            </div>
                            <div class="mobile-skill-item">
                                <div class="mobile-skill-header">
                                    <span class="mobile-skill-label">Typing Speed</span>
                                    <span class="mobile-skill-value">${employee.typing_speed} WPM</span>
                                </div>
                                <div class="mobile-progress-bar">
                                    <div class="mobile-progress-fill" 
                                         style="width: ${Math.min(employee.typing_speed, 100)}%; 
                                                background-color: ${employee.typing_speed >= 80 ? '#22c55e' : 
                                                                   employee.typing_speed >= 60 ? '#eab308' : '#ef4444'}">
                                    </div>
                                </div>
                            </div>
                            <div class="mobile-detail-item">
                                <span class="mobile-detail-label">BPO Experience</span>
                                <span class="mobile-detail-value" style="color: #4f46e5; font-weight: 600">
                                    ${employee.bpo_experience}y (${getExperienceLevel(employee.bpo_experience)})
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Timeline - THIRD -->
                    <div class="mobile-detail-section">
                        <h4 class="mobile-detail-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            Timeline
                        </h4>
                        <div class="mobile-timeline">
                            <div class="mobile-timeline-line"></div>
                            <div class="mobile-timeline-events">
                                ${timelineEvents.map((event, index) => {
                                    const hasDate = !!event.date;
                                    return `
                                        <div class="mobile-timeline-event">
                                            <div class="mobile-timeline-dot" 
                                                 style="background-color: ${hasDate ? event.color : '#f3f4f6'};
                                                        border-color: ${hasDate ? 'white' : '#e5e7eb'}">
                                                ${hasDate ? '<div class="mobile-timeline-dot-inner"></div>' : ''}
                                            </div>
                                            <div class="mobile-timeline-content ${!hasDate ? 'no-date' : ''}">
                                                <span class="mobile-timeline-label ${!hasDate ? 'no-date' : ''}">${event.label}</span>
                                                <span class="mobile-timeline-date ${!hasDate ? 'no-date' : ''}">${event.date || '—'}</span>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Assessment Actions -->
                    <div class="mobile-assessment-section">
                        <p class="mobile-assessment-label">Assessment Results</p>
                        <div class="mobile-assessment-actions">
                            <button onclick="event.stopPropagation(); window.open('${employee.english_proficiency_test}', '_blank')" 
                                    class="mobile-action-button primary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View
                            </button>
                            <button onclick="event.stopPropagation(); downloadReport('${employee.english_proficiency_test}', '${employee.full_name}')" 
                                    class="mobile-action-button secondary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// ========================================
// MAIN RENDER FUNCTIONS
// ========================================
function renderEmployees() {
    const teamGrid = document.getElementById('teamGrid');
    const emptyState = document.getElementById('emptyState');

    if (state.filteredEmployees.length === 0) {
        teamGrid.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        teamGrid.style.display = state.isMobile ? 'flex' : 'grid';
        emptyState.style.display = 'none';
        
        if (state.isMobile) {
            teamGrid.innerHTML = state.filteredEmployees.map(employee => renderMobileEmployeeCard(employee)).join('');
        } else {
            teamGrid.innerHTML = state.filteredEmployees.map(employee => renderDesktopEmployeeCard(employee)).join('');
        }
    }
}

function updateUI() {
    updateStats();
    updateResultsCount();
    updateFilterButtons();
    renderDropdowns();
    renderEmployees();
}

// ========================================
// EVENT HANDLERS
// ========================================
function handleCardHover(element, isHover) {
    if (state.isMobile) return;
    
    const transform = isHover ? 'translateY(-4px)' : 'translateY(0px)';
    const shadow = isHover ? '0 16px 40px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(204, 102, 51, 0.2)' : '';
    const bg = isHover ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)';
    
    if (window.innerWidth > 768) {
        element.style.transform = transform;
    }
    element.style.boxShadow = shadow;
    element.style.backgroundColor = bg;
}

function toggleEmployee(id) {
    state.selectedEmployee = state.selectedEmployee === id ? null : id;
    renderEmployees();
}

function toggleFilter(type, value) {
    let filterArray;
    if (type === 'project') {
        filterArray = state.filterProject;
    } else if (type === 'stage') {
        filterArray = state.filterStage;
    } else if (type === 'position') {
        filterArray = state.filterPosition;
    }

    const index = filterArray.indexOf(value);
    if (index > -1) {
        filterArray.splice(index, 1);
    } else {
        filterArray.push(value);
    }

    filterEmployees();
}

function clearAllFilters() {
    state.filterProject = [];
    state.filterStage = [];
    state.filterPosition = [];
    filterEmployees();
}

function showTooltip(element, text) {
    if (state.isMobile) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerHTML = `
        ${text}
        <div class="tooltip-arrow"></div>
    `;
    element.appendChild(tooltip);
}

function hideTooltip() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => tooltip.remove());
}

function downloadReport(url, name) {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/\s+/g, '-').toLowerCase()}-test-results.pdf`;
    link.click();
}

// ========================================
// MOBILE BOTTOM SHEET HANDLERS
// ========================================
function openBottomSheet() {
    state.showMobileFilters = true;
    const bottomSheet = document.getElementById('bottomSheet');
    const backdrop = document.getElementById('bottomSheetBackdrop');
    
    if (bottomSheet && backdrop) {
        bottomSheet.style.display = 'block';
        backdrop.style.display = 'block';
        
        // Добавить задержку для анимации как в React
        setTimeout(() => {
            state.isBottomSheetAnimating = true;
            bottomSheet.style.transform = 'translateY(0)';
            backdrop.style.opacity = '0.5'; // Добавить анимацию backdrop
        }, 10);
    }
}

function closeBottomSheet() {
    state.isBottomSheetAnimating = false;
    const backdrop = document.getElementById('bottomSheetBackdrop');
    const bottomSheet = document.getElementById('bottomSheet');
    
    if (backdrop && bottomSheet) {
        backdrop.style.opacity = '0';
        bottomSheet.style.transform = 'translateY(100%)';
        
        // Hide after animation completes
        setTimeout(() => {
            state.showMobileFilters = false;
            backdrop.style.display = 'none';
            bottomSheet.style.display = 'none';
        }, 300);
    }
}

function switchFilterTab(tab) {
    state.activeMobileFilterTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.mobile-filter-tab').forEach(tabBtn => {
        tabBtn.classList.remove('active');
    });
    document.querySelector(`.mobile-filter-tab[data-tab="${tab}"]`).classList.add('active');
    
    // Show correct content
    document.querySelectorAll('.mobile-tab-pane').forEach(pane => {
        pane.style.display = 'none';
    });
    document.getElementById(`${tab}TabContent`).style.display = 'block';
}

// ========================================
// MOBILE SPECIFIC EVENT LISTENERS
// ========================================
function initializeMobileHandlers() {
    // Mobile filter button
    const mobileFilterButton = document.getElementById('mobileFilterButton');
    if (mobileFilterButton) {
        mobileFilterButton.addEventListener('click', openBottomSheet);
    }
    
    // Clear all filters mobile
    const clearAllMobile = document.getElementById('mobileClearAllFilters');
    if (clearAllMobile) {
        clearAllMobile.addEventListener('click', clearAllFilters);
    }
    
    // Bottom sheet backdrop
    const backdrop = document.getElementById('bottomSheetBackdrop');
    if (backdrop) {
        backdrop.addEventListener('click', closeBottomSheet);
    }
    
    // Filter tabs
    const filterTabs = document.querySelectorAll('.mobile-filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchFilterTab(tab.dataset.tab);
        });
    });
    
    // Clear all button in bottom sheet
    const clearAllButton = document.getElementById('bottomSheetClearAll');
    if (clearAllButton) {
        clearAllButton.addEventListener('click', () => {
            clearAllFilters();
            closeBottomSheet();
        });
    }
    
    // ESC key to close bottom sheet
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.showMobileFilters) {
            closeBottomSheet();
        }
    });
}

// ========================================
// DESKTOP SPECIFIC EVENT LISTENERS
// ========================================
function initializeDesktopHandlers() {
    // Desktop filter dropdowns
    const projectFilterBtn = document.getElementById('projectFilterBtn');
    const stageFilterBtn = document.getElementById('stageFilterBtn');
    const positionFilterBtn = document.getElementById('positionFilterBtn');
    
    if (projectFilterBtn) {
        projectFilterBtn.addEventListener('click', () => {
            state.showProjectDropdown = !state.showProjectDropdown;
            state.showStageDropdown = false;
            state.showPositionDropdown = false;
            updateDropdownVisibility();
        });
    }

    if (stageFilterBtn) {
        stageFilterBtn.addEventListener('click', () => {
            state.showStageDropdown = !state.showStageDropdown;
            state.showProjectDropdown = false;
            state.showPositionDropdown = false;
            updateDropdownVisibility();
        });
    }

    if (positionFilterBtn) {
        positionFilterBtn.addEventListener('click', () => {
            state.showPositionDropdown = !state.showPositionDropdown;
            state.showProjectDropdown = false;
            state.showStageDropdown = false;
            updateDropdownVisibility();
        });
    }

    // Clear filter buttons
    const clearProjectFilter = document.getElementById('clearProjectFilter');
    const clearStageFilter = document.getElementById('clearStageFilter');
    const clearPositionFilter = document.getElementById('clearPositionFilter');
    
    if (clearProjectFilter) {
        clearProjectFilter.addEventListener('click', (e) => {
            e.stopPropagation();
            state.filterProject = [];
            filterEmployees();
        });
    }

    if (clearStageFilter) {
        clearStageFilter.addEventListener('click', (e) => {
            e.stopPropagation();
            state.filterStage = [];
            filterEmployees();
        });
    }

    if (clearPositionFilter) {
        clearPositionFilter.addEventListener('click', (e) => {
            e.stopPropagation();
            state.filterPosition = [];
            filterEmployees();
        });
    }

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        const isDropdownClick = e.target.closest('.filter-dropdown');
        if (!isDropdownClick) {
            state.showProjectDropdown = false;
            state.showStageDropdown = false;
            state.showPositionDropdown = false;
            updateDropdownVisibility();
        }
    });
}

function updateDropdownVisibility() {
    const projectDropdown = document.getElementById('projectDropdown');
    const stageDropdown = document.getElementById('stageDropdown');
    const positionDropdown = document.getElementById('positionDropdown');
    
    if (projectDropdown) projectDropdown.style.display = state.showProjectDropdown ? 'block' : 'none';
    if (stageDropdown) stageDropdown.style.display = state.showStageDropdown ? 'block' : 'none';
    if (positionDropdown) positionDropdown.style.display = state.showPositionDropdown ? 'block' : 'none';
}

// ========================================
// COMMON EVENT LISTENERS
// ========================================
function initializeEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    if (searchInput && clearSearch) {
        searchInput.addEventListener('input', (e) => {
            state.searchTerm = e.target.value;
            clearSearch.style.display = state.searchTerm ? 'block' : 'none';
            filterEmployees();
        });

        clearSearch.addEventListener('click', () => {
            state.searchTerm = '';
            searchInput.value = '';
            clearSearch.style.display = 'none';
            filterEmployees();
        });
    }

    // Initialize handlers based on device
    if (state.isMobile) {
        initializeMobileHandlers();
    } else {
        initializeDesktopHandlers();
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => handleResize(), 250);
    });
}

// ========================================
// RESIZE HANDLER
// ========================================
function handleResize() {
    const wasMobile = state.isMobile;
    state.isMobile = window.innerWidth < 768;
    state.deviceType = getDeviceType();
    
    if (wasMobile !== state.isMobile) {
        // Close any open modals/dropdowns
        state.showProjectDropdown = false;
        state.showStageDropdown = false;
        state.showPositionDropdown = false;
        state.showMobileFilters = false;
        
        // Close bottom sheet if open
        if (state.showMobileFilters) {
            closeBottomSheet();
        }
        
        // Re-initialize event listeners
        const elements = [
            'searchInput', 'clearSearch',
            'projectFilterBtn', 'stageFilterBtn', 'positionFilterBtn',
            'clearProjectFilter', 'clearStageFilter', 'clearPositionFilter',
            'mobileFilterButton', 'mobileClearAllFilters'
        ];
        
        elements.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const newEl = el.cloneNode(true);
                el.parentNode.replaceChild(newEl, el);
            }
        });
        
        // Re-initialize
        setTimeout(() => {
            initializeEventListeners();
            updateUI();
        }, 100);
    }
}

// ========================================
// GLOBAL FUNCTIONS
// ========================================
window.toggleEmployee = toggleEmployee;
window.toggleFilter = toggleFilter;
window.handleCardHover = handleCardHover;
window.showTooltip = showTooltip;
window.hideTooltip = hideTooltip;
window.downloadReport = downloadReport;
window.clearAllFilters = clearAllFilters;
window.openBottomSheet = openBottomSheet;
window.closeBottomSheet = closeBottomSheet;
window.switchFilterTab = switchFilterTab;

// ========================================
// INITIALIZATION
// ========================================
async function initialize() {
    try {
        // Show loading
        document.getElementById('loadingScreen').style.display = 'flex';
        document.getElementById('mainContainer').style.display = 'none';
        
        // Determine device type
        state.deviceType = getDeviceType();
        state.isMobile = ['ultra-mobile', 'small-mobile', 'mobile'].includes(state.deviceType);
        
        // Load data from Supabase
        const employees = await api.getEmployees();
        
        // Save to state
        state.employees = employees;
        state.filteredEmployees = employees;
        
        // Hide loading and show content
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'block';
        
        // Initialize UI
        updateUI();
        initializeEventListeners();
        
    } catch (error) {
        console.error('Error initializing:', error);
        
        // Show error message
        document.getElementById('loadingScreen').innerHTML = `
            <div class="loading-content">
                <div style="text-align: center;">
                    <svg class="empty-icon" style="width: 64px; height: 64px; margin: 0 auto 16px; color: #ef4444;" 
                         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h3 style="font-size: 18px; font-weight: 500; color: #111827; margin-bottom: 8px;">
                        Error loading data
                    </h3>
                    <p style="color: #6b7280; margin-bottom: 16px;">
                        ${error.message || 'Failed to connect to database'}
                    </p>
                    <button onclick="location.reload()" style="
                        padding: 8px 16px;
                        background-color: #cc6633;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-weight: 500;
                        cursor: pointer;
                    ">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }
}

// Start the application
document.addEventListener('DOMContentLoaded', initialize);