/**
 * Point d'entree de l'application Vue.
 * 
 * Initialise Vue avec Pinia (store) et Vue Router.
 * 
 * @module main
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
