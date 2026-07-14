/**
 * Vercel Web Analytics initialization
 * This module configures Vercel Web Analytics for the TechIgnite Academy website.
 * 
 * The analytics script is automatically loaded from Vercel's CDN when deployed to Vercel.
 * All page views are tracked automatically without additional configuration.
 * 
 * For custom event tracking, use: window.va('event', { name: 'event_name' })
 * 
 * Documentation: https://vercel.com/docs/analytics
 */

// Initialize the analytics queue if not already present
window.va = window.va || function () { 
  (window.vaq = window.vaq || []).push(arguments); 
};

// Optional: Configure analytics before the main script loads
// Uncomment and modify as needed:
// window.va('beforeSend', (event) => {
//   // Filter or modify events before sending
//   return event;
// });

console.log('Vercel Web Analytics configured and ready');
