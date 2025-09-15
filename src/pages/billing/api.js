// api.js для страницы Billing - CORRECTED VERSION
import { supabase } from '../../utils/supabase.js'
window.supabase = supabase;

/**
 * Validates a billing record against schema requirements
 * @param {Object} record - Raw billing record from database
 * @returns {Object} Validated and formatted record
 * @throws {Error} If required fields are missing or invalid
 */
function validateBillingRecord(record) {
  // Some backends use created_at instead of created_date.
  // Define required fields with allowed aliases per field.
  const required = {
    id: ['id'],
    start_date: ['start_date', 'startDate'],
    end_date: ['end_date', 'endDate'],
    planned_hours: ['planned_hours', 'plannedHours'],
    actual_hours: ['actual_hours', 'actualHours'],
    hourly_rate: ['hourly_rate', 'hourlyRate'],
    payment_status: ['payment_status', 'paymentStatus'],
    period_type: ['period_type', 'periodType'],
    created_date: ['created_date', 'created_at', 'createdAt']
  };

  const missingFields = [];

  for (const [key, aliases] of Object.entries(required)) {
    const hasAny = aliases.some(k => record[k] !== undefined && record[k] !== null);
    if (!hasAny) missingFields.push(key);
  }
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields in billing record ${record.id}: ${missingFields.join(', ')}`);
  }
  
  // Validate enum values
  const paymentStatus = String(record.payment_status || record.paymentStatus || '').toLowerCase();
  const validPaymentStatuses = ['pending', 'overdue', 'paid'];
  if (!validPaymentStatuses.includes(paymentStatus)) {
    throw new Error(`Invalid payment_status "${paymentStatus}" for record ${record.id}. Must be one of: ${validPaymentStatuses.join(', ')}`);
  }
  
  const periodType = String(record.period_type || record.periodType || '').toLowerCase();
  const validPeriodTypes = ['regular', 'custom'];
  if (!validPeriodTypes.includes(periodType)) {
    throw new Error(`Invalid period_type "${periodType}" for record ${record.id}. Must be one of: ${validPeriodTypes.join(', ')}`);
  }
  
  // Return properly formatted record
  return {
    id: record.id,
    start_date: record.start_date || record.startDate,
    end_date: record.end_date || record.endDate,
    planned_hours: parseFloat(record.planned_hours ?? record.plannedHours),
    actual_hours: parseFloat(record.actual_hours ?? record.actualHours),
    hourly_rate: parseFloat(record.hourly_rate ?? record.hourlyRate),
    invoice_url: record.invoice_url || record.invoiceUrl || null,  // NULL for nullable fields
    report_url: record.report_url || record.reportUrl || null,     // NULL for nullable fields
    payment_status: paymentStatus,
    period_type: periodType,
    created_date: record.created_date || record.created_at || record.createdAt
  };
}

/**
 * Gets all billing records from database with proper validation
 * @returns {Promise<Array>} Array of validated billing records
 */
export async function getBillingRecords() {
  try {
    // Fetch without DB-side ordering to avoid errors if column differs (created_at vs created_date).
    const { data, error } = await supabase
      .from('billing')
      .select('*');

    if (error) {
      console.error('Database error fetching billing records:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('No billing records found');
      return [];
    }

    // Validate and format each record
    const validatedRecords = [];
    const errors = [];
    
    for (const record of data) {
      try {
        const validatedRecord = validateBillingRecord(record);
        validatedRecords.push(validatedRecord);
      } catch (validationError) {
        console.error('Validation error for record:', validationError);
        errors.push({
          recordId: record.id,
          error: validationError.message
        });
      }
    }
    
    // If there are validation errors, you might want to handle them
    if (errors.length > 0) {
      console.warn(`${errors.length} records failed validation:`, errors);
      // Optionally throw if you want to fail on any validation error
      // throw new Error(`Validation failed for ${errors.length} records`);
    }

    // Client-side order by created_date/created_at descending
    const ordered = validatedRecords.sort((a, b) => {
      const da = new Date(a.created_date).getTime() || 0;
      const db = new Date(b.created_date).getTime() || 0;
      return db - da;
    });

    return ordered;

  } catch (error) {
    console.error('Error in getBillingRecords:', error);
    throw error;
  }
}

/**
 * Gets a single billing record by ID
 * @param {number} id - Record ID
 * @returns {Promise<Object>} Single billing record
 */
export async function getBillingRecordById(id) {
  try {
    const { data, error } = await supabase
      .from('billing')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Database error fetching billing record:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      throw new Error(`Billing record with ID ${id} not found`);
    }

    return validateBillingRecord(data);

  } catch (error) {
    console.error('Error in getBillingRecordById:', error);
    throw error;
  }
}

// Export all functions
export default {
  getBillingRecords,
  getBillingRecordById
};
