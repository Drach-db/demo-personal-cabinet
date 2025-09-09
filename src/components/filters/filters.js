// Shared Filters Row (Team + Schedules)
// Returns HTML string with standardized search + 3 dropdowns + results counter
// Expects window-level handlers: updateSearch, clearSearch, toggleDropdown, toggleFilter, clearFilter, clearAllFilters

export function buildFiltersRowHTML(params) {
  const {
    state, // { searchTerm, filters: {project,stage,position}, open: {project,stage,position} }
    options, // { projects:[], stages:[], positions:[] }
    count, // { filtered, total }
    placeholder = 'Search employees by name, position, or project...'
  } = params;

  const st = state || {};
  const filters = st.filters || { project: [], stage: [], position: [] };
  const open = st.open || { project: false, stage: false, position: false };

  const ICONS = {
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>',
    briefcase: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
    userCheck: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>',
    award: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
    chevronDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>',
    x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
  };

  const dd = (type, label, list, selected, isOpen) => {
    const icon = type === 'project' ? ICONS.briefcase : type === 'stage' ? ICONS.userCheck : ICONS.award;
    const selCount = selected.length;
    const items = (list || []).map(option => `
      <label class="dropdown-item">
        <input type="checkbox" ${selected.includes(option) ? 'checked' : ''}
               onchange="window.toggleFilter('${option}', 'filter${type.charAt(0).toUpperCase()+type.slice(1)}')" />
        <span class="dropdown-item-dot" style="background-color: ${type === 'project' ? '#3b82f6' : type === 'stage' ? '#22c55e' : '#8b5cf6'}"></span>
        <span class="dropdown-item-label">${option}</span>
      </label>
    `).join('');

    return `
      <div class="dropdown-container">
        <div style="position: relative;">
          <div class="dropdown-icon">${icon}</div>
          <button class="dropdown-trigger" onclick="window.toggleDropdown('${type}')">
            <span class="dropdown-text">${selCount === 0 ? `All ${label}` : `${selCount} Selected`}</span>
          </button>
          ${selCount > 0 ? `<button class="dropdown-clear" onclick="event.stopPropagation(); window.clearFilter('${type}')">${ICONS.x}</button>` : ''}
          <div class="dropdown-chevron">${ICONS.chevronDown}</div>
        </div>
        ${isOpen ? `<div class="dropdown-menu">${items}</div>` : ''}
      </div>
    `;
  };

  return `
    <div class="filters-row">
      <div class="search-container">
        <div class="search-icon">${ICONS.search}</div>
        <input type="text" class="search-input" placeholder="${placeholder}"
               value="${st.searchTerm || ''}" oninput="window.updateSearch(this.value)" />
        ${st.searchTerm ? `<button class="search-clear" onclick="window.clearSearch()">${ICONS.x}</button>` : ''}
      </div>

      <div class="filters-group">
        ${dd('project', 'Projects', options.projects || [], filters.project || [], open.project)}
        ${dd('stage', 'Stages', options.stages || [], filters.stage || [], open.stage)}
        ${dd('position', 'Positions', options.positions || [], filters.position || [], open.position)}
      </div>

      <div class="results-count">${count.filtered} of ${count.total}</div>
    </div>
  `;
}

