<template>
  <div class="cookies-policy">
    <div class="container">
      <div class="header">
        <h1>Politique de cookies</h1>
        <p class="last-updated">Dernière mise à jour : {{ lastUpdated }}</p>
      </div>

      <div class="content">
        <section>
          <h2>1. Qu'est-ce qu'un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, 
            tablette) lors de la visite d'un site web. Il permet au site de mémoriser des informations 
            sur votre visite, comme votre langue préférée et d'autres paramètres, afin de faciliter 
            votre prochaine visite et de rendre le site plus utile.
          </p>
          <p>
            Les cookies peuvent être placés par le site que vous visitez (cookies "first-party") 
            ou par d'autres sites web qui diffusent du contenu sur la page que vous consultez 
            (cookies "third-party").
          </p>
        </section>

        <section>
          <h2>2. Pourquoi utilisons-nous des cookies ?</h2>
          <p>Nous utilisons des cookies pour :</p>
          <ul>
            <li>Assurer le fonctionnement technique du site</li>
            <li>Mémoriser vos préférences (langue, thème)</li>
            <li>Maintenir votre session de connexion (espace administrateur)</li>
            <li>Améliorer les performances du site</li>
            <li>Analyser l'utilisation du site (anonymisé)</li>
          </ul>
        </section>

        <section>
          <h2>3. Types de cookies utilisés</h2>

          <div class="cookie-category">
            <h3>
              <span class="cookie-icon essential">●</span>
              3.1 Cookies strictement nécessaires
            </h3>
            <div class="info-box">
              <p><strong>Finalité :</strong> Indispensables au fonctionnement du site</p>
              <p><strong>Consentement :</strong> Non requis (exemptés par la CNIL)</p>
              <p><strong>Durée :</strong> Session / 24 heures</p>
            </div>
            <p>Ces cookies sont essentiels pour vous permettre de naviguer sur le site et d'utiliser ses fonctionnalités :</p>
            
            <div class="cookie-list">
              <div class="cookie-item">
                <h4>session_token</h4>
                <p><strong>Finalité :</strong> Maintien de la session utilisateur</p>
                <p><strong>Durée :</strong> Session (supprimé à la fermeture du navigateur)</p>
              </div>
              
              <div class="cookie-item">
                <h4>csrf_token</h4>
                <p><strong>Finalité :</strong> Protection contre les attaques CSRF</p>
                <p><strong>Durée :</strong> Session</p>
              </div>
              
              <div class="cookie-item">
                <h4>auth_token</h4>
                <p><strong>Finalité :</strong> Authentification administrateur</p>
                <p><strong>Durée :</strong> 24 heures</p>
              </div>
            </div>
          </div>

          <div class="cookie-category">
            <h3>
              <span class="cookie-icon functional">●</span>
              3.2 Cookies de préférences
            </h3>
            <div class="info-box">
              <p><strong>Finalité :</strong> Mémoriser vos préférences</p>
              <p><strong>Consentement :</strong> Requis</p>
              <p><strong>Durée :</strong> 6-12 mois</p>
            </div>
            <p>Ces cookies permettent au site de retenir vos choix et de personnaliser votre expérience :</p>
            
            <div class="cookie-list">
              <div class="cookie-item">
                <h4>theme_preference</h4>
                <p><strong>Finalité :</strong> Mémorisation du thème (clair/sombre)</p>
                <p><strong>Durée :</strong> 12 mois</p>
              </div>
              
              <div class="cookie-item">
                <h4>language_preference</h4>
                <p><strong>Finalité :</strong> Mémorisation de la langue</p>
                <p><strong>Durée :</strong> 12 mois</p>
              </div>
              
              <div class="cookie-item">
                <h4>cookie_consent</h4>
                <p><strong>Finalité :</strong> Enregistrement du choix sur les cookies</p>
                <p><strong>Durée :</strong> 13 mois</p>
              </div>
            </div>
          </div>

          <div class="cookie-category">
            <h3>
              <span class="cookie-icon analytics">●</span>
              3.3 Cookies analytiques
            </h3>
            <div class="info-box">
              <p><strong>Finalité :</strong> Statistiques anonymisées</p>
              <p><strong>Consentement :</strong> Requis</p>
              <p><strong>Durée :</strong> 13 mois</p>
            </div>
            <p>Ces cookies nous aident à comprendre comment vous utilisez le site (anonymisé) :</p>
            
            <div class="cookie-list">
              <div class="cookie-item">
                <h4>_ga</h4>
                <p><strong>Finalité :</strong> Distinguer les utilisateurs (Google Analytics)</p>
                <p><strong>Durée :</strong> 2 ans</p>
                <p><strong>Tiers :</strong> Google LLC</p>
              </div>
              
              <div class="cookie-item">
                <h4>_gid</h4>
                <p><strong>Finalité :</strong> Distinguer les utilisateurs (Google Analytics)</p>
                <p><strong>Durée :</strong> 24 heures</p>
                <p><strong>Tiers :</strong> Google LLC</p>
              </div>
            </div>
            
            <div class="warning-box">
              <p>
                ⚠️ Note : Si des cookies analytiques sont utilisés, ils sont configurés en mode 
                anonyme (anonymizeIP activé) conformément aux recommandations de la CNIL.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>4. Gérer vos préférences de cookies</h2>
          
          <h3>4.1 Via notre interface</h3>
          <p>
            Vous pouvez à tout moment modifier vos préférences de cookies en cliquant sur le bouton 
            ci-dessous :
          </p>
          <div class="cookie-settings">
            <button @click="openCookieSettings" class="btn btn-primary">
              ⚙️ Gérer mes cookies
            </button>
          </div>

          <h3>4.2 Via votre navigateur</h3>
          <p>
            Vous pouvez également configurer votre navigateur pour accepter ou refuser les cookies :
          </p>
          
          <div class="browser-guides">
            <div class="browser-card">
              <h4>Google Chrome</h4>
              <p>Paramètres → Confidentialité et sécurité → Cookies</p>
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">
                Guide officiel →
              </a>
            </div>
            
            <div class="browser-card">
              <h4>Mozilla Firefox</h4>
              <p>Options → Vie privée et sécurité → Cookies</p>
              <a href="https://support.mozilla.org/fr/kb/cookies" target="_blank" rel="noopener">
                Guide officiel →
              </a>
            </div>
            
            <div class="browser-card">
              <h4>Safari</h4>
              <p>Préférences → Confidentialité → Cookies</p>
              <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471" target="_blank" rel="noopener">
                Guide officiel →
              </a>
            </div>
            
            <div class="browser-card">
              <h4>Microsoft Edge</h4>
              <p>Paramètres → Confidentialité → Cookies</p>
              <a href="https://support.microsoft.com/fr-fr/microsoft-edge" target="_blank" rel="noopener">
                Guide officiel →
              </a>
            </div>
          </div>

          <div class="warning-box">
            <p>
              ⚠️ Attention : La désactivation de certains cookies peut affecter le fonctionnement 
              du site et limiter certaines fonctionnalités.
            </p>
          </div>
        </section>

        <section>
          <h2>5. Cookies tiers</h2>
          <p>Certains cookies sont déposés par des services tiers :</p>
          
          <div class="third-party-list">
            <div class="third-party-item">
              <h4>Google APIs</h4>
              <p>
                <strong>Finalité :</strong> Récupération d'informations sur les livres via Google Books API
              </p>
              <p>
                <strong>Politique :</strong> 
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
                  Politique de confidentialité Google
                </a>
              </p>
            </div>
            
            <div class="third-party-item">
              <h4>GitHub</h4>
              <p>
                <strong>Finalité :</strong> Affichage des projets via GitHub API
              </p>
              <p>
                <strong>Politique :</strong> 
                <a href="https://docs.github.com/en/site-policy/privacy-policies" target="_blank" rel="noopener">
                  Politique de confidentialité GitHub
                </a>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>6. Durée de conservation</h2>
          <p>Les cookies ont des durées de vie différentes :</p>
          <ul>
            <li><strong>Cookies de session :</strong> Supprimés à la fermeture du navigateur</li>
            <li><strong>Cookies persistants :</strong> Entre 24 heures et 13 mois maximum</li>
          </ul>
          <p>
            Conformément aux recommandations de la CNIL, les cookies non essentiels sont conservés 
            pour une durée maximale de 13 mois à compter du premier dépôt.
          </p>
        </section>

        <section>
          <h2>7. Protection des données</h2>
          <p>
            Les informations collectées via les cookies sont traitées conformément à notre 
            <router-link to="/privacy-policy">politique de confidentialité</router-link> 
            et au RGPD.
          </p>
          <p>
            Aucune donnée personnelle identifiable n'est collectée sans votre consentement explicite.
          </p>
        </section>

        <section>
          <h2>8. Vos droits</h2>
          <p>
            Vous disposez des droits suivants concernant vos données collectées via les cookies :
          </p>
          <ul>
            <li>Droit d'accès</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit d'opposition</li>
            <li>Droit à la limitation du traitement</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à : 
            <a href="mailto:contact@example.com">contact@example.com</a>
          </p>
        </section>

        <section>
          <h2>9. Modifications</h2>
          <p>
            Cette politique de cookies peut être mise à jour à tout moment. La date de dernière 
            mise à jour est indiquée en haut de cette page. Nous vous encourageons à consulter 
            régulièrement cette page.
          </p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>
            Pour toute question concernant l'utilisation des cookies sur ce site :
          </p>
          <div class="contact-buttons">
            <router-link to="/contact" class="btn btn-primary">
              Nous contacter
            </router-link>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const lastUpdated = ref('04 février 2026')

const openCookieSettings = () => {
  // Emit event to open cookie consent modal
  window.dispatchEvent(new CustomEvent('open-cookie-settings'))
  // Or integrate with your cookie consent solution
  alert('Fonctionnalité de gestion des cookies à implémenter')
}
</script>

<style scoped lang="scss">
.cookies-policy {
  min-height: 100vh;
  background: var(--bg-primary, #0a0a0f);
  color: var(--text-primary, #e0e0e0);
  padding: 2rem 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid rgba(0, 255, 255, 0.2);
  
  h1 {
    font-size: 2.5rem;
    color: #00ffff;
    margin-bottom: 0.5rem;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  .last-updated {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
  }
}

.content {
  section {
    margin-bottom: 3rem;
    
    h2 {
      font-size: 1.8rem;
      color: #00ffff;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(0, 255, 255, 0.3);
      
      @media (max-width: 768px) {
        font-size: 1.5rem;
      }
    }
    
    h3 {
      font-size: 1.3rem;
      color: #00ccff;
      margin: 1.5rem 0 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      @media (max-width: 768px) {
        font-size: 1.1rem;
      }
    }
    
    h4 {
      font-size: 1.1rem;
      color: #00aaff;
      margin-bottom: 0.5rem;
    }
    
    p {
      line-height: 1.8;
      margin-bottom: 1rem;
      color: rgba(255, 255, 255, 0.85);
    }
    
    ul {
      list-style: none;
      padding-left: 0;
      
      li {
        padding-left: 1.5rem;
        margin-bottom: 0.75rem;
        position: relative;
        line-height: 1.6;
        
        &::before {
          content: '▸';
          position: absolute;
          left: 0;
          color: #00ffff;
        }
      }
    }
    
    a {
      color: #00ffff;
      text-decoration: none;
      transition: color 0.2s;
      
      &:hover {
        color: #00ccff;
        text-decoration: underline;
      }
    }
  }
}

.cookie-icon {
  font-size: 1rem;
  
  &.essential {
    color: #ff4444;
  }
  
  &.functional {
    color: #ffaa00;
  }
  
  &.analytics {
    color: #00aaff;
  }
}

.cookie-category {
  margin-bottom: 2rem;
}

.info-box {
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  
  p {
    margin-bottom: 0.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.warning-box {
  background: rgba(255, 170, 0, 0.05);
  border: 1px solid rgba(255, 170, 0, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  
  p {
    margin: 0;
    color: rgba(255, 200, 100, 0.9);
  }
}

.cookie-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.cookie-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 1rem;
  
  h4 {
    color: #00ffff;
    font-family: monospace;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.cookie-settings {
  margin: 1.5rem 0;
}

.browser-guides {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.browser-card {
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 255, 255, 0.1);
    border-color: rgba(0, 255, 255, 0.4);
    transform: translateY(-2px);
  }
  
  h4 {
    color: #00ffff;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.75rem;
  }
  
  a {
    font-size: 0.9rem;
    color: #00ccff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.third-party-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.third-party-item {
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  
  h4 {
    color: #00ffff;
    margin-bottom: 0.75rem;
  }
  
  p {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.contact-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  
  &.btn-primary {
    background: #00ffff;
    color: #0a0a0f;
    
    &:hover {
      background: #00ccff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 255, 0.3);
    }
  }
}
</style>