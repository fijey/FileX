import { createApp } from 'vue'
import App from './src/App.vue'
import './src/index.css'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())
createApp(App).mount('#app')