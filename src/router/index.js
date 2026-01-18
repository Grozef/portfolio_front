/**
 * Configuration du routeur Vue.
 * @module router
 */
import { createRouter, createWebHistory } from 'vue-router'

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

    // Catch-all redirect
    { 
      path: '/:pathMatch(.*)*', 
      redirect: '/' 
    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const isAuthenticated = !!token

  // Redirect authenticated users away from login page
  if (to.meta.guest && isAuthenticated) {
    return next('/admin')
  }

  // Protect admin routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  next()
})

export default router