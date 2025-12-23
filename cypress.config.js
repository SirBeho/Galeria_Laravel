import { defineConfig } from "cypress";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default defineConfig({
  e2e: {
    baseUrl: API_BASE_URL,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
