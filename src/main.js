import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import naive from 'naive-ui'
import './style.css'

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

const app = createApp(App)
const pinia = createPinia()
pinia.use(createPersistedState())

app.use(pinia)
app.use(naive)
app.use(router)
app.mount('#app')
