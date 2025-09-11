
import '../../components/layout/layout.js';
import '../../components/navbar/navbar.js';
import '../../components/header/header.js';


        // NO MODALS VERSION 4.0
        
        // Constants & Config - SINGLE SOURCE OF TRUTH для всех цветов статусов
        const STATUS_CONFIG = {
            active: ['#22c55e', 'Active'], inactive: ['#f97316', 'Inactive ⚠️'], break: ['#3b82f6', 'Break'],
            lunch: ['#3b82f6', 'Lunch'], missed: ['#dc2626', 'Overtime'], future: ['#f3f4f6', 'Future'],
            off: ['#f3f4f6', 'Off']
        };
        
        const MOCK_DATA = {
            schedule: [{ 
                name: 'John D.', 
                role: 'Chat', 
                shift: { start: '10:00', end: '18:00' },
                shift_projected: { start: '10:00', end: '18:00' }
            }],
            events: [
                { name: 'John D.', time: '10:08', status: 'active' }, { name: 'John D.', time: '12:00', status: 'break' },
                { name: 'John D.', time: '12:15', status: 'lunch' }, { name: 'John D.', time: '13:00', status: 'active' },
                { name: 'John D.', time: '14:30', status: 'break' }, { name: 'John D.', time: '15:00', status: 'active' },
                { name: 'John D.', time: '15:25', status: 'inactive' }
            ]
        };
        
        // ЧИСТОЕ СОСТОЯНИЕ БЕЗ МОДАЛЬНЫХ ПОЛЕЙ
        let state = { 
            expanded: null, 
            hour: null, 
            screenshot: 0, 
            notifs: [], 
            tab: 'unread', 
            activeHour: null, 
            activeMember: null, 
            loadedScreenshots: 20, 
            mobileTab: 'status',
            activeMetricSlide: 0 
        };
        
        // Утилиты
        const isMobile = () => window.innerWidth <= 1023;
        const h = (tag, cls = '', style = '', content = '') => `<${tag}${cls ? ` class="${cls}"` : ''}${style ? ` style="${style}"` : ''}>${content}</${tag}>`;
        const timeToMinutes = time => { const [h, m] = time.split(':').map(Number); return h * 60 + m; };
        const formatTime12Hour = time24 => {
            const [hours, minutes] = time24.split(':').map(Number);
            const period = hours >= 12 ? 'PM' : 'AM';
            const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
            return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
        };
        
        // Функции для метрик слайдера
        const updateMetricDots = () => {
            const dots = document.querySelectorAll('.metric-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === state.activeMetricSlide);
            });
        };
        
        const scrollToMetricSlide = (index) => {
            const container = document.querySelector('.metrics-mobile');
            if (!container) return;
            
            const cards = container.querySelectorAll('.metric-card');
            if (!cards[index]) return;
            
            state.activeMetricSlide = index;
            
            const cardWidth = cards[0].offsetWidth + 16;
            container.scrollTo({
                left: cardWidth * index,
                behavior: 'smooth'
            });
            
            updateMetricDots();
        };
        
        const handleMetricScroll = () => {
            const container = document.querySelector('.metrics-mobile');
            if (!container) return;
            
            const cards = container.querySelectorAll('.metric-card');
            const cardWidth = cards[0].offsetWidth + 16;
            const scrollLeft = container.scrollLeft;
            const newActiveSlide = Math.round(scrollLeft / cardWidth);
            
            if (newActiveSlide !== state.activeMetricSlide) {
                state.activeMetricSlide = Math.max(0, Math.min(2, newActiveSlide));
                updateMetricDots();
            }
        };

        // Helper: Calculate actual worked hours from timeline (FACT)
        const calculateFactHours = (members) => {
            let totalMinutes = 0;
            members.forEach(member => {
                if (member.timeline) {
                    for (let i = 0; i < 1440; i++) {
                        if (member.timeline[i] === 'active') {
                            totalMinutes++;
                        }
                    }
                }
            });
            return Math.round(totalMinutes / 60 * 100) / 100;
        };
        
        // Helper: Universal function for calculating hours
        const calculateHours = (schedule, field) => {
            let totalHours = 0;
            schedule.forEach(emp => {
                if (emp[field]) {
                    const start = timeToMinutes(emp[field].start);
                    const end = timeToMinutes(emp[field].end);
                    totalHours += (end - start) / 60;
                }
            });
            return totalHours;
        };
        
        // Helper: Calculate costs
        const calculateCosts = () => {
            const {members} = getTeamData();

            // (reverted) — remove notification expand toggle
            const hourlyRate = 15;
            
            const factHours = calculateFactHours(members);
            const projectedHours = calculateHours(MOCK_DATA.schedule, 'shift_projected');
            const plannedHours = calculateHours(MOCK_DATA.schedule, 'shift');
            
            return {
                today: {
                    fact: { hours: factHours, cost: Math.round(factHours * hourlyRate) },
                    projected: { hours: projectedHours, cost: Math.round(projectedHours * hourlyRate) },
                    planned: { hours: plannedHours, cost: Math.round(plannedHours * hourlyRate) }
                },
                month: {
                    fact: { hours: factHours, cost: Math.round(factHours * hourlyRate) },
                    projected: { hours: projectedHours, cost: Math.round(projectedHours * hourlyRate) },
                    planned: { hours: plannedHours, cost: Math.round(plannedHours * hourlyRate) }
                }
            };
        };
        
        // Helper: Format screenshot time
        const formatScreenshotTime = (hour, minute) => {
            return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        };
        
        // Helper: Get screenshot visual config by status
        const getScreenshotVisual = (status) => {
            const configs = {
                active: { icon: '💻', bg: '#dcfce7', label: 'Active' },
                inactive: { icon: '📷', bg: '#f3f4f6', label: 'Inactive' },
                break: { icon: '☕', bg: '#dbeafe', label: 'Break' },
                lunch: { icon: '🍽️', bg: '#cffafe', label: 'Lunch' },
                missed: { icon: '⚠️', bg: '#fee2e2', label: 'Missed' }
            };
            return configs[status] || configs.active;
        };
        
        // Helper: Check if member is active at specific minute
        const isActiveAtMinute = (member, absoluteMinute) => {
            return member && member.timeline && member.timeline[absoluteMinute] === 'active';
        };
        
        // Helper: Get hourly screenshots for a member
        const getHourlyScreenshots = (member, hour) => {
            const screenshots = [];
            let carouselIndex = 0;
            
            for (let i = 0; i < 30; i++) {
                const minute = i * 2;
                const absoluteMinute = hour * 60 + minute;
                if (isActiveAtMinute(member, absoluteMinute)) {
                    screenshots.push({
                        index: carouselIndex,
                        originalIndex: i,
                        minute,
                        absoluteMinute,
                        time: formatScreenshotTime(hour, minute),
                        status: 'active'
                    });
                    carouselIndex++;
                }
            }
            return screenshots;
        };
        
        // Helper: Render screenshot card HTML - НЕТ МОДАЛЬНЫХ ФУНКЦИЙ
        const renderScreenshotCard = (screenshot, options = {}) => {
            const { isThumb = false, isActive = false, showMember = true } = options;
            const visual = getScreenshotVisual(screenshot.status);
            const borderColor = isActive ? 'var(--primary)' : 'rgba(0,0,0,0.1)';
            
            const containerStyle = isThumb 
                ? `border:2px solid ${borderColor};border-radius:0.5rem;cursor:pointer;overflow:hidden;min-width:clamp(6.5rem, 9vw, 7.5rem);`
                : `padding:0.75rem;background:var(--light);border:2px solid ${borderColor};border-radius:0.5rem;cursor:pointer;min-width:clamp(8.125rem, 10vw, 8.75rem);height:clamp(8.75rem, 12vw, 10rem);display:flex;flex-direction:column;text-align:center;`;
            
            return `<div class="${isThumb ? 'screenshot-thumb' : 'screenshot-card'}" ${isThumb ? `data-index="${screenshot.index || 0}"` : ''} style="${containerStyle}">
                <div style="aspect-ratio:16/10;background:${visual.bg};display:flex;align-items:center;justify-content:center;font-size:clamp(1.75rem, 3vw, 2rem);${isThumb ? '' : 'margin-bottom:0.5rem;flex:1;'}border-radius:0.5rem;position:relative;overflow:hidden;">
                    ${visual.icon}
                    <div style="position:absolute;bottom:0.25rem;right:0.25rem;background:rgba(0,0,0,0.8);color:white;padding:0.125rem 0.375rem;border-radius:0.1875rem;font-size:clamp(0.5rem, 1vw, 0.625rem);font-weight:600;">${screenshot.time}</div>
                </div>
                ${!isThumb && showMember ? `<div class="value" style="font-size:clamp(0.6875rem, 1.2vw, 0.8125rem);margin-bottom:0.5rem;">${screenshot.member}</div>` : ''}
                ${!isThumb && showMember ? `<div class="badge" style="--c:var(--success);justify-content:center;"><span style="color:var(--c)">●</span><span style="color:var(--c)">${visual.label}</span></div>` : ''}
            </div>`;
        };
        
        // Helper: Render screenshot preview HTML  
        const renderScreenshotPreview = (member, hour, minute) => {
            const absoluteMinute = hour * 60 + minute;
            const status = member.timeline[absoluteMinute] || 'inactive';
            const visual = getScreenshotVisual(status);
            const time = formatScreenshotTime(hour, minute);
            
            return `<div style="border-radius:0.5rem;border:2px solid rgba(0,0,0,0.1);width:100%;height:clamp(32rem, 45vw, 40rem);display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;background:${visual.bg};">
                <div style="font-size:clamp(2.5rem, 5vw, 3rem);margin-bottom:0.5rem;">${visual.icon}</div>
                <div style="background:rgba(0,0,0,0.7);color:white;padding:0.375rem 0.75rem;border-radius:0.375rem;font-size:clamp(0.75rem, 1.5vw, 0.875rem);font-weight:600;">${visual.label}</div>
                <div style="position:absolute;bottom:0.75rem;right:0.75rem;background:rgba(0,0,0,0.7);color:white;padding:0.25rem 0.5rem;border-radius:0.25rem;font-size:clamp(0.6875rem, 1.2vw, 0.75rem);">${time}</div>
            </div>`;
        };
        
        // Helper: Find first active screenshot in hour
        const findFirstActiveScreenshot = (member, hour) => {
            const screenshots = getHourlyScreenshots(member, hour);
            return screenshots.length > 0 ? 0 : 0;
        };
        
        // Helper: Find first active hour for member
        const findFirstActiveHour = (member) => {
            if (!member || !member.timeline) return 10;
            for (let h = 0; h < 24; h++) {
                if (Array.from({length: 60}, (_, i) => member.timeline[h * 60 + i]).some(s => s === 'active')) return h;
            }
            return 10;
        };
        
        // Helper: Check if hour has any activity
        const hasActivityInHour = (member, hour) => {
            if (!member || !member.timeline) return false;
            return Array.from({length: 60}, (_, i) => member.timeline[hour * 60 + i])
                .some(s => !['off', 'not-started', 'future'].includes(s));
        };
        
        // Helper: Unified timeline interaction handler
        const handleTimelineInteraction = (memberName, hour = null) => {
            const {members} = getTeamData();
            const member = members.find(m => m.name === memberName);
            if (!member) return;
            
            const hasActivity = hour !== null ? hasActivityInHour(member, hour) : true;
            
            if (!hasActivity) {
                if (state.expanded === memberName) {
                    state.expanded = state.activeHour = state.activeMember = null;
                } else {
                    openCardAtFirstActiveHour(memberName);
                }
            } else if (hour === null) {
                if (state.expanded === memberName) {
                    state.expanded = state.activeHour = state.activeMember = null;
                } else {
                    openCardAtFirstActiveHour(memberName);
                }
            } else {
                openCardAtHour(memberName, hour);
            }
            
            rerenderPreservingScroll();
            
            if (state.expanded === memberName) {
                scrollToScreenshots(memberName);
                if (hasActivity && hour !== null) {
                    scrollToActiveScreenshot(memberName);
                }
            }
        };
        
        // Helper: Open card at specific hour
        const openCardAtHour = (memberName, hour) => {
            const {members} = getTeamData();
            const member = members.find(m => m.name === memberName);
            if (!member) return;
            
            state.expanded = memberName;
            state.hour = state.activeHour = hour;
            state.activeMember = memberName;
            state.screenshot = findFirstActiveScreenshot(member, hour);
        };
        
        // Helper: Open card at first active hour
        const openCardAtFirstActiveHour = (memberName) => {
            const {members} = getTeamData();
            const member = members.find(m => m.name === memberName);
            if (!member) return;
            
            const firstActiveHour = findFirstActiveHour(member);
            openCardAtHour(memberName, firstActiveHour);
        };
        
        // Helper: Unified scroll function
        const scrollWithDelay = (callback, delay = 300) => {
            setTimeout(callback, delay);
        };
        
        // Helper: Scroll to SCREENSHOTS section
        const scrollToScreenshots = (memberName) => {
            scrollWithDelay(() => {
                const expandedSection = document.querySelector(`[data-member="${memberName}"] + .expanded`);
                if (expandedSection) {
                    const screenshotsLabel = expandedSection.querySelector('.label');
                    if (screenshotsLabel && screenshotsLabel.textContent.includes('SCREENSHOTS')) {
                        screenshotsLabel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        };
        
        // Helper: Scroll carousel to active screenshot
        const scrollToActiveScreenshot = (memberName) => {
            scrollWithDelay(() => {
                const carousel = document.querySelector(`[data-carousel="${memberName}"]`);
                if (!carousel) return;
                
                const activeThumb = carousel.querySelector('.screenshot-thumb[data-index="' + state.screenshot + '"]');
                if (!activeThumb) return;
                
                const carouselRect = carousel.getBoundingClientRect();
                const thumbRect = activeThumb.getBoundingClientRect();
                
                const isVisible = thumbRect.left >= carouselRect.left && 
                                thumbRect.right <= carouselRect.right;
                
                if (!isVisible) {
                    const scrollLeft = activeThumb.offsetLeft - carousel.offsetLeft - (carouselRect.width / 2) + (thumbRect.width / 2);
                    carousel.scrollTo({ 
                        left: Math.max(0, scrollLeft), 
                        behavior: 'smooth' 
                    });
                }
            }, 400);
        };
        
        // Helper: Open expanded card
        const openCard = (memberName, hour = null) => {
            const targetHour = hour !== null ? hour : findFirstActiveHour(getTeamData().members.find(m => m.name === memberName));
            openCardAtHour(memberName, targetHour);
        };
        
        // Helper: Toggle card (unified for all scenarios)
        const toggleCard = (memberName) => {
            if (state.expanded === memberName) {
                state.expanded = state.activeHour = state.activeMember = null;
            } else {
                openCard(memberName);
            }
            rerenderPreservingScroll();
            if (state.expanded === memberName) {
                scrollToScreenshots(memberName);
                scrollToActiveScreenshot(memberName);
            }
        };
        
        // Components
        const Icon = type => {
            const icons = {
                users: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
                clock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5 11h-6V8h2v3h4v2z"/></svg>`,
                dollar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
                activity: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
                alert: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
                camera: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 2l1.17 1H15l1.17-1H21c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h5zm3 15c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0-1.8c-1.77 0-3.2-1.43-3.2-3.2s1.43-3.2 3.2-3.2 3.2 1.43 3.2 3.2-1.43 3.2-3.2 3.2z"/></svg>`
            };
            return icons[type] || icons.activity;
        };
        
        // Helper: Generate HTML element with common pattern
        const createBadge = (status) => {
            const config = STATUS_CONFIG[status] || STATUS_CONFIG.active;
            return `<div class="badge" style="--c:${config[0]}"><span style="color:var(--c)">●</span><span style="color:var(--c)">${config[1]}</span></div>`;
        };
        
        const component = (type, data) => {
            const templates = {
                iconBox: `<div class="icon-box" style="background:rgba(204,102,51,0.15);border:1px solid rgba(204,102,51,0.2);color:#cc6633">${Icon(data.icon)}</div>`,
                badge: createBadge(data.status),
                metric: `<div class="text-center"><div style="font-size:${data.size||'16px'};font-weight:bold;color:${data.color||'var(--gray)'}">${data.value}</div>${data.label ? `<div style="font-size:12px;color:var(--gray);">${data.label}</div>` : ''}</div>`,
                progress: `<div class="progress" style="--c:${data.color}"><div class="progress-fill" style="width:${data.value}%"></div></div>`
            };
            return templates[type] || '';
        };
        
        // Data Processing
        const generateTimeline = (name, events, schedule) => {
            const timeline = new Array(1440).fill('off');
            const emp = schedule.find(s => s.name === name);
            if (!emp) return timeline;
            
            const shiftStart = timeToMinutes(emp.shift.start), shiftEnd = timeToMinutes(emp.shift.end), currentTime = 930;
            const employeeEvents = events.filter(e => e.name === name).map(e => ({...e, minute: timeToMinutes(e.time)})).sort((a,b) => a.minute - b.minute);
            const firstEvent = employeeEvents[0]?.minute;
            
            if (currentTime < shiftEnd) {
                for (let i = Math.max(currentTime + 1, shiftStart); i < shiftEnd; i++) {
                    timeline[i] = 'future';
                }
            }
            
            if (!firstEvent || firstEvent >= shiftStart + 30) {
                if (currentTime >= shiftStart + 30) {
                    for (let i = shiftStart; i <= Math.min(currentTime, shiftEnd - 1); i++) {
                        timeline[i] = 'missed';
                    }
                }
                return timeline;
            }
            
            if (firstEvent > shiftStart) {
                for (let i = shiftStart; i < firstEvent; i++) {
                    timeline[i] = 'missed';
                }
            }
            
            employeeEvents.forEach((event, i) => {
                const nextEvent = employeeEvents[i + 1]?.minute || Math.min(shiftEnd, currentTime + 1);
                const duration = nextEvent - event.minute;
                const overtimeLimit = event.status === 'break' ? 10 : event.status === 'lunch' ? 30 : null;
                
                for (let j = event.minute; j < nextEvent; j++) {
                    timeline[j] = overtimeLimit && duration > overtimeLimit && j >= event.minute + overtimeLimit ? 'missed' : event.status;
                }
            });
            
            return timeline;
        };
        
        const generateNotifications = () => {
            const notifications = [], currentTime = 930;
            
            MOCK_DATA.schedule.forEach(emp => {
                const shiftStart = timeToMinutes(emp.shift.start);
                const events = MOCK_DATA.events.filter(e => e.name === emp.name).map(e => ({...e, minute: timeToMinutes(e.time)})).sort((a,b) => a.minute - b.minute);
                const firstEvent = events[0]?.minute;
                
                if (currentTime >= shiftStart + 5) {
                    if (!firstEvent || firstEvent >= shiftStart + 30) {
                        [5, 15, 25].forEach(delay => {
                            const notifTime = shiftStart + delay;
                            if (notifTime <= currentTime) {
                                const time = `${Math.floor(notifTime/60)}:${(notifTime%60).toString().padStart(2,'0')}`;
                                notifications.push({
                                    id: `late-${emp.name}-${delay}`, time: formatTime12Hour(time), minute: notifTime, color: '#f97316',
                                    msg: `${emp.name} - ${delay < 30 ? `Is late for shift (${delay} minutes)` : 'Did not show up for shift (30+ minutes)'}`, read: false
                                });
                            }
                        });
                        if (!firstEvent && currentTime >= shiftStart + 30) {
                            const time = `${Math.floor((shiftStart + 30)/60)}:${((shiftStart + 30)%60).toString().padStart(2,'0')}`;
                            notifications.push({
                                id: `no-show-${emp.name}`, time: formatTime12Hour(time), minute: shiftStart + 30, color: '#dc2626',
                                msg: `${emp.name} - Did not show up for shift (30+ minutes)`, read: false
                            });
                        }
                    } else if (firstEvent > shiftStart + 5) {
                        const delay = firstEvent - shiftStart;
                        [5, 15, 25].filter(d => d < delay).forEach(d => {
                            const notifTime = shiftStart + d;
                            if (notifTime <= currentTime) {
                                const time = `${Math.floor(notifTime/60)}:${(notifTime%60).toString().padStart(2,'0')}`;
                                notifications.push({
                                    id: `late-${emp.name}-${d}`, time: formatTime12Hour(time), minute: notifTime, color: '#f97316',
                                    msg: `${emp.name} - Is late for shift (${d} minutes)`, read: false
                                });
                            }
                        });
                        notifications.push({
                            id: `arrived-${emp.name}`, time: formatTime12Hour(`${Math.floor(firstEvent/60)}:${(firstEvent%60).toString().padStart(2,'0')}`),
                            minute: firstEvent, color: '#22c55e', msg: `${emp.name} - Late employee started shift (${delay} min delay)`, read: false
                        });
                    }
                }
                
                events.forEach((event, i) => {
                    const nextEvent = events[i + 1]?.minute || currentTime + 1;
                    const duration = nextEvent - event.minute;
                    const limits = {break: 10, lunch: 30, inactive: 5};
                    const limit = limits[event.status];
                    
                    if (limit && duration > limit) {
                        const colors = {break: '#3b82f6', lunch: '#06b6d4', inactive: '#f97316'};
                        const labels = {break: 'extending break', lunch: 'extending lunch', inactive: 'inactive'};
                        const interval = event.status === 'inactive' ? 5 : 5;
                        
                        for (let overtime = 1; overtime <= duration - limit; overtime += interval) {
                            const notifTime = event.minute + limit + overtime;
                            if (notifTime <= currentTime) {
                                const time = `${Math.floor(notifTime/60)}:${(notifTime%60).toString().padStart(2,'0')}`;
                                const totalOvertime = Math.min(overtime + interval - 1, duration - limit);
                                notifications.push({
                                    id: `${event.status}-${emp.name}-${notifTime}`, time: formatTime12Hour(time), minute: notifTime,
                                    color: colors[event.status], read: false,
                                    msg: `${emp.name} - Employee is ${labels[event.status]} (${event.status === 'inactive' ? `no activity for ${limit + totalOvertime}` : `${totalOvertime} minutes overtime`})`
                                });
                            }
                        }
                    }
                });
            });
            
            return notifications.sort((a,b) => b.minute - a.minute);
        };
        
        const getTeamData = () => {
            const members = MOCK_DATA.schedule.map(emp => {
                const timeline = generateTimeline(emp.name, MOCK_DATA.events, MOCK_DATA.schedule);
                let status = timeline[930] || 'off';
                return {...emp, status, timeline};
            });
            
            const working = members.filter(m => ['active', 'break', 'inactive'].includes(m.status));
            const active = members.filter(m => m.status === 'active');
            
            return {
                members,
                coverage: { actual: working.length, planned: 1, pct: working.length * 100 },
                active: { count: active.length, total: members.length },
                status: {
                    active, available: members.filter(m => m.status === 'break'),
                    problems: members.filter(m => ['inactive', 'missed'].includes(m.status))
                }
            };
        };
        
        const generateScreenshots = () => {
            const {members} = getTeamData();
            const screenshots = [];
            
            members.forEach(member => {
                for (let minute = 0; minute < 930; minute += 2) {
                    if (isActiveAtMinute(member, minute)) {
                        const hour = Math.floor(minute / 60);
                        const min = minute % 60;
                        screenshots.push({
                            id: `${member.name}-${minute}`, 
                            member: member.name, 
                            role: member.role,
                            time: formatScreenshotTime(hour, min), 
                            minute, 
                            status: 'active',
                            visual: getScreenshotVisual('active')
                        });
                    }
                }
            });
            
            return screenshots.sort((a,b) => b.minute - a.minute);
        };
        
        const updateScreenshotPreview = () => {
            if (isMobile()) return;
            
            const container = document.querySelector('.screenshot-preview-container');
            if (!container) return;
            
            const {members} = getTeamData();
            const member = members.find(m => m.name === state.activeMember);
            if (!member) return;
            
            const hourScreenshots = getHourlyScreenshots(member, state.hour);
            if (hourScreenshots.length === 0) {
                if (container.parentElement) {
                    container.parentElement.style.display = 'none';
                }
                return;
            }
            
            const selectedScreenshot = hourScreenshots.find(s => s.index === state.screenshot);
            if (!selectedScreenshot) {
                state.screenshot = 0;
                const firstScreenshot = hourScreenshots[0];
                container.innerHTML = renderScreenshotPreview(member, state.hour, firstScreenshot.minute);
                return;
            }
            
            container.innerHTML = renderScreenshotPreview(member, state.hour, selectedScreenshot.minute);
        };
        
        // Helper: Render legend for timeline
        const renderLegend = (isMobile = false) => {
            const legendItems = Object.entries(STATUS_CONFIG)
                .filter(([key]) => !['lunch', 'future', 'off'].includes(key));
            
            if (isMobile) {
                // Мобильная версия - колонки с выравниванием
                return `<div style="padding:0.75rem 1rem;background:rgba(248,247,244,0.5);border-bottom:1px solid rgba(204,102,51,0.1);">
                    <div style="display:grid;grid-template-columns:repeat(${legendItems.length}, 1fr);gap:0.5rem;">
                        ${legendItems.map(([key, [color, label]]) => 
                            `<div style="display:flex;flex-direction:column;align-items:center;gap:0.375rem;">
                                <div style="width:12px;height:12px;background:${color};border-radius:2px;"></div>
                                <span style="font-size:0.625rem;color:var(--gray);text-align:center;">${label.replace(' ⚠️', '')}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>`;
            } else {
                // Desktop - горизонтально как было
                return `<div style="padding:0.75rem 1rem;background:rgba(248,247,244,0.5);border-bottom:1px solid rgba(204,102,51,0.1);display:flex;justify-content:center;gap:5rem;flex-wrap:wrap;">
                    ${legendItems.map(([key, [color, label]]) => 
                        `<div style="display:flex;align-items:center;gap:0.5rem;">
                            <span style="background:${color};color:white;padding:0.125rem 0.375rem;border-radius:0.125rem;font-size:0.625rem;">●</span>
                            <span style="font-size:0.75rem;">${label.replace(' ⚠️', '')}</span>
                        </div>`
                    ).join('')}
                </div>`;
            }
        };
        
        // Main Render Functions
        function createDesktopLayout() {
            const {members, coverage, active, status} = getTeamData();
            const costs = calculateCosts();
            
            const MetricCard = (icon, title, color, content) => {
                return h('div', 'p-6', '', 
                    h('div', 'flex items-center gap-3 mb-4', '', component('iconBox', {icon, color}) + h('h3', 'title', `color:${color}`, title)) + content);
            };
            
            let html = '';
            
            // Metrics
            html += '<div class="card"><div class="grid grid-3 divide-x">';
            
            // Cost Tracker
            html += MetricCard('dollar', 'COST TRACKER ($15/hr)', 'var(--primary)',
                [
                    {period: 'MONTH (January 2025)', data: costs.month},
                    {period: 'TODAY (Jan 10)', data: costs.today}
                ].map((item, i) => 
                    h('div', i ? 'mt-4' : '', '', h('div', 'label mb-2', '', item.period) +
                    h('div', 'flex justify-between', '', [
                        component('metric', {value: item.data.fact.cost.toString(), label: `fact (${item.data.fact.hours}h)`, size: i ? 'clamp(0.75rem, 1.3vw, 0.875rem)' : 'clamp(0.875rem, 1.5vw, 1rem)', color: 'var(--success)'}),
                        component('metric', {value: item.data.projected.cost.toString(), label: `projected (${item.data.projected.hours}h)`, size: i ? 'clamp(0.75rem, 1.3vw, 0.875rem)' : 'clamp(0.875rem, 1.5vw, 1rem)', color: 'var(--info)'}),
                        component('metric', {value: item.data.planned.cost.toString(), label: `plan (${item.data.planned.hours}h)`, size: i ? 'clamp(0.75rem, 1.3vw, 0.875rem)' : 'clamp(0.875rem, 1.5vw, 1rem)', color: 'var(--gray)'})
                    ].join('')))
                ).join(''));
            
            // Coverage
            html += MetricCard('activity', 'COVERAGE', 'var(--info)',
                h('div', 'text-center', '', h('div', 'metric-lg', `color:var(--danger)`, `${coverage.pct}%`) +
                component('progress', {value: coverage.pct, color: coverage.pct >= 80 ? 'var(--success)' : 'var(--danger)'}) +
                h('div', 'subtitle', '', `Working: ${coverage.actual}/${coverage.planned} planned`)));
            
            // Active Now
            html += MetricCard('users', 'ACTIVE NOW', 'var(--success)',
                h('div', 'text-center', '', h('div', 'metric-lg', `color:var(--success)`, `${active.count}`) +
                component('progress', {value: Math.round(active.count / active.total * 100), color: 'var(--success)'}) +
                h('div', 'subtitle', '', `of ${active.total} staff | Others: break/inactive`)));
            
            html += '</div></div>';
            
            // Latest Activity (island placeholder)
            html += '<div id="latest-activity-island"></div>';
            
            // Status & Notifications
            html += '<div class="card"><div class="grid grid-2 divide-x">';
            html += '<div class="p-5">';
            html += '<div class="flex items-center justify-between mb-4">';
            html += '<div class="flex items-center gap-3">' + component('iconBox', {icon: 'users', color: 'var(--success)'}) + '<h3 class="title">NOW STATUS</h3></div>';
            html += component('metric', {value: members.length, label: 'Total'});
            html += '</div>';
            
            html += '<div class="grid grid-3 gap-4 now-status-grid">';
            ['active', 'problems', 'available'].forEach(key => {
                const colors = {active: 'var(--success)', available: 'var(--info)', problems: 'var(--danger)'};
                const count = status[key].length;
                html += h('div', '', '', h('div', 'flex items-center gap-2 mb-2', '',
                    h('span', '', `width:12px;height:12px;border-radius:50%;background:${colors[key]};`, '') +
                    h('span', '', 'font-size:13px;font-weight:600;', `${key[0].toUpperCase()}${key.slice(1)} (${count})`)) +
                    h('div', 'subtitle', '', count ? status[key].map(m => `${m.name} (${(STATUS_CONFIG[m.status] || STATUS_CONFIG.active)[1].replace(' ⚠️', '')})`).join(', ') : 'None'));
            });
            html += '</div></div>';
            
            html += '<div class="p-5">';
            html += '<div class="flex items-center gap-3 mb-4">' + component('iconBox', {icon: 'alert', color: 'var(--danger)'}) + '<h3 class="title">ATTENTION NEEDED</h3></div>';
            html += '<div class="flex gap-2 mb-4">';
            ['unread', 'read'].forEach(tab => {
                const count = state.notifs.filter(n => tab === 'unread' ? !n.read : n.read).length;
                const active = state.tab === tab;
                html += h('button', `btn today-tab-btn${active ? ' is-active' : ''}`,
                    ``, `${tab[0].toUpperCase()}${tab.slice(1)} (${count})`).replace('<button', `<button data-type="${tab}"`);
            });
            html += '</div>';
            
            html += '<div class="overflow-y">';
            state.notifs.filter(n => state.tab === 'unread' ? !n.read : n.read).forEach(n => {
                html += h('div', 'notification', `background:${n.color}0d;`,
                    h('div', 'dot', `background:${n.color};`, '') +
                    h('div', 'flex-1', `padding-right:${!n.read ? '36px' : '0'};`, h('div', '', 'font-size:13px;', n.msg) + h('div', 'subtitle', '', n.time)) +
                    (!n.read ? h('button', 'btn', `position:absolute;top:12px;right:12px;width:24px;height:24px;background:white;border:1px solid ${n.color}40;color:${n.color};padding:0;font-size:12px;`, '✓').replace('<button', `<button data-id="${n.id}"`) : ''));
            });
            html += '</div></div></div></div>';
            
            // Timeline
            html += '<div class="card" style="overflow:hidden;">';
            html += '<div class="p-5" style="border-bottom:1px solid rgba(0,0,0,0.08);">';
            html += '<div class="flex items-center justify-between">';
            html += '<div class="flex items-center gap-3">' + component('iconBox', {icon: 'clock', color: 'var(--primary)'});
            html += '<div><h3 class="title" style="font-size:18px;margin-bottom:4px;">TEAM TIMELINE</h3>';
            html += '<p class="subtitle">Realtime monitoring • Click employee timeline hour to view screenshots</p></div></div>';
            html += '<div class="text-right">';
            html += '<div class="value" style="margin-bottom:4px;">' + new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) + '</div>';
            html += '<div class="subtitle" style="color:var(--primary);">Current: 3:30 PM • Live Cost: ' + costs.today.fact.cost + ' ⚡</div>';
            html += '</div></div></div>';
            
            // Добавляем легенду для десктопа
            html += renderLegend(false);
            
            html += '<div style="display:grid;grid-template-columns:120px 1fr 100px;padding:clamp(1rem, 2.5vw, 1.25rem) clamp(1.25rem, 3vw, 1.5rem);background:linear-gradient(135deg,rgba(204,102,51,0.08),rgba(248,247,244,0.9));align-items:center;">';
            html += '<div class="label" style="color:var(--primary);font-weight:700;">TEAM MEMBER</div>';
            html += '<div style="display:grid;grid-template-columns:repeat(24, 1fr);padding:0 0.5rem;gap:0;">';
            
            for (let i = 0; i < 24; i++) {
                const isNow = i === 15, isMajor = i % 6 === 0;
                let text;
                
                if (isNow) {
                    // Показываем реальное текущее время для десктопа
                    const now = new Date();
                    const currentHour = now.getHours();
                    const currentMinute = now.getMinutes();
                    const period = currentHour >= 12 ? 'PM' : 'AM';
                    const displayHour = currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour;
                    text = `${displayHour}:${currentMinute.toString().padStart(2, '0')} ${period}`;
                } else {
                    text = i === 0 ? '12 AM' : i === 6 ? '6 AM' : i === 12 ? '12 PM' : i === 18 ? '6 PM' : i < 12 ? `${i}` : `${i-12}`;
                }
                
                html += h('div', 'text-center', `font-size:${isMajor||isNow?'clamp(0.5rem, 1vw, 0.625rem)':'clamp(0.4375rem, 0.8vw, 0.5625rem)'};font-weight:${isMajor||isNow?700:500};padding:0.1875rem 0.0625rem;color:${isNow?'white':isMajor?'var(--dark)':'var(--gray)'};${isNow?'background:var(--primary);border-radius:0.375rem;box-shadow:0 0.125rem 0.5rem rgba(204,102,51,0.3);':''}transition:all 0.2s;position:relative;white-space:nowrap;line-height:1;`, 
                    text + (isNow ? '<div style="position:absolute;top:-0.75rem;left:50%;transform:translateX(-50%);font-size:0.5rem;font-weight:700;color:var(--primary);background:white;padding:0.0625rem 0.25rem;border-radius:0.1875rem;white-space:nowrap;box-shadow:0 0.0625rem 0.1875rem rgba(0,0,0,0.1);">NOW</div>' : ''));
            }
            
            html += '</div>';
            html += '<div class="label text-center" style="color:var(--primary);font-weight:700;">STATUS</div>';
            html += '</div>';
            
            members.forEach(m => {
                html += '<div>';
                html += '<div class="employee-row" data-member="' + m.name + '">';
                html += '<div><div class="value">' + m.name + '</div><div class="subtitle">' + m.role + '</div></div>';
                html += '<div class="flex" style="height:clamp(2rem, 4vw, 2.5rem);background:rgba(229,231,235,0.5);padding:0 0.5rem;">';
                
                for (let hour = 0; hour < 24; hour++) {
                    const hourStatuses = Array.from({length: 60}, (_, i) => m.timeline[hour * 60 + i] || 'off');
                    const segments = []; let current = hourStatuses[0], start = 0;
                    
                    for (let i = 1; i <= 60; i++) {
                        if (i === 60 || hourStatuses[i] !== current) {
                            segments.push({status: current, width: ((i - start) / 60) * 100});
                            if (i < 60) { current = hourStatuses[i]; start = i; }
                        }
                    }
                    
                    html += h('div', 'timeline-row', `opacity:${segments.every(s => ['off'].includes(s.status)) ? 0.5 : 1};border-left:${hour ? '0.5px solid white' : 'none'};`,
                        segments.map(seg => h('div', '', `background:${(STATUS_CONFIG[seg.status] || STATUS_CONFIG.active)[0]};width:${seg.width}%;height:100%;`, '')).join(''));
                }
                
                html += '</div>';
                html += '<div class="text-center">' + component('badge', {status: m.status}) + '</div>';
                html += '</div>';
                
                if (state.expanded === m.name && state.hour !== null) {
                    html += '<div class="expanded">';
                    html += '<div class="flex justify-between items-center mb-4">';
                    html += '<h3 class="title">' + (state.hour === 0 ? '12:00-12:59 AM' : state.hour < 12 ? `${state.hour}:00-${state.hour}:59 AM` : state.hour === 12 ? '12:00-12:59 PM' : `${state.hour - 12}:00-${state.hour - 12}:59 PM`) + '</h3>';
                    html += '<button class="btn" style="background:rgba(239,68,68,0.1);color:var(--danger);">✕ Close</button>';
                    html += '</div>';
                    
                    html += '<div class="label" style="margin-bottom:0.75rem;">SCREENSHOTS - Every 2 minutes</div>';
                    
                    const hourScreenshots = getHourlyScreenshots(m, state.hour);
                    
                    if (hourScreenshots.length) {
                        html += '<div class="flex gap-3 overflow-x" data-carousel="' + m.name + '" style="padding-bottom:0.5rem;">';
                        hourScreenshots.forEach(s => {
                            html += renderScreenshotCard(s, { 
                                isThumb: true, 
                                isActive: state.screenshot === s.index, 
                                showMember: false 
                            });
                        });
                        html += '</div>';
                    } else {
                        html += '<div style="background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.2);border-radius:0.5rem;padding:1.25rem;text-align:center;margin-bottom:1rem;">';
                        html += '<div style="font-size:2rem;margin-bottom:0.75rem;">📷</div>';
                        html += '<div style="font-weight:600;color:#dc2626;margin-bottom:0.5rem;">No Screenshots Available</div>';
                        html += '<div style="font-size:0.875rem;color:#6b7280;">This hour contains non-active activity, no work screenshots captured.</div>';
                        html += '</div>';
                    }
                    
                    if (hourScreenshots.length) {
                        const selectedScreenshot = hourScreenshots.find(s => s.index === state.screenshot) || hourScreenshots[0];
                        const minute = selectedScreenshot.minute;
                        
                        html += '<div class="mt-4"><div class="label" style="margin-bottom:0.5rem;">SCREENSHOT PREVIEW</div>';
                        html += '<div class="screenshot-preview-container">';
                        html += renderScreenshotPreview(m, state.hour, minute);
                        html += '</div></div>';
                    }
                    
                    html += '</div>';
                }
                
                html += '</div>';
            });
            
            html += '</div>';
            
            return html;
        }
        
        function createMobileLayout() {
            const {members, coverage, active, status} = getTeamData();
            const costs = calculateCosts();
            
            let html = '';
            
            // Mobile Metrics
            html += '<div class="metrics-mobile" id="metrics-container">';
            
            // Cost card
            html += '<div class="metric-card card p-6">';
            html += '<div class="flex items-center gap-3 mb-4">' + component('iconBox', {icon: 'dollar', color: 'var(--primary)'}) + '<h3 class="title" style="color:var(--primary)">COST TRACKER</h3></div>';
            html += '<div class="label mb-2">TODAY (Jan 10)</div>';
            html += '<div class="flex justify-between">';
            html += component('metric', {value: `$${costs.today.fact.cost}`, label: `fact (${costs.today.fact.hours}h)`, color: 'var(--success)'});
            html += component('metric', {value: `$${costs.today.projected.cost}`, label: `projected (${costs.today.projected.hours}h)`, color: 'var(--info)'});
            html += component('metric', {value: `$${costs.today.planned.cost}`, label: `plan (${costs.today.planned.hours}h)`, color: 'var(--gray)'});
            html += '</div></div>';
            
            // Coverage card
            html += '<div class="metric-card card p-6">';
            html += '<div class="flex items-center gap-3 mb-4">' + component('iconBox', {icon: 'activity', color: 'var(--info)'}) + '<h3 class="title" style="color:var(--info)">COVERAGE</h3></div>';
            html += '<div class="text-center">';
            html += '<div class="metric-lg" style="color:var(--danger)">' + coverage.pct + '%</div>';
            html += component('progress', {value: coverage.pct, color: coverage.pct >= 80 ? 'var(--success)' : 'var(--danger)'});
            html += '<div class="subtitle">Working: ' + coverage.actual + '/' + coverage.planned + ' planned</div>';
            html += '</div></div>';
            
            // Active card
            html += '<div class="metric-card card p-6">';
            html += '<div class="flex items-center gap-3 mb-4">' + component('iconBox', {icon: 'users', color: 'var(--success)'}) + '<h3 class="title" style="color:var(--success)">ACTIVE NOW</h3></div>';
            html += '<div class="text-center">';
            html += '<div class="metric-lg" style="color:var(--success)">' + active.count + '</div>';
            html += component('progress', {value: Math.round(active.count / active.total * 100), color: 'var(--success)'});
            html += '<div class="subtitle">of ' + active.total + ' staff | Others: break/inactive</div>';
            html += '</div></div>';
            
            html += '</div>';
            
            // Добавляем индикаторы точки под метриками
            html += '<div class="metrics-dots">';
            for (let i = 0; i < 3; i++) {
                html += '<div class="metric-dot ' + (i === state.activeMetricSlide ? 'active' : '') + '" data-slide="' + i + '"></div>';
            }
            html += '</div>';
            
            // Mobile Latest Activity (island placeholder)
            html += '<div id="latest-activity-island"></div>';
            
            // Mobile Status/Notifications with tabs
            html += '<div class="card">';
            html += '<div class="mobile-tabs">';
            html += '<button class="mobile-tab ' + (state.mobileTab === 'status' ? 'active' : '') + '" data-tab="status">Team Status</button>';
            
            // Считаем непрочитанные уведомления для бейджа
            const unreadCount = state.notifs.filter(n => !n.read).length;
            html += '<button class="mobile-tab ' + (state.mobileTab === 'alerts' ? 'active' : '') + '" data-tab="alerts" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;">';
            html += 'Alerts';
            if (unreadCount > 0) {
                html += '<span style="background:#ef4444;color:white;border-radius:50%;min-width:1.125rem;height:1.125rem;display:flex;align-items:center;justify-content:center;font-size:0.625rem;font-weight:700;padding:0 0.25rem;">' + (unreadCount > 99 ? '99+' : unreadCount) + '</span>';
            }
            html += '</button>';
            html += '</div>';
            
            // Фиксированная высота контейнера для обоих табов
            html += '<div style="height: 267px; overflow: hidden;">';
            
            if (state.mobileTab === 'status') {
                html += '<div class="p-5">';
                // Same visual as desktop, but allow horizontal scroll when tight
                html += '<div class="status-scroll-row" style="height: 227px;">';
                ['active', 'problems', 'available'].forEach(key => {
                    const colors = {active: 'var(--success)', available: 'var(--info)', problems: 'var(--danger)'};
                    const count = status[key].length;
                    html += h('div', 'status-col', '', h('div', 'flex items-center gap-2 mb-2', '',
                        h('span', '', 'width:12px;height:12px;border-radius:50%;background:' + colors[key] + ';', '') +
                        h('span', '', 'font-size:13px;font-weight:600;', key.charAt(0).toUpperCase() + key.slice(1) + ' (' + count + ')')) +
                        h('div', 'subtitle', '', count ? status[key].map(m => m.name).join(', ') : 'None'));
                });
                html += '</div></div>';
            } else {
                html += '<div style="padding: 0.75rem 1.25rem 1.25rem 1.25rem; height: 267px;">';
                html += '<div class="flex gap-2 mb-2">';
                ['unread', 'read'].forEach(tab => {
                    const count = state.notifs.filter(n => tab === 'unread' ? !n.read : n.read).length;
                    const active = state.tab === tab;
                    html += h('button', `btn today-tab-btn${active ? ' is-active' : ''}`,
                        '', tab.charAt(0).toUpperCase() + tab.slice(1) + ' (' + count + ')').replace('<button', `<button data-type="${tab}"`);
                });
                html += '</div>';
                html += '<div class="alerts-scroll" style="overflow-y: auto; height: 185px;">';
                state.notifs.filter(n => state.tab === 'unread' ? !n.read : n.read).forEach(n => {
                    html += h('div', 'notification', 'background:' + n.color + '0d;',
                        h('div', 'dot', 'background:' + n.color + ';', '') +
                        h('div', 'flex-1', 'padding-right:' + (!n.read ? '2.25rem' : '0') + ';', h('div', '', 'font-size:0.8125rem;', n.msg) + h('div', 'subtitle', '', n.time)) +
                        (!n.read ? h('button', 'btn', 'position:absolute;top:0.75rem;right:0.75rem;width:1.5rem;height:1.5rem;background:white;border:1px solid ' + n.color + '40;color:' + n.color + ';padding:0;font-size:0.75rem;', '✓').replace('<button', '<button data-id="' + n.id + '"') : ''));
                });
                html += '</div></div>';
            }
            
            html += '</div>';
            
            html += '</div>';
            
            // Mobile Timeline - возвращаю РАБОЧУЮ структуру
            html += '<div class="card">';
            html += '<div class="p-5" style="border-bottom:1px solid rgba(0,0,0,0.08);">';
            html += '<div class="flex items-center gap-3 mb-4">' + component('iconBox', {icon: 'clock', color: 'var(--primary)'});
            html += '<div><h3 class="title">TEAM TIMELINE</h3>';
            html += '<p class="subtitle">Swipe to scroll timeline</p></div></div></div>';
            
            // ДОБАВИТЬ легенду перед временной шкалой
            html += renderLegend(true);
            
            // Заголовочная строка
            html += '<div style="display:grid;grid-template-columns:100px 1fr;padding:clamp(0.625rem, 1.5vw, 0.75rem) 0;background:#f8f7f4;align-items:center;overflow:hidden;border-bottom:1px solid rgba(204, 102, 51, 0.1);">';
            html += '<div class="label timeline-header-name" style="color:var(--primary);font-weight:700;position:sticky;left:0;background:#f8f7f4;z-index:10;padding:0 clamp(1.25rem, 3vw, 1.5rem);border-right:1px solid rgba(204, 102, 51, 0.1);">TEAM MEMBER</div>';
            html += '<div class="timeline-hours-scroll" style="overflow-x:auto;padding:0 0.5rem;scrollbar-width:none;-ms-overflow-style:none;"><div style="scrollbar-width:none;-ms-overflow-style:none;"></div><style>.timeline-hours-scroll::-webkit-scrollbar{display:none;}</style>';
            html += '<div style="display:grid;grid-template-columns:repeat(24, 1fr);min-width:1400px;gap:0;">';
            
            for (let i = 0; i < 24; i++) {
                const isNow = i === 15, isMajor = i % 6 === 0;
                let text;
                
                if (isNow) {
                    // Показываем фиксированное время приложения 3:30 PM
                    text = '3:30 PM';
                } else {
                    text = i === 0 ? '12 AM' : i === 6 ? '6 AM' : i === 12 ? '12 PM' : i === 18 ? '6 PM' : i < 12 ? `${i}` : `${i-12}`;
                }
                
                html += h('div', 'text-center', `font-size:${isMajor||isNow?'clamp(0.6875rem, 1.2vw, 0.75rem)':'clamp(0.5625rem, 1vw, 0.625rem)'};font-weight:${isMajor||isNow?700:500};padding:0.375rem 0.125rem;color:${isNow?'white':isMajor?'var(--dark)':'var(--gray)'};${isNow?'background:var(--primary);border-radius:0.375rem;box-shadow:0 0.125rem 0.5rem rgba(204,102,51,0.3);':''}transition:all 0.2s;position:relative;white-space:nowrap;line-height:1;`, text);
            }
            
            html += '</div></div>';
            html += '</div>';
            
            html += '<div class="timeline-mobile-body" style="overflow:hidden;">';
            members.forEach(m => {
                html += '<div>';
                html += '<div class="employee-row" data-member="' + m.name + '" style="display:grid;grid-template-columns:100px 1fr;padding:clamp(0.625rem, 1.5vw, 0.75rem) 0;cursor:pointer;transition:background 0.2s;align-items:center;border-bottom:1px solid rgba(0,0,0,0.05);">';
                html += '<div class="timeline-name-sticky" style="position:sticky;left:0;z-index:10;padding:0 clamp(1.25rem, 3vw, 1.5rem);border-right:1px solid rgba(204, 102, 51, 0.1);"><div class="value">' + m.name + '</div><div class="subtitle">' + m.role + '</div></div>';
                html += '<div class="timeline-data-scroll" style="overflow-x:auto;padding:0 0.5rem;scrollbar-width:none;-ms-overflow-style:none;"><style>.timeline-data-scroll::-webkit-scrollbar{display:none;}</style>';
                html += '<div class="flex" style="height:clamp(3rem, 6vw, 3.5rem);background:rgba(229,231,235,0.5);min-width:1400px;">';
                
                for (let hour = 0; hour < 24; hour++) {
                    const hourStatuses = Array.from({length: 60}, (_, i) => m.timeline[hour * 60 + i] || 'off');
                    const segments = []; let current = hourStatuses[0], start = 0;
                    
                    for (let i = 1; i <= 60; i++) {
                        if (i === 60 || hourStatuses[i] !== current) {
                            segments.push({status: current, width: ((i - start) / 60) * 100});
                            if (i < 60) { current = hourStatuses[i]; start = i; }
                        }
                    }
                    
                    html += h('div', 'timeline-row', 'opacity:' + (segments.every(s => ['off'].includes(s.status)) ? 0.5 : 1) + ';border-left:' + (hour ? '0.5px solid white' : 'none') + ';flex:1;cursor:pointer;transition:all 0.3s;display:flex;',
                        segments.map(seg => h('div', '', 'background:' + (STATUS_CONFIG[seg.status] || STATUS_CONFIG.active)[0] + ';width:' + seg.width + '%;height:100%;', '')).join(''));
                }
                
                html += '</div></div>';
                html += '</div>';
                
                // Добавляем expanded секцию для мобильных БЕЗ МОДАЛЬНЫХ ФУНКЦИЙ
                if (state.expanded === m.name && state.hour !== null) {
                    html += '<div class="expanded" style="padding:1rem;background:rgba(248,247,244,0.9);border-top:2px solid var(--primary);border-bottom:1px solid rgba(0,0,0,0.05);">';
                    html += '<div class="flex justify-between items-center mb-4">';
                    html += '<h3 class="title" style="font-size:1.125rem;">' + (state.hour === 0 ? '12:00-12:59 AM' : state.hour < 12 ? `${state.hour}:00-${state.hour}:59 AM` : state.hour === 12 ? '12:00-12:59 PM' : `${state.hour - 12}:00-${state.hour - 12}:59 PM`) + '</h3>';
                    html += '<button class="btn" style="background:rgba(239,68,68,0.1);color:var(--danger);padding:0.5rem 1rem;font-size:0.875rem;">✕ Close</button>';
                    html += '</div>';
                    
                    html += '<div class="label" style="margin-bottom:0.75rem;font-size:0.75rem;">SCREENSHOTS - Every 2 minutes</div>';
                    
                    const hourScreenshots = getHourlyScreenshots(m, state.hour);
                    
                    if (hourScreenshots.length) {
                        html += '<div class="flex gap-3 overflow-x mobile-screenshot-carousel" data-carousel="' + m.name + '" style="padding-bottom:1rem;">';
                        hourScreenshots.forEach(s => {
                            html += '<div class="mobile-carousel-item" data-member="' + m.name + '" data-hour="' + state.hour + '" data-screenshot="' + s.index + '">';
                            html += renderScreenshotCard(s, { 
                                isThumb: false, 
                                isActive: false, 
                                showMember: false 
                            });
                            html += '</div>';
                        });
                        html += '</div>';
                    } else {
                        html += '<div style="background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.2);border-radius:0.75rem;padding:1.5rem;text-align:center;">';
                        html += '<div style="font-size:2.5rem;margin-bottom:1rem;">📷</div>';
                        html += '<div style="font-weight:600;color:#dc2626;margin-bottom:0.5rem;font-size:1.125rem;">No Screenshots Available</div>';
                        html += '<div style="font-size:1rem;color:#6b7280;">This hour contains non-active activity, no work screenshots captured.</div>';
                        html += '</div>';
                    }
                    
                    html += '</div>';
                }
                
                html += '</div>';
            });
            html += '</div>';
            
            html += '</div>';
            
            return html;
        }
        
        const applyTimelineHoverEffects = (members) => {
            document.querySelectorAll('.timeline-row').forEach((cell, i) => {
                const hour = i % 24, member = members[Math.floor(i / 24)];
                if (!member) return;
                
                const hasActivity = Array.from({length: 60}, (_, j) => member.timeline[hour * 60 + j]).some(s => !['off', 'not-started', 'future'].includes(s));
                if (!hasActivity) return;
                
                const isActive = (state.activeHour === hour && state.activeMember === member.name);
                
                const createOverlay = (isHover = false) => {
                    const existingOverlay = document.getElementById(`overlay-${i}`);
                    if (existingOverlay) existingOverlay.remove();
                    
                    const color = (STATUS_CONFIG[member.timeline[hour * 60]] || STATUS_CONFIG.active)[0];
                    const rect = cell.getBoundingClientRect();
                    const containerRect = cell.parentNode.getBoundingClientRect();
                    
                    const overlay = document.createElement('div');
                    overlay.id = `overlay-${i}`;
                    overlay.className = 'timeline-overlay';
                    overlay.innerHTML = cell.innerHTML;
                    
                    const scaledWidth = rect.width * 1.8;
                    const leftOffset = rect.left - containerRect.left - (scaledWidth - rect.width) / 2;
                    
                    overlay.style.cssText = `
                        position: absolute;
                        left: ${leftOffset}px;
                        top: 0;
                        width: ${scaledWidth}px;
                        height: 100%;
                        z-index: ${isHover ? 35 : 25};
                        box-shadow: 0 ${isHover?0.375:0.25}rem ${isHover?1:0.75}rem ${color}${isHover?80:60}, 0 0 0 ${isHover?0.1875:0.125}rem rgba(255,255,255,0.9);
                        border-radius: 0.25rem;
                        transition: all 0.2s ease;
                        cursor: pointer;
                        display: flex;
                    `;
                    
                    const label = document.createElement('div');
                    label.textContent = hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour-12} PM`;
                    label.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;font-size:clamp(0.625rem, 1.2vw, 0.6875rem);font-weight:700;z-index:40;pointer-events:none;text-shadow:0 0.0625rem 0.125rem rgba(0,0,0,0.3);white-space:nowrap;';
                    overlay.appendChild(label);
                    
                    overlay.onclick = (e) => {
                        e.stopPropagation();
                        handleTimelineInteraction(member.name, hour);
                    };
                    
                    overlay.onmouseleave = () => {
                        if (!isActive) overlay.remove();
                    };
                    
                    cell.parentNode.style.position = 'relative';
                    cell.parentNode.appendChild(overlay);
                };
                
                if (isActive) createOverlay();
                
                cell.onmouseenter = () => {
                    if (!isActive) createOverlay(true);
                };
            });
        };

        // Scroll Position Management
        const saveScrollPositions = () => {
            const positions = {};
            
            // Metrics position
            const metricsContainer = document.querySelector('.metrics-mobile');
            if (metricsContainer) {
                positions.metrics = metricsContainer.scrollLeft;
            }
            
            // Latest Activity scroll (explicit row)
            const latestActivity = document.querySelector('.latest-activity-row');
            if (latestActivity) {
                positions.latestActivity = latestActivity.scrollLeft;
            }

            // Mobile Alerts scroll (inside ATTENTION tab on mobile)
            const alertsScroller = document.querySelector('.alerts-scroll');
            if (alertsScroller) {
                positions.alertsScrollTop = alertsScroller.scrollTop;
            }
            
            // Timeline scroll positions
            const headerScroll = document.querySelector('.timeline-hours-scroll');
            const dataScrolls = document.querySelectorAll('.timeline-data-scroll');
            if (headerScroll) {
                positions.timelineHeader = headerScroll.scrollLeft;
            }
            if (dataScrolls.length > 0) {
                positions.timelineData = dataScrolls[0].scrollLeft;
            }
            
            return positions;
        };
        
        const restoreScrollPositions = (positions) => {
            if (!positions) return;
            
            setTimeout(() => {
                // Restore metrics position
                if (positions.metrics !== undefined) {
                    const metricsContainer = document.querySelector('.metrics-mobile');
                    if (metricsContainer) {
                        metricsContainer.scrollLeft = positions.metrics;
                    }
                }
                
                // Restore latest activity scroll
                if (positions.latestActivity !== undefined) {
                    const latestActivity = document.querySelector('.latest-activity-row');
                    if (latestActivity) {
                        latestActivity.scrollLeft = positions.latestActivity;
                    }
                }

                // Restore mobile alerts scroll
                if (positions.alertsScrollTop !== undefined) {
                    const alertsScroller = document.querySelector('.alerts-scroll');
                    if (alertsScroller) {
                        alertsScroller.scrollTop = positions.alertsScrollTop;
                    }
                }
                
                // Restore timeline scroll
                if (positions.timelineHeader !== undefined || positions.timelineData !== undefined) {
                    const headerScroll = document.querySelector('.timeline-hours-scroll');
                    const dataScrolls = document.querySelectorAll('.timeline-data-scroll');
                    
                    if (headerScroll && positions.timelineHeader !== undefined) {
                        headerScroll.scrollLeft = positions.timelineHeader;
                    }
                    if (dataScrolls.length > 0 && positions.timelineData !== undefined) {
                        dataScrolls.forEach(container => {
                            container.scrollLeft = positions.timelineData;
                        });
                    }
                }
            }, 0);
        };

        // Re-render preserving scroll positions (Latest Activity, metrics, timeline)
        const rerenderPreservingScroll = () => {
            const saved = saveScrollPositions();
            render();
            restoreScrollPositions(saved);
        };
        
        // Mobile Tabs Content Update (без полного перерендера)
        const updateMobileTabsContent = () => {
            const {status} = getTeamData();
            // Target the wrapper, not its first child, to avoid nested padding wrappers
            const tabContentWrapper = document.querySelector('.mobile-tabs').nextElementSibling;
            
            if (!tabContentWrapper) return;
            
            let newContent = '';
            
            if (state.mobileTab === 'status') {
                newContent = '<div class="p-5">';
                // Mirror desktop visuals; enable horizontal scroll when tight
                newContent += '<div class="status-scroll-row" style="height: 227px;">';
                ['active', 'problems', 'available'].forEach(key => {
                    const colors = {active: 'var(--success)', available: 'var(--info)', problems: 'var(--danger)'};
                    const count = status[key].length;
                    newContent += h('div', 'status-col', '', h('div', 'flex items-center gap-2 mb-2', '',
                        h('span', '', 'width:12px;height:12px;border-radius:50%;background:' + colors[key] + ';', '') +
                        h('span', '', 'font-size:13px;font-weight:600;', key.charAt(0).toUpperCase() + key.slice(1) + ' (' + count + ')')) +
                        h('div', 'subtitle', '', count ? status[key].map(m => m.name).join(', ') : 'None'));
                });
                newContent += '</div></div>';
            } else {
                newContent = '<div style="padding: 0.75rem 1.25rem 1.25rem 1.25rem; height: 267px;">';
                newContent += '<div class="flex gap-2 mb-2">';
                ['unread', 'read'].forEach(tab => {
                    const count = state.notifs.filter(n => tab === 'unread' ? !n.read : n.read).length;
                    const active = state.tab === tab;
                    newContent += h('button', `btn today-tab-btn${active ? ' is-active' : ''}`,
                        '', tab.charAt(0).toUpperCase() + tab.slice(1) + ' (' + count + ')')
                        .replace('<button', `<button data-type="${tab}"`);
                });
                newContent += '</div>';
                newContent += '<div class="alerts-scroll" style="overflow-y: auto; height: 185px;">';
                state.notifs.filter(n => state.tab === 'unread' ? !n.read : n.read).forEach(n => {
                    newContent += h('div', 'notification', 'background:' + n.color + '0d;',
                        h('div', 'dot', 'background:' + n.color + ';', '') +
                        h('div', 'flex-1', 'padding-right:' + (!n.read ? '2.25rem' : '0') + ';', h('div', '', 'font-size:0.8125rem;', n.msg) + h('div', 'subtitle', '', n.time)) +
                        (!n.read ? h('button', 'btn', 'position:absolute;top:0.75rem;right:0.75rem;width:1.5rem;height:1.5rem;background:white;border:1px solid ' + n.color + '40;color:' + n.color + ';padding:0;font-size:0.75rem;', '✓').replace('<button', '<button data-id="' + n.id + '"') : ''));
                });
                newContent += '</div></div>';
            }
            
            tabContentWrapper.innerHTML = newContent;
            
            // Обновляем активные табы
            const tabs = document.querySelectorAll('.mobile-tab');
            tabs.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === state.mobileTab);
            });
            
            // Обновляем бейдж с количеством уведомлений
            const alertsTab = document.querySelector('.mobile-tab[data-tab="alerts"]');
            if (alertsTab) {
                const unreadCount = state.notifs.filter(n => !n.read).length;
                const existingBadge = alertsTab.querySelector('span[style*="background:#ef4444"]');
                
                if (unreadCount > 0) {
                    if (!existingBadge) {
                        alertsTab.innerHTML = 'Alerts<span style="background:#ef4444;color:white;border-radius:50%;min-width:1.125rem;height:1.125rem;display:flex;align-items:center;justify-content:center;font-size:0.625rem;font-weight:700;padding:0 0.25rem;">' + (unreadCount > 99 ? '99+' : unreadCount) + '</span>';
                    } else {
                        existingBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                    }
                } else if (existingBadge) {
                    alertsTab.innerHTML = 'Alerts';
                }
            }
        };

        // Desktop 'ATTENTION NEEDED' partial update (без перерендеринга страницы)
        const updateDesktopAttentionTabs = () => {
            const rootTitle = Array.from(document.querySelectorAll('.title')).find(el => el.textContent && el.textContent.includes('ATTENTION NEEDED'));
            if (!rootTitle) return false;
            const cardRoot = rootTitle.closest('.p-5');
            if (!cardRoot) return false;

            // Update tab buttons
            const btnBar = cardRoot.querySelector('.flex.gap-2.mb-4');
            if (btnBar) {
                btnBar.innerHTML = ['unread', 'read'].map(tab => {
                    const count = state.notifs.filter(n => tab === 'unread' ? !n.read : n.read).length;
                    const active = state.tab === tab;
                    return `<button class="btn today-tab-btn${active ? ' is-active' : ''}" data-type="${tab}">${tab.charAt(0).toUpperCase()}${tab.slice(1)} (${count})</button>`;
                }).join('');
            }

            // Update list
            const list = cardRoot.querySelector('.overflow-y');
            if (list) {
                let html = '';
                state.notifs.filter(n => state.tab === 'unread' ? !n.read : n.read).forEach(n => {
                    html += h('div', 'notification', `background:${n.color}0d;`,
                        h('div', 'dot', `background:${n.color};`, '') +
                        h('div', 'flex-1', `padding-right:${!n.read ? '36px' : '0'};`, h('div', '', 'font-size:13px;', n.msg) + h('div', 'subtitle', '', n.time)) +
                        (!n.read ? h('button', 'btn', `position:absolute;top:12px;right:12px;width:24px;height:24px;background:white;border:1px solid ${n.color}40;color:${n.color};padding:0;font-size:12px;`, '✓').replace('<button', `<button data-id="${n.id}"`) : ''));
                });
                list.innerHTML = html;
            }
            return true;
        };

        // Event Handler
        
// ==== Screenshot Modal (arrows + swipe) ====
let __modalState = null; // { member, hour, index }
function __getModalCtx(){
  const data = getTeamData();
  if (!__modalState || !data || !data.members) return null;
  const member = data.members.find(m => m.name === __modalState.member);
  if (!member) return null;
  const list = getHourlyScreenshots(member, __modalState.hour);
  let index = Math.max(0, Math.min(__modalState.index || 0, list.length - 1));
  return { member, list, index };
}
function __buildModalHTML(){
  const ctx = __getModalCtx();
  if (!ctx || ctx.list.length === 0) {
    return '<div class="modal-dialog"><button class="modal-close" aria-label="Close">×</button><div class="modal-media" style="background:#fff;"><div style="padding:2rem;font-weight:600;">No screenshots</div></div></div>';
  }
  const shot = ctx.list[ctx.index];
  const vis = getScreenshotVisual(shot.status || 'active');
  const t = shot.time;
  return '' +
    '<div class="modal-dialog" role="dialog" aria-modal="true">' +
      '<button class="modal-close" aria-label="Close">×</button>' +
      '<button class="modal-arrow left" aria-label="Previous">‹</button>' +
      '<button class="modal-arrow right" aria-label="Next">›</button>' +
      '<div class="modal-media" style="background:'+vis.bg+';">' +
        '<div style="font-size:clamp(48px,14vw,100px);">'+vis.icon+'</div>' +
        '<div class="modal-time">'+t+'</div>' +
      '</div>' +
    '</div>';
}
function openScreenshotModal(member, hour, index){
  __modalState = { member: member, hour: hour, index: index };
  const root = document.getElementById('modal-root');
  if (!root) return;
  document.body.style.overflow = 'hidden';
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.innerHTML = __buildModalHTML();
  root.replaceChildren(overlay);
  // Bind events
  overlay.addEventListener('click', function(ev){ if (ev.target === overlay) { closeScreenshotModal(); } }, { passive: true });
  var btnClose = overlay.querySelector('.modal-close');
  if (btnClose) btnClose.addEventListener('click', function(){ closeScreenshotModal(); }, { passive: true });
  var btnL = overlay.querySelector('.modal-arrow.left');
  if (btnL) btnL.addEventListener('click', function(){ modalPrev(); }, { passive: true });
  var btnR = overlay.querySelector('.modal-arrow.right');
  if (btnR) btnR.addEventListener('click', function(){ modalNext(); }, { passive: true });
  window.addEventListener('keydown', __modalKeyHandler);
  __attachSwipe(overlay);
}
function closeScreenshotModal(){
  const root = document.getElementById('modal-root');
  if (root) root.replaceChildren();
  document.body.style.overflow = '';
  window.removeEventListener('keydown', __modalKeyHandler);
  __modalState = null;
}
function modalPrev(){
  const ctx = __getModalCtx(); if (!ctx) return;
  __modalState.index = (ctx.index - 1 + ctx.list.length) % ctx.list.length;
  __rerenderModal();
}
function modalNext(){
  const ctx = __getModalCtx(); if (!ctx) return;
  __modalState.index = (ctx.index + 1) % ctx.list.length;
  __rerenderModal();
}
function __rerenderModal(){
  const root = document.getElementById('modal-root');
  if (!root || !root.firstElementChild) return;
  root.firstElementChild.innerHTML = __buildModalHTML();
  var overlay = root.firstElementChild;
  var btnClose = overlay.querySelector('.modal-close');
  if (btnClose) btnClose.addEventListener('click', function(){ closeScreenshotModal(); }, { passive: true });
  var btnL = overlay.querySelector('.modal-arrow.left');
  if (btnL) btnL.addEventListener('click', function(){ modalPrev(); }, { passive: true });
  var btnR = overlay.querySelector('.modal-arrow.right');
  if (btnR) btnR.addEventListener('click', function(){ modalNext(); }, { passive: true });
  __attachSwipe(overlay);
}
function __modalKeyHandler(e){
  if (!__modalState) return;
  if (e.key === 'Escape') closeScreenshotModal();
  else if (e.key === 'ArrowLeft') modalPrev();
  else if (e.key === 'ArrowRight') modalNext();
}
function __attachSwipe(overlay){
  var startX = 0, startY = 0, touching = false;
  overlay.addEventListener('touchstart', function(ev){
    if (!ev.touches || !ev.touches[0]) return;
    touching = true;
    startX = ev.touches[0].clientX;
    startY = ev.touches[0].clientY;
  }, { passive: true });
  overlay.addEventListener('touchend', function(ev){
    if (!touching) return;
    var t = ev.changedTouches && ev.changedTouches[0]; if (!t) return;
    var dx = t.clientX - startX, dy = t.clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dy) < 40) { if (dx > 0) modalPrev(); else modalNext(); }
    touching = false;
  }, { passive: true });
}
// ==== End Modal ====

const handleClick = e => {
            // Open modal from mobile expanded card carousel item
            var item = e.target.closest && e.target.closest('.mobile-carousel-item');
            if (item) {
                var member = item.getAttribute('data-member');
                var hour = parseInt(item.getAttribute('data-hour') || '0', 10);
                var idx = parseInt(item.getAttribute('data-screenshot') || '0', 10);
                openScreenshotModal(member, hour, idx);
                return;
            }
            const {members} = getTeamData();
            
            if (e.target.matches('.btn')) {
                const text = e.target.textContent;
                const isTabBtn = e.target.classList.contains('today-tab-btn');
                const saved = saveScrollPositions();

                if (text.includes('Close')) { state.expanded = state.activeHour = state.activeMember = null; rerenderPreservingScroll(); return; }
                if (text.includes('Show More')) {
                    if (e.target.closest('#latest-activity-island')) { appendMoreLatestActivity(20); return; }
                    state.loadedScreenshots += 20; rerenderPreservingScroll(); return;
                }
                if (text.includes('Unread')) { state.tab = 'unread'; if (isTabBtn) { if (isMobile()) { updateMobileTabsContent(); restoreScrollPositions(saved); } else { updateDesktopAttentionTabs(); restoreScrollPositions(saved); } } else { rerenderPreservingScroll(); } return; }
                if (text.includes('Read')) { state.tab = 'read'; if (isTabBtn) { if (isMobile()) { updateMobileTabsContent(); restoreScrollPositions(saved); } else { updateDesktopAttentionTabs(); restoreScrollPositions(saved); } } else { rerenderPreservingScroll(); } return; }
                if (text === '✓') {
                    const btn = e.target.closest('button');
                    const id = btn && btn.dataset.id;
                    // Mobile anchoring to minimize jump when removing bottom item
                    let anchorId = null, anchorOffset = 0;
                    if (isMobile()) {
                        const scroller = document.querySelector('.alerts-scroll');
                        const notifEl = btn && btn.closest('.notification');
                        if (scroller && notifEl) {
                            const next = notifEl.nextElementSibling;
                            anchorOffset = notifEl.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
                            anchorId = next && next.classList && next.classList.contains('notification') ? next.dataset.id : null;
                        }
                    }

                    let notif = null;
                    if (id) notif = state.notifs.find(n => n.id === id);
                    if (!notif) notif = state.notifs.find(n => !n.read);
                    if (notif) notif.read = true;

                    if (isMobile()) {
                        updateMobileTabsContent();
                        setTimeout(() => {
                            const sc = document.querySelector('.alerts-scroll');
                            if (!sc) return;
                            if (anchorId) {
                                const el = sc.querySelector('.notification[data-id="' + anchorId + '"]');
                                if (el) sc.scrollTop = el.offsetTop - anchorOffset;
                            } else {
                                sc.scrollTop = sc.scrollHeight; // keep bottom pinned
                            }
                        }, 0);
                    } else {
                        updateDesktopAttentionTabs();
                    }

                    // Update navbar badge immediately
                    try {
                        const unread = state.notifs.filter(n => !n.read).length;
                        localStorage.setItem('today-unread-count', String(unread));
                        const badge = document.getElementById('navbar-today-badge') || document.querySelector('.navbar__link[data-nav="today"] .navbar__link-badge');
                        if (badge) {
                            if (unread > 0) { badge.textContent = unread > 99 ? '99+' : String(unread); badge.style.display = ''; }
                            else { badge.style.display = 'none'; }
                        }
                    } catch (_) {}
                    return;
                }
            }
            
            // Клики на точки метрик
            if (e.target.matches('.metric-dot')) {
                const slideIndex = parseInt(e.target.dataset.slide);
                scrollToMetricSlide(slideIndex);
                return;
            }
            
            // Обработка кликов по мобильным табам (БЕЗ полного перерендера)
            if (e.target.matches('.mobile-tab')) {
                const newTab = e.target.dataset.tab;
                if (newTab !== state.mobileTab) {
                    const savedPositions = saveScrollPositions();
                    state.mobileTab = newTab;
                    updateMobileTabsContent();
                    restoreScrollPositions(savedPositions);
                }
                return;
            }
            
            // Timeline clicks
            if (e.target.closest('.timeline-row')) {
                e.stopPropagation();
                const memberRow = e.target.closest('[data-member]');
                const memberName = memberRow.dataset.member;
                
                let hourIndex;
                if (isMobile()) {
                    const timelineContainer = e.target.closest('.flex');
                    const clickedSegment = e.target.closest('.timeline-row');
                    const allSegments = [...timelineContainer.children];
                    hourIndex = allSegments.indexOf(clickedSegment);
                } else {
                    const container = e.target.closest('.flex');
                    const clickX = e.clientX - container.getBoundingClientRect().left;
                    hourIndex = Math.floor(clickX / (container.getBoundingClientRect().width / 24));
                }
                
                handleTimelineInteraction(memberName, hourIndex);
                return;
            }
            
            // Employee row clicks
            if (e.target.closest('[data-member]') && !e.target.closest('.timeline-row') && !e.target.closest('.expanded')) {
                const name = e.target.closest('[data-member]').dataset.member;
                handleTimelineInteraction(name);
                return;
            }
            
            // Screenshot clicks
            if (e.target.closest('.screenshot-thumb, .screenshot-card, .mobile-screenshot')) {
                const thumb = e.target.closest('.screenshot-thumb');
                const card = e.target.closest('.screenshot-card');
                const mobileScreenshot = e.target.closest('.mobile-screenshot');
                
                if (thumb) {
                    const newIndex = parseInt(thumb.dataset.index);
                    state.screenshot = newIndex;
                    
                    const carousel = thumb.parentNode;
                    if (carousel) {
                        carousel.querySelectorAll('.screenshot-thumb').forEach((t, i) => {
                            const isActive = i === newIndex;
                            const borderColor = isActive ? 'var(--primary)' : 'rgba(0,0,0,0.1)';
                            t.style.border = `2px solid ${borderColor}`;
                        });
                    }
                    
                    updateScreenshotPreview();
                } else if (mobileScreenshot && isMobile()) {
                    // Mobile Latest Activity screenshot click
                    const cardIndex = parseInt(mobileScreenshot.dataset.index);
                    const screenshot = generateScreenshots()[cardIndex];
                    if (screenshot) {
                        const [hours] = screenshot.time.split(':').map(Number);
                        const minuteIndex = Math.floor(parseInt(screenshot.time.split(':')[1]) / 2);
                        
                        openCardAtHour(screenshot.member, hours);
                        state.screenshot = minuteIndex;
                        rerenderPreservingScroll();
                        
                        // Mobile scroll to employee card
                        setTimeout(() => {
                            const employeeRow = document.querySelector(`[data-member="${screenshot.member}"]`);
                            if (employeeRow) {
                                employeeRow.scrollIntoView({ 
                                    behavior: 'smooth', 
                                    block: 'start' 
                                });
                                
                                // Scroll to carousel screenshot after expand animation
                                setTimeout(() => {
                                    const carousel = document.querySelector(`[data-carousel="${screenshot.member}"]`);
                                    if (carousel && state.screenshot !== undefined) {
                                        const allItems = carousel.querySelectorAll('.mobile-carousel-item');
                                        const targetItem = allItems[state.screenshot];
                                        if (targetItem) {
                                            const carouselRect = carousel.getBoundingClientRect();
                                            const itemRect = targetItem.getBoundingClientRect();
                                            
                                            const isVisible = itemRect.left >= carouselRect.left && 
                                                            itemRect.right <= carouselRect.right;
                                            
                                            if (!isVisible) {
                                                const scrollLeft = targetItem.offsetLeft - carousel.offsetLeft - 
                                                                 (carouselRect.width / 2) + (itemRect.width / 2);
                                                carousel.scrollTo({ 
                                                    left: Math.max(0, scrollLeft), 
                                                    behavior: 'smooth' 
                                                });
                                            }
                                        }
                                    }
                                }, 400);
                            }
                        }, 100);
                    }
                } else if (card && !isMobile()) {
                    // Desktop Latest Activity screenshot click
                    const cardIndex = [...card.parentNode.children].indexOf(card);
                    const screenshot = generateScreenshots()[cardIndex];
                    if (screenshot) {
                        const [hours] = screenshot.time.split(':').map(Number);
                        const minuteIndex = Math.floor(parseInt(screenshot.time.split(':')[1]) / 2);
                        
                        openCardAtHour(screenshot.member, hours);
                        state.screenshot = minuteIndex;
                        rerenderPreservingScroll();
                        scrollToScreenshots(screenshot.member);
                        scrollToActiveScreenshot(screenshot.member);
                    }
                }
            }
        };

        // Main Render
        const render = () => {
            const {members, coverage, active, status} = getTeamData();
            const costs = calculateCosts();
            if (!state.notifs.length) state.notifs = generateNotifications();
            // Update navbar badge with unread count (and persist for other pages)
            try {
                const unread = state.notifs.filter(n => !n.read).length;
                const el = document.getElementById('navbar-today-badge') || document.querySelector('.navbar__link[data-nav="today"] .navbar__link-badge');
                if (el) {
                    if (unread > 0) {
                        el.textContent = unread > 99 ? '99+' : String(unread);
                        el.style.display = '';
                        el.setAttribute('aria-label', `${unread} unread`);
                    } else {
                        el.textContent = '0';
                        el.style.display = 'none';
                        el.removeAttribute('aria-label');
                    }
                }
                try { localStorage.setItem('today-unread-count', String(unread)); } catch (_) {}
            } catch (e) {}
            
            const mobile = isMobile();
            
            let html = '<div class="main-content">';
            
            if (mobile) {
                html += createMobileLayout();
            } else {
                html += createDesktopLayout();
            }
            
            html += '</div>';
            
            // Preserve island node across rerenders
            const preserveIsland = () => {
                const island = document.getElementById('latest-activity-island');
                if (!island || !island.firstElementChild) return null;
                const node = island.firstElementChild; // whole card node
                const row = node.querySelector('.latest-activity-row');
                const scrollLeft = row ? row.scrollLeft : 0;
                return { node, scrollLeft };
            };
            const preserved = preserveIsland();
            document.getElementById('app').innerHTML = html;
            // Restore or mount island immediately after render (no flicker)
            {
                const container = document.getElementById('latest-activity-island');
                if (container) {
                    if (preserved && preserved.node) {
                        container.appendChild(preserved.node);
                        const row = preserved.node.querySelector('.latest-activity-row');
                        if (row) row.scrollLeft = preserved.scrollLeft || 0;
                    } else {
                        renderLatestActivityIsland();
                    }
                }
            }

            // Синхронизация скролла для мобильного таймлайна
            if (mobile) {
                setTimeout(() => {
                    const headerScroll = document.querySelector('.timeline-hours-scroll');
                    const dataScrolls = document.querySelectorAll('.timeline-data-scroll');
                    
                    if (headerScroll && dataScrolls.length) {
                        // Точное центрирование: считаем позицию по фактическим пикселям часа+минут
                        const calcCenterPos = () => {
                            const refScroll = dataScrolls[0];
                            const refFlex = refScroll && refScroll.querySelector('.flex');
                            if (!refScroll || !refFlex || !refFlex.children.length) return null;

                            // Artifact requirement: center fixed 'current' time at 3:30 PM
                            const hour = 15; // 3 PM
                            const minute = 30; // :30
                            const hourEl = refFlex.children[Math.min(23, Math.max(0, hour))];
                            if (!hourEl) return null;

                            const hourRect = hourEl.getBoundingClientRect();
                            const scrollRect = refScroll.getBoundingClientRect();
                            const left = hourRect.left - scrollRect.left + refScroll.scrollLeft;
                            const hourWidth = hourRect.width || (refScroll.scrollWidth / 24);
                            const minuteOffset = hourWidth * (minute / 60);

                            const targetX = left + minuteOffset; // X‑координата «сейчас» внутри скролла
                            const viewport = refScroll.clientWidth;
                            const maxScroll = Math.max(0, refScroll.scrollWidth - viewport);
                            return Math.max(0, Math.min(maxScroll, Math.round(targetX - viewport / 2)));
                        };

                        const applyPos = () => {
                            const pos = calcCenterPos();
                            if (pos == null) return;
                            headerScroll.scrollLeft = pos;
                            dataScrolls.forEach(c => { c.scrollLeft = pos; });
                        };

                        // Несколько проходов для стабильной геометрии
                        applyPos();
                        setTimeout(applyPos, 60);
                        setTimeout(applyPos, 180);
                        
                        // Настройка синхронизации скролла
                        headerScroll.addEventListener('scroll', () => {
                            dataScrolls.forEach(container => {
                                container.scrollLeft = headerScroll.scrollLeft;
                            });
                        });
                        
                        dataScrolls.forEach(container => {
                            container.addEventListener('scroll', () => {
                                headerScroll.scrollLeft = container.scrollLeft;
                                dataScrolls.forEach(otherContainer => {
                                    if (otherContainer !== container) {
                                        otherContainer.scrollLeft = container.scrollLeft;
                                    }
                                });
                            });
                        });
                    }
                    
                    const metricsContainer = document.querySelector('.metrics-mobile');
                    if (metricsContainer) {
                        metricsContainer.addEventListener('scroll', handleMetricScroll);
                        updateMetricDots();
                    }
                    // latest-activity scrollbar already initialized above
                }, 0);
            }
            
            if (!mobile) {
                setTimeout(() => {
                    applyTimelineHoverEffects(members);
                }, 0);
            }
        };

        // Visible scrollbar for Latest Activity (scoped to island)
        function setupLatestActivityScrollbar(row, track) {
            const thumb = track && track.querySelector('.thumb');
            if (!row || !track || !thumb) return;

            const update = () => {
                const total = row.scrollWidth || 1;
                const visible = row.clientWidth || 1;
                const maxScroll = Math.max(1, total - visible);
                track.style.display = total > visible ? '' : 'none';

                const trackWidth = track.clientWidth || visible;
                const minThumbPx = 32;
                const widthPx = Math.max(minThumbPx, (visible / total) * trackWidth);
                const widthPct = (widthPx / trackWidth) * 100;
                const leftPct = (row.scrollLeft / maxScroll) * (100 - widthPct);
                thumb.style.width = widthPct + '%';
                thumb.style.left = leftPct + '%';
            };

            update();
            row.removeEventListener('scroll', row.__laTrackHandler || (()=>{}));
            const onScroll = () => requestAnimationFrame(update);
            row.addEventListener('scroll', onScroll, { passive: true });
            row.__laTrackHandler = onScroll;
            window.addEventListener('resize', () => requestAnimationFrame(update), { passive: true });
        }

        function renderLatestActivityIsland() {
            const container = document.getElementById('latest-activity-island');
            if (!container) return;
            const mobile = isMobile();
            const all = generateScreenshots();
            const shots = all.slice(0, state.loadedScreenshots);
            const hasMore = all.length > state.loadedScreenshots;

            let html = '';
            html += '<div class="card p-5">';
            html += '<div class="flex items-center gap-3 mb-4">' + component('iconBox', {icon: 'camera', color: 'var(--primary)'}) + '<h3 class="title">LATEST ACTIVITY</h3></div>';
            html += '<div class="latest-activity-row flex gap-3 overflow-x" style="align-items:center;padding:4px 0 12px 0;">';
            if (mobile) {
                shots.forEach((s, i) => {
                    html += '<div class="mobile-screenshot" data-index="' + i + '">' + renderScreenshotCard(s, { showMember: true }) + '</div>';
                });
            } else {
                shots.forEach(s => { html += renderScreenshotCard(s, { showMember: true }); });
            }
            if (hasMore) {
                const btnStyle = mobile
                    ? 'background:var(--primary);color:white;min-width:160px;height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:0.5rem;font-size:0.6875rem;'
                    : 'background:var(--primary);color:white;min-width:clamp(6.5rem, 9vw, 7.5rem);height:clamp(8.75rem, 12vw, 10rem);display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:0.5rem;font-size:clamp(0.625rem, 1vw, 0.6875rem);';
                html += h('button', 'btn', btnStyle, '<div style="font-size:1rem;margin-bottom:0.25rem;">→</div><div data-la-showmore>Show More</div><div style="font-size:0.625rem;opacity:0.8;">' + (all.length - state.loadedScreenshots) + ' more</div>');
            }
            html += '</div>';
            html += '<div class="today-mobile-scrollbar" aria-hidden="true"><div class="thumb"></div></div>';
            html += '</div>';
            container.innerHTML = html;

            const row = container.querySelector('.latest-activity-row');
            const track = container.querySelector('.today-mobile-scrollbar');
            setupLatestActivityScrollbar(row, track);
        }

        function appendMoreLatestActivity(count = 20) {
            const container = document.getElementById('latest-activity-island');
            if (!container) return;
            const row = container.querySelector('.latest-activity-row');
            const track = container.querySelector('.today-mobile-scrollbar');
            if (!row) return;
            const all = generateScreenshots();
            const from = state.loadedScreenshots;
            const to = Math.min(all.length, state.loadedScreenshots + count);
            if (to <= from) return;
            const mobile = isMobile();
            for (let i = from; i < to; i++) {
                const s = all[i];
                if (mobile) {
                    const wrap = document.createElement('div');
                    wrap.className = 'mobile-screenshot';
                    wrap.setAttribute('data-index', String(i));
                    wrap.innerHTML = renderScreenshotCard(s, { showMember: true });
                    row.appendChild(wrap);
                } else {
                    const div = document.createElement('div');
                    div.innerHTML = renderScreenshotCard(s, { showMember: true });
                    row.appendChild(div.firstElementChild);
                }
            }
            state.loadedScreenshots = to;
            const btn = row.querySelector('button.btn');
            if (state.loadedScreenshots >= all.length) {
                if (btn) btn.remove();
            } else if (btn) {
                const info = btn.querySelector('div[style*="opacity"]');
                if (info) info.textContent = (all.length - state.loadedScreenshots) + ' more';
            }
            setupLatestActivityScrollbar(row, track);
        }
        
        // ИНИЦИАЛИЗАЦИЯ
        if (window.closeMobileModal) {
            delete window.closeMobileModal;
            delete window.modalPrev; 
            delete window.modalNext;
            delete window.openMobileModal;
        }
        
        document.addEventListener('click', handleClick);
        
        window.addEventListener('resize', () => {
            render();
        });
        
        render();
    
