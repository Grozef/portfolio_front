# ARIA LABELS MANQUANTS - LISTE EXHAUSTIVE

## NAVIGATION PRINCIPALE (HomeView.vue)

### Desktop Nav (ligne 10-16)
```vue
<nav class="nav desktop-nav" role="navigation" aria-label="Primary navigation">
  <router-link to="/" class="nav-link active" aria-current="page">terminal</router-link>
  <router-link to="/projects" class="nav-link">projects</router-link>
  <router-link to="/books" class="nav-link">books</router-link>
  <router-link to="/about" class="nav-link">about</router-link>
  <router-link to="/contact" class="nav-link">contact</router-link>
</nav>
```

### Mobile Menu Button (ligne 18)
```vue
<button 
  class="mobile-menu-btn" 
  @click="toggleMobileMenu"
  aria-label="Toggle navigation menu"
  :aria-expanded="isMobileMenuOpen"
>
```

### Mobile Nav (ligne 29)
```vue
<nav class="mobile-nav" :class="{ open: isMobileMenuOpen }" role="navigation" aria-label="Mobile navigation">
```

---

## PROJECTS PAGE (ProjectsView.vue)

### Back Button (ligne 4)
```vue
<button class="back-btn" @click="goToTerminal" aria-label="Return to terminal">
```

### Project Cards (ligne 25-88)
```vue
<article 
  class="project-card"
  :aria-label="`Project: ${project.name}`"
  role="article"
>
```

### Navigation Arrows (ligne 92-124)
```vue
<button 
  class="nav-arrow nav-arrow-prev"
  :disabled="activeIndex === 0"
  aria-label="Previous project"
>

<button 
  class="nav-arrow nav-arrow-next"
  :disabled="activeIndex === projects.length - 1"
  aria-label="Next project"
>
```

### Navigation Dots (ligne 103-110)
```vue
<button 
  class="nav-dot"
  :class="{ active: activeIndex === index }"
  :aria-label="`Go to project ${index + 1}`"
  :aria-current="activeIndex === index ? 'true' : 'false'"
>
```

---

## BOOKS PAGE (BooksView.vue)

### Back Button (ligne 4)
```vue
<button class="back-btn" @click="goToTerminal" aria-label="Return to terminal">
```

### Add Book Button (ligne 11)
```vue
<button class="add-btn" @click="openAddModal" aria-label="Add new book to library">
```

### Carousel Button (ligne 12)
```vue
<button class="add-btn" @click="goToAdminCarousel" aria-label="Manage carousel images">
```

### Logout Button (ligne 13)
```vue
<button class="logout-btn" @click="handleLogout" aria-label="Logout from admin">
```

### Login Button (ligne 15)
```vue
<button class="login-btn" @click="goToLogin" aria-label="Admin login">
```

### Carousel Arrows (ligne 83-99)
```vue
<button class="carousel-arrow carousel-prev" @click="prevCarouselImage" aria-label="Previous carousel image">

<button class="carousel-arrow carousel-next" @click="nextCarouselImage" aria-label="Next carousel image">
```

### Filter Pills (ligne 124-128)
```vue
<button 
  v-for="filter in filters"
  class="filter-pill"
  :class="{ active: selectedFilter === filter.key }"
  @click="selectedFilter = filter.key"
  :aria-label="`Filter by ${filter.label}`"
  :aria-pressed="selectedFilter === filter.key"
>
????????????
```

### Book Cards (ligne 136-203)
```vue
<article 
  class="book-card"
  :aria-label="`Book: ${book.display_title} by ${book.display_author}`"
  role="article"
>
```

### Fleeing Button (ligne 208)
```vue
<button 
  class="add-book-btn fleeing"
  @mouseenter="handleMouseEnter"
  @click="handleFleeingClick"
  aria-label="Add book (easter egg)"

  in component
>
```

---













<!--  

icicicicicicicicicicic

-->





















## ABOUT PAGE (AboutView.vue)

### Back Button (ligne 4)
```vue
<router-link to="/" class="back-btn" aria-label="Back to home">
```

### CTA Button (ligne 99)
```vue
<router-link to="/contact" class="cta-button" aria-label="Contact me">
```

---

## CONTACT PAGE (ContactView.vue)

**DÉJÀ FAIT** - 8 aria-label présents
























---

## LOGIN PAGE (LoginView.vue)

### Back Button (ligne 4)
```vue
<button class="back-btn" @click="goToTerminal" aria-label="Back to site">
```

### Password Toggle (ligne 32)
```vue
<button 
  type="button" 
  class="toggle-password" 
  @click="showPassword = !showPassword"
  :aria-label="showPassword ? 'Hide password' : 'Show password'"
>
```

### Submit Button (ligne 45) - MANQUE aria-busy
```vue
<button 
  type="submit" 
  class="submit-btn"
  :disabled="authStore.isLoading || countdown > 0"
  :aria-busy="authStore.isLoading"
  aria-label="Login to admin panel"
>
```

---

## ADMIN DASHBOARD (AdminDashboard.vue)

### Stats Cards
```vue
<div class="stat-card" role="region" aria-labelledby="stat-books">
  <h3 id="stat-books">Total Books</h3>
```

### Quick Actions Buttons
```vue
<button aria-label="Add new book">
<button aria-label="Manage carousel">
<button aria-label="View messages">
```

---

## ADMIN BOOKS VIEW (AdminBooksView.vue)

### Search Input
```vue
<input 
  type="search"
  v-model="searchQuery"
  placeholder="Search books..."
  aria-label="Search books by title, author or ISBN"
>
```

### Filter Buttons
```vue
<button 
  v-for="filter in filters"
  :aria-label="`Filter by ${filter.label}`"
  :aria-pressed="selectedFilter === filter.key"
>
```

### Add Book Modal
```vue
<div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
  <h2 id="modal-title">Add Book</h2>
  <button aria-label="Close modal">✕</button>
```

### Edit/Delete Buttons
```vue
<button aria-label="Edit book">
<button aria-label="Delete book">
<button aria-label="Toggle featured status">


?????????????????????????????????
```

---

## TERMINAL INTERFACE (TerminalInterface.vue)

### Demo Stop Button (ligne 42)
```vue
<button @click="stopDemoMode" class="demo-stop" aria-label="Stop demo mode">
```

### Terminal Container
```vue
<div class="terminal" @click="focusInput" role="application" aria-label="Interactive terminal">
```

### macOS Controls (ligne 51-54) - DÉCORATIFS
```vue
<span class="control control--close" role="presentation"></span>
<span class="control control--minimize" role="presentation"></span>
<span class="control control--maximize" role="presentation"></span>
```

---

## PROJECT MODAL (ProjectModal.vue)

### Modal Container
```vue
<div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">

????????????????????????????????????????????
```

### Close Button
```vue
<button @click="$emit('close')" aria-label="Close project details">
```

### Section Navigation
```vue
<button 
  v-for="section in sections"
  :aria-label="`View ${section.title} section`"
  :aria-current="currentSection === index ? 'true' : 'false'"
>
```

---

## FOOTER (FooterComponent.vue)

### Navigation
```vue
<nav aria-label="Footer navigation">

???????????????????????????????????
```

### Social Links
```vue
<a href="..." target="_blank" rel="noopener" aria-label="Visit GitHub profile">
<a href="..." target="_blank" rel="noopener" aria-label="Visit LinkedIn profile">
```

---

## DARK MODE TOGGLE (DarkModeToggle.vue)

**DÉJÀ FAIT** - aria-label présent

---

## SWORD TRIGGER (SwordTrigger.vue)

**DÉJÀ FAIT** - aria-label présent

---

## WEATHER BACKGROUND (WeatherBackground.vue)

**DÉJÀ FAIT** - role et aria-label présents

---

## RÉSUMÉ PAR PRIORITÉ

### CRITIQUE (empêche accessibilité)
1. Navigation principale (nav desktop + mobile)
2. Boutons modals (close, submit)
3. Forms inputs sans label visible
4. Boutons back/retour sur toutes pages

### IMPORTANTE (améliore UX)
5. Project cards navigation (arrows, dots)
6. Book filters et carousel
7. Admin search et filters
8. Password toggle
9. aria-pressed sur boutons filtres

### NICE-TO-HAVE
10. role="article" sur cards
11. role="presentation" sur éléments décoratifs
12. aria-busy sur loading states
13. aria-current sur navigation active

---

## CHECKLIST D'IMPLÉMENTATION

```
[ ] HomeView.vue - Navigation (desktop + mobile)
[ ] ProjectsView.vue - Back button, arrows, dots, cards
[ ] BooksView.vue - Tous boutons, carousel, filters
[ ] AboutView.vue - Back button, CTA
[ ] LoginView.vue - Password toggle, submit aria-busy
[ ] AdminDashboard.vue - Stats regions, quick actions
[ ] AdminBooksView.vue - Search, filters, modals, edit/delete
[ ] ProjectModal.vue - Modal dialog, close, sections nav
[ ] FooterComponent.vue - Nav label, social links
[ ] TerminalInterface.vue - Demo stop, terminal role
```

**Total estimé: 80-100 aria labels à ajouter**
**Temps: 3-4h**
