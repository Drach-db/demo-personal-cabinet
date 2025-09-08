// test-api.js - Временный файл для тестирования без Supabase

const MOCK_EMPLOYEES = [
    { 
        employee_id: "emp001", 
        full_name: "John Doe", 
        position: "Developer", 
        stage: "Active", 
        project: "Project A", 
        interview_date: "2025-01-15", 
        start_date: "2025-02-01", 
        end_date: null, 
        staffing_type: "core" 
    },
    { 
        employee_id: "emp002", 
        full_name: "Jane Smith", 
        position: "Designer", 
        stage: "Active", 
        project: "Project B", 
        interview_date: "2025-02-20", 
        start_date: "2025-03-01", 
        end_date: "2025-12-01", 
        staffing_type: "core" 
    }
];

const MOCK_SHIFTS = [
    {
        id: 1,
        employee_id: "emp001",
        schedule_type: "baseline schedule",
        shift_date: "2025-11-01",
        start_time: "09:00",
        end_time: "18:00",
        pay_time: 8,
        status: null,
        reason: null
    },
    {
        id: 2,
        employee_id: "emp001",
        schedule_type: "fact schedule",
        shift_date: "2025-11-01",
        start_time: "09:15",
        end_time: "18:30",
        pay_time: 8.25,
        status: "completed",
        reason: null
    },
    {
        id: 3,
        employee_id: "emp002",
        schedule_type: "baseline schedule",
        shift_date: "2025-11-02",
        start_time: "10:00",
        end_time: "19:00",
        pay_time: 8,
        status: null,
        reason: null
    },
    {
        id: 4,
        employee_id: "emp002",
        schedule_type: "fact schedule",
        shift_date: "2025-11-02",
        start_time: "10:05",
        end_time: "18:50",
        pay_time: 7.75,
        status: "completed",
        reason: null
    }
];

async function getShiftsForMonth(year, month) {
    console.log(`📍 Mock API: Getting shifts for ${year}-${month}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter shifts for the requested month
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const monthShifts = MOCK_SHIFTS.filter(shift => 
        (shift.shift_date || "").startsWith(monthStr)
    );
    
    return {
        employees: MOCK_EMPLOYEES,
        shifts: monthShifts,
        shiftsByEmployee: {}
    };
}

export default {
    getShiftsForMonth
};
