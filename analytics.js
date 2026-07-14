/**
 * Vercel Web Analytics initialization
 * This module loads and configures Vercel Web Analytics using the @vercel/analytics package
 */

import { inject } from 'https://esm.sh/@vercel/analytics@2.0.1';

// Initialize Vercel Web Analytics
inject({
  mode: 'auto', // Automatically detect environment (production/development)
  debug: false, // Set to true to see debug logs in development
});

// Analytics is now tracking page views automatically
console.log('Vercel Web Analytics initialized');
