# MEDIA QUERIES MANQUANTES - TOUS LES FICHIERS

## BREAKPOINTS STANDARDS

```scss
// Mobile first approach
$mobile: 320px;
$mobile-l: 425px;
$tablet: 768px;
$laptop: 1024px;
$desktop: 1440px;

// Ou en media queries
@media (max-width: 480px)  // Mobile
@media (max-width: 768px)  // Tablet
@media (max-width: 1024px) // Laptop
@media (min-width: 1440px) // Large desktop
```

---

## 1. ADMIN CAROUSEL VIEW (AdminCarouselView.vue)

**Actuellement: 0 media queries**

```scss
<style lang="scss" scoped>
.admin-carousel {
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  h1 {
    font-size: 2rem;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
}

.actions {
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
}

.carousel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.carousel-item {
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    
    @media (max-width: 768px) {
      height: 150px;
    }
  }
}

.item-actions {
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
}

.upload-modal {
  .modal-content {
    max-width: 600px;
    width: 90vw;
    padding: 2rem;
    
    @media (max-width: 768px) {
      width: 95vw;
      padding: 1.5rem;
    }
    
    @media (max-width: 480px) {
      padding: 1rem;
    }
  }
  
  input[type="file"] {
    width: 100%;
    
    @media (max-width: 480px) {
      font-size: 0.875rem;
    }
  }
}
</style>
```

---

## 2. ADMIN DASHBOARD (AdminDashboard.vue)

**Actuellement: 0 media queries**

```scss
<style lang="scss" scoped>
.admin-dashboard {
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.dashboard-header {
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    
    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
  }
  
  p {
    color: var(--terminal-text-dim);
    
    @media (max-width: 480px) {
      font-size: 0.875rem;
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  padding: 1.5rem;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  h3 {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }
  
  .stat-value {
    font-size: 2.5rem;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.action-card {
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  padding: 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    
    @media (max-width: 480px) {
      font-size: 1.1rem;
    }
  }
  
  p {
    font-size: 0.875rem;
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }
}

.recent-activity {
  margin-top: 2rem;
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }
}

.activity-list {
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  border-radius: 8px;
  overflow: hidden;
}

.activity-item {
  padding: 1rem;
  border-bottom: 1px solid var(--terminal-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
  }
  
  .activity-text {
    font-size: 0.875rem;
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }
  
  .activity-time {
    font-size: 0.75rem;
    color: var(--terminal-text-dim);
    
    @media (max-width: 768px) {
      font-size: 0.7rem;
    }
  }
}
</style>
```

---

## 3. LOGIN VIEW (LoginView.vue)

**Actuellement: 0 media queries**

```scss
<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: var(--terminal-bg);
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  border-bottom: 1px solid var(--terminal-border);
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    
    .back-text {
      display: none;
    }
  }
}

.page-title {
  font-size: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
}

.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
}

.login-card {
  width: 100%;
  max-width: 400px;
  
  @media (max-width: 480px) {
    max-width: 100%;
  }
}

.login-header {
  padding: 2rem 2rem 1.5rem;
  
  @media (max-width: 480px) {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  .login-icon {
    font-size: 3rem;
    
    @media (max-width: 480px) {
      font-size: 2.5rem;
    }
  }
  
  h2 {
    font-size: 1.5rem;
    
    @media (max-width: 480px) {
      font-size: 1.25rem;
    }
  }
  
  p {
    font-size: 0.8rem;
    
    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
  }
}

.login-form {
  padding: 2rem;
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
}

.form-group {
  label {
    font-size: 0.75rem;
    
    @media (max-width: 480px) {
      font-size: 0.7rem;
    }
  }
  
  input {
    padding: 0.875rem 1rem;
    font-size: 0.9rem;
    
    @media (max-width: 480px) {
      padding: 0.75rem 0.875rem;
      font-size: 0.85rem;
    }
  }
}

.password-input {
  .toggle-password {
    font-size: 1.25rem;
    
    @media (max-width: 480px) {
      font-size: 1.1rem;
    }
  }
}

.error-message {
  font-size: 0.8rem;
  padding: 0.75rem 1rem;
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.625rem 0.875rem;
  }
  
  .countdown {
    font-size: 1rem;
    
    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
    
    strong {
      font-size: 1.25rem;
      
      @media (max-width: 480px) {
        font-size: 1.1rem;
      }
    }
  }
}

.submit-btn {
  padding: 1rem;
  font-size: 0.875rem;
  
  @media (max-width: 480px) {
    padding: 0.875rem;
    font-size: 0.8rem;
  }
}

.login-footer {
  padding: 1rem 2rem;
  
  @media (max-width: 480px) {
    padding: 0.875rem 1.5rem;
  }
  
  p {
    font-size: 0.7rem;
    
    @media (max-width: 480px) {
      font-size: 0.65rem;
    }
  }
}
</style>
```

---

## 4. CONTACT PAGE - AMÉLIORATION

**Actuellement: 3 media queries - INSUFFISANT**

```scss
// Ajouter à contact.scss existant

@media (max-width: 480px) {
  .contact-page {
    padding: 5rem 0.75rem 3rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 0.9rem;
  }
  
  .contact-info h2 {
    font-size: 1.25rem;
  }
  
  .info-item {
    .label {
      font-size: 0.8rem;
    }
    
    .value {
      font-size: 1rem;
    }
  }
  
  .easter-egg-progress {
    padding: 1rem;
    
    h3 {
      font-size: 0.95rem;
    }
    
    .progress-info p {
      font-size: 0.8rem;
    }
    
    .reset-hint {
      font-size: 0.7rem;
    }
  }
  
  .contact-form-wrapper {
    padding: 1rem;
  }
  
  .form-group {
    label {
      font-size: 0.8rem;
    }
    
    input,
    textarea {
      padding: 0.625rem 0.875rem;
      font-size: 0.8rem;
    }
    
    textarea {
      min-height: 100px;
    }
  }
  
  .char-count {
    font-size: 0.7rem;
  }
  
  .submit-btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 375px) {
  .contact-page {
    padding: 4.5rem 0.5rem 2.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .contact-content {
    gap: 2rem;
  }
  
  .contact-form-wrapper {
    padding: 0.875rem;
  }
}

@media (min-width: 1024px) {
  .contact-content {
    grid-template-columns: 1fr 2.5fr;
    gap: 5rem;
  }
  
  .contact-info h2 {
    font-size: 2.25rem;
  }
}
```

---

## 5. ADMIN BOOKS VIEW - AMÉLIORATION

**Actuellement: 1 media query - TRÈS INSUFFISANT**

```scss
// Ajouter à AdminBooksView.vue styles

@media (max-width: 768px) {
  .admin-books {
    padding: 1rem;
  }
  
  .books-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    
    h1 {
      font-size: 1.5rem;
    }
  }
  
  .header-actions {
    width: 100%;
    flex-wrap: wrap;
    
    button {
      flex: 1;
      min-width: 120px;
    }
  }
  
  .search-filters {
    flex-direction: column;
    gap: 1rem;
    
    input {
      width: 100%;
    }
  }
  
  .filters {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .books-grid {
    grid-template-columns: 1fr;
  }
  
  .book-card {
    padding: 1rem;
    
    .book-cover {
      width: 80px;
      height: 120px;
    }
  }
  
  .modal-content {
    width: 95vw;
    max-width: none;
    padding: 1.5rem;
  }
  
  .modal-form {
    .form-row {
      flex-direction: column;
      
      .form-group {
        width: 100%;
      }
    }
  }
}

@media (max-width: 480px) {
  .admin-books {
    padding: 0.75rem;
  }
  
  .books-header h1 {
    font-size: 1.25rem;
  }
  
  .header-actions button {
    font-size: 0.8rem;
    padding: 0.5rem 0.875rem;
  }
  
  .book-card {
    padding: 0.875rem;
    
    .book-title {
      font-size: 1rem;
    }
    
    .book-author {
      font-size: 0.8rem;
    }
    
    .book-actions {
      flex-direction: column;
      gap: 0.5rem;
      
      button {
        width: 100%;
      }
    }
  }
  
  .modal-content {
    padding: 1rem;
  }
  
  .modal-header h2 {
    font-size: 1.25rem;
  }
}

@media (min-width: 1440px) {
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}
```

---

## INSTALLATION

### 1. Copier dans chaque fichier concerné

- AdminCarouselView.vue
- AdminDashboard.vue  
- LoginView.vue
- contact.scss (compléter)
- AdminBooksView.vue (compléter)

### 2. Tester tous breakpoints

```bash
# Chrome DevTools
- 320px (iPhone SE)
- 375px (iPhone X)
- 425px (iPhone Plus)
- 768px (iPad)
- 1024px (iPad Pro)
- 1440px (Desktop)
```

### 3. Vérifier

- [ ] Textes lisibles
- [ ] Boutons tapables (min 44x44px)
- [ ] Pas de scroll horizontal
- [ ] Images responsive
- [ ] Grids s'adaptent
- [ ] Modals full width mobile

---

## TEMPS ESTIMÉ

- AdminCarouselView: 1h
- AdminDashboard: 1h
- LoginView: 45min
- Contact (amélioration): 30min
- AdminBooksView (amélioration): 1h
- Testing complet: 1h

**TOTAL: 5-6h**


OK