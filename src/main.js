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
import './assets/styles/componentsScss/sword-cursor.css'

window.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') document.body.classList.add('keyboard-nav')
})
window.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav')
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')