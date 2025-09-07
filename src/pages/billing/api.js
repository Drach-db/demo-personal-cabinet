// api.js для страницы Billing
// Импортируем готовый клиент Supabase из utils
import { supabase } from '../../utils/supabase.js'

/**
 * Получает все записи биллинга из базы данных
 * @returns {Promise<Array>} Массив записей биллинга
 */
export async function getBillingRecords() {
  try {
    // Более толерантная выборка: все поля, без сортировки по потенциально отсутствующим колонкам
    const { data, error } = await supabase
      .from('billing')
      .select('*')

    if (error) {
      console.error('Ошибка при получении данных биллинга:', error)
      throw new Error('Не удалось загрузить данные биллинга')
    }

    if (!data) return []

    // Нормализуем значения с безопасными fallback'ами
    const formattedBilling = data.map(record => ({
      id: record.id,
      start_date: record.start_date || record.startDate || '',
      end_date: record.end_date || record.endDate || '',
      planned_hours: record.planned_hours ?? record.plannedHours ?? 0,
      actual_hours: record.actual_hours ?? record.actualHours ?? 0,
      hourly_rate: record.hourly_rate ?? record.hourlyRate ?? 0,
      invoice_url: record.invoice_url || record.invoiceUrl || '',
      report_url: record.report_url || record.reportUrl || '',
      payment_status: record.payment_status || record.paymentStatus || 'unpaid',
      period_type: record.period_type || record.periodType || 'regular',
      created_date: record.created_date || record.created_at || record.createdAt || ''
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
