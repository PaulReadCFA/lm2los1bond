/**
 * Validation Module
 * Input validation and error handling
 */

/**
 * Validation rules for each input field
 */
const validationRules = {
  couponRate: {
    min: 0,
    max: 10,
    label: 'Coupon rate',
    errorMessage: 'Coupon rate must be between 0% and 10%'
  },
  ytm: {
    min: 0,
    max: 10,
    label: 'Yield-to-maturity',
    errorMessage: 'Yield-to-maturity must be between 0% and 10%'
  },
  years: {
    min: 1,
    max: 5,
    label: 'Years-to-maturity',
    errorMessage: 'Years-to-maturity must be between 1 and 5'
  }
};

/**
 * Validate a single field
 * @param {string} field - Field name
 * @param {number} value - Field value
 * @returns {string|null} Error message or null if valid
 */
export function validateField(field, value) {
  const rules = validationRules[field];
  
  if (!rules) {
    return null;
  }
  
  // Check if value is a number
  if (isNaN(value) || value === '') {
    return `${rules.label} is required`;
  }
  
  // Check min/max bounds
  if (value < rules.min || value > rules.max) {
    return rules.errorMessage;
  }
  
  return null;
}

/**
 * Validate all input fields
 * @param {Object} inputs - Object with all input values
 * @returns {Object} Object with field names as keys and error messages as values
 */
export function validateAllInputs(inputs) {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const error = validateField(field, inputs[field]);
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
}

/**
 * Check if there are any validation errors
 * @param {Object} errors - Errors object
 * @returns {boolean} True if there are errors
 */
export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

/**
 * Update input field UI to show/hide error state
 * @param {string} fieldId - Input field ID
 * @param {string|null} errorMessage - Error message or null
 */
export function updateFieldError(fieldId, errorMessage) {
  const input = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}-error`);
  
  if (!input || !errorElement) {
    return;
  }
  
  if (errorMessage) {
    // Show error
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', `${fieldId}-error`);
    input.classList.add('error');
    errorElement.textContent = errorMessage;
  } else {
    // Clear error
    input.setAttribute('aria-invalid', 'false');
    input.removeAttribute('aria-describedby');
    input.classList.remove('error');
    errorElement.textContent = '';
  }
}

/**
 * Update validation summary section
 * @param {Object} errors - Errors object
 */
export function updateValidationSummary(errors) {
  const summary = document.getElementById('validation-summary');
  const list = document.getElementById('validation-list');
  
  if (!summary || !list) {
    return;
  }
  
  if (hasErrors(errors)) {
    // Show validation summary
    list.innerHTML = '';
    Object.values(errors).forEach(error => {
      const li = document.createElement('li');
      li.textContent = error;
      list.appendChild(li);
    });
    summary.style.display = 'block';
  } else {
    // Hide validation summary
    summary.style.display = 'none';
    list.innerHTML = '';
  }
}
