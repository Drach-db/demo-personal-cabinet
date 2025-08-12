// Импортируем готовый клиент Supabase
import { supabase } from '../../utils/supabase.js'

/**
 * Получает все батчи с сотрудниками
 * @returns {Promise<Array>} Массив батчей с вложенными сотрудниками
 */
export async function getBatchesWithEmployees() {
    try {
        console.log('🔄 Начинаем загрузку батчей...');
        
        // 1. Получаем все батчи
        const { data: batches, error: batchError } = await supabase
            .from('hiring_batches_summary')
            .select('*')
            .order('batch_id', { ascending: false });

        if (batchError) {
            console.error('❌ Ошибка загрузки батчей:', batchError);
            throw batchError;
        }

        console.log('✅ Загружено батчей:', batches.length);
        console.log('📋 Пример батча:', batches[0]);

        // 2. Для каждого батча получаем сотрудников
        const batchesWithEmployees = await Promise.all(
            batches.map(async (batch) => {
                // Проверяем и нормализуем employee_id
                let employeeIds = batch.employee_id;
                
                // Если это строка - преобразуем в массив
                if (typeof employeeIds === 'string') {
                    try {
                        // Пробуем распарсить JSON строку
                        employeeIds = JSON.parse(employeeIds);
                    } catch (e) {
                        // Если не JSON, может быть строка с разделителями
                        employeeIds = employeeIds.split(',').map(id => id.trim());
                    }
                }
                
                // Проверяем что это массив
                if (!Array.isArray(employeeIds)) {
                    // Если это одно значение - делаем массив
                    employeeIds = employeeIds ? [employeeIds] : [];
                }
                
                // Если массив пустой или null
                if (!employeeIds || employeeIds.length === 0) {
                    console.log(`⚠️ Батч ${batch.batch_id}: нет сотрудников`);
                    return {
                        ...batch,
                        employees: []
                    };
                }

                console.log(`🔍 Батч ${batch.batch_id}, employee_ids:`, employeeIds);

                // 3. Определяем тип ID (числовые или строковые)
                const firstId = employeeIds[0];
                const isNumericIds = typeof firstId === 'number' || !isNaN(Number(firstId));
                
                let query;
                if (isNumericIds) {
                    // Если ID числовые - ищем по полю id
                    // Преобразуем в числа если это строки чисел
                    const numericIds = employeeIds.map(id => 
                        typeof id === 'number' ? id : parseInt(id, 10)
                    );
                    
                    console.log(`  Используем числовой поиск по полю "id":`, numericIds);
                    
                    query = supabase
                        .from('employees')
                        .select(`
                            *,
                            contacts:contacts_id (
                                bpo_experience,
                                english_proficiency_test,
                                english_level,
                                typing_speed,
                                avatar
                            )
                        `)
                        .in('id', numericIds);
                } else {
                    // Если ID строковые (recXXX) - ищем по полю employee_id
                    console.log(`  Используем строковый поиск по полю "employee_id":`, employeeIds);
                    
                    query = supabase
                        .from('employees')
                        .select(`
                            *,
                            contacts:contacts_id (
                                bpo_experience,
                                english_proficiency_test,
                                english_level,
                                typing_speed,
                                avatar
                            )
                        `)
                        .in('employee_id', employeeIds);
                }

                const { data: employees, error: empError } = await query;

                if (empError) {
                    console.error(`❌ Ошибка загрузки сотрудников для батча ${batch.batch_id}:`, empError);
                    return {
                        ...batch,
                        employees: []
                    };
                }

                console.log(`✅ Батч ${batch.batch_id}: найдено сотрудников ${employees?.length || 0}`);

                // 4. Мержим данные сотрудников с контактами
                const employeesWithContacts = (employees || []).map(emp => ({
                    ...emp,
                    // Разворачиваем контакты на верхний уровень
                    bpo_experience: emp.contacts?.bpo_experience || 0,
                    english_proficiency_test: emp.contacts?.english_proficiency_test || '',
                    english_level: emp.contacts?.english_level || 0,
                    typing_speed: emp.contacts?.typing_speed || 0,
                    avatar: emp.contacts?.avatar || null,
                    // Убираем вложенный объект contacts
                    contacts: undefined
                }));

                return {
                    ...batch,
                    employees: employeesWithContacts
                };
            })
        );

        console.log('✅ Все данные загружены успешно!');
        return batchesWithEmployees;

    } catch (error) {
        console.error('💥 Критическая ошибка:', error);
        throw error;
    }
}

/**
 * Тестовая функция для проверки подключения
 */
export async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('hiring_batches_summary')
            .select('*')
            .limit(1);
        
        if (error) throw error;
        
        console.log('✅ Подключение успешно! Первая запись:', data);
        return data;
    } catch (error) {
        console.error('❌ Ошибка подключения:', error);
        throw error;
    }
}

// Экспортируем для тестирования в консоли
window.onboardingApi = {
    getBatchesWithEmployees,
    testConnection
};

// Экспортируем объект со всеми функциями
export default {
    getBatchesWithEmployees,
    testConnection
}