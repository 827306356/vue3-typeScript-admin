import { createApp } from 'vue'
import 'normalize.css'
import './assets/css/index.less'
import App from './App.vue'
import router from './router'
import pinia from './store'
import golbal from './global/register-icons'

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(golbal)
app.mount('#app')
