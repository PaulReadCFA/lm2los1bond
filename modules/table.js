/**
 * Table Module
 * Table rendering with semantic HTML and accessibility
 */

import { formatCurrency, createElement } from './utils.js';

/**
 * Render cash flow table
 * @param {Array} cashFlows - Array of cash flow objects
 * @param {number} bondPrice - Bond price for caption
 * @param {number} periods - Number of periods
 * @param {number} periodicCoupon - Periodic coupon payment
 */
export function renderTable(cashFlows, bondPrice, periods, periodicCoupon) {
  const tableElement = document.getElementById('cash-flow-table');
  
  if (!tableElement) {
    console.error('Table element not found');
    return;
  }
  
  // Clear existing content
  tableElement.innerHTML = '';
  
  // Create caption for screen readers
  const caption = createElement('caption', { className: 'sr-only' },
    `Table showing bond cash flows: Initial purchase of ${formatCurrency(bondPrice)} at year 0, ` +
    `followed by ${periods} semi-annual coupon payments of ${formatCurrency(periodicCoupon)} each, ` +
    `plus principal repayment of ${formatCurrency(100)} at maturity. ` +
    `Values in parentheses indicate cash outflows.`
  );
  tableElement.appendChild(caption);
  
  // Create table head
  const thead = createElement('thead');
  const headerRow = createElement('tr');
  
  // Header cells
  const headers = [
    { text: 'Period (Years)', scope: 'col', className: 'text-left' },
    { text: 'Coupon Payment', scope: 'col', className: 'text-right' },
    { text: 'Principal Payment', scope: 'col', className: 'text-right' },
    { text: 'Total Cash Flow', scope: 'col', className: 'text-right' }
  ];
  
  headers.forEach(header => {
    const th = createElement('th', {
      scope: header.scope,
      className: header.className
    }, header.text);
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  tableElement.appendChild(thead);
  
  // Create table body
  const tbody = createElement('tbody');
  
  cashFlows.forEach(row => {
    const tr = createElement('tr');
    
    // Period cell (row header)
    const periodTh = createElement('th', {
      scope: 'row',
      className: 'text-left'
    }, `${row.yearLabel} ${row.yearLabel === 1 ? 'year' : 'years'}`);
    tr.appendChild(periodTh);
    
    // Coupon payment cell
    const couponTd = createElement('td', { className: 'text-right' });
    if (row.couponPayment !== 0) {
      couponTd.textContent = formatCurrency(row.couponPayment);
    } else {
      const span = createElement('span', { 'aria-label': 'No payment' }, '—');
      couponTd.appendChild(span);
    }
    tr.appendChild(couponTd);
    
    // Principal payment cell
    const principalTd = createElement('td', { className: 'text-right' });
    if (row.principalPayment !== 0) {
      principalTd.textContent = formatCurrency(row.principalPayment, true);
    } else {
      const span = createElement('span', { 'aria-label': 'No payment' }, '—');
      principalTd.appendChild(span);
    }
    tr.appendChild(principalTd);
    
    // Total cash flow cell
    const totalTd = createElement('td', { className: 'text-right' });
    totalTd.textContent = formatCurrency(row.totalCashFlow, true);
    tr.appendChild(totalTd);
    
    tbody.appendChild(tr);
  });
  
  tableElement.appendChild(tbody);
  
  // Create table foot with totals
  const tfoot = createElement('tfoot');
  const footerRow = createElement('tr');
  
  // Calculate totals
  const totalCoupon = cashFlows.reduce((sum, row) => sum + row.couponPayment, 0);
  const totalPrincipal = cashFlows.reduce((sum, row) => sum + row.principalPayment, 0);
  const totalCashFlow = cashFlows.reduce((sum, row) => sum + row.totalCashFlow, 0);
  
  // Total row header
  const totalTh = createElement('th', {
    scope: 'row',
    className: 'text-left'
  }, 'Total');
  footerRow.appendChild(totalTh);
  
  // Total coupon
  const totalCouponTd = createElement('td', { className: 'text-right' });
  totalCouponTd.textContent = formatCurrency(totalCoupon);
  footerRow.appendChild(totalCouponTd);
  
  // Total principal
  const totalPrincipalTd = createElement('td', { className: 'text-right' });
  totalPrincipalTd.textContent = formatCurrency(totalPrincipal, true);
  footerRow.appendChild(totalPrincipalTd);
  
  // Total cash flow
  const totalCashFlowTd = createElement('td', { className: 'text-right' });
  totalCashFlowTd.textContent = formatCurrency(totalCashFlow, true);
  footerRow.appendChild(totalCashFlowTd);
  
  tfoot.appendChild(footerRow);
  tableElement.appendChild(tfoot);
}
