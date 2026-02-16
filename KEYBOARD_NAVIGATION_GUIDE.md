# KEYBOARD NAVIGATION - EXPLICATION ET IMPLÉMENTATION

## C'EST QUOI KEYBOARD NAVIGATION ?

Navigation au clavier = utiliser le site SANS souris, uniquement avec:
- **Tab** - Aller au prochain élément
- **Shift+Tab** - Revenir en arrière
- **Enter/Space** - Activer bouton/lien
- **Esc** - Fermer modal/menu
- **Flèches** - Naviguer dans listes/carousels

**Pourquoi c'est important:**
- Accessibilité (handicap moteur, malvoyants avec lecteur écran)
- Power users (devs, admins qui préfèrent clavier)
- Conformité WCAG 2.1 niveau AA

---

## TON PORTFOLIO - ÉTAT ACTUEL

### ✅ CE QUI MARCHE DÉJÀ

**TerminalInterface.vue:**
```javascript
// Ligne 1002-1013 - Keyboard shortcuts
if (e.key === 'ArrowUp') {
  e.preventDefault()
  localInput.value = terminalStore.getPreviousCommand()
} else if (e.key === 'ArrowDown') {
  e.preventDefault()
  localInput.value = terminalStore.getNextCommand()
} else if (e.key === 'l' && e.ctrlKey) {
  e.preventDefault()
  terminalStore.clearHistory()
}
```

**ContactView.vue:**
- Tab entre inputs fonctionne
- Enter soumet form

### ❌ CE QUI MANQUE

1. **Focus visible** - Pas de outline quand Tab
2. **Modal trap** - Focus sort des modals
3. **Skip links** - Pas de "Skip to content"
4. **Esc handlers** - Modals ne se ferment pas avec Esc
5. **Arrow navigation** - Projects/Books carousels pas navigables
6. **Mobile menu** - Pas de Esc pour fermer

---

## IMPLÉMENTATIONS NÉCESSAIRES

### 1. FOCUS VISIBLE GLOBAL

**Fichier: `main.scss`**

```scss
// Focus indicators visibles
*:focus-visible {
  outline: 2px solid var(--terminal-accent);
  outline-offset: 2px;
  border-radius: 2px;
}

// Supprimer focus par défaut sur click souris
*:focus:not(:focus-visible) {
  outline: none;
}

// Focus pour boutons
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--terminal-accent);
  outline-offset: 4px;
}

// Focus pour inputs
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid var(--terminal-accent);
  outline-offset: 0;
  border-color: var(--terminal-accent);
}
```

---

### 2. SKIP TO CONTENT LINK

**Fichier: `App.vue`**

```vue
<template>
  <div id="app">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <router-view />
  </div>
</template>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--terminal-accent);
  color: var(--terminal-bg);
  padding: 0.5rem 1rem;
  text-decoration: none;
  z-index: 9999;
  font-family: var(--font-mono);
}

.skip-link:focus {
  top: 0;
}
</style>
```

**Dans chaque page:**
```vue
<main id="main-content" tabindex="-1">
  <!-- Contenu -->
</main>
```

---

### 3. MODAL FOCUS TRAP

**Fichier: `ProjectModal.vue`**

```vue
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const modalRef = ref(null)
const previousFocus = ref(null)

// Capturer éléments focusables
const getFocusableElements = () => {
  if (!modalRef.value) return []
  
  return modalRef.value.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  )
}

// Trap focus dans modal
const trapFocus = (e) => {
  if (e.key !== 'Tab') return
  
  const focusable = getFocusableElements()
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

// Fermer avec Esc
const handleEsc = (e) => {
  if (e.key === 'Escape') {
    handleClose()
  }
}

const handleClose = () => {
  emit('close')
  // Restore focus
  if (previousFocus.value) {
    previousFocus.value.focus()
  }
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // Sauver focus actuel
    previousFocus.value = document.activeElement
    
    // Ajouter listeners
    document.addEventListener('keydown', trapFocus)
    document.addEventListener('keydown', handleEsc)
    
    // Focus premier élément
    nextTick(() => {
      const focusable = getFocusableElements()
      if (focusable.length) focusable[0].focus()
    })
  } else {
    // Retirer listeners
    document.removeEventListener('keydown', trapFocus)
    document.removeEventListener('keydown', handleEsc)
  }
})
</script>
```

---

### 4. CAROUSEL NAVIGATION (Projects/Books)

**Fichier: `ProjectsView.vue`**

```vue
<script setup>
// Ajouter keyboard navigation
const handleKeyNav = (e) => {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    goToPrevProject()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    goToNextProject()
  } else if (e.key === 'Home') {
    e.preventDefault()
    scrollToProject(0)
  } else if (e.key === 'End') {
    e.preventDefault()
    scrollToProject(projects.value.length - 1)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyNav)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyNav)
})
</script>

<template>
  <div 
    class="projects-scroll"
    role="region"
    aria-label="Projects carousel"
    aria-roledescription="carousel"
    tabindex="0"
  >
```

---

### 5. MOBILE MENU ESC

**Fichier: `HomeView.vue`**

```vue
<script setup>
const handleEsc = (e) => {
  if (e.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
})
</script>
```

---

### 6. CUSTOM CURSOR DÉSACTIVÉ SUR TAB

**Fichier: `CustomCursor.vue`**

```vue
<script setup>
const isKeyboardUser = ref(false)

const handleTab = (e) => {
  if (e.key === 'Tab') {
    isKeyboardUser.value = true
    document.body.style.cursor = 'auto'
  }
}

const handleMouseMove = () => {
  if (isKeyboardUser.value) {
    isKeyboardUser.value = false
    document.body.style.cursor = 'none'
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleTab)
  document.addEventListener('mousemove', handleMouseMove)
})
</script>
```

---

## CHECKLIST COMPLÈTE

### Focus Management
```
[ ] main.scss - Focus visible styles
[ ] App.vue - Skip to content link
[ ] Toutes pages - id="main-content" sur <main>
[ ] CustomCursor - Désactiver sur Tab
```

### Modal Focus Trap
```
[ ] ProjectModal.vue - Focus trap + Esc
[ ] AdminBooksView - Modal add/edit focus trap
[ ] AdminCarouselView - Modal focus trap
[ ] CookieSettings - Modal focus trap
```

### Keyboard Navigation
```
[ ] ProjectsView - Arrow left/right, Home/End
[ ] BooksView - Carousel arrows keyboard
[ ] HomeView - Mobile menu Esc
[ ] AdminDashboard - Tab order logique
```

### Testing
```
[ ] Tab à travers toute la page
[ ] Shift+Tab retour
[ ] Enter/Space sur boutons
[ ] Esc ferme modals/menus
[ ] Arrows dans carousels
[ ] Custom cursor s'enlève sur Tab
```

---

## OUTILS DE TEST

### Browser DevTools
```javascript
// Console - Voir élément focus
document.addEventListener('focusin', (e) => {
  console.log('Focus:', e.target)
})
```

### Extension Chrome
- **axe DevTools** - Audit accessibilité
- **WAVE** - Test WCAG
- **Tab key tracker** - Visualise tab order

### Test manuel
1. Déconnecter souris
2. Utiliser que clavier
3. Naviguer tout le site
4. Vérifier focus visible partout

---

## TEMPS ESTIMÉ

- Focus visible global: **30min**
- Skip link: **15min**
- Modal focus traps (4 modals): **2h**
- Carousel keyboard nav: **1h**
- Mobile menu Esc: **15min**
- Custom cursor keyboard: **30min**
- Testing complet: **1h**

**TOTAL: 5-6h**

---

## RESSOURCES

- [WCAG 2.1 Keyboard Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)
- [Focus Management Best Practices](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
- [Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
