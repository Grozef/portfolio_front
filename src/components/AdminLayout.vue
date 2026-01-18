<!--
  AdminLayout.vue - Layout admin avec sidebar
  
  Fonctionnalites:
  - Sidebar navigation
  - Header avec user info
  - Slot pour le contenu
-->
<script setup>
    import { computed } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useAuthStore } from '@/stores/auth'
    
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    
    const user = computed(() => authStore.user)
    
    const menuItems = [
      { path: '/admin', icon: '◆', label: 'Dashboard', exact: true },
      { path: '/admin/books', icon: '◈', label: 'Books' },
      { path: '/admin/messages', icon: '◇', label: 'Messages' },
    ]
    
    const isActive = (item) => {
      if (item.exact) {
        return route.path === item.path
      }
      return route.path.startsWith(item.path)
    }
    
    const handleLogout = async () => {
      await authStore.logout()
      router.push('/')
    }
    
    const goToSite = () => {
      router.push('/')
    }
    </script>
    
    <template>
      <div class="admin-layout">
        <!-- Sidebar -->
        <aside class="sidebar">
          <div class="sidebar-header">
            <span class="logo-symbol">◆</span>
            <span class="logo-text">Admin</span>
          </div>
    
          <nav class="sidebar-nav">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="nav-item"
              :class="{ active: isActive(item) }"
              data-cursor-hover
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
            </router-link>
          </nav>
    
          <div class="sidebar-footer">
            <button class="site-btn" @click="goToSite" data-cursor-hover>
              <span class="btn-icon">←</span>
              <span>View Site</span>
            </button>
          </div>
        </aside>
    
        <!-- Main Content -->
        <div class="main-wrapper">
          <!-- Header -->
          <header class="admin-header">
            <div class="header-title">
              <slot name="header-title">Dashboard</slot>
            </div>
            
            <div class="header-actions">
              <div class="user-info" v-if="user">
                <span class="user-name">{{ user.name }}</span>
                <span class="user-email">{{ user.email }}</span>
              </div>
              <button class="logout-btn" @click="handleLogout" data-cursor-hover>
                Logout
              </button>
            </div>
          </header>
    
          <!-- Content -->
          <main class="admin-content">
            <slot></slot>
          </main>
        </div>
      </div>
    </template>
    
    <style lang="scss" scoped>
    .admin-layout {
      min-height: 100vh;
      display: flex;
      background: var(--terminal-bg);
    }
    
    .sidebar {
      width: 240px;
      background: var(--terminal-bg-secondary);
      border-right: 1px solid var(--terminal-border);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 100;
    }
    
    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--terminal-border);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    
      .logo-symbol {
        color: var(--terminal-accent);
        font-size: 1.5rem;
      }
    
      .logo-text {
        font-family: var(--font-display);
        font-size: 1.25rem;
        font-weight: 500;
        color: var(--terminal-text);
      }
    }
    
    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.5rem;
      color: var(--terminal-text-dim);
      font-family: var(--font-mono);
      font-size: 0.875rem;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    
      &:hover {
        color: var(--terminal-text);
        background: rgba(255, 255, 255, 0.02);
      }
    
      &.active {
        color: var(--terminal-accent);
        background: rgba(255, 255, 255, 0.03);
        border-left-color: var(--terminal-accent);
      }
    
      .nav-icon {
        font-size: 1rem;
      }
    }
    
    .sidebar-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--terminal-border);
    }
    
    .site-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background: transparent;
      border: 1px solid var(--terminal-border);
      color: var(--terminal-text-dim);
      font-family: var(--font-mono);
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s ease;
    
      &:hover {
        border-color: var(--terminal-accent);
        color: var(--terminal-accent);
      }
    
      .btn-icon {
        transition: transform 0.2s ease;
      }
    
      &:hover .btn-icon {
        transform: translateX(-3px);
      }
    }
    
    .main-wrapper {
      flex: 1;
      margin-left: 240px;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .admin-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: var(--terminal-bg-secondary);
      border-bottom: 1px solid var(--terminal-border);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    
    .header-title {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 500;
      color: var(--terminal-text);
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .user-info {
      text-align: right;
    
      .user-name {
        display: block;
        font-family: var(--font-mono);
        font-size: 0.875rem;
        color: var(--terminal-text);
      }
    
      .user-email {
        display: block;
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--terminal-text-dim);
      }
    }
    
    .logout-btn {
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid var(--terminal-border);
      color: var(--terminal-text-dim);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
    
      &:hover {
        border-color: #ff6464;
        color: #ff6464;
      }
    }
    
    .admin-content {
      flex: 1;
      padding: 2rem;
    }
    
    @media (max-width: 768px) {
      .sidebar {
        width: 60px;
    
        .logo-text,
        .nav-label,
        .site-btn span:not(.btn-icon) {
          display: none;
        }
    
        .sidebar-header {
          justify-content: center;
          padding: 1rem;
        }
    
        .nav-item {
          justify-content: center;
          padding: 1rem;
        }
    
        .site-btn {
          justify-content: center;
        }
      }
    
      .main-wrapper {
        margin-left: 60px;
      }
    }
    </style>