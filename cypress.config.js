import { defineConfig } from "cypress";


export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: process.env.VITE_API_URL || "http://localhost:8000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
