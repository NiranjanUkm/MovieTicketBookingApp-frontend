// src/env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_CASHFREE_MODE: 'TEST' | 'PROD';  // Adjust types based on expected values
      // Add other environment variables here if needed
    }
  }
  