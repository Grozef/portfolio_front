/**
 * Vue Router Configuration
 * 
 * Fixed: Admin-layout child route naming
 * Added: Fake admin terminal at /admin
 * Added: Real admin moved to /Moi
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

    // Fake admin terminal (Easter Egg #18)
    {
      path: '/admin',
      name: 'fake-admin',
      component: () => import('@/components/FakeAdminTerminal.vue')
    },

    // Real admin routes - moved to /Moi for security
    {
      path: '/Moi',
      component: () => import('@/views/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/AdminDashboard.vue')
        },
        {
          path: 'books',
          name: 'admin-books',
          component: () => import('@/views/AdminBooksView.vue')
        },
        {
          path: 'messages',
          name: 'admin-messages',
          component: () => import('@/views/AdminMessagesView.vue')
        },
        {
          path: 'carousel',
          name: 'admin-carousel',
          component: () => import('@/views/AdminCarouselView.vue')
        }
      ]
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

    // 404 Page - accessible directly and as catch-all
    { 
      path: '/404', 
      name: 'not-found', 
      component: () => import('@/views/NotFoundView.vue') 
    },

    // Catch-all for undefined routes
    { 
      path: '/:pathMatch(.*)*',
      name: 'catch-all',
      component: () => import('@/views/NotFoundView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard with token validation
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const authStore = useAuthStore()

  // Redirect authenticated users away from login page
  if (to.meta.guest && token) {
    return next('/Moi')
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