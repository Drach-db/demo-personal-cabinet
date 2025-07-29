// Импортируем API модуль
import api from './api.js'

// State management
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
    showPositionDropdown: false
};

// Utility functions
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
    const colors = { Sber: '#22c55e', Tbank: '#3b82f6', Alfabank: '#ef4444', VTB: '#8b5cf6' };
    return colors[project] || '#6b7280';
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

// Filter and search logic
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

// UI Update Functions
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
    document.getElementById('resultsCount').textContent = `${state.filteredEmployees.length} of ${state.employees.length}`;
}

function updateFilterButtons() {
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

function renderDropdowns() {
    const options = getFilterOptions();

    // Render project dropdown
    const projectDropdown = document.getElementById('projectDropdown');
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

    // Render stage dropdown
    const stageDropdown = document.getElementById('stageDropdown');
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

    // Render position dropdown
    const positionDropdown = document.getElementById('positionDropdown');
    positionDropdown.innerHTML = '<div class="dropdown-content">' +
        options.positions.map(position => `
            <label class="dropdown-item">
                <input type="checkbox" class="dropdown-checkbox" value="${position}" 
                    ${state.filterPosition.includes(position) ? 'checked' : ''}
                    onchange="toggleFilter('position', '${position}')">
                <span class="dropdown-color" style="background-color: #8b5cf6"></span>
                <span class="dropdown-label">${position}</span>
            </label>
        `).join('') +
        '</div>';
}

function renderEmployeeCard(employee) {
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
                    <p class="employee-position">${employee.position}</p>
                </div>
            </div>

            <!-- Tags and View Button -->
            <div class="tags-container">
                <div class="tags">
                    <span class="tag" style="background-color: ${getStageColor(employee.stage)}20; color: ${getStageColor(employee.stage)}">
                        ${employee.stage}
                    </span>
                    <span class="tag" style="background-color: ${getProjectColor(employee.project)}20; color: ${getProjectColor(employee.project)}">
                        ${employee.project}
                    </span>
                    ${employee.staffing_type === 'Backup' ? 
                        '<span class="tag" style="background-color: #f1f5f9; color: #475569">Backup</span>' : ''}
                </div>

                <button class="view-button ${isSelected ? 'selected' : ''}" 
                        onclick="event.stopPropagation(); toggleEmployee(${employee.id})"
                        onmouseenter="this.style.transform='translate(-50%, -50%) scale(1.05)'; this.style.color='#cc6633'"
                        onmouseleave="this.style.transform='translate(-50%, -50%) scale(1)'; this.style.color='${isSelected ? '#cc6633' : '#6b7280'}'">
                    <span>${isSelected ? 'Hide Employee Details' : 'View Employee Details'}</span>
                    ${isSelected ? 
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>' :
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>'}
                </button>
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
                                    <span class="detail-value" style="color: #4b5563">${calculateAge(employee.date_of_birth)} years</span>
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
                        </div>
                    </div>

                    <!-- Assessment Actions -->
                    <div class="assessment-section">
                        <span class="assessment-label">Assessment Results:</span>
                        <div class="assessment-actions">
                            <button class="action-button primary" 
                                    onclick="event.stopPropagation(); window.open('${employee.english_proficiency_test}', '_blank')"
                                    onmouseenter="handleButtonHover(this, true, 'view')"
                                    onmouseleave="handleButtonHover(this, false, 'view')">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View Assessment
                            </button>
                            <a href="${employee.english_proficiency_test}" 
                               download="${employee.full_name.replace(/\s+/g, '-').toLowerCase()}-test-results.pdf"
                               class="action-button secondary"
                               onclick="event.stopPropagation()"
                               onmouseenter="handleButtonHover(this, true, 'download')"
                               onmouseleave="handleButtonHover(this, false, 'download')">
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

function renderEmployees() {
    const teamGrid = document.getElementById('teamGrid');
    const emptyState = document.getElementById('emptyState');

    if (state.filteredEmployees.length === 0) {
        teamGrid.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        teamGrid.style.display = 'grid';
        emptyState.style.display = 'none';
        teamGrid.innerHTML = state.filteredEmployees.map(employee => renderEmployeeCard(employee)).join('');
    }
}

function updateUI() {
    updateStats();
    updateResultsCount();
    updateFilterButtons();
    renderDropdowns();
    renderEmployees();
}

// Event Handlers
function handleCardHover(element, isHover) {
    const transform = isHover ? 'translateY(-4px)' : 'translateY(0px)';
    const shadow = isHover ? '0 16px 40px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(204, 102, 51, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)';
    const bg = isHover ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)';
    
    Object.assign(element.style, { transform, boxShadow: shadow, backgroundColor: bg });
}

function handleButtonHover(element, isHover, type) {
    const transform = isHover ? 'translateY(-2px)' : 'translateY(0px)';
    const shadow = isHover ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 1px 2px rgba(0, 0, 0, 0.05)';
    
    element.style.transform = transform;
    element.style.boxShadow = shadow;
    
    if (type === 'view') {
        element.style.backgroundColor = isHover ? '#cc6633' : '#b85c2e';
    } else {
        element.style.backgroundColor = isHover ? '#6b7280' : '#9ca3af';
    }
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

function showTooltip(element, text) {
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

// Initialize event listeners
function initializeEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
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

    // Filter dropdowns
    document.getElementById('projectFilterBtn').addEventListener('click', () => {
        state.showProjectDropdown = !state.showProjectDropdown;
        state.showStageDropdown = false;
        state.showPositionDropdown = false;
        updateDropdownVisibility();
    });

    document.getElementById('stageFilterBtn').addEventListener('click', () => {
        state.showStageDropdown = !state.showStageDropdown;
        state.showProjectDropdown = false;
        state.showPositionDropdown = false;
        updateDropdownVisibility();
    });

    document.getElementById('positionFilterBtn').addEventListener('click', () => {
        state.showPositionDropdown = !state.showPositionDropdown;
        state.showProjectDropdown = false;
        state.showStageDropdown = false;
        updateDropdownVisibility();
    });

    // Clear filter buttons
    document.getElementById('clearProjectFilter').addEventListener('click', (e) => {
        e.stopPropagation();
        state.filterProject = [];
        filterEmployees();
    });

    document.getElementById('clearStageFilter').addEventListener('click', (e) => {
        e.stopPropagation();
        state.filterStage = [];
        filterEmployees();
    });

    document.getElementById('clearPositionFilter').addEventListener('click', (e) => {
        e.stopPropagation();
        state.filterPosition = [];
        filterEmployees();
    });

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
    document.getElementById('projectDropdown').style.display = state.showProjectDropdown ? 'block' : 'none';
    document.getElementById('stageDropdown').style.display = state.showStageDropdown ? 'block' : 'none';
    document.getElementById('positionDropdown').style.display = state.showPositionDropdown ? 'block' : 'none';
}

// Делаем функции доступными глобально для onclick в HTML
window.toggleEmployee = toggleEmployee;
window.toggleFilter = toggleFilter;
window.handleCardHover = handleCardHover;
window.handleButtonHover = handleButtonHover;
window.showTooltip = showTooltip;
window.hideTooltip = hideTooltip;

// Initialize the application with real data from Supabase
async function initialize() {
    try {
        // Показываем реальную загрузку
        document.getElementById('loadingScreen').style.display = 'flex';
        document.getElementById('mainContainer').style.display = 'none';
        
        // Загружаем данные из Supabase
        const employees = await api.getEmployees();
        
        // Сохраняем в state
        state.employees = employees;
        state.filteredEmployees = employees;
        
        // Скрываем загрузку и показываем контент
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'block';
        
        // Инициализируем UI
        updateUI();
        initializeEventListeners();
        
    } catch (error) {
        // Обработка ошибок
        console.error('Ошибка при инициализации:', error);
        
        // Показываем сообщение об ошибке вместо загрузки
        document.getElementById('loadingScreen').innerHTML = `
            <div class="loading-content">
                <div style="text-align: center;">
                    <svg class="empty-icon" style="width: 64px; height: 64px; margin: 0 auto 16px; color: #ef4444;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h3 style="font-size: 18px; font-weight: 500; color: #111827; margin-bottom: 8px;">
                        Ошибка загрузки данных
                    </h3>
                    <p style="color: #6b7280; margin-bottom: 16px;">
                        ${error.message || 'Не удалось подключиться к базе данных'}
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
                        Попробовать снова
                    </button>
                </div>
            </div>
        `;
    }
}

// Start the application
initialize();