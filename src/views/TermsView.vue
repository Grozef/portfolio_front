<template>
  <div class="terms">
    <div class="container">
      <div class="header">
        <h1>{{ t.title }}</h1>
        <p class="last-updated">{{ t.lastUpdated }}: 04/02/2026</p>
        
        <button @click="toggleLanguage" class="lang-toggle">
          {{ currentLang === 'fr' ? '🇬🇧 English' : '🇫🇷 Français' }}
        </button>
      </div>

      <div class="content">
        <section>
          <h2>1. {{ t.acceptance }}</h2>
          <p>{{ t.acceptanceText }}</p>
        </section>

        <section>
          <h2>2. {{ t.services }}</h2>
          <p>{{ t.servicesText }}</p>
          <ul>
            <li>{{ t.service1 }}</li>
            <li>{{ t.service2 }}</li>
            <li>{{ t.service3 }}</li>
            <li>{{ t.service4 }}</li>
          </ul>
        </section>

        <section>
          <h2>3. {{ t.userAccount }}</h2>
          <p>{{ t.userAccountText }}</p>
          <ul>
            <li>{{ t.account1 }}</li>
            <li>{{ t.account2 }}</li>
            <li>{{ t.account3 }}</li>
          </ul>
        </section>

        <section>
          <h2>4. {{ t.prohibitedUse }}</h2>
          <p>{{ t.prohibitedUseText }}</p>
          <ul>
            <li>{{ t.prohibited1 }}</li>
            <li>{{ t.prohibited2 }}</li>
            <li>{{ t.prohibited3 }}</li>
            <li>{{ t.prohibited4 }}</li>
            <li>{{ t.prohibited5 }}</li>
          </ul>
        </section>

        <section>
          <h2>5. {{ t.intellectualProperty }}</h2>
          <p>{{ t.intellectualPropertyText }}</p>
          <p>{{ t.intellectualPropertyText2 }}</p>
        </section>

        <section>
          <h2>6. {{ t.liability }}</h2>
          <p>{{ t.liabilityText }}</p>
          <ul>
            <li>{{ t.liability1 }}</li>
            <li>{{ t.liability2 }}</li>
            <li>{{ t.liability3 }}</li>
          </ul>
        </section>

        <section>
          <h2>7. {{ t.modification }}</h2>
          <p>{{ t.modificationText }}</p>
        </section>

        <section>
          <h2>8. {{ t.termination }}</h2>
          <p>{{ t.terminationText }}</p>
        </section>

        <section>
          <h2>9. {{ t.law }}</h2>
          <p>{{ t.lawText }}</p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>{{ t.contactText }}</p>
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

const currentLang = ref('fr')

const translations = {
  fr: {
    title: 'Conditions d\'utilisation',
    lastUpdated: 'Dernière mise à jour',
    acceptance: 'Acceptation des conditions',
    acceptanceText: 'En accédant et en utilisant ce site, vous acceptez d\'être lié par les présentes conditions d\'utilisation. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser ce site.',
    services: 'Services proposés',
    servicesText: 'Ce site vous permet de :',
    service1: 'Consulter les projets et travaux présentés',
    service2: 'Découvrir les livres et lectures recommandés',
    service3: 'Nous contacter via le formulaire de contact',
    service4: 'Accéder aux informations publiques partagées',
    userAccount: 'Compte utilisateur',
    userAccountText: 'L\'accès à l\'interface d\'administration nécessite un compte. Vous êtes responsable de :',
    account1: 'Maintenir la confidentialité de vos identifiants',
    account2: 'Toutes les activités effectuées sous votre compte',
    account3: 'Nous informer immédiatement de toute utilisation non autorisée',
    prohibitedUse: 'Utilisations interdites',
    prohibitedUseText: 'Vous vous engagez à ne pas :',
    prohibited1: 'Utiliser le site à des fins illégales ou non autorisées',
    prohibited2: 'Tenter d\'accéder à des zones restreintes sans autorisation',
    prohibited3: 'Interférer avec le fonctionnement du site',
    prohibited4: 'Transmettre des virus ou codes malveillants',
    prohibited5: 'Collecter des informations sur d\'autres utilisateurs',
    intellectualProperty: 'Propriété intellectuelle',
    intellectualPropertyText: 'Tous les contenus du site (textes, images, code, etc.) sont protégés par les droits de propriété intellectuelle.',
    intellectualPropertyText2: 'Toute reproduction ou utilisation sans autorisation est interdite, sauf exception prévue par la loi.',
    liability: 'Limitation de responsabilité',
    liabilityText: 'Nous déclinons toute responsabilité concernant :',
    liability1: 'L\'exactitude ou la complétude des informations fournies',
    liability2: 'Les dommages résultant de l\'utilisation ou de l\'impossibilité d\'utiliser le site',
    liability3: 'Les contenus des sites tiers accessibles via des liens',
    modification: 'Modification des conditions',
    modificationText: 'Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication sur le site.',
    termination: 'Résiliation',
    terminationText: 'Nous pouvons suspendre ou résilier votre accès au site en cas de violation de ces conditions, sans préavis ni indemnité.',
    law: 'Droit applicable',
    lawText: 'Les présentes conditions sont régies par le droit français. Tout litige sera soumis à la compétence des tribunaux français.',
    contactText: 'Pour toute question concernant ces conditions :',
    contactUs: 'Nous contacter'
  },
  en: {
    title: 'Terms of Use',
    lastUpdated: 'Last updated',
    acceptance: 'Acceptance of Terms',
    acceptanceText: 'By accessing and using this site, you agree to be bound by these terms of use. If you do not agree to these terms, please do not use this site.',
    services: 'Services Provided',
    servicesText: 'This site allows you to:',
    service1: 'View presented projects and works',
    service2: 'Discover recommended books and readings',
    service3: 'Contact us via the contact form',
    service4: 'Access shared public information',
    userAccount: 'User Account',
    userAccountText: 'Access to the administration interface requires an account. You are responsible for:',
    account1: 'Maintaining the confidentiality of your credentials',
    account2: 'All activities performed under your account',
    account3: 'Immediately notifying us of any unauthorized use',
    prohibitedUse: 'Prohibited Uses',
    prohibitedUseText: 'You agree not to:',
    prohibited1: 'Use the site for illegal or unauthorized purposes',
    prohibited2: 'Attempt to access restricted areas without authorization',
    prohibited3: 'Interfere with the operation of the site',
    prohibited4: 'Transmit viruses or malicious code',
    prohibited5: 'Collect information about other users',
    intellectualProperty: 'Intellectual Property',
    intellectualPropertyText: 'All content on the site (text, images, code, etc.) is protected by intellectual property rights.',
    intellectualPropertyText2: 'Any reproduction or use without authorization is prohibited, except as provided by law.',
    liability: 'Limitation of Liability',
    liabilityText: 'We disclaim all liability concerning:',
    liability1: 'The accuracy or completeness of the information provided',
    liability2: 'Damages resulting from the use or inability to use the site',
    liability3: 'Content of third-party sites accessible via links',
    modification: 'Modification of Terms',
    modificationText: 'We reserve the right to modify these terms at any time. Modifications take effect upon publication on the site.',
    termination: 'Termination',
    terminationText: 'We may suspend or terminate your access to the site in case of violation of these terms, without notice or compensation.',
    law: 'Applicable Law',
    lawText: 'These terms are governed by French law. Any dispute will be subject to the jurisdiction of French courts.',
    contactText: 'For any questions regarding these terms:',
    contactUs: 'Contact us'
  }
}

const t = computed(() => translations[currentLang.value])

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'fr' ? 'en' : 'fr'
}
</script>

<style scoped lang="scss">
.terms {
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
  
  .lang-toggle {
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    background: rgba(0, 255, 255, 0.1);
    border: 2px solid #00ffff;
    border-radius: 25px;
    color: #00ffff;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(0, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 255, 0.3);
    }
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