/**
 * State Management Module
 * Simple observable state pattern for reactive updates
 */

export const state = {
  // Input values
  faceValue: 100,
  frequency: 2, // Semi-annual
  couponRate: 8.6,
  ytm: 6.5,
  years: 5,
  
  // UI state
  viewMode: 'chart',
  
  // Calculated values (computed on demand)
  bondCalculations: null,
  
  // Validation errors
  errors: {},
  
  // Listeners for state changes
  listeners: []
};

/**
 * Update state and notify listeners
 * @param {Object} updates - Object with state properties to update
 */
export function setState(updates) {
  Object.assign(state, updates);
  notifyListeners();
}

/**
 * Subscribe to state changes
 * @param {Function} callback - Function to call when state changes
 * @returns {Function} Unsubscribe function
 */
export function subscribe(callback) {
  state.listeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = state.listeners.indexOf(callback);
    if (index > -1) {
      state.listeners.splice(index, 1);
    }
  };
}

/**
 * Notify all listeners of state change
 */
function notifyListeners() {
  state.listeners.forEach(callback => {
    try {
      callback(state);
    } catch (error) {
      console.error('Error in state listener:', error);
    }
  });
}

/**
 * Get current state (read-only)
 * @returns {Object} Current state
 */
export function getState() {
  return { ...state };
}
