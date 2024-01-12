import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/common.scss'
import 'uno.css'
import { setupStore } from './store'
import router from './router/index'
import { setupNaive, setupDirectives} from '@/plugins';
import Vicons from '@/plugins/vicons'
import {registerComponents} from './components'
import { setupNaiveDiscreteApi } from "./utils"

async function setupApp() {
    const app = createApp(App)

   setupNaiveDiscreteApi()

    setupStore(app)

    registerComponents(app)

    setupNaive(app) 

    setupDirectives(app)

    app.use(Vicons)

    app.use(router).mount('#app')
}
setupApp()

