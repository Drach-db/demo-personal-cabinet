import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_PROJECT_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_PUBLIC_API_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchData() {
  // Получаем employees с contacts через foreign key contacts_id
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
    .limit(5)

  if (error) {
    console.error('Ошибка:', error)
  } else {
    // Форматируем даты
    const formatDate = (date) => {
      if (!date) return ''
      const d = new Date(date)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      return `${day}.${month}.${year}`
    }
    
    // Мержим в нужный формат как в артефакте
    const merged = data.map(emp => ({
      id: emp.id,
      full_name: emp.full_name,
      stage: emp.stage,
      project: emp.project,
      position: emp.position,
      staffing_type: emp.staffing_type,
      bpo_experience: emp.contacts?.bpo_experience || 0,
      gender: emp.contacts?.gender || '',
      date_of_birth: formatDate(emp.contacts?.date_of_birth),
      start_date: formatDate(emp.start_date),
      end_date: formatDate(emp.end_date),
      interview_date: formatDate(emp.interview_date),
      transfer_planned_date: formatDate(emp.transfer_planned_date),
      transfer_fact_date: formatDate(emp.transfer_fact_date),
      english_proficiency_test: emp.contacts?.english_proficiency_test || '',
      english_level: emp.contacts?.english_level || 0,
      typing_speed: emp.contacts?.typing_speed || 0,
      avatar: emp.contacts?.avatar || null
    }))
    
    console.log('Готовые данные для UI:')
    console.table(merged, ['full_name', 'date_of_birth'])
  }
}

fetchData()