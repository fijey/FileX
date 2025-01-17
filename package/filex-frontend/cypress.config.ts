import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    retries: {
      runMode: 2,
      openMode: 0
    },
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {},
    env: {
      apiUrl: 'http://localhost:3000'
    }
  }
})