<template>
  <div class="cookies">
    <div class="container">
      <div class="header">
        <h1>{{ t.title }}</h1>
        <p class="last-updated">{{ t.lastUpdated }}: 04/02/2026</p>
        
        <LanjuageToggle v-model="currentLang" />
      </div>

      <div class="content">
        <section>
          <h2>1. {{ t.intro }}</h2>
          <p>{{ t.introText }}</p>
        </section>

        <section>
          <h2>2. {{ t.whatAreCookies }}</h2>
          <p>{{ t.whatAreCookiesText }}</p>
        </section>

        <section>
          <h2>3. {{ t.typesTitle }}</h2>
          
          <h3>3.1 {{ t.essential }}</h3>
          <p>{{ t.essentialText }}</p>
          <ul>
            <li>{{ t.essential1 }}</li>
            <li>{{ t.essential2 }}</li>
          </ul>

          <h3>3.2 {{ t.functional }}</h3>
          <p>{{ t.functionalText }}</p>
          <ul>
            <li>{{ t.functional1 }}</li>
            <li>{{ t.functional2 }}</li>
          </ul>

          <h3>3.3 {{ t.analytics }}</h3>
          <p>{{ t.analyticsText }}</p>
        </section>

        <section>
          <h2>4. {{ t.management }}</h2>
          <p>{{ t.managementText }}</p>
          <ul>
            <li><strong>Chrome:</strong> {{ t.chromeHelp }}</li>
            <li><strong>Firefox:</strong> {{ t.firefoxHelp }}</li>
            <li><strong>Safari:</strong> {{ t.safariHelp }}</li>
            <li><strong>Edge:</strong> {{ t.edgeHelp }}</li>
          </ul>
          <p>{{ t.disableWarning }}</p>
        </section>

        <section>
          <h2>5. {{ t.moreInfo }}</h2>
          <p>{{ t.moreInfoText }}</p>
          <div class="contact-buttons">
            <router-link to="/contact" class="btn btn-primary">
              {{ t.contactUs }}
            </router-link>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LanjuageToggle from '@/components/LanjuageToggle.vue'

const currentLang = ref('fr')

const translations = {
  fr: {
    title: 'Politique de cookies',
    lastUpdated: 'Dernière mise à jour',
    intro: 'Introduction',
    introText: 'Ce site utilise des cookies pour améliorer votre expérience de navigation. Cette politique explique ce que sont les cookies, comment nous les utilisons et comment vous pouvez les gérer.',
    whatAreCookies: 'Qu\'est-ce qu\'un cookie ?',
    whatAreCookiesText: 'Un cookie est un petit fichier texte stocké sur votre appareil par votre navigateur web. Il permet de mémoriser des informations sur votre visite.',
    typesTitle: 'Types de cookies utilisés',
    essential: 'Cookies essentiels',
    essentialText: 'Ces cookies sont nécessaires au fonctionnement du site :',
    essential1: 'Cookies de session - pour maintenir votre connexion',
    essential2: 'Cookies de sécurité - pour protéger contre les attaques',
    functional: 'Cookies fonctionnels',
    functionalText: 'Ces cookies améliorent votre expérience :',
    functional1: 'Préférences de langue',
    functional2: 'Préférences d\'affichage',
    analytics: 'Cookies analytiques',
    analyticsText: 'Nous n\'utilisons actuellement aucun cookie analytique tiers.',
    management: 'Gestion des cookies',
    managementText: 'Vous pouvez gérer les cookies via les paramètres de votre navigateur :',
    chromeHelp: 'Paramètres > Confidentialité et sécurité > Cookies',
    firefoxHelp: 'Paramètres > Vie privée et sécurité > Cookies',
    safariHelp: 'Préférences > Confidentialité > Cookies',
    edgeHelp: 'Paramètres > Cookies et autorisations',
    disableWarning: 'La désactivation de certains cookies peut affecter le fonctionnement du site.',
    moreInfo: 'Plus d\'informations',
    moreInfoText: 'Pour toute question concernant notre utilisation des cookies :',
    contactUs: 'Nous contacter'
  },
  en: {
    title: 'Cookie Policy',
    lastUpdated: 'Last updated',
    intro: 'Introduction',
    introText: 'This site uses cookies to improve your browsing experience. This policy explains what cookies are, how we use them and how you can manage them.',
    whatAreCookies: 'What is a cookie?',
    whatAreCookiesText: 'A cookie is a small text file stored on your device by your web browser. It allows information about your visit to be remembered.',
    typesTitle: 'Types of cookies used',
    essential: 'Essential cookies',
    essentialText: 'These cookies are necessary for the site to function:',
    essential1: 'Session cookies - to maintain your login',
    essential2: 'Security cookies - to protect against attacks',
    functional: 'Functional cookies',
    functionalText: 'These cookies improve your experience:',
    functional1: 'Language preferences',
    functional2: 'Display preferences',
    analytics: 'Analytics cookies',
    analyticsText: 'We do not currently use any third-party analytics cookies.',
    management: 'Cookie management',
    managementText: 'You can manage cookies through your browser settings:',
    chromeHelp: 'Settings > Privacy and security > Cookies',
    firefoxHelp: 'Settings > Privacy and security > Cookies',
    safariHelp: 'Preferences > Privacy > Cookies',
    edgeHelp: 'Settings > Cookies and permissions',
    disableWarning: 'Disabling certain cookies may affect site functionality.',
    moreInfo: 'More information',
    moreInfoText: 'For any questions regarding our use of cookies:',
    contactUs: 'Contact us'
  }
}

const t = computed(() => translations[currentLang.value])

</script>

<style scoped lang="scss">
.cookies {
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
    margin-bottom: 1rem;
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
      
      @media (max-width: 768px) {
        font-size: 1.1rem;
      }
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