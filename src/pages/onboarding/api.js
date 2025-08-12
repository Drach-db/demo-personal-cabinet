// Импортируем готовый клиент Supabase
import { supabase } from '../../utils/supabase.js'

/**
 * Улучшенный парсер employee_id из разных форматов
 * @param {string|null|array} employeeIdField - Поле employee_id из БД
 * @returns {Array} Массив ID для поиска
 */
function parseEmployeeIds(employeeIdField) {
    console.log('📋 Парсинг employee_id:', employeeIdField);
    
    // 1. Если null или undefined
    if (employeeIdField === null || employeeIdField === undefined) {
        console.log('  → NULL значение, возвращаем пустой массив');
        return [];
    }
    
    // 2. Если уже массив (маловероятно, но проверим)
    if (Array.isArray(employeeIdField)) {
        console.log('  → Уже массив:', employeeIdField);
        return employeeIdField;
    }
    
    // 3. Преобразуем в строку и очищаем
    let idString = String(employeeIdField).trim();
    
    // 4. Проверяем на пустые скобки []
    if (idString === '[]' || idString === '[ ]') {
        console.log('  → Пустые скобки, возвращаем пустой массив');
        return [];
    }
    
    // 5. Убираем квадратные скобки если есть
    if (idString.startsWith('[') && idString.endsWith(']')) {
        idString = idString.slice(1, -1).trim();
    }
    
    // 6. Если после удаления скобок пусто
    if (!idString) {
        console.log('  → Пустая строка после удаления скобок');
        return [];
    }
    
    // 7. Разбиваем по запятой и очищаем каждый элемент
    const ids = idString.split(',').map(id => {
        // Убираем пробелы и кавычки
        let cleanId = id.trim().replace(/["']/g, '');
        
        // Проверяем, является ли ID числом (например, 00000001)
        if (/^\d+$/.test(cleanId)) {
            // Преобразуем в число, чтобы убрать ведущие нули
            return parseInt(cleanId, 10);
        }
        
        // Возвращаем как строку (для recXXX формата)
        return cleanId;
    }).filter(id => {
        // Фильтруем пустые значения
        return id !== '' && id !== null && id !== undefined;
    });
    
    console.log('  → Распаршенные IDs:', ids);
    return ids;
}

/**
 * Получает сотрудников из таблицы contacts по массиву ID
 * @param {Array} employeeIds - Массив ID сотрудников
 * @returns {Promise<Array>} Массив данных сотрудников
 */
async function getEmployeesByIds(employeeIds) {
    if (!employeeIds || employeeIds.length === 0) {
        return [];
    }
    
    // Определяем тип ID
    const firstId = employeeIds[0];
    const isNumericIds = typeof firstId === 'number';
    
    console.log(`  🔍 Ищем ${employeeIds.length} сотрудников, тип ID: ${isNumericIds ? 'числовой' : 'строковый'}`);
    
    try {
        // Ищем в таблице contacts по полю id
        const { data: contacts, error: contactsError } = await supabase
            .from('contacts')
            .select(`
                id,
                bpo_experience,
                english_proficiency_test,
                english_level,
                typing_speed,
                avatar,
                gender,
                date_of_birth
            `)
            .in('id', employeeIds);
        
        if (contactsError) {
            console.error('  ❌ Ошибка при поиске в contacts:', contactsError);
            // Не бросаем ошибку, просто возвращаем пустой массив
            return [];
        }
        
        if (!contacts || contacts.length === 0) {
            console.log('  ⚠️ Контакты не найдены для IDs:', employeeIds);
            return [];
        }
        
        console.log(`  ✅ Найдено контактов: ${contacts.length}`);
        
        // Теперь получаем данные из employees для найденных контактов
        const contactIds = contacts.map(c => c.id);
        
        const { data: employees, error: empError } = await supabase
            .from('employees')
            .select(`
                id,
                employee_id,
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
                contacts_id
            `)
            .in('contacts_id', contactIds);
        
        if (empError) {
            console.error('  ❌ Ошибка при получении employees:', empError);
            return [];
        }
        
        // Объединяем данные
        const mergedData = employees.map(emp => {
            const contact = contacts.find(c => c.id === emp.contacts_id);
            return {
                ...emp,
                // Добавляем данные из contacts
                bpo_experience: contact?.bpo_experience || 0,
                english_proficiency_test: contact?.english_proficiency_test || '',
                english_level: contact?.english_level || 0,
                typing_speed: contact?.typing_speed || 0,
                avatar: contact?.avatar || null,
                gender: contact?.gender || '',
                date_of_birth: contact?.date_of_birth || null
            };
        });
        
        return mergedData;
        
    } catch (error) {
        console.error('  💥 Критическая ошибка при получении сотрудников:', error);
        return [];
    }
}

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
        
        // 2. Для каждого батча получаем сотрудников
        const batchesWithEmployees = await Promise.all(
            batches.map(async (batch) => {
                console.log(`\n📦 Обрабатываем батч ${batch.batch_id}:`);
                
                // Используем улучшенный парсер
                const employeeIds = parseEmployeeIds(batch.employee_id);
                
                if (employeeIds.length === 0) {
                    console.log('  ⚠️ Нет сотрудников в батче');
                    return {
                        ...batch,
                        employees: []
                    };
                }
                
                // Получаем сотрудников
                const employees = await getEmployeesByIds(employeeIds);
                
                console.log(`  ✅ Загружено сотрудников: ${employees.length} из ${employeeIds.length}`);
                
                return {
                    ...batch,
                    employees: employees
                };
            })
        );

        console.log('\n✅ Все данные загружены успешно!');
        
        // Выводим статистику
        const totalEmployees = batchesWithEmployees.reduce((sum, batch) => 
            sum + batch.employees.length, 0
        );
        console.log(`📊 Статистика: ${batches.length} батчей, ${totalEmployees} сотрудников`);
        
        return batchesWithEmployees;

    } catch (error) {
        console.error('💥 Критическая ошибка:', error);
        throw error;
    }
}

/**
 * Тестовая функция для проверки парсера
 */
export function testParser() {
    const testCases = [
        "[recQWE1234567890, recQWE1234567891]",
        "[00000005, 00000006, 00000007]",
        "[00000001]",
        "[]",
        null,
        "[00000030, 00000031]",
        "[ ]",
        ""
    ];
    
    console.log('🧪 Тестирование парсера:');
    testCases.forEach(test => {
        console.log(`Input: ${test}`);
        console.log(`Output:`, parseEmployeeIds(test));
        console.log('---');
    });
}

// Экспортируем для тестирования в консоли браузера
window.onboardingApi = {
    getBatchesWithEmployees,
    testParser,
    parseEmployeeIds,
    getEmployeesByIds
};

// Экспортируем объект со всеми функциями
export default {
    getBatchesWithEmployees,
    testParser
}