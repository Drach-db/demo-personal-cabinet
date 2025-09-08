// Realtime API for Schedules page (Supabase)
import { supabase } from '../../utils/supabase.js'

function pad2(n) { return String(n).padStart(2, '0') }

function getMonthRange(year, month) {
  const start = `${year}-${pad2(month)}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const end = `${year}-${pad2(month)}-${pad2(lastDay)}`
  return { start, end }
}

async function getEmployeesForMonth(year, month) {
  const { start, end } = getMonthRange(year, month)
  // Сотрудники, чьи периоды пересекаются с месяцем: start_date <= end AND (end_date IS NULL OR end_date >= start)
  const { data, error } = await supabase
    .from('employees')
    .select('employee_id, full_name, position, stage, project, interview_date, start_date, end_date, staffing_type')
    .lte('start_date', end)
    .or(`end_date.gte.${start},end_date.is.null`)
    .order('full_name', { ascending: true })

  if (error) throw error
  return data || []
}

async function getMonthShifts(year, month) {
  const { start, end } = getMonthRange(year, month)
  const { data, error } = await supabase
    .from('shifts')
    .select('id, employee_id, schedule_type, start_shift_date, start_shift_time, end_shift_time, pay_time, absence_reason, day_status')
    .gte('start_shift_date', start)
    .lte('start_shift_date', end)
    .order('employee_id', { ascending: true })
    .order('start_shift_date', { ascending: true })

  if (error) throw error
  return data || []
}

async function getShiftsForMonth(year, month) {
  try {
    console.log(`📍 Supabase: fetch shifts for ${year}-${pad2(month)}`)
    const [employees, shifts] = await Promise.all([
      getEmployeesForMonth(year, month),
      getMonthShifts(year, month)
    ])

    return {
      employees,
      shifts,
      shiftsByEmployee: {}
    }
  } catch (error) {
    console.error('❌ Supabase schedules API error:', error)
    throw new Error('Failed to load schedules data')
  }
}

export default { getShiftsForMonth }
