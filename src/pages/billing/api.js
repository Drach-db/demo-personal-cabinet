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
  // Check all required NOT NULL fields
  const requiredFields = [
    'id', 
    'start_date', 
    'end_date', 
    'planned_hours', 
    'actual_hours', 
    'hourly_rate',
    'payment_status',
    'period_type',
    'created_date'
  ];
  
  const missingFields = [];
  
  for (const field of requiredFields) {
    // Check both snake_case and camelCase variants
    const snakeValue = record[field];
    const camelValue = record[field.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())];
    
    if (snakeValue === undefined && camelValue === undefined) {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields in billing record ${record.id}: ${missingFields.join(', ')}`);
  }
  
  // Validate enum values
  const paymentStatus = record.payment_status || record.paymentStatus;
  const validPaymentStatuses = ['pending', 'overdue', 'paid'];
  if (!validPaymentStatuses.includes(paymentStatus)) {
    throw new Error(`Invalid payment_status "${paymentStatus}" for record ${record.id}. Must be one of: ${validPaymentStatuses.join(', ')}`);
  }
  
  const periodType = record.period_type || record.periodType;
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
    const { data, error } = await supabase
      .from('billing')
      .select('*')
      .order('created_date', { ascending: false });  // Add ordering for consistency

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

    return validatedRecords;

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