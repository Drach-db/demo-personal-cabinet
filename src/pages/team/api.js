// Импортируем готовый клиент Supabase из utils
import { supabase } from '../../utils/supabase.js'

// Вспомогательная функция для форматирования дат
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

/**
 * Получает всех сотрудников с их контактными данными
 * @returns {Promise<Array>} Массив сотрудников в формате для UI
 */
export async function getEmployees() {
  try {
    // Делаем JOIN запрос через foreign key contacts_id
    const { data, error } = await supabase
      .from('employees')
      .select(`
        id,
        full_name,
        stage,
        project,
        position,
        staffing_type,
        start_date,
        end_date,
        interview_date,
        transfer_planned_date,
        transfer_fact_date,
        contacts:contacts_id (
          english_proficiency_test,
          english_level,
          typing_speed,
          avatar,
          bpo_experience,
          gender,
          date_of_birth
        )
      `)
      .order('full_name', { ascending: true })

    if (error) {
      console.error('Ошибка при получении данных:', error)
      throw new Error('Не удалось загрузить данные сотрудников')
    }

    // Преобразуем данные в формат, который ожидает UI
    const formattedEmployees = data.map(emp => ({
      id: emp.id,
      full_name: emp.full_name,
      stage: emp.stage,
      project: emp.project,
      position: emp.position,
      staffing_type: emp.staffing_type,
      bpo_experience: emp.contacts?.bpo_experience || 0,
      gender: emp.contacts?.gender || '',
      english_proficiency_test: emp.contacts?.english_proficiency_test || '',
      english_level: emp.contacts?.english_level || 0,
      typing_speed: emp.contacts?.typing_speed || 0,
      avatar: emp.contacts?.avatar || null,
      date_of_birth: formatDate(emp.contacts?.date_of_birth),
      start_date: formatDate(emp.start_date),
      end_date: formatDate(emp.end_date),
      interview_date: formatDate(emp.interview_date),
      transfer_planned_date: formatDate(emp.transfer_planned_date),
      transfer_fact_date: formatDate(emp.transfer_fact_date)
    }))

    return formattedEmployees

  } catch (error) {
    console.error('Ошибка в getEmployees:', error)
    throw error
  }
}

/**
 * Получает одного сотрудника по ID
 * @param {number} id - ID сотрудника
 * @returns {Promise<Object>} Данные сотрудника
 */
export async function getEmployeeById(id) {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        id,
        full_name,
        stage,
        project,
        position,
        staffing_type,
        start_date,
        end_date,
        interview_date,
        transfer_planned_date,
        transfer_fact_date,
        contacts:contacts_id (
          english_proficiency_test,
          english_level,
          typing_speed,
          avatar,
          bpo_experience,
          gender,
          date_of_birth
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Ошибка при получении сотрудника:', error)
      throw new Error('Не удалось загрузить данные сотрудника')
    }

    // Форматируем данные
    return {
      id: data.id,
      full_name: data.full_name,
      stage: data.stage,
      project: data.project,
      position: data.position,
      staffing_type: data.staffing_type,
      bpo_experience: data.contacts?.bpo_experience || 0,
      gender: data.contacts?.gender || '',
      english_proficiency_test: data.contacts?.english_proficiency_test || '',
      english_level: data.contacts?.english_level || 0,
      typing_speed: data.contacts?.typing_speed || 0,
      avatar: data.contacts?.avatar || null,
      date_of_birth: formatDate(data.contacts?.date_of_birth),
      start_date: formatDate(data.start_date),
      end_date: formatDate(data.end_date),
      interview_date: formatDate(data.interview_date),
      transfer_planned_date: formatDate(data.transfer_planned_date),
      transfer_fact_date: formatDate(data.transfer_fact_date)
    }

  } catch (error) {
    console.error('Ошибка в getEmployeeById:', error)
    throw error
  }
}

// Экспортируем объект со всеми функциями для удобства
export default {
  getEmployees,
  getEmployeeById
}