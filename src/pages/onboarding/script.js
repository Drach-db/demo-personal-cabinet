// ========================================
// ONBOARDING MANAGEMENT - ES6 MODULE
// ========================================

// ========================================
// ОБЯЗАТЕЛЬНЫЕ ИМПОРТЫ
// ========================================
import '../../components/layout/layout.js';
import '../../components/navbar/navbar.js';
import '../../components/header/header.js';
import api from './api.js';

// ========================================
// STATE MANAGEMENT
// ========================================
const state = {
    selectedCard: null,
    batches: [],
    loading: true,
    employeeStatuses: {},
    activeTab: 'all',
    activeIndicator: 0
};

// ========================================
// CONFIG
// ========================================
const config = {
    statusColors: {
        'completed': { color: '#22c55e', bg: '#22c55e20' },
        'done': { color: '#22c55e', bg: '#22c55e20' },
        'in progress': { color: '#3b82f6', bg: '#3b82f620' },
        'pending': { color: '#eab308', bg: '#eab30820' },
        'planned': { color: '#eab308', bg: '#eab30820' },
        'cancelled': { color: '#ef4444', bg: '#ef444420' },
        'preparation': { color: '#f59e0b', bg: '#f59e0b20' },
        'met': { color: '#22c55e', bg: '#22c55e20' },
        'overfilled': { color: '#3b82f6', bg: '#3b82f620' },
        'underfilled': { color: '#eab308', bg: '#eab30820' },
        'backup': { color: '#9333ea', bg: '#9333ea20' }
    },
    
    avatarGradients: [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 100%)'
    ],
    
    progressThresholds: [
        { min: 90, bg: '#6ee7b7', text: '#22c55e' },
        { min: 70, bg: '#a7f3d0', text: '#65a30d' },
        { min: 50, bg: '#fde68a', text: '#ca8a04' },
        { min: 30, bg: '#fed7aa', text: '#ea580c' },
        { min: 0, bg: '#fecaca', text: '#6b7280' }
    ],
    
    analyticsCards: [
        { key: 'inProgress', label: 'In Progress', icon: 'clock', color: '#3b82f6' },
        { key: 'completed', label: 'Completed', icon: 'check-circle', color: '#22c55e' },
        { key: 'pending', label: 'Pending', icon: 'alert-circle', color: '#eab308' },
        { key: 'active', label: 'Active Batches', icon: 'activity', color: '#8b5cf6' }
    ]
};

// ========================================
// SVG ICONS
// ========================================
const icons = {
    userSearch: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="7" r="4"></circle><path d="M10.3 15H7a4 4 0 0 0-4 4v2"></path><circle cx="17" cy="17" r="3"></circle><path d="m21 21-1.9-1.9"></path></svg>',
    clock: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    checkCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>',
    alertCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
    activity: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
    chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>',
    chevronUp: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>',
    eye: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    download: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
};

// ========================================
// UTILS
// ========================================
const utils = {
    getStatusConfig(status) {
        const key = status?.toLowerCase() || '';
        return config.statusColors[key] || { color: '#6b7280', bg: '#6b728020' };
    },
    
    getAvatarColor(name) {
        if (!name) return config.avatarGradients[0];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return config.avatarGradients[Math.abs(hash) % config.avatarGradients.length];
    },
    
    getProgressColor(progress) {
        const thresholds = config.progressThresholds;
        return thresholds.find(t => progress >= t.min) || thresholds[thresholds.length - 1];
    },
    
    calculateProgress(fact, planned) {
        if (!fact || !planned || planned === 0) return 0;
        // Преобразуем в числа, если это строки
        const factNum = parseInt(fact) || 0;
        const plannedNum = parseInt(planned) || 0;
        if (plannedNum === 0) return 0;
        return Math.min(100, Math.round((factNum / plannedNum) * 100));
    },
    
    getEmployeeCount(employees, type) {
        if (!employees?.length) return 0;
        return type === 'all' ? employees.length : employees.filter(e => e.staffing_type === type).length;
    },
    
    getAvgEnglish(employees) {
        if (!employees?.length) return 0;
        const sum = employees.reduce((acc, emp) => acc + (emp.english_level || 0), 0);
        return Math.round(sum / employees.length);
    },
    
    getInitials(name) {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
};

// ========================================
// TEMPLATES
// ========================================
const templates = {
    badge(text, status) {
        const cfg = utils.getStatusConfig(status);
        return `<span class="badge" style="background-color: ${cfg.bg}; color: ${cfg.color}">${text}</span>`;
    },

    progressBar(progress) {
        const colors = utils.getProgressColor(progress);
        return `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%; background-color: ${colors.bg}"></div>
            </div>
        `;
    },

    avatar(name) {
        const avatarColor = utils.getAvatarColor(name);
        const initials = utils.getInitials(name);
        
        return `
            <div class="avatar-wrapper">
                <div class="avatar" style="background: ${avatarColor}">
                    <span style="color: #fff">${initials}</span>
                </div>
            </div>
        `;
    },

    noData(icon, text, subtext) {
        return `
            <div class="empty-state">
                ${icon}
                <p class="empty-text">${text}</p>
                <p class="empty-subtext">${subtext}</p>
            </div>
        `;
    },

    employeeCard(employee) {
        const statusButtons = state.employeeStatuses[employee.employee_id];
        const testUrl = employee.english_proficiency_test || '#';
        
        return `
            <div class="employee-card" data-employee-id="${employee.employee_id}">
                <div class="employee-content">
                    ${templates.avatar(employee.full_name)}
                    
                    <div class="employee-info">
                        <div class="employee-name-row">
                            <span class="employee-name">${employee.full_name || 'Unknown'}</span>
                            <span class="employee-position">– ${employee.position || 'Position N/A'}</span>
                        </div>
                        
                        <div class="employee-stats">
                            <span class="stat-label">English: </span>
                            <span class="stat-value">${employee.english_level || 0}%</span>
                            <span class="stat-separator">|</span>
                            <span class="stat-label">Typing: </span>
                            <span class="stat-value">${employee.typing_speed || 0}wpm</span>
                        </div>
                        
                        <div class="employee-badges">
                            <span class="stat-label">Experience:</span>
                            <span class="stat-value experience-value">${employee.bpo_experience || 0}y</span>
                            ${employee.staffing_type === 'Backup' ? templates.badge('Backup', 'backup') : ''}
                        </div>
                    </div>
                </div>
                
                <div class="employee-actions">
                    <div class="action-row">
                        <span class="action-label">
                            <span class="label-full">Test Results:</span>
                            <span class="label-short">Test:</span>
                        </span>
                        <div class="action-buttons">
                            <button class="btn btn-view" onclick="handleViewTest('${testUrl}')">
                                ${icons.eye}
                                <span class="btn-text">View</span>
                            </button>
                            <a href="${testUrl}" download class="btn btn-download">
                                ${icons.download}
                                <span class="btn-text">Download</span>
                            </a>
                        </div>
                    </div>
                    
                    <div class="action-row">
                        <span class="action-label">
                            <span class="label-full">Decision:</span>
                            <span class="label-short">Action:</span>
                        </span>
                        ${statusButtons ? `
                            <div class="decision-status decision-${statusButtons}" 
                                 onclick="handleEmployeeDecision('${employee.employee_id}', 'null')">
                                ${statusButtons === 'approved' ? icons.check : icons.x}
                                <span>${statusButtons === 'approved' ? 'Approved' : 'Rejected'}</span>
                            </div>
                        ` : `
                            <div class="action-buttons">
                                <button class="btn btn-approve" 
                                        onclick="handleEmployeeDecision('${employee.employee_id}', 'approved')">
                                    ${icons.check}
                                    <span class="btn-text">Approve</span>
                                </button>
                                <button class="btn btn-reject" 
                                        onclick="handleEmployeeDecision('${employee.employee_id}', 'rejected')">
                                    ${icons.x}
                                    <span class="btn-text">Reject</span>
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    },

    expandedSection(batch) {
        const filteredEmployees = getFilteredEmployees(batch.employees);
        
        if (!batch.employees || batch.employees.length === 0) {
            return `
                <div class="batch-expanded">
                    ${templates.noData(
                        icons.userSearch,
                        'No team members assigned yet',
                        'Team members will be assigned to this batch'
                    )}
                </div>
            `;
        }

        return `
            <div class="batch-expanded">
                <div class="employee-tabs">
                    <button class="employee-tab ${state.activeTab === 'all' ? 'active' : ''}" 
                            onclick="handleTabChange('all')">
                        All
                        <span class="tab-count">${batch.employees.length}</span>
                    </button>
                    <button class="employee-tab ${state.activeTab === 'approved' ? 'active' : ''}" 
                            onclick="handleTabChange('approved')">
                        Approved
                        <span class="tab-count">
                            ${batch.employees.filter(e => state.employeeStatuses[e.employee_id] === 'approved').length}
                        </span>
                    </button>
                    <button class="employee-tab ${state.activeTab === 'rejected' ? 'active' : ''}" 
                            onclick="handleTabChange('rejected')">
                        Rejected
                        <span class="tab-count">
                            ${batch.employees.filter(e => state.employeeStatuses[e.employee_id] === 'rejected').length}
                        </span>
                    </button>
                </div>

                <div class="employees-list">
                    ${filteredEmployees.length === 0 ? templates.noData(
                        icons.userSearch,
                        `No ${state.activeTab === 'all' ? '' : state.activeTab} employees`,
                        state.activeTab === 'approved' ? 'Click "Approve" to confirm employees' : 
                        state.activeTab === 'rejected' ? 'Click "Reject" to decline employees' : 
                        'Employees will be assigned to this batch'
                    ) : filteredEmployees.map(employee => templates.employeeCard(employee)).join('')}
                </div>
            </div>
        `;
    },

    batchCard(batch) {
        const progress = utils.calculateProgress(batch.fact_fte, batch.planned_fte);
        const progressColors = utils.getProgressColor(progress);
        const coreCount = utils.getEmployeeCount(batch.employees, 'Core');
        const backupCount = utils.getEmployeeCount(batch.employees, 'Backup');
        const avgEnglish = utils.getAvgEnglish(batch.employees);
        const isSelected = state.selectedCard === batch.id;

        return `
            <div class="batch-card hoverable ${isSelected ? 'selected' : ''}" 
                 data-batch-id="${batch.id}" 
                 onclick="handleBatchClick(event, ${batch.id})">
                <div class="batch-header">
                    <div class="batch-icon">
                        ${icons.userSearch}
                    </div>
                    <div class="batch-title">
                        <span class="batch-title-main">
                            BATCH #${batch.batch_id}
                            <span class="batch-title-desktop"> – ${batch.name_batch || 'Unnamed'} | </span>
                            <span class="batch-project">${batch.project || 'N/A'}</span>
                        </span>
                        <div class="batch-title-sub batch-title-mobile">
                            ${batch.name_batch || 'Unnamed'}
                        </div>
                    </div>
                </div>

                <!-- Desktop Data -->
                <div class="batch-data batch-data-desktop">
                    <div class="batch-data-grid batch-data-header">
                        <div>Planned date:</div>
                        <div>Planned Employees:</div>
                        <div>Fact date:</div>
                        <div>Fact Employees:</div>
                        <div>Stage</div>
                        <div>Quality</div>
                    </div>
                    <div class="batch-data-grid">
                        <div class="batch-data-value">${batch.planned_date || '—'}</div>
                        <div class="batch-data-value">${batch.planned_fte || 0}</div>
                        <div class="batch-data-value">${batch.fact_date || "—"}</div>
                        <div class="batch-data-value">${batch.fact_fte || "—"}</div>
                        <div>${templates.badge(batch.stage || 'Unknown', batch.stage)}</div>
                        <div>${templates.badge(batch.quality || 'Unknown', batch.quality)}</div>
                    </div>
                </div>

                <!-- Mobile Data -->
                <div class="batch-data batch-data-mobile">
                    <div class="batch-data-grid">
                        <div class="batch-data-item">
                            <span class="batch-data-label">Planned</span>
                            <div class="batch-data-value">${batch.planned_date || '—'}</div>
                            <div class="batch-data-sub">${batch.planned_fte || 0} employees</div>
                        </div>
                        <div class="batch-data-item">
                            <span class="batch-data-label">Actual</span>
                            <div class="batch-data-value">${batch.fact_date || "—"}</div>
                            <div class="batch-data-sub">${batch.fact_fte ? `${batch.fact_fte} employees` : "—"}</div>
                        </div>
                    </div>
                </div>

                <!-- Mobile Progress -->
                <div class="batch-mobile-progress">
                    <div class="batch-mobile-tags">
                        <div class="batch-mobile-badges">
                            ${templates.badge(batch.stage || 'Unknown', batch.stage)}
                            ${templates.badge(batch.quality || 'Unknown', batch.quality)}
                        </div>
                        <span class="batch-mobile-percent" style="color: ${progressColors.text}">
                            ${progress}%
                        </span>
                    </div>
                    ${templates.progressBar(progress)}
                </div>

                <!-- Desktop Progress -->
                <div class="batch-progress-desktop">
                    ${templates.progressBar(progress)}
                </div>

                <!-- Footer -->
                <div class="batch-footer">
                    <div class="batch-team-info">
                        ${icons.userSearch}
                        <span>${coreCount} Core + ${backupCount} Backup | Eng: ${avgEnglish}%</span>
                    </div>
                    
                    <button class="batch-view-btn ${isSelected ? 'active' : ''}" 
                            data-desktop="true" 
                            onclick="handleToggleBatch(event, ${batch.id})">
                        <span>${isSelected ? 'Hide' : 'View'}</span>
                        ${isSelected ? icons.chevronUp : icons.chevronDown}
                    </button>
                    
                    <button class="batch-view-btn ${isSelected ? 'active' : ''}" 
                            data-mobile="true" 
                            onclick="handleToggleBatch(event, ${batch.id})">
                        <span>${isSelected ? 'Hide' : 'View'}</span>
                        ${isSelected ? icons.chevronUp : icons.chevronDown}
                    </button>
                    
                    <span class="batch-progress-text" style="color: ${progressColors.text}">
                        ${progress}%
                    </span>
                </div>

                ${isSelected ? templates.expandedSection(batch) : ''}
            </div>
        `;
    }
};

// ========================================
// RENDER FUNCTIONS
// ========================================
function renderLoading() {
    return `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading batches data from Supabase...</p>
        </div>
    `;
}

function renderAnalytics() {
    const stats = getBatchStats();
    const iconMap = {
        'clock': icons.clock,
        'check-circle': icons.checkCircle,
        'alert-circle': icons.alertCircle,
        'activity': icons.activity
    };

    return `
        <div class="analytics-grid" id="analyticsGrid">
            ${config.analyticsCards.map((card, index) => {
                const value = card.key === 'active' ? stats.inProgress : stats[card.key];
                return `
                    <div class="analytics-card">
                        <div class="analytics-card-content">
                            <div>
                                <h3>${card.label}</h3>
                                <p>${value || 0}</p>
                            </div>
                            <div class="analytics-icon" style="color: ${card.color}">
                                ${iconMap[card.icon]}
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>

        <div class="analytics-indicators">
            ${[0, 1, 2, 3].map(index => `
                <button class="indicator ${state.activeIndicator === index ? 'active' : ''}" 
                        onclick="handleIndicatorClick(${index})"></button>
            `).join('')}
        </div>
    `;
}

function renderBatches() {
    return `
        <div class="batches-list">
            ${state.batches.map(batch => templates.batchCard(batch)).join('')}
        </div>
    `;
}

function renderApp() {
    const mainElement = document.getElementById('appMain');
    if (!mainElement) return;

    if (state.loading) {
        mainElement.innerHTML = renderLoading();
        return;
    }

    mainElement.innerHTML = `
        ${renderAnalytics()}
        ${renderBatches()}
    `;

    // Setup analytics scroll после рендера
    setupAnalyticsScroll();
}

// ========================================
// HELPER FUNCTIONS
// ========================================
function getBatchStats() {
    const stats = { inProgress: 0, completed: 0, pending: 0, active: 0 };
    state.batches.forEach(batch => {
        const stage = (batch.stage || '').toLowerCase();
        if (stage === 'in progress') { 
            stats.inProgress++; 
            stats.active++; 
        }
        if (stage === 'completed') stats.completed++;
        if (stage === 'pending') stats.pending++;
        if (stage === 'planned') stats.pending++;
    });
    return stats;
}

function getFilteredEmployees(employees) {
    if (!employees) return [];
    switch(state.activeTab) {
        case 'approved':
            return employees.filter(e => state.employeeStatuses[e.employee_id] === 'approved');
        case 'rejected':
            return employees.filter(e => state.employeeStatuses[e.employee_id] === 'rejected');
        default:
            return employees;
    }
}

// ========================================
// ГЛОБАЛЬНЫЕ ФУНКЦИИ для onclick
// ========================================
window.handleBatchClick = function(event, batchId) {
    // Если клик на кнопке или ссылке - не обрабатываем
    if (event.target.closest('.batch-view-btn') || 
        event.target.closest('.batch-expanded') ||
        event.target.closest('a') ||
        event.target.closest('button')) {
        return;
    }
    
    state.selectedCard = state.selectedCard === batchId ? null : batchId;
    state.activeTab = 'all';
    renderApp();
};

window.handleToggleBatch = function(event, batchId) {
    event.preventDefault();
    event.stopPropagation();
    
    state.selectedCard = state.selectedCard === batchId ? null : batchId;
    state.activeTab = 'all';
    renderApp();
};

window.handleEmployeeDecision = function(employeeId, status) {
    if (status === 'null') {
        delete state.employeeStatuses[employeeId];
    } else {
        state.employeeStatuses[employeeId] = status;
    }
    
    // Перерисовываем только расширенную секцию
    const batchId = state.selectedCard;
    if (batchId) {
        const batchElement = document.querySelector(`[data-batch-id="${batchId}"] .batch-expanded`);
        if (batchElement) {
            const batch = state.batches.find(b => b.id === batchId);
            if (batch) {
                batchElement.outerHTML = templates.expandedSection(batch);
            }
        }
    }
};

window.handleViewTest = function(url) {
    if (url && url !== '#') {
        window.open(url, '_blank');
    } else {
        alert('Test results not available');
    }
};

window.handleTabChange = function(tab) {
    state.activeTab = tab;
    const batchId = state.selectedCard;
    if (batchId) {
        const batchElement = document.querySelector(`[data-batch-id="${batchId}"] .batch-expanded`);
        if (batchElement) {
            const batch = state.batches.find(b => b.id === batchId);
            if (batch) {
                batchElement.outerHTML = templates.expandedSection(batch);
            }
        }
    }
};

window.handleIndicatorClick = function(index) {
    const grid = document.querySelector('.analytics-grid');
    if (!grid) return;
    const cards = grid.children;
    if (cards[index]) {
        grid.scrollTo({ left: cards[index].offsetLeft, behavior: 'smooth' });
    }
};

// ========================================
// SETUP FUNCTIONS
// ========================================
function setupAnalyticsScroll() {
    const analyticsGrid = document.getElementById('analyticsGrid');
    if (!analyticsGrid || window.innerWidth > 450) return;
    
    analyticsGrid.addEventListener('scroll', () => {
        const scrollLeft = analyticsGrid.scrollLeft;
        const cardWidth = 280;
        const gap = 12;
        const activeIndex = Math.min(3, Math.round(scrollLeft / (cardWidth + gap)));
        
        state.activeIndicator = activeIndex;
        document.querySelectorAll('.indicator').forEach((ind, i) => {
            ind.classList.toggle('active', i === activeIndex);
        });
    });
}

// ========================================
// DATA LOADING
// ========================================
async function loadData() {
    state.loading = true;
    renderApp();
    
    try {
        console.log('🔄 Loading batches from Supabase...');
        
        // Используем функцию из api.js
        const data = await api.getBatchesWithEmployees();
        
        console.log('✅ Loaded batches:', data.length);
        
        // Добавляем id для каждого батча если его нет
        state.batches = data.map((batch, index) => ({
            ...batch,
            id: batch.id || batch.batch_id || index + 1
        }));
        
        state.loading = false;
    } catch (error) {
        console.error('❌ Error loading data:', error);
        state.loading = false;
        
        // Показываем ошибку
        const mainElement = document.getElementById('appMain');
        if (mainElement) {
            mainElement.innerHTML = `
                <div class="empty-state">
                    ${icons.alertCircle}
                    <p class="empty-text">Failed to load data</p>
                    <p class="empty-subtext">${error.message}</p>
                    <button class="btn btn-view" onclick="location.reload()">
                        Retry
                    </button>
                </div>
            `;
        }
    }
    
    renderApp();
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('✅ Onboarding page loaded');
    
    // Загружаем данные
    await loadData();
});

// Экспортируем для тестирования в консоли
window.onboardingState = state;
window.onboardingApi = api;