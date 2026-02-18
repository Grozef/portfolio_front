# ANALYSE MANQUANTE - TESTS, API, SÉCURITÉ

## CE QUI N'A PAS ÉTÉ ANALYSÉ (ET DEVRAIT)

<!-- ---

## 1. TESTS - ABSENCE TOTALE

### BACKEND (Laravel)

**Actuellement:**
```
tests/
├── Unit/
│   └── ExampleTest.php (EXAMPLE INUTILE)
└── Feature/
    └── ExampleTest.php (EXAMPLE INUTILE)
```

**Couverture: 0%** -->

<!-- **Tests manquants critiques:**

#### Auth (AuthController)
```php
// tests/Feature/AuthTest.php - MANQUANT
- test_login_with_valid_credentials()
- test_login_with_invalid_credentials()
- test_login_brute_force_protection()
- test_login_blocked_after_3_attempts()
- test_login_lockout_expires_after_15_minutes()
- test_logout_revokes_token()
- test_me_returns_user_data()
```

#### Books (BookController)
```php
// tests/Feature/BookTest.php - MANQUANT
- test_index_returns_paginated_books()
- test_store_creates_book_with_isbn()
- test_store_validates_isbn_format()
- test_store_prevents_duplicate_isbn()
- test_update_book_requires_auth()
- test_delete_book_requires_auth()
- test_featured_books_limited_to_6()
```

#### Contact (ContactController)
```php
// tests/Feature/ContactTest.php - MANQUANT
- test_store_creates_message()
- test_store_validates_email_format()
- test_store_rate_limited_5_per_minute()
- test_store_validates_max_message_length()
```

#### Messages (MessageController)
```php
// tests/Feature/MessageTest.php - MANQUANT
- test_index_requires_auth()
- test_show_requires_auth()
- test_mark_as_read_updates_timestamp()
- test_delete_removes_message()
```

**Tests unitaires manquants:**
```php
// tests/Unit/LoginAttemptTest.php - MANQUANT
- test_is_blocked_returns_true_after_3_failures()
- test_remaining_lockout_seconds_calculation()
- test_cleanup_removes_old_attempts()

// tests/Unit/BookTest.php - MANQUANT
- test_ordered_scope_sorts_by_created_at()
- test_featured_scope_filters_featured()
- test_by_status_scope_filters()
```

**Temps estimé création tests backend:** 8-10h -->

---

<!-- ### FRONTEND (Vue 3)

**Actuellement:** AUCUN FICHIER TEST

**package.json devDependencies manquants:**
```json
{
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "sass": "^1.82.0",
    // MANQUE TOUT ÇA:
    "@vue/test-utils": "^2.4.0",
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "happy-dom": "^12.0.0",
    "cypress": "^13.0.0",
    "@playwright/test": "^1.40.0"
  }
}
``` -->

<!-- **Tests composants manquants:**

#### TerminalInterface.vue
```javascript
// TerminalInterface.spec.js - MANQUANT
describe('TerminalInterface', () => {
  it('displays welcome message on mount')
  it('processes help command')
  it('processes projects command')
  it('navigates history with arrow keys')
  it('clears terminal with Ctrl+L')
  it('shows demo mode after 5 seconds')
  it('stops demo mode on user input')
})
```

#### ContactView.vue
```javascript
// ContactView.spec.js - MANQUANT
describe('ContactView', () => {
  it('validates email format')
  it('validates required fields')
  it('shows character count')
  it('disables submit when form invalid')
  it('shows success message on submit')
  it('rate limits submissions')
  it('progressive button easter egg')
})
```

#### ProjectsView.vue
```javascript
// ProjectsView.spec.js - MANQUANT
describe('ProjectsView', () => {
  it('loads projects from GitHub API')
  it('displays project cards')
  it('navigates with arrow buttons')
  it('navigates with dots')
  it('infinite scroll loads more')
  it('opens project modal on click')
})
```

**Tests E2E manquants:**
```javascript
// cypress/e2e/navigation.cy.js - MANQUANT
describe('Navigation', () => {
  it('navigates between pages')
  it('mobile menu works')
  it('terminal commands navigate')
})

// cypress/e2e/contact.cy.js - MANQUANT
describe('Contact Form', () => {
  it('submits contact form')
  it('shows validation errors')
  it('rate limits submissions')
})

// cypress/e2e/admin.cy.js - MANQUANT
describe('Admin', () => {
  it('logs in admin')
  it('blocks after 3 failed attempts')
  it('manages books')
  it('manages carousel')
})
```

**Temps estimé création tests frontend:** 12-15h

---

en cours -->








## 2. API RESOURCES & FORM REQUESTS

<!-- ### MANQUE: Form Requests

**Actuellement:** Validation inline dans controllers (verbose, non réutilisable)

**À créer:**

```php
// app/Http/Requests/StoreBookRequest.php - MANQUANT
class StoreBookRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'isbn' => ['nullable', 'string', 'regex:/^(?:\d{9}[\dXx]|\d{13})$/'],
            'title' => 'nullable|string|max:255',
            'author' => 'nullable|string|max:255',
            'genre' => 'nullable|string|max:100',
            'cover_url' => 'nullable|url|max:500',
            'status' => 'in:read,reading,to-read',
            'rating' => 'nullable|integer|min:1|max:5',
            'review' => 'nullable|string|max:5000',
            'is_featured' => 'boolean',
        ];
    }
}

// app/Http/Requests/UpdateBookRequest.php - MANQUANT
// app/Http/Requests/StoreContactRequest.php - MANQUANT
// app/Http/Requests/LoginRequest.php - MANQUANT
```

**Bénéfices:**
- Code controller plus propre
- Réutilisation validation
- Messages d'erreur centralisés
- Autorisation intégrée

--- -->

<!-- ### MANQUE: API Resources

**Actuellement:** Arrays construits manuellement dans controllers

**À créer:**

```php
// app/Http/Resources/BookResource.php - MANQUANT
class BookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'isbn' => $this->isbn,
            'title' => $this->display_title,
            'author' => $this->display_author,
            'cover_url' => $this->cover_url,
            'status' => $this->status,
            'rating' => $this->rating,
            'is_featured' => $this->is_featured,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}

// app/Http/Resources/BookCollection.php - MANQUANT
class BookCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total' => $this->total(),
                'current_page' => $this->currentPage(),
            ],
        ];
    }
}

// app/Http/Resources/UserResource.php - MANQUANT
// app/Http/Resources/ContactMessageResource.php - MANQUANT
// app/Http/Resources/CarouselImageResource.php - MANQUANT
```

**Bénéfices:**
- Format JSON consistent
- Masquer attributs sensibles (passwords, tokens)
- Relations chargées conditionnellement
- Versioning API facilité

--- -->

<!-- ## 3. SÉCURITÉ - MANQUES CRITIQUES

### MessageController - Pas de pagination

**Problème actuel:**
```php
// Line 25 MessageController.php
public function index(): JsonResponse
{
    $messages = ContactMessage::orderByDesc('created_at')->get();
    // GET ALL = CRASHERA avec 10k+ messages
```

**Fix:**
```php
public function index(Request $request): JsonResponse
{
    $perPage = $request->input('per_page', 50);
    $messages = ContactMessage::orderByDesc('created_at')
        ->paginate($perPage);
    
    return response()->json([
        'success' => true,
        'data' => $messages->items(),
        'meta' => [
            'current_page' => $messages->currentPage(),
            'total' => $messages->total(),
        ],
    ]);
}
```

---

### BookController - Pas de sanitization URLs

**Problème actuel:**
```php
// Line 134 BookController.php
'cover_url' => 'nullable|url|max:500',
// Valide URL mais pas de vérification domaine
```

**Fix:**
```php
'cover_url' => [
    'nullable',
    'url',
    'max:500',
    Rule::in(['covers.openlibrary.org', 'books.google.com']), // Whitelist
],
```

---

### ContactController - Pas de honeypot anti-spam

**Manque protection spam bot:**
```php
// Add honeypot field
<input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">

// Validation
if ($request->filled('website')) {
    // Bot detected
    return response()->json(['success' => false], 200); // Fake success
}
```

---

### AuthController - Password pas hashé en BDD

**À vérifier:**
```php
// Si User créé manuellement:
User::create([
    'password' => 'plaintext' // DANGER
]);

// Doit être:
User::create([
    'password' => Hash::make('plaintext')
]);
```

---

### CarouselImageController - Validation images manquante

**Problème actuel:**
```php
// Upload sans vérification MIME type
'image' => 'required|file|max:5120',
```

**Fix:**
```php
'image' => [
    'required',
    'file',
    'mimes:jpeg,jpg,png,webp', // MIME types
    'max:5120', // 5MB
    'dimensions:min_width=100,min_height=100,max_width=4000,max_height=4000',
],
```

---
 -->


 





<!-- en cours -->







<!-- ### CORS - Configuration à vérifier

**Fichier:** `config/cors.php`

**Vérifier:**
```php
'allowed_origins' => ['*'], // DANGER en production
// Doit être:
'allowed_origins' => [
    'https://portfolio.domain.com',
    'http://localhost:5173', // Dev only
],
```

--- -->

<!-- ### Headers sécurité manquants

**Middleware:** `app/Http/Middleware/AddCustomHeaders.php`

**Manque:**
```php
// À ajouter
'X-Content-Type-Options' => 'nosniff',
'X-Frame-Options' => 'DENY',
'X-XSS-Protection' => '1; mode=block',
'Referrer-Policy' => 'strict-origin-when-cross-origin',
'Permissions-Policy' => 'geolocation=(), microphone=()',
```

--- -->

<!-- ### SQL Injection - Vérification Eloquent

**Status:** ✅ Protégé par Eloquent ORM

**Mais attention à:**
```php
// DANGER - Raw queries non bindées
DB::select("SELECT * FROM books WHERE title = '$request->title'");

// OK - Bindings
DB::select("SELECT * FROM books WHERE title = ?", [$request->title]);

// MIEUX - Eloquent
Book::where('title', $request->title)->get();
```

---

### XSS - Protection Laravel native

**Status:** ✅ Blade escape automatiquement

**Mais attention en Vue:**
```vue
<!-- DANGER -->
<div v-html="userInput"></div>

<!-- OK - sanitize d'abord -->
<div v-html="sanitize(userInput)"></div>
```

--- -->

## 4. PERFORMANCE & OPTIMISATION

### N+1 Queries

**BookController ligne 90:**
```php
$books->each(fn($book) => $this->ensureCache($book));
// Potentiel N+1 si ensureCache fait requête
```

**Fix:**
```php
// Eager load relations
Book::with(['author', 'publisher'])->featured()->get();
```

---

### Cache manquant

**Routes API publiques pas cachées:**
```php
// routes/api.php
Route::get('/books', [BookController::class, 'index']);
// Pas de cache

// À ajouter
Route::get('/books', [BookController::class, 'index'])
    ->middleware('cache.headers:public;max_age=300');
```

---

### Images non optimisées

**CarouselImageController:**
- Pas de resize automatique
- Pas de WebP conversion
- Pas de lazy loading

**À implémenter:**
```php
use Intervention\Image\Facades\Image;

$image = Image::make($request->file('image'))
    ->resize(1200, null, function ($constraint) {
        $constraint->aspectRatio();
    })
    ->encode('webp', 85)
    ->save(storage_path('app/public/carousel/image.webp'));
```

---

<!-- ## 5. COLLECTIONS API

### Manque: API Versioning

**Actuellement:**
```
/api/v1/books
/api/v1/contact
```

**OK** - Versioning présent mais pas de v2 strategy

--- -->

### Manque: Rate Limiting granulaire

**Actuellement:**
```php
// routes/api.php ligne 83-84
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:5,1'); // 5/minute
```

**À améliorer:**
```php
// Différent par route
'throttle:api', // 60/minute general
'throttle:contact', // 5/minute contact
'throttle:upload', // 10/hour uploads
```

---

### Manque: Soft Deletes

**Books/Messages supprimés définitivement**

**À ajouter:**
```php
// Migration
$table->softDeletes();

// Model
use SoftDeletes;

// Query
Book::withTrashed()->get();
Book::onlyTrashed()->get();
```

---



























## RÉCAPITULATIF MANQUES

### TESTS
- [ ] Tests backend Feature (8h)
- [ ] Tests backend Unit (4h)
- [ ] Tests frontend composants (8h)
- [ ] Tests frontend E2E (4h)
- [ ] Configuration CI/CD (2h)

### API ARCHITECTURE
- [ ] FormRequests (2h)
- [ ] API Resources (3h)
- [ ] Pagination MessageController (30min)
- [ ] API versioning strategy (1h)

### SÉCURITÉ
- [ ] Image upload validation (1h)
- [ ] URL sanitization (30min)
- [ ] Honeypot anti-spam (1h)
- [ ] Security headers (30min)
- [ ] CORS production config (30min)

### PERFORMANCE
- [ ] Query optimization (2h)
- [ ] Response caching (2h)
- [ ] Image optimization (3h)
- [ ] Database indexes (1h)

### CODE QUALITY
- [ ] PHPStan/Larastan (2h)
- [ ] ESLint frontend (1h)
- [ ] Pre-commit hooks (1h)

**TEMPS TOTAL: 50-60h**

---

## IMPACT SUR SCORE

**Score actuel: 5.5/10**

**Après tests + sécurité + API:**
- Tests: +1.5 (critical pour prod)
- Sécurité: +1.0 (headers, validation)
- API Resources: +0.5 (clean code)
- Performance: +0.5 (cache, optimization)

**Nouveau score potentiel: 9.0/10**

Portfolio production-ready pour mid-level full-stack.