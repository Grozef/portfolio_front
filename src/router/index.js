/**
 * FIX: Router configuration for accessible 404 page
 * File: src/router/index.js
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

    // Legal pages
    { 
      path: '/privacy-policy', 
      name: 'privacy-policy', 
      component: () => import('@/views/PrivacyPolicyView.vue') 
    },
    { 
      path: '/legal-notice', 
      name: 'legal-notice', 
      component: () => import('@/views/LegalNoticeView.vue') 
    },
    { 
      path: '/cookies', 
      name: 'cookies', 
      component: () => import('@/views/CookiesView.vue') 
    },
    { 
      path: '/terms', 
      name: 'terms', 
      component: () => import('@/views/TermsView.vue') 
    },

    // FIX: 404 Page - accessible directement ET comme catch-all
    { 
      path: '/404', 
      name: 'not-found', 
      component: () => import('@/views/NotFoundView.vue') 
    },

    // FIX: Catch-all - affiche le composant 404 directement (pas de redirect)
    { 
      path: '/:pathMatch(.*)*',
      name: 'catch-all',
      component: () => import('@/views/NotFoundView.vue')
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

  // Protect admin routes
  if (to.meta.requiresAuth) {
    if (!token) {
      return next('/login')
    }

    try {
      const isValid = await authStore.checkAuth()
      if (!isValid) {
        return next('/login')
      }
    } catch (error) {
      localStorage.removeItem('auth_token')
      return next('/login')
    }
  }

  next()
})

export default router