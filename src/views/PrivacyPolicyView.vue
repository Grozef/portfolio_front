<template>
  <div class="privacy-policy">
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
          <h2>1. {{ t.intro }}</h2>
          <p>{{ t.introText1 }}</p>
          <p>{{ t.introText2 }}</p>
        </section>

        <section>
          <h2>2. {{ t.controller }}</h2>
          <div class="info-box">
            <p><strong>{{ t.name }}:</strong> [{{ t.yourName }}]</p>
            <p><strong>{{ t.address }}:</strong> [{{ t.yourAddress }}]</p>
            <p><strong>Email:</strong> <a href="mailto:contact@example.com">contact@example.com</a></p>
          </div>
        </section>

        <section>
          <h2>3. {{ t.dataCollected }}</h2>
          <p>{{ t.dataCollectedText }}</p>
          
          <h3>3.1 {{ t.directData }}</h3>
          <ul>
            <li><strong>{{ t.contactForm }}:</strong> {{ t.contactFormData }}</li>
            <li><strong>{{ t.adminLogin }}:</strong> {{ t.adminLoginData }}</li>
          </ul>

          <h3>3.2 {{ t.autoData }}</h3>
          <ul>
            <li><strong>{{ t.techData }}:</strong> {{ t.techDataList }}</li>
            <li><strong>Cookies:</strong> {{ t.cookiesData }}</li>
            <li><strong>{{ t.serverLogs }}:</strong> {{ t.serverLogsData }}</li>
          </ul>
        </section>

        <section>
          <h2>4. {{ t.purposes }}</h2>
          <p>{{ t.purposesText }}</p>
          <ul>
            <li>{{ t.purpose1 }}</li>
            <li>{{ t.purpose2 }}</li>
            <li>{{ t.purpose3 }}</li>
            <li>{{ t.purpose4 }}</li>
            <li>{{ t.purpose5 }}</li>
          </ul>
        </section>

        <section>
          <h2>5. {{ t.legalBasis }}</h2>
          <p>{{ t.legalBasisText }}</p>
          <ul>
            <li><strong>{{ t.consent }}:</strong> {{ t.consentText }}</li>
            <li><strong>{{ t.contract }}:</strong> {{ t.contractText }}</li>
            <li><strong>{{ t.interest }}:</strong> {{ t.interestText }}</li>
            <li><strong>{{ t.obligation }}:</strong> {{ t.obligationText }}</li>
          </ul>
        </section>

        <section>
          <h2>6. {{ t.recipients }}</h2>
          <p>{{ t.recipientsText }}</p>
          <ul>
            <li><strong>{{ t.host }}:</strong> [{{ t.hostName }}] - {{ t.hostPurpose }}</li>
            <li><strong>{{ t.thirdParty }}:</strong>
              <ul>
                <li>GitHub API - {{ t.github }}</li>
                <li>Google Books API - {{ t.googleBooks }}</li>
              </ul>
            </li>
          </ul>
          <p>{{ t.noSale }}</p>
        </section>

        <section>
          <h2>7. {{ t.rights }}</h2>
          <p>{{ t.rightsText }}</p>
          <ul>
            <li><strong>{{ t.access }}:</strong> {{ t.accessText }}</li>
            <li><strong>{{ t.rectification }}:</strong> {{ t.rectificationText }}</li>
            <li><strong>{{ t.deletion }}:</strong> {{ t.deletionText }}</li>
            <li><strong>{{ t.limitation }}:</strong> {{ t.limitationText }}</li>
            <li><strong>{{ t.portability }}:</strong> {{ t.portabilityText }}</li>
            <li><strong>{{ t.objection }}:</strong> {{ t.objectionText }}</li>
          </ul>
          <p>{{ t.exerciseRights }}</p>
        </section>

        <section>
          <h2>8. {{ t.security }}</h2>
          <p>{{ t.securityText }}</p>
        </section>

        <section>
          <h2>9. Contact</h2>
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
    title: 'Politique de confidentialité',
    lastUpdated: 'Dernière mise à jour',
    intro: 'Introduction',
    introText1: 'La présente politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez ce site web.',
    introText2: 'Nous nous engageons à protéger votre vie privée et à traiter vos données personnelles conformément au RGPD et aux lois applicables.',
    controller: 'Responsable du traitement',
    name: 'Nom',
    yourName: 'Votre nom ou nom de l\'entreprise',
    address: 'Adresse',
    yourAddress: 'Votre adresse',
    dataCollected: 'Données collectées',
    dataCollectedText: 'Nous collectons les types de données suivants :',
    directData: 'Données fournies directement',
    contactForm: 'Formulaire de contact',
    contactFormData: 'nom, email, message',
    adminLogin: 'Connexion administrateur',
    adminLoginData: 'email, mot de passe hashé',
    autoData: 'Données collectées automatiquement',
    techData: 'Données techniques',
    techDataList: 'adresse IP, type de navigateur, système d\'exploitation',
    cookiesData: 'cookies de session, préférences utilisateur',
    serverLogs: 'Logs serveur',
    serverLogsData: 'date et heure de connexion, pages visitées',
    purposes: 'Finalités du traitement',
    purposesText: 'Nous utilisons vos données pour :',
    purpose1: 'Répondre à vos demandes de contact',
    purpose2: 'Gérer l\'accès à l\'interface d\'administration',
    purpose3: 'Assurer la sécurité du site',
    purpose4: 'Améliorer nos services',
    purpose5: 'Se conformer aux obligations légales',
    legalBasis: 'Base légale du traitement',
    legalBasisText: 'Les bases légales de nos traitements sont :',
    consent: 'Consentement',
    consentText: 'pour les cookies non essentiels',
    contract: 'Exécution d\'un contrat',
    contractText: 'pour répondre à vos demandes',
    interest: 'Intérêt légitime',
    interestText: 'pour la sécurité et l\'amélioration du site',
    obligation: 'Obligation légale',
    obligationText: 'pour la conservation des logs',
    recipients: 'Destinataires des données',
    recipientsText: 'Vos données peuvent être partagées avec :',
    host: 'Hébergeur',
    hostName: 'Nom de l\'hébergeur',
    hostPurpose: 'pour l\'hébergement du site',
    thirdParty: 'Services tiers',
    github: 'pour afficher les projets publics',
    googleBooks: 'pour les informations sur les livres',
    noSale: 'Aucune donnée n\'est vendue à des tiers.',
    rights: 'Vos droits',
    rightsText: 'Conformément au RGPD, vous disposez des droits suivants :',
    access: 'Droit d\'accès',
    accessText: 'obtenir une copie de vos données',
    rectification: 'Droit de rectification',
    rectificationText: 'corriger vos données inexactes',
    deletion: 'Droit à l\'effacement',
    deletionText: 'supprimer vos données',
    limitation: 'Droit à la limitation',
    limitationText: 'limiter le traitement de vos données',
    portability: 'Droit à la portabilité',
    portabilityText: 'récupérer vos données dans un format structuré',
    objection: 'Droit d\'opposition',
    objectionText: 'vous opposer au traitement',
    exerciseRights: 'Pour exercer vos droits, contactez-nous par email.',
    security: 'Sécurité',
    securityText: 'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.',
    contactText: 'Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter :',
    contactUs: 'Nous contacter'
  },
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated',
    intro: 'Introduction',
    introText1: 'This privacy policy describes how we collect, use and protect your personal data when you use this website.',
    introText2: 'We are committed to protecting your privacy and processing your personal data in accordance with GDPR and applicable laws.',
    controller: 'Data Controller',
    name: 'Name',
    yourName: 'Your name or company name',
    address: 'Address',
    yourAddress: 'Your address',
    dataCollected: 'Data Collected',
    dataCollectedText: 'We collect the following types of data:',
    directData: 'Data provided directly',
    contactForm: 'Contact form',
    contactFormData: 'name, email, message',
    adminLogin: 'Admin login',
    adminLoginData: 'email, hashed password',
    autoData: 'Automatically collected data',
    techData: 'Technical data',
    techDataList: 'IP address, browser type, operating system',
    cookiesData: 'session cookies, user preferences',
    serverLogs: 'Server logs',
    serverLogsData: 'connection date and time, pages visited',
    purposes: 'Processing Purposes',
    purposesText: 'We use your data to:',
    purpose1: 'Respond to your contact requests',
    purpose2: 'Manage access to the administration interface',
    purpose3: 'Ensure website security',
    purpose4: 'Improve our services',
    purpose5: 'Comply with legal obligations',
    legalBasis: 'Legal Basis',
    legalBasisText: 'The legal bases for our processing are:',
    consent: 'Consent',
    consentText: 'for non-essential cookies',
    contract: 'Contract execution',
    contractText: 'to respond to your requests',
    interest: 'Legitimate interest',
    interestText: 'for security and site improvement',
    obligation: 'Legal obligation',
    obligationText: 'for log retention',
    recipients: 'Data Recipients',
    recipientsText: 'Your data may be shared with:',
    host: 'Host',
    hostName: 'Host name',
    hostPurpose: 'for website hosting',
    thirdParty: 'Third-party services',
    github: 'to display public projects',
    googleBooks: 'for book information',
    noSale: 'No data is sold to third parties.',
    rights: 'Your Rights',
    rightsText: 'In accordance with GDPR, you have the following rights:',
    access: 'Right of access',
    accessText: 'obtain a copy of your data',
    rectification: 'Right to rectification',
    rectificationText: 'correct inaccurate data',
    deletion: 'Right to erasure',
    deletionText: 'delete your data',
    limitation: 'Right to restriction',
    limitationText: 'limit the processing of your data',
    portability: 'Right to portability',
    portabilityText: 'retrieve your data in a structured format',
    objection: 'Right to object',
    objectionText: 'object to processing',
    exerciseRights: 'To exercise your rights, contact us by email.',
    security: 'Security',
    securityText: 'We implement appropriate technical and organizational measures to protect your data against unauthorized access, modification, disclosure or destruction.',
    contactText: 'For any questions regarding this privacy policy, you can contact us:',
    contactUs: 'Contact us'
  }
}

const t = computed(() => translations[currentLang.value])

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'fr' ? 'en' : 'fr'
}
</script>

<style scoped lang="scss">
.privacy-policy {
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
    
    &:active {
      transform: translateY(0);
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
        
        ul {
          margin-top: 0.5rem;
          padding-left: 1rem;
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