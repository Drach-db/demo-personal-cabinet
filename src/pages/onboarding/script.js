// Импортируем компоненты layout системы
import '../../components/layout/layout.js';
import '../../components/navbar/navbar.js';
import '../../components/header/header.js';
import api from './api.js';

// ========================================
// STATE MANAGEMENT
// ========================================
const state = {
    batches: [],
    selectedCard: null,
    loading: true,
    stats: {
        active: 0,
        onboarding: 0,
        terminated: 0,
        backup: 0
    }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

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
    const stageStr = (stage || '').toLowerCase();
    switch (stageStr) {
        case 'completed':
        case 'done': 
            return '#22c55e';
        case 'in progress': 
            return '#3b82f6';
        case 'pending':
        case 'planned': 
            return '#eab308';
        case 'cancelled': 
            return '#ef4444';
        default: 
            return '#6b7280';
    }
}

function getQualityColor(quality) {
    const qualityStr = (quality || '').toLowerCase();
    switch (qualityStr) {
        case 'met': return '#22c55e';
        case 'overfilled': return '#3b82f6';
        case 'underfilled': return '#eab308';
        default: return '#6b7280';
    }
}

function getEmployeeStatusColor(stage) {
    switch (stage) {
        case 'Active': return '#22c55e';
        case 'Onboarding': return '#eab308';
        case 'Terminated': return '#ef4444';
        default: return '#6b7280';
    }
}

function calculateProgress(fact_fte, planned_fte) {
    if (!fact_fte || !planned_fte || planned_fte === 0) return 0;
    return Math.min(100, Math.round((fact_fte / planned_fte) * 100));
}

function calculateCoreCount(employees) {
    return employees.filter(emp => emp.staffing_type === 'Core').length;
}

function calculateBackupCount(employees) {
    return employees.filter(emp => emp.staffing_type === 'Backup').length;
}

function calculateAvgEnglish(employees) {
    if (employees.length === 0) return 0;
    const sum = employees.reduce((acc, emp) => acc + (emp.english_level || 0), 0);
    return Math.round(sum / employees.length);
}

function getProgressColor(progress) {
    if (progress >= 90) return '#22c55e';
    if (progress >= 70) return '#65a30d';
    if (progress >= 50) return '#ca8a04';
    if (progress >= 30) return '#ea580c';
    return '#6b7280';
}

// ========================================
// STATISTICS
// ========================================

function calculateStats() {
    const stats = {
        active: 0,
        onboarding: 0,
        terminated: 0,
        backup: 0
    };
    
    state.batches.forEach(batch => {
        batch.employees.forEach(employee => {
            if (employee.stage === 'Active') stats.active++;
            if (employee.stage === 'Onboarding') stats.onboarding++;
            if (employee.stage === 'Terminated') stats.terminated++;
            if (employee.staffing_type === 'Backup') stats.backup++;
        });
    });
    
    state.stats = stats;
    updateStatsUI();
}

function updateStatsUI() {
    document.getElementById('statActive').textContent = state.stats.active;
    document.getElementById('statOnboarding').textContent = state.stats.onboarding;
    document.getElementById('statTerminated').textContent = state.stats.terminated;
    document.getElementById('statBackup').textContent = state.stats.backup;
}

// ========================================
// RENDER FUNCTIONS
// ========================================

function renderBatchCard(batch) {
    const isSelected = state.selectedCard === batch.id;
    const progress = calculateProgress(batch.fact_fte, batch.planned_fte);
    
    return `
        <div class="batch-card ${isSelected ? 'selected' : ''}" 
             data-batch-id="${batch.id}"
             onclick="toggleCard(${batch.id})">
            
            <!-- Header -->
            <div class="batch-header">
                <div class="batch-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <circle cx="18" cy="18" r="3" fill="none"></circle>
                    </svg>
                </div>
                <h3 class="batch-title">
                    BATCH #${batch.batch_id} – ${batch.name_batch} | 
                    <span class="batch-project">${batch.project}</span>
                </h3>
            </div>

            <!-- Data Table -->
            <div class="batch-data">
                <div class="data-grid">
                    <div class="data-label">Planned date:</div>
                    <div class="data-label">Planned FTE:</div>
                    <div class="data-label">Fact date:</div>
                    <div class="data-label">Fact FTE:</div>
                    <div class="data-label">Stage</div>
                    <div class="data-label">Quality</div>
                </div>
                
                <div class="data-grid">
                    <div class="data-value">${batch.planned_date || '—'}</div>
                    <div class="data-value">${batch.planned_fte || '—'}</div>
                    <div class="data-value">${batch.fact_date || '—'}</div>
                    <div class="data-value">${batch.fact_fte || '—'}</div>
                    <div class="data-value">
                        <span class="badge" style="background-color: ${getStageColor(batch.stage)}20; color: ${getStageColor(batch.stage)}">
                            ${batch.stage}
                        </span>
                    </div>
                    <div class="data-value">
                        <span class="badge" style="background-color: ${getQualityColor(batch.quality)}20; color: ${getQualityColor(batch.quality)}">
                            ${batch.quality || '—'}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Progress Bar -->
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%; background-color: ${getProgressColor(progress)}"></div>
            </div>

            <!-- Footer -->
            <div class="batch-footer">
                <div class="team-stats">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                    <span>
                        ${calculateCoreCount(batch.employees)} Core + 
                        ${calculateBackupCount(batch.employees)} Backup | 
                        Avg English: ${calculateAvgEnglish(batch.employees)}%
                    </span>
                </div>
                
                <button class="view-button ${isSelected ? 'active' : ''}"
                        onclick="event.stopPropagation(); toggleCard(${batch.id})">
                    <span>${isSelected ? 'Hide Details' : 'View Details'}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${isSelected ? 
                            '<polyline points="18 15 12 9 6 15"></polyline>' :
                            '<polyline points="6 9 12 15 18 9"></polyline>'}
                    </svg>
                </button>
                
                <span class="progress-text" style="color: ${getProgressColor(progress)}">
                    ${progress}% Complete
                </span>
            </div>

            ${isSelected ? renderEmployees(batch) : ''}
        </div>
    `;
}

function renderEmployees(batch) {
    if (!batch.employees || batch.employees.length === 0) {
        return `
            <div class="employees-section">
                <h4 class="employees-title">Assigned Team Members (0)</h4>
                <div class="empty-employees">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                    <p>No team members assigned yet</p>
                </div>
            </div>
        `;
    }

    const employeesHTML = batch.employees.map(emp => {
        const avatarColor = getAvatarColor(emp.full_name);
        return `
            <div class="employee-item">
                <div class="employee-avatar-wrapper">
                    ${emp.avatar ? 
                        `<img src="${emp.avatar}" alt="${emp.full_name}" class="employee-avatar">` :
                        `<div class="employee-avatar" style="background: ${avatarColor.bg}">
                            <span style="color: ${avatarColor.text}">
                                ${emp.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                        </div>`
                    }
                    <div class="status-dot" style="background-color: ${getEmployeeStatusColor(emp.stage)}"></div>
                </div>
                
                <div class="employee-info">
                    <div class="employee-name">
                        ${emp.full_name}
                        <span class="employee-position">– ${emp.position}</span>
                    </div>
                    
                    <div class="employee-skills">
                        <span>English: <strong style="color: #7c3aed">${emp.english_level}%</strong></span>
                        <span class="separator">|</span>
                        <span>Typing: <strong style="color: #7c3aed">${emp.typing_speed} WPM</strong></span>
                    </div>
                    
                    <div class="employee-details">
                        <span>BPO Experience: <strong style="color: #4f46e5">${emp.bpo_experience} years</strong></span>
                        <div class="employee-badges">
                            <span class="badge" style="background-color: ${getEmployeeStatusColor(emp.stage)}20; color: ${getEmployeeStatusColor(emp.stage)}">
                                ${emp.stage}
                            </span>
                            ${emp.staffing_type === 'Backup' ? 
                                '<span class="badge" style="background-color: #f1f5f920; color: #475569">Backup</span>' : ''}
                        </div>
                    </div>
                    
                    <div class="employee-actions">
                        <span class="action-label">Assessment Results:</span>
                        <div class="action-buttons">
                            <button onclick="window.open('${emp.english_proficiency_test}', '_blank')" 
                                    class="btn-view">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View
                            </button>
                            <button onclick="downloadReport('${emp.english_proficiency_test}', '${emp.full_name}')" 
                                    class="btn-download">
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
            </div>
        `;
    }).join('');

    return `
        <div class="employees-section">
            <h4 class="employees-title">Assigned Team Members (${batch.employees.length})</h4>
            <div class="employees-list">
                ${employeesHTML}
            </div>
        </div>
    `;
}

function renderBatches() {
    const batchesList = document.getElementById('batchesList');
    const emptyState = document.getElementById('emptyState');

    if (state.batches.length === 0) {
        batchesList.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        batchesList.style.display = 'grid';
        emptyState.style.display = 'none';
        batchesList.innerHTML = state.batches.map(batch => renderBatchCard(batch)).join('');
    }
}

// ========================================
// EVENT HANDLERS
// ========================================

function toggleCard(batchId) {
    state.selectedCard = state.selectedCard === batchId ? null : batchId;
    renderBatches();
}

function downloadReport(url, name) {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/\s+/g, '-').toLowerCase()}-test-results.pdf`;
    link.click();
}

// Make functions globally available
window.toggleCard = toggleCard;
window.downloadReport = downloadReport;

// ========================================
// INITIALIZATION
// ========================================

async function initialize() {
    try {
        console.log('🚀 Инициализация страницы Onboarding...');
        
        // Показываем загрузку
        document.getElementById('loadingScreen').style.display = 'flex';
        document.getElementById('mainContainer').style.display = 'none';
        
        // Загружаем данные
        const batches = await api.getBatchesWithEmployees();
        state.batches = batches;
        
        // Рассчитываем статистику
        calculateStats();
        
        // Рендерим батчи
        renderBatches();
        
        // Скрываем загрузку
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'block';
        
        console.log('✅ Страница загружена успешно');
        
    } catch (error) {
        console.error('❌ Ошибка при инициализации:', error);
        
        document.getElementById('loadingScreen').innerHTML = `
            <div class="loading-content">
                <div style="text-align: center;">
                    <svg class="empty-icon" style="width: 64px; height: 64px; color: #ef4444;" 
                         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h3 style="font-size: 18px; color: #111827; margin: 16px 0;">
                        Error loading data
                    </h3>
                    <p style="color: #6b7280; margin-bottom: 16px;">
                        ${error.message || 'Failed to connect to database'}
                    </p>
                    <button onclick="location.reload()" 
                            style="padding: 8px 16px; background: #cc6633; color: white; 
                                   border: none; border-radius: 6px; cursor: pointer;">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', initialize);