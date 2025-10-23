/**
 * Chart Module
 * Chart rendering using Chart.js
 */

import { formatCurrency } from './utils.js';

// CFA Brand Colors (WCAG AA verified)
const COLORS = {
  coupon: '#3369FF',      // 4.55:1 contrast
  mint: '#49b2b8',
  purchase: '#f2af81',
  darkText: '#06005a'
};

let chartInstance = null;

/**
 * Create or update bond cash flow chart
 * @param {Array} cashFlows - Array of cash flow objects
 * @param {boolean} showLabels - Whether to show value labels
 */
export function renderChart(cashFlows, showLabels = true) {
  const canvas = document.getElementById('bond-chart');
  
  if (!canvas) {
    console.error('Chart canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  
  // Prepare data for Chart.js
  const labels = cashFlows.map(cf => cf.yearLabel);

  
  // Separate coupon and principal data
  const couponData = cashFlows.map(cf => cf.couponPayment);
  const principalData = cashFlows.map(cf => cf.principalPayment);
  
  // Calculate total for labels
  const totalData = cashFlows.map(cf => cf.totalCashFlow);
  
  // Destroy existing chart instance
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  // Create new chart with custom label drawing
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Principal repayment',
          data: principalData,
          backgroundColor: principalData.map(val => 
            val >= 0 ? COLORS.mint : COLORS.purchase
          ),
          borderColor: '#333',
          borderWidth: 1,
          stack: 'cashflow'
        },
        {
          label: 'Coupon payment',
          data: couponData,
          backgroundColor: COLORS.coupon,
          borderColor: '#333',
          borderWidth: 1,
          stack: 'cashflow'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        title: {
          display: false
        },
        legend: {
          display: false // Using custom legend in HTML
        },
        tooltip: {
          callbacks: {
            title: (context) => {
              const index = context[0].dataIndex;
              return `Period: ${cashFlows[index].yearLabel} years`;
            },
            label: (context) => {
              const value = context.parsed.y;
              return `${context.dataset.label}: ${formatCurrency(value, true)}`;
            },
            footer: (context) => {
              const index = context[0].dataIndex;
              const total = totalData[index];
              return `Total: ${formatCurrency(total, true)}`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Years'
          },
          grid: {
            display: false
          }
        },
        y: {
          title: {
            display: false
          },
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      },
      layout: {
        padding: {
          left: 20, // Important for zoom support (not 50)
          right: 30,
          top: showLabels ? 40 : 20, // More top padding for labels
          bottom: 60
        }
      }
    },
    plugins: [{
      // Custom plugin to draw labels on top of stacked bars
      id: 'stackedBarLabels',
      afterDatasetsDraw: (chart) => {
        if (!showLabels) return;
        
        const ctx = chart.ctx;
        ctx.save();
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = COLORS.darkText;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        
        chart.data.labels.forEach((label, index) => {
          const total = totalData[index];
          if (Math.abs(total) < 0.01) return;
          
          // Find the top of the stacked bars
          const meta0 = chart.getDatasetMeta(0);
          const meta1 = chart.getDatasetMeta(1);
          
          if (!meta0.data[index] || !meta1.data[index]) return;
          
          const bar0 = meta0.data[index];
          const bar1 = meta1.data[index];
          
          // Get the topmost point
          const x = bar1.x;
          const y = Math.min(bar0.y, bar1.y) - 5; // 5px above the bar
          
          // Draw the label
          ctx.fillText(formatCurrency(total, true), x, y);
        });
        
        ctx.restore();
      }
    },
  {
  id: 'outerBorders',
  afterDatasetsDraw: (chart) => {
    const ctx = chart.ctx;
    ctx.save();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    // Loop through all datasets and bars
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((bar) => {
        // Each bar is a rectangle, with these properties:
        // bar.x (center X), bar.y (top Y), bar.base (bottom Y), bar.width, bar.height
        const x = bar.x - bar.width / 2;
        const y = Math.min(bar.y, bar.base);
        const width = bar.width;
        const height = Math.abs(bar.base - bar.y);

        // Draw a rectangle around the filled bar
        ctx.strokeRect(x, y, width, height);
      });
    });

    ctx.restore();
  }
}
]
  });
}

/**
 * Update chart visibility based on window width
 * @returns {boolean} True if labels should be shown
 */
export function shouldShowLabels() {
  return window.innerWidth > 860;
}

/**
 * Cleanup chart resources
 */
export function destroyChart() {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}
