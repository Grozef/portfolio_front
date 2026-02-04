<template>
  <div class="legal-notice">
    <div class="container">
      <div class="header">
        <h1>{{ t.title }}</h1>
        <p class="last-updated">{{ t.lastUpdated }}: {{ lastUpdated }}</p>
        
        <!-- Language Toggle Button -->
        <button @click="toggleLanguage" class="lang-toggle">
          {{ currentLang === 'fr' ? '🇬🇧 English' : '🇫🇷 Français' }}
        </button>
      </div>

      <div class="content">
        <section>
          <h2>1. {{ t.section1Title }}</h2>
          <div class="info-box">
            <p><strong>{{ t.companyName }}:</strong> [Your name or company name]</p>
            <p><strong>{{ t.legalStatus }}:</strong> [Self-employed / LLC / etc.]</p>
            <p><strong>{{ t.address }}:</strong> [Your complete address]</p>
            <p><strong>Email:</strong> <a href="mailto:contact@example.com">contact@example.com</a></p>
            <p><strong>{{ t.phone }}:</strong> [Your phone number]</p>
            <p><strong>{{ t.siret }}:</strong> [Your SIRET number if applicable]</p>
            <p><strong>{{ t.vat }}:</strong> [If applicable]</p>
          </div>
        </section>

        <section>
          <h2>2. {{ t.section2Title }}</h2>
          <p>
            <strong>{{ t.directorTitle }}:</strong> [Your name]<br>
            <strong>Contact:</strong> <a href="mailto:contact@example.com">contact@example.com</a>
          </p>
        </section>

        <section>
          <h2>3. {{ t.section3Title }}</h2>
          <div class="info-box">
            <p><strong>{{ t.host }}:</strong> [Host name]</p>
            <p><strong>{{ t.hostCompany }}:</strong> [Company name]</p>
            <p><strong>{{ t.address }}:</strong> [Host address]</p>
            <p><strong>{{ t.website }}:</strong> <a href="https://example.com" target="_blank" rel="noopener">[Host URL]</a></p>
          </div>
        </section>

        <section>
          <h2>4. {{ t.section4Title }}</h2>
          
          <h3>4.1 {{ t.copyright }}</h3>
          <p>{{ t.copyrightText }}</p>

          <h3>4.2 {{ t.trademarks }}</h3>
          <p>{{ t.trademarksText }}</p>

          <h3>4.3 {{ t.sourceCode }}</h3>
          <p>{{ t.sourceCodeText }}</p>

          <h3>4.4 {{ t.thirdParty }}</h3>
          <p>{{ t.thirdPartyText }}</p>
        </section>

        <section>
          <h2>5. {{ t.section5Title }}</h2>
          
          <h3>5.1 {{ t.siteContent }}</h3>
          <p>{{ t.siteContentText }}</p>

          <h3>5.2 {{ t.externalLinks }}</h3>
          <p>{{ t.externalLinksText }}</p>

          <h3>5.3 {{ t.availability }}</h3>
          <p>{{ t.availabilityText }}</p>
        </section>

        <section>
          <h2>6. {{ t.section6Title }}</h2>
          <p>
            {{ t.personalDataText1 }}
            <router-link to="/privacy-policy">{{ t.privacyPolicy }}</router-link>.
          </p>
          <p>{{ t.personalDataText2 }}</p>
        </section>

        <section>
          <h2>7. {{ t.section7Title }}</h2>
          <p>
            {{ t.cookiesText }}
            <router-link to="/cookies">{{ t.cookiesPolicy }}</router-link>.
          </p>
        </section>

        <section>
          <h2>8. {{ t.section8Title }}</h2>
          <p>{{ t.lawText }}</p>
        </section>

        <section>
          <h2>9. {{ t.section9Title }}</h2>
          
          <h3>9.1 {{ t.development }}</h3>
          <ul>
            <li><strong>Frontend:</strong> Vue.js 3, Vite, Vue Router, Pinia</li>
            <li><strong>Backend:</strong> Laravel, PHP</li>
            <li><strong>{{ t.database }}:</strong> SQLite</li>
          </ul>

          <h3>9.2 {{ t.apis }}</h3>
          <ul>
            <li>GitHub API - {{ t.projectDisplay }}</li>
            <li>Google Books API - {{ t.bookInfo }}</li>
            <li>Open Library API - {{ t.libraryData }}</li>
          </ul>

          <h3>9.3 Design</h3>
          <ul>
            <li>{{ t.font }}: [Your font]</li>
            <li>{{ t.icons }}: [Icon source]</li>
            <li>{{ t.images }}: [Sources]</li>
          </ul>
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
const lastUpdated = ref('04/02/2026')

const translations = {
  fr: {
    title: 'Mentions légales',
    lastUpdated: 'Dernière mise à jour',
    section1Title: 'Informations sur l\'éditeur du site',
    companyName: 'Nom/Raison sociale',
    legalStatus: 'Statut juridique',
    address: 'Adresse',
    phone: 'Téléphone',
    siret: 'SIRET',
    vat: 'TVA Intracommunautaire',
    section2Title: 'Directeur de la publication',
    directorTitle: 'Directeur de publication',
    section3Title: 'Hébergement',
    host: 'Hébergeur',
    hostCompany: 'Raison sociale',
    website: 'Site web',
    section4Title: 'Propriété intellectuelle',
    copyright: 'Droits d\'auteur',
    copyrightText: 'L\'ensemble de ce site relève de la législation française et internationale sur le droit d\'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.',
    trademarks: 'Marques',
    trademarksText: 'Les marques et logos figurant sur le site sont des marques déposées. Toute reproduction totale ou partielle de ces marques ou logos effectuée à partir des éléments du site sans l\'autorisation expresse de l\'éditeur est donc prohibée.',
    sourceCode: 'Code source',
    sourceCodeText: 'Le code source de certains projets présentés sur ce site peut être disponible sous licence open source. Les licences spécifiques sont indiquées dans les dépôts GitHub correspondants.',
    thirdParty: 'Images et contenus tiers',
    thirdPartyText: 'Les images et contenus provenant de sources tierces (GitHub, Google Books, etc.) restent la propriété de leurs auteurs respectifs et sont utilisés conformément à leurs conditions d\'utilisation.',
    section5Title: 'Responsabilité',
    siteContent: 'Contenu du site',
    siteContentText: 'L\'éditeur s\'efforce d\'assurer l\'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, il ne peut garantir l\'exactitude, la précision ou l\'exhaustivité des informations mises à disposition sur ce site.',
    externalLinks: 'Liens externes',
    externalLinksText: 'Ce site peut contenir des liens hypertextes vers d\'autres sites. L\'éditeur n\'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à l\'accès, au contenu ou à l\'utilisation de ces sites, ainsi qu\'aux dommages pouvant résulter de la consultation des informations présentes sur ces sites.',
    availability: 'Disponibilité du site',
    availabilityText: 'L\'éditeur s\'efforce de permettre l\'accès au site 24 heures sur 24, 7 jours sur 7, sauf en cas de force majeure ou d\'un événement hors de son contrôle, et sous réserve des éventuelles pannes et interventions de maintenance nécessaires au bon fonctionnement du site.',
    section6Title: 'Données personnelles',
    personalDataText1: 'Pour toute information concernant le traitement de vos données personnelles, veuillez consulter notre',
    privacyPolicy: 'politique de confidentialité',
    personalDataText2: 'Conformément au RGPD, vous disposez d\'un droit d\'accès, de rectification, de suppression et d\'opposition au traitement de vos données personnelles.',
    section7Title: 'Cookies',
    cookiesText: 'Ce site utilise des cookies pour améliorer l\'expérience utilisateur. Pour plus d\'informations, consultez notre',
    cookiesPolicy: 'politique de cookies',
    section8Title: 'Droit applicable et juridiction',
    lawText: 'Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d\'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.',
    section9Title: 'Crédits',
    development: 'Développement',
    database: 'Base de données',
    apis: 'APIs et services',
    projectDisplay: 'Affichage des projets',
    bookInfo: 'Informations sur les livres',
    libraryData: 'Données bibliographiques',
    font: 'Police',
    icons: 'Icônes',
    images: 'Images',
    contactText: 'Pour toute question concernant ces mentions légales, vous pouvez nous contacter :',
    contactUs: 'Nous contacter'
  },
  en: {
    title: 'Legal Notice',
    lastUpdated: 'Last updated',
    section1Title: 'Website Publisher Information',
    companyName: 'Name/Company name',
    legalStatus: 'Legal status',
    address: 'Address',
    phone: 'Phone',
    siret: 'SIRET',
    vat: 'Intra-community VAT',
    section2Title: 'Publication Director',
    directorTitle: 'Publication Director',
    section3Title: 'Hosting',
    host: 'Host',
    hostCompany: 'Company name',
    website: 'Website',
    section4Title: 'Intellectual Property',
    copyright: 'Copyright',
    copyrightText: 'This entire website is governed by French and international copyright and intellectual property law. All reproduction rights are reserved, including for downloadable documents and iconographic and photographic representations.',
    trademarks: 'Trademarks',
    trademarksText: 'The trademarks and logos appearing on the site are registered trademarks. Any total or partial reproduction of these trademarks or logos made from elements of the site without the express authorization of the publisher is therefore prohibited.',
    sourceCode: 'Source Code',
    sourceCodeText: 'The source code of certain projects presented on this site may be available under an open source license. Specific licenses are indicated in the corresponding GitHub repositories.',
    thirdParty: 'Third-party Images and Content',
    thirdPartyText: 'Images and content from third-party sources (GitHub, Google Books, etc.) remain the property of their respective authors and are used in accordance with their terms of use.',
    section5Title: 'Liability',
    siteContent: 'Website Content',
    siteContentText: 'The publisher strives to ensure the accuracy and updating of information published on this site. However, it cannot guarantee the accuracy, precision or completeness of the information made available on this site.',
    externalLinks: 'External Links',
    externalLinksText: 'This site may contain hypertext links to other sites. The publisher has no control over these sites and disclaims all liability with respect to access, content or use of these sites, as well as any damages that may result from consultation of the information present on these sites.',
    availability: 'Site Availability',
    availabilityText: 'The publisher strives to allow access to the site 24 hours a day, 7 days a week, except in cases of force majeure or an event beyond its control, and subject to any breakdowns and maintenance operations necessary for the proper functioning of the site.',
    section6Title: 'Personal Data',
    personalDataText1: 'For any information regarding the processing of your personal data, please consult our',
    privacyPolicy: 'privacy policy',
    personalDataText2: 'In accordance with the GDPR, you have the right to access, rectify, delete and object to the processing of your personal data.',
    section7Title: 'Cookies',
    cookiesText: 'This site uses cookies to improve user experience. For more information, consult our',
    cookiesPolicy: 'cookie policy',
    section8Title: 'Applicable Law and Jurisdiction',
    lawText: 'This legal notice is governed by French law. In case of dispute and failing an amicable agreement, the dispute will be brought before the French courts in accordance with the applicable rules of jurisdiction.',
    section9Title: 'Credits',
    development: 'Development',
    database: 'Database',
    apis: 'APIs and Services',
    projectDisplay: 'Project display',
    bookInfo: 'Book information',
    libraryData: 'Library data',
    font: 'Font',
    icons: 'Icons',
    images: 'Images',
    contactText: 'For any questions concerning this legal notice, you can contact us:',
    contactUs: 'Contact us'
  }
}

const t = computed(() => translations[currentLang.value])

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'fr' ? 'en' : 'fr'
}
</script>

<style scoped lang="scss">
.legal-notice {
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
  position: relative;
  
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