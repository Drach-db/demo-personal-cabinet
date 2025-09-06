// api.js для страницы Billing
// Импортируем готовый клиент Supabase из utils
import { supabase } from '../../utils/supabase.js'

/**
 * Получает все записи биллинга из базы данных
 * @returns {Promise<Array>} Массив записей биллинга
 */
export async function getBillingRecords() {
  try {
    const { data, error } = await supabase
      .from('billing')
      .select(`
        id,
        start_date,
        end_date,
        planned_hours,
        actual_hours,
        hourly_rate,
        invoice_url,
        report_url,
        payment_status,
        period_type,
        created_date
      `)
      .order('start_date', { ascending: false })

    if (error) {
      console.error('Ошибка при получении данных биллинга:', error)
      throw new Error('Не удалось загрузить данные биллинга')
    }

    // Возвращаем данные как есть, обрабатываем NULL значения
    const formattedBilling = data.map(record => ({
      id: record.id,
      start_date: record.start_date || '',
      end_date: record.end_date || '',
      planned_hours: record.planned_hours || 0,
      actual_hours: record.actual_hours || 0,
      hourly_rate: record.hourly_rate || 0,
      invoice_url: record.invoice_url || '',
      report_url: record.report_url || '',
      payment_status: record.payment_status || 'unpaid',
      period_type: record.period_type || 'regular',
      created_date: record.created_date || ''
    }))

    return formattedBilling

  } catch (error) {
    console.error('Ошибка в getBillingRecords:', error)
    throw error
  }
}

// Экспортируем объект со всеми функциями для удобства
export default {
  getBillingRecords
}