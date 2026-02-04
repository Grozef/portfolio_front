<template>
  <div class="legal-notice">
    <div class="container">
      <div class="header">
        <h1>Mentions légales</h1>
        <p class="last-updated">Dernière mise à jour : {{ lastUpdated }}</p>
      </div>

      <div class="content">
        <section>
          <h2>1. Informations sur l'éditeur du site</h2>
          <div class="info-box">
            <p><strong>Nom/Raison sociale :</strong> [Votre nom ou nom de l'entreprise]</p>
            <p><strong>Statut juridique :</strong> [Auto-entrepreneur / SARL / etc.]</p>
            <p><strong>Adresse :</strong> [Votre adresse complète]</p>
            <p><strong>Email :</strong> <a href="mailto:contact@example.com">contact@example.com</a></p>
            <p><strong>Téléphone :</strong> [Votre numéro]</p>
            <p><strong>SIRET :</strong> [Votre numéro SIRET si applicable]</p>
            <p><strong>TVA Intracommunautaire :</strong> [Si applicable]</p>
          </div>
        </section>

        <section>
          <h2>2. Directeur de la publication</h2>
          <p>
            <strong>Directeur de publication :</strong> [Votre nom]<br>
            <strong>Contact :</strong> <a href="mailto:contact@example.com">contact@example.com</a>
          </p>
        </section>

        <section>
          <h2>3. Hébergement</h2>
          <div class="info-box">
            <p><strong>Hébergeur :</strong> [Nom de l'hébergeur]</p>
            <p><strong>Raison sociale :</strong> [Raison sociale]</p>
            <p><strong>Adresse :</strong> [Adresse de l'hébergeur]</p>
            <p><strong>Site web :</strong> <a href="https://example.com" target="_blank" rel="noopener">[URL hébergeur]</a></p>
          </div>
        </section>

        <section>
          <h2>4. Propriété intellectuelle</h2>
          
          <h3>4.1 Droits d'auteur</h3>
          <p>
            L'ensemble de ce site relève de la législation française et internationale sur le droit 
            d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, 
            y compris pour les documents téléchargeables et les représentations iconographiques et 
            photographiques.
          </p>

          <h3>4.2 Marques</h3>
          <p>
            Les marques et logos figurant sur le site sont des marques déposées. Toute reproduction 
            totale ou partielle de ces marques ou logos effectuée à partir des éléments du site 
            sans l'autorisation expresse de l'éditeur est donc prohibée.
          </p>

          <h3>4.3 Code source</h3>
          <p>
            Le code source de certains projets présentés sur ce site peut être disponible sous 
            licence open source. Les licences spécifiques sont indiquées dans les dépôts GitHub 
            correspondants.
          </p>

          <h3>4.4 Images et contenus tiers</h3>
          <p>
            Les images et contenus provenant de sources tierces (GitHub, Google Books, etc.) 
            restent la propriété de leurs auteurs respectifs et sont utilisés conformément à 
            leurs conditions d'utilisation.
          </p>
        </section>

        <section>
          <h2>5. Responsabilité</h2>
          
          <h3>5.1 Contenu du site</h3>
          <p>
            L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées 
            sur ce site. Toutefois, il ne peut garantir l'exactitude, la précision ou l'exhaustivité 
            des informations mises à disposition sur ce site.
          </p>

          <h3>5.2 Liens externes</h3>
          <p>
            Ce site peut contenir des liens hypertextes vers d'autres sites. L'éditeur n'exerce 
            aucun contrôle sur ces sites et décline toute responsabilité quant à l'accès, au 
            contenu ou à l'utilisation de ces sites, ainsi qu'aux dommages pouvant résulter de 
            la consultation des informations présentes sur ces sites.
          </p>

          <h3>5.3 Disponibilité du site</h3>
          <p>
            L'éditeur s'efforce de permettre l'accès au site 24 heures sur 24, 7 jours sur 7, 
            sauf en cas de force majeure ou d'un événement hors de son contrôle, et sous réserve 
            des éventuelles pannes et interventions de maintenance nécessaires au bon fonctionnement 
            du site.
          </p>
        </section>

        <section>
          <h2>6. Données personnelles</h2>
          <p>
            Pour toute information concernant le traitement de vos données personnelles, 
            veuillez consulter notre 
            <router-link to="/privacy-policy">politique de confidentialité</router-link>.
          </p>
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de 
            suppression et d'opposition au traitement de vos données personnelles.
          </p>
        </section>

        <section>
          <h2>7. Cookies</h2>
          <p>
            Ce site utilise des cookies pour améliorer l'expérience utilisateur. Pour plus 
            d'informations, consultez notre 
            <router-link to="/cookies">politique de cookies</router-link>.
          </p>
        </section>

        <section>
          <h2>8. Droit applicable et juridiction</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige 
            et à défaut d'accord amiable, le litige sera porté devant les tribunaux français 
            conformément aux règles de compétence en vigueur.
          </p>
        </section>

        <section>
          <h2>9. Crédits</h2>
          
          <h3>9.1 Développement</h3>
          <ul>
            <li><strong>Frontend :</strong> Vue.js 3, Vite, Vue Router, Pinia</li>
            <li><strong>Backend :</strong> Laravel, PHP</li>
            <li><strong>Base de données :</strong> SQLite</li>
          </ul>

          <h3>9.2 APIs et services</h3>
          <ul>
            <li>GitHub API - Affichage des projets</li>
            <li>Google Books API - Informations sur les livres</li>
            <li>Open Library API - Données bibliographiques</li>
          </ul>

          <h3>9.3 Design</h3>
          <ul>
            <li>Police : [Votre police]</li>
            <li>Icônes : [Source des icônes]</li>
            <li>Images : [Sources]</li>
          </ul>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>
            Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
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