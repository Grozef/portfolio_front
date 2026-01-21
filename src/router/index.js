/**
 * Configuration du routeur Vue avec validation de token.
 * 
 * IMPORTANT: Le garde de navigation valide maintenant le token
 * en appelant l'API /auth/me avant d'autoriser l'acces aux routes protegees.
 * 
 * @module router
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public routes
    { 
      path: '/', 
      name: 'home', 
      component: () => import('@/views/HomeView.vue') 
    },
    { 
      path: '/projects', 
      name: 'projects', 
      component: () => import('@/views/ProjectsView.vue') 
    },
    { 
      path: '/books', 
      name: 'books', 
      component: () => import('@/views/BooksView.vue') 
    },
    { 
      path: '/about', 
      name: 'about', 
      component: () => import('@/views/AboutView.vue') 
    },
    { 
      path: '/contact', 
      name: 'contact', 
      component: () => import('@/views/ContactView.vue') 
    },
    { 
      path: '/login', 
      name: 'login', 
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true }
    },

    // Admin routes
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminDashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/books',
      name: 'admin-books',
      component: () => import('@/views/AdminBooksView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/messages',
      name: 'admin-messages',
      component: () => import('@/views/AdminMessagesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/carousel',
      name: 'admin-carousel',
      component: () => import('@/views/AdminCarouselView.vue'),
      meta: { requiresAuth: true }
    },

    // Catch-all redirect
    { 
      path: '/:pathMatch(.*)*', 
      redirect: '/' 
    }
  ]
})

// Navigation guard avec validation de token
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const authStore = useAuthStore()

  // Redirect authenticated users away from login page
  if (to.meta.guest && token) {
    return next('/admin')
  }

  // Protect admin routes - VALIDATION CRITIQUE DU TOKEN
  if (to.meta.requiresAuth) {
    if (!token) {
      return next('/login')
    }

    // IMPORTANT: Valide le token en appelant l'API
    // Cela evite l'acces avec un token expire ou invalide
    try {
      const isValid = await authStore.checkAuth()
      if (!isValid) {
        return next('/login')
      }
    } catch (error) {
      // Si l'API retourne une erreur, le token est invalide
      localStorage.removeItem('auth_token')
      return next('/login')
    }
  }

  next()
})

export default router