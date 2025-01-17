import { defineConfig } from 'cypress';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

const app = createApp({});
const pinia = createPinia();
app.use(pinia);

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});