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
    activeIndicator: 0,
    loadingBatchEmployees: {}
};

// ========================================
// CONFIG
// ========================================
const config = {
    statusColors: {
        'completed':   { color: '#22c55e', bg: '#22c55e1A' },
        'done':        { color: '#22c55e', bg: '#22c55e1A' },
        'in progress': { color: '#3b82f6', bg: '#3b82f61A' },
        'pending':     { color: '#eab308', bg: '#eab3081A' },
        'planned':     { color: '#eab308', bg: '#eab3081A' },
        'cancelled':   { color: '#ef4444', bg: '#ef44441A' },
        'preparation': { color: '#f59e0b', bg: '#f59e0b1A' },
        'met':         { color: '#22c55e', bg: '#22c55e1A' },
        'overfilled':  { color: '#3b82f6', bg: '#3b82f61A' },
        'underfilled': { color: '#eab308', bg: '#eab3081A' },
        'backup':      { color: '#9333ea', bg: '#9333ea1A' }
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
        // 0-29%: neutral gray (not red/pink)
        { min: 0, bg: '#e5e7eb', text: '#6b7280' }
    ],
    
    analyticsCards: [
        { key: 'unreviewed', label: 'Unreviewed Staff', icon: 'userSearch', color: '#eab308' },
        { key: 'inProgress', label: 'In Progress', icon: 'clock', color: '#3b82f6' },
        { key: 'completed', label: 'Completed', icon: 'check-circle', color: '#22c55e' },
        { key: 'planned', label: 'Planned', icon: 'calendar', color: '#eab308' }
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
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
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

    employeeCard(employee, options = {}) {
        const { locked = false } = options;
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
                            <div class="decision-status decision-${statusButtons} ${locked ? 'decision-locked' : ''}"
                                 ${locked ? 'title="Locked for completed group"' : `onclick="handleEmployeeDecision('${employee.employee_id}', 'null')"`}>
                                ${statusButtons === 'approved' ? icons.check : icons.x}
                                <span>${statusButtons === 'approved' ? 'Approved' : 'Rejected'}</span>
                            </div>
                        ` : (
                            locked ? `
                                <div class="decision-status decision-approved decision-locked" title="Locked for completed group">
                                    ${icons.check}
                                    <span>Approved</span>
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
                            `
                        )}
                    </div>
                </div>
            </div>
        `;
    },

    expandedSection(batch) {
        // Loading state for lazy employees
        if (typeof batch.employees === 'undefined' || state.loadingBatchEmployees[batch.id]) {
            return `
                <div class="batch-expanded">
                    <div class="loading-container" style="height: auto; min-height: 160px;">
                        <div class="loading-spinner"></div>
                        <p class="loading-text">Loading employees...</p>
                    </div>
                </div>
            `;
        }

        const filteredEmployees = getFilteredEmployees(batch.employees);
        
        if (!batch.employees || batch.employees.length === 0) {
            return `
                <div class="batch-expanded">
                    ${templates.noData(
                        icons.userSearch,
                        'No team members assigned yet',
                        'Team members will be assigned to this group'
                    )}
                </div>
            `;
        }

        // Determine if batch decisions should be locked (completed/done)
        const stage = ((batch && (batch.stage || batch.status)) || '').toLowerCase();
        const locked = stage === 'completed' || stage === 'done';

        return `
            <div class="batch-expanded">
                <div class="employee-tabs">
                    <button class="employee-tab ${state.activeTab === 'all' ? 'active' : ''}" 
                            onclick="handleTabChange('all')">
                        All
                        <span class="tab-count">${batch.employees.length}</span>
                    </button>
                    <button class="employee-tab ${state.activeTab === 'unreviewed' ? 'active' : ''}" 
                            onclick="handleTabChange('unreviewed')">
                        Unreviewed
                        <span class="tab-count">
                            ${batch.employees.filter(e => {
                                const st = state.employeeStatuses[e.employee_id];
                                return st !== 'approved' && st !== 'rejected';
                            }).length}
                        </span>
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
                        (state.activeTab === 'unreviewed' ? 'All employees are reviewed' : 'Employees will be assigned to this group')
                    ) : filteredEmployees.map(employee => templates.employeeCard(employee, { locked })).join('')}
                </div>
            </div>
        `;
    },

    batchCard(batch) {
        // Progress should reflect approved staff only
        const approved = getApprovedInfo(batch);
        const progress = utils.calculateProgress(approved.count, approved.total);
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
                            GROUP №${batch.batch_id} | 
                            <span class="batch-project">${batch.project || 'N/A'}</span>
                        </span>
                    </div>
                </div>

                <!-- Desktop Data -->
                <div class="batch-data batch-data-desktop">
                    <div class="batch-data-grid batch-data-header">
                        <div>Stage</div>
                        <div>Planned date:</div>
                        <div>Planned Employees:</div>
                        <div>Fact date:</div>
                        <div>Approved Staff</div>
                        <div>Unreviewed Staff</div>
                    </div>
                    <div class="batch-data-grid">
                        <div>${templates.badge(batch.stage || 'Unknown', batch.stage)}</div>
                        <div class="batch-data-value">${batch.planned_date || '—'}</div>
                        <div class="batch-data-value">${batch.planned_fte || 0}</div>
                        <div class="batch-data-value">${batch.fact_date || "—"}</div>
                        <div class="batch-data-value">${(() => { const info = getApprovedInfo(batch); return `${info.count} of ${info.total} approved`; })()}</div>
                        <div class="batch-data-value">${(() => { const info = getUnreviewedInfo(batch); return info.count; })()}</div>
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
                            <span class="batch-data-label">Approved Staff</span>
                            <div class="batch-data-value">${(() => { const info = getApprovedInfo(batch); return `${info.count} of ${info.total} approved`; })()}</div>
                        </div>
                    </div>
                </div>

                <!-- Mobile Progress -->
                <div class="batch-mobile-progress">
                    <div class="batch-mobile-tags">
                        <div class="batch-mobile-badges">
                            ${templates.badge(batch.stage || 'Unknown', batch.stage)}
                            ${templates.badge(`Unreviewed Staff: ${getUnreviewedInfo(batch).count ?? '—'}`, 'pending')}
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
                        <span>
                            <span class="metric-strong">${coreCount}</span> Core + 
                            <span class="metric-strong">${backupCount}</span> Backup | Eng: 
                            <span class="metric-strong">${avgEnglish}%</span>
                        </span>
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
            <p class="loading-text">Loading Onboarding...</p>
        </div>
    `;
}

function renderAnalytics() {
    const stats = getBatchStats();
    const iconMap = {
        'clock': icons.clock,
        'check-circle': icons.checkCircle,
        'alert-circle': icons.alertCircle,
        'calendar': icons.calendar,
        'activity': icons.activity,
        'userSearch': icons.userSearch
    };

    return `
        <div class="analytics-grid" id="analyticsGrid">
            ${config.analyticsCards.map((card, index) => {
                const value = (card.key === 'unreviewed')
                    ? getTotalUnreviewedCount()
                    : (card.key === 'active' ? stats.inProgress : stats[card.key]);
                return `
                    <div class="analytics-card">
                        <div class="analytics-card-content">
                            <div class="analytics-card-info">
                                <h3 class="analytics-card-title">${card.label}</h3>
                                <p class="analytics-card-value">${value || 0}</p>
                            </div>
                            <div class="analytics-card-icon-container" style="color: ${card.color};">
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
    const mainElement = document.getElementById('onboardingRoot');
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
// CACHE + LAZY EMPLOYEE LOADING
// ========================================
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cacheKeyBatches = () => 'onb_batches_v1';
const cacheKeyEmployees = (batchId) => `onb_emps_${batchId}`;

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

async function loadEmployeesForBatch(batch) {
    const batchId = batch.id || batch.batch_id;
    if (!batchId) return;
    if (state.loadingBatchEmployees[batchId]) return;

    const cached = cacheGet(cacheKeyEmployees(batchId));
    if (cached) {
        batch.employees = cached;
        autoApproveBatchEmployees(batch); // ensure completed batches are approved
        refreshExpanded(batchId);
        return;
    }

    state.loadingBatchEmployees[batchId] = true;
    refreshExpanded(batchId);
    try {
        const ids = api.parseEmployeeIds(batch.employee_id);
        const emps = await api.getEmployeesByIds(ids);
        batch.employees = emps;
        autoApproveBatchEmployees(batch); // ensure completed batches are approved
        cacheSet(cacheKeyEmployees(batchId), emps);
    } catch (e) {
        console.error('Failed to load employees for batch', batchId, e);
        batch.employees = [];
    } finally {
        delete state.loadingBatchEmployees[batchId];
        refreshExpanded(batchId);
    }
}

function refreshExpanded(batchId) {
    const container = document.querySelector(`[data-batch-id="${batchId}"] .batch-expanded`);
    const batch = state.batches.find(b => b.id === batchId);
    if (container && batch) {
        container.outerHTML = templates.expandedSection(batch);
    } else {
        renderApp();
    }
}

// ========================================
// HELPER FUNCTIONS
// ========================================
function autoApproveBatchEmployees(batch) {
    const stage = (batch && (batch.stage || batch.status) || '').toLowerCase();
    if (stage !== 'completed' && stage !== 'done') return;
    const emps = Array.isArray(batch.employees) ? batch.employees : [];
    emps.forEach(emp => {
        if (emp && emp.employee_id) {
            state.employeeStatuses[emp.employee_id] = 'approved';
        }
    });
}
function getBatchStats() {
    const stats = { inProgress: 0, completed: 0, planned: 0, active: 0 };
    state.batches.forEach(batch => {
        const stage = (batch.stage || '').toLowerCase();
        if (stage === 'in progress') { 
            stats.inProgress++; 
            stats.active++; 
        }
        if (stage === 'completed') stats.completed++;
        if (stage === 'planned' || stage === 'pending') stats.planned++;
    });
    return stats;
}

function getFilteredEmployees(employees) {
    if (!employees) return [];
    switch(state.activeTab) {
        case 'unreviewed':
            return employees.filter(e => {
                const st = state.employeeStatuses[e.employee_id];
                return st !== 'approved' && st !== 'rejected';
            });
        case 'approved':
            return employees.filter(e => state.employeeStatuses[e.employee_id] === 'approved');
        case 'rejected':
            return employees.filter(e => state.employeeStatuses[e.employee_id] === 'rejected');
        default:
            return employees;
    }
}

// Calculate dynamic fact FTE: base fact value or employees count minus local rejections
function getDynamicFactFte(batch) {
    if (!batch) return 0;
    const base = (batch && Number.isFinite(Number(batch.fact_fte))) ? Number(batch.fact_fte) : (Array.isArray(batch.employees) ? batch.employees.length : 0);
    const employees = Array.isArray(batch.employees) ? batch.employees : [];
    const rejected = employees.reduce((acc, emp) => acc + (state.employeeStatuses[emp.employee_id] === 'rejected' ? 1 : 0), 0);
    return Math.max(0, base - rejected);
}

// Total employees in batch from DB (prefer loaded list, else parse employee_id, else fact_fte/planned_fte)
function getTotalEmployeesCount(batch) {
    if (!batch) return 0;
    if (Array.isArray(batch.employees)) return batch.employees.length;
    try {
        if (batch.employee_id) {
            const ids = api.parseEmployeeIds(batch.employee_id);
            if (Array.isArray(ids)) return ids.length;
        }
    } catch {}
    const fact = Number(batch.fact_fte);
    if (Number.isFinite(fact) && fact > 0) return fact;
    const planned = Number(batch.planned_fte);
    if (Number.isFinite(planned) && planned > 0) return planned;
    return 0;
}

// Approved counts helper
function getApprovedInfo(batch) {
    if (!batch) return { count: 0, total: 0 };
    const stage = ((batch.stage || batch.status) || '').toLowerCase();
    const total = getTotalEmployeesCount(batch);
    if (!Array.isArray(batch.employees)) {
        // Employees not loaded yet: Completed/Done => everyone approved, otherwise 0
        const count = (stage === 'completed' || stage === 'done') ? total : 0;
        return { count, total };
    }
    const emps = batch.employees;
    const count = emps.reduce((acc, e) => acc + (state.employeeStatuses[e.employee_id] === 'approved' ? 1 : 0), 0);
    return { count, total };
}

// Unreviewed (neither approved nor rejected)
function getUnreviewedInfo(batch) {
    if (!batch) return { count: 0, total: 0 };
    const stage = ((batch.stage || batch.status) || '').toLowerCase();
    const total = getTotalEmployeesCount(batch);
    if (!Array.isArray(batch.employees)) {
        // Not loaded: Completed/Done => 0, else all need review
        const count = (stage === 'completed' || stage === 'done') ? 0 : total;
        return { count, total };
    }
    const emps = batch.employees;
    const count = emps.reduce((acc, e) => {
        const st = state.employeeStatuses[e.employee_id];
        return acc + ((st !== 'approved' && st !== 'rejected') ? 1 : 0);
    }, 0);
    return { count, total };
}

// Sum of unreviewed employees across all batches
function getTotalUnreviewedCount() {
    try {
        return state.batches.reduce((sum, b) => sum + (getUnreviewedInfo(b).count || 0), 0);
    } catch {
        return 0;
    }
}

// Reviewed (approved or rejected)
function getReviewedInfo(batch) {
    if (!batch) return { count: 0, total: 0 };
    const total = getTotalEmployeesCount(batch);
    const stage = ((batch.stage || batch.status) || '').toLowerCase();
    if (!Array.isArray(batch.employees)) {
        const count = (stage === 'completed' || stage === 'done') ? total : 0;
        return { count, total };
    }
    const emps = batch.employees;
    const count = emps.reduce((acc, e) => {
        const st = state.employeeStatuses[e.employee_id];
        return acc + ((st === 'approved' || st === 'rejected') ? 1 : 0);
    }, 0);
    return { count, total };
}

// Update only parts of the batch card to avoid hover re-trigger
function updateBatchCardUI(batch) {
    const card = document.querySelector(`[data-batch-id="${batch.id}"]`);
    if (!card) return;

    const approvedInfo = getApprovedInfo(batch);
    const unreviewedInfo = getUnreviewedInfo(batch);
    // Progress reflects approved only
    const progress = utils.calculateProgress(approvedInfo.count, approvedInfo.total);
    const progressColors = utils.getProgressColor(progress);

    // Desktop grid: target the values row (second .batch-data-grid inside .batch-data-desktop)
    const desktopGrids = card.querySelectorAll('.batch-data-desktop .batch-data-grid');
    const valuesGrid = desktopGrids && desktopGrids[1];
    if (valuesGrid) {
        const values = valuesGrid.querySelectorAll('.batch-data-value');
        // Column order: [Stage badge(not .batch-data-value)], Planned date(0), Planned employees(1), Fact date(2), Approved(3), Unreviewed(4)
        // But since Stage is a badge without class, values[] indexes shift by 1: indexes 0..4 map to cols 2..6
        // Approved is index 3, Unreviewed is index 4
        if (values[3]) values[3].textContent = `${approvedInfo.count} of ${approvedInfo.total} approved`;
        if (values[4]) values[4].textContent = (unreviewedInfo.count ?? 0);
    }

    // Mobile Approved employees
    const mobileApprovedVal = card.querySelector('.batch-data-mobile .batch-data-item:nth-child(2) .batch-data-value');
    if (mobileApprovedVal) {
        mobileApprovedVal.textContent = `${approvedInfo.count} of ${approvedInfo.total} approved`;
    }

    // Desktop Unreviewed is handled above via values[4]

    // Mobile badge: update unreviewed count
    const mobileBadges = card.querySelector('.batch-mobile-badges');
    if (mobileBadges) {
        mobileBadges.innerHTML = `
            ${templates.badge(batch.stage || 'Unknown', batch.stage)}
            ${templates.badge(`Unreviewed Staff: ${unreviewedInfo.count ?? '—'}`, 'pending')}
        `;
    }

    // Progress bars width
    card.querySelectorAll('.progress-fill').forEach(el => {
        el.style.width = `${progress}%`;
        el.style.backgroundColor = progressColors.bg;
    });

    // Progress text (desktop and mobile percent)
    const pText = card.querySelector('.batch-progress-text');
    if (pText) {
        pText.textContent = `${progress}%`;
        pText.style.color = progressColors.text;
    }
    const mPercent = card.querySelector('.batch-mobile-percent');
    if (mPercent) {
        mPercent.textContent = `${progress}%`;
        mPercent.style.color = progressColors.text;
    }

    // Expanded section
    const expanded = card.querySelector('.batch-expanded');
    if (expanded) {
        expanded.outerHTML = templates.expandedSection(batch);
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
    
    const next = state.selectedCard === batchId ? null : batchId;
    state.selectedCard = next;
    state.activeTab = 'all';
    renderApp();
    if (next) {
        const batch = state.batches.find(b => b.id === next);
        if (batch && typeof batch.employees === 'undefined') {
            loadEmployeesForBatch(batch);
        }
    }
};

window.handleToggleBatch = function(event, batchId) {
    event.preventDefault();
    event.stopPropagation();
    
    const next = state.selectedCard === batchId ? null : batchId;
    state.selectedCard = next;
    state.activeTab = 'all';
    renderApp();
    if (next) {
        const batch = state.batches.find(b => b.id === next);
        if (batch && typeof batch.employees === 'undefined') {
            loadEmployeesForBatch(batch);
        }
    }
};

window.handleEmployeeDecision = function(employeeId, status) {
    // Prevent changing decisions in completed/done batches
    const batchId = state.selectedCard;
    let isLocked = false;
    if (batchId) {
        const batch = state.batches.find(b => b.id === batchId);
        const stage = ((batch && (batch.stage || batch.status)) || '').toLowerCase();
        isLocked = stage === 'completed' || stage === 'done';
    }

    if (isLocked) {
        const current = state.employeeStatuses[employeeId];
        // In locked batches, do not allow resetting or changing away from approved
        if (status === 'null' || (current === 'approved' && status !== 'approved')) {
            return; // ignore any attempt to cancel/override approval
        }
    }

    if (status === 'null') {
        delete state.employeeStatuses[employeeId];
    } else {
        state.employeeStatuses[employeeId] = status;
    }
    
    // Обновляем только содержимое карточки, чтобы не триггерить hover-анимацию
    const currentId = state.selectedCard;
    if (currentId) {
        const batch = state.batches.find(b => b.id === currentId);
        if (batch) updateBatchCardUI(batch);
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
        let batches = cacheGet(cacheKeyBatches());
        if (!batches) {
            // 1) Try fast summary
            const summary = await api.getBatchesSummary();
            // If summary unexpectedly empty, fallback to full fetch to keep page alive
            if (!summary || summary.length === 0) {
                console.warn('Onboarding summary empty; falling back to full fetch');
                batches = await api.getBatchesWithEmployees();
            } else {
                batches = summary;
            }
            cacheSet(cacheKeyBatches(), batches);
        } else {
            console.log('⚡ Using cached batches');
        }

        // Normalize
        state.batches = batches.map((batch, index) => ({
            ...batch,
            id: batch.id || batch.batch_id || index + 1,
            // If employees not included (summary path) — lazy load later
            employees: Array.isArray(batch.employees) ? batch.employees : undefined
        }));
        // Auto-approve employees for completed batches if employees are already attached
        state.batches.forEach(b => {
            if (Array.isArray(b.employees) && b.employees.length > 0) {
                autoApproveBatchEmployees(b);
            }
        });
        state.loading = false;
    } catch (error) {
        console.error('❌ Error loading data:', error);
        state.loading = false;
        const mainElement = document.getElementById('onboardingRoot');
        if (mainElement) {
            mainElement.innerHTML = `
                <div class="empty-state">
                    ${icons.alertCircle}
                    <p class="empty-text">Failed to load data</p>
                    <p class="empty-subtext">${error.message}</p>
                    <button class="btn btn-view" onclick="location.reload()">Retry</button>
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
