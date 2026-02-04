<template>
  <div class="terms">
    <div class="container">
      <div class="header">
        <h1>Conditions d'utilisation</h1>
        <p class="last-updated">Dernière mise à jour : {{ lastUpdated }}</p>
      </div>

      <div class="content">
        <section>
          <h2>1. Acceptation des conditions</h2>
          <p>
            En accédant et en utilisant ce site web (ci-après "le Site"), vous acceptez d'être 
            lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, 
            veuillez ne pas utiliser le Site.
          </p>
          <p>
            Ces conditions peuvent être modifiées à tout moment. Il est de votre responsabilité 
            de les consulter régulièrement pour vous tenir informé des mises à jour.
          </p>
        </section>

        <section>
          <h2>2. Objet du site</h2>
          <p>
            Ce site est un portfolio professionnel destiné à présenter :
          </p>
          <ul>
            <li>Les projets et réalisations de l'éditeur</li>
            <li>Les compétences et expériences professionnelles</li>
            <li>Une sélection de livres et lectures</li>
            <li>Un formulaire de contact</li>
          </ul>
          <p>
            Le Site est fourni à titre informatif et de présentation professionnelle uniquement.
          </p>
        </section>

        <section>
          <h2>3. Accès au site</h2>
          
          <h3>3.1 Disponibilité</h3>
          <p>
            Nous nous efforçons de maintenir le Site accessible 24h/24 et 7j/7. Toutefois, 
            l'accès peut être temporairement suspendu pour des raisons de maintenance, de mise 
            à jour, ou en cas de force majeure.
          </p>

          <h3>3.2 Responsabilité d'accès</h3>
          <p>
            Vous êtes responsable de :
          </p>
          <ul>
            <li>L'accès à Internet et des frais associés</li>
            <li>La sécurité de votre équipement et connexion</li>
            <li>La compatibilité de votre matériel et logiciels</li>
          </ul>

          <h3>3.3 Restrictions d'accès</h3>
          <p>
            L'accès à certaines sections du Site (espace administrateur) est restreint et 
            nécessite une authentification.
          </p>
        </section>

        <section>
          <h2>4. Utilisation autorisée</h2>
          
          <h3>4.1 Usage personnel</h3>
          <p>
            L'utilisation du Site est autorisée à des fins personnelles et non commerciales. 
            Vous pouvez :
          </p>
          <ul>
            <li>Consulter les informations présentées</li>
            <li>Utiliser le formulaire de contact</li>
            <li>Partager les liens du Site</li>
          </ul>

          <h3>4.2 Interdictions</h3>
          <p>
            Il est strictement interdit de :
          </p>
          <ul>
            <li>Extraire, copier ou reproduire le contenu du Site sans autorisation</li>
            <li>Utiliser des robots, scrapers ou outils automatisés</li>
            <li>Tenter d'accéder aux zones restreintes sans autorisation</li>
            <li>Transmettre des virus, malwares ou codes malveillants</li>
            <li>Surcharger le serveur (attaques DDoS)</li>
            <li>Usurper l'identité de l'éditeur ou d'un tiers</li>
            <li>Utiliser le Site à des fins illégales</li>
            <li>Collecter des données personnelles d'autres utilisateurs</li>
          </ul>
        </section>

        <section>
          <h2>5. Propriété intellectuelle</h2>
          
          <h3>5.1 Droits de l'éditeur</h3>
          <p>
            Tous les contenus présents sur le Site (textes, images, logos, design, code, etc.) 
            sont la propriété exclusive de l'éditeur ou de ses partenaires et sont protégés par 
            les lois sur la propriété intellectuelle.
          </p>

          <h3>5.2 Utilisation des contenus</h3>
          <p>
            Toute reproduction, représentation, modification, publication ou adaptation de tout 
            ou partie des éléments du Site, par quelque moyen que ce soit, est interdite sans 
            l'autorisation écrite préalable de l'éditeur.
          </p>

          <h3>5.3 Contenus open source</h3>
          <p>
            Certains projets présentés peuvent être sous licence open source. Dans ce cas, les 
            conditions de la licence spécifique s'appliquent et sont indiquées dans les dépôts 
            GitHub correspondants.
          </p>

          <h3>5.4 Contenus tiers</h3>
          <p>
            Les contenus provenant de sources tierces (GitHub API, Google Books API) restent 
            la propriété de leurs auteurs respectifs.
          </p>
        </section>

        <section>
          <h2>6. Formulaire de contact</h2>
          
          <h3>6.1 Utilisation du formulaire</h3>
          <p>
            Le formulaire de contact est destiné aux demandes professionnelles légitimes. 
            Vous vous engagez à :
          </p>
          <ul>
            <li>Fournir des informations exactes</li>
            <li>Ne pas envoyer de spam ou messages abusifs</li>
            <li>Respecter les règles de courtoisie</li>
            <li>Ne pas utiliser le formulaire à des fins publicitaires</li>
          </ul>

          <h3>6.2 Traitement des messages</h3>
          <p>
            Les messages reçus sont traités conformément à notre 
            <router-link to="/privacy-policy">politique de confidentialité</router-link>.
          </p>
          <p>
            Aucune garantie n'est donnée quant aux délais de réponse. L'éditeur se réserve le 
            droit de ne pas répondre aux messages inappropriés.
          </p>
        </section>

        <section>
          <h2>7. Liens externes</h2>
          
          <h3>7.1 Liens vers des sites tiers</h3>
          <p>
            Le Site peut contenir des liens vers des sites web tiers (GitHub, réseaux sociaux, etc.). 
            Ces liens sont fournis à titre informatif uniquement.
          </p>
          <p>
            L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant 
            à leur contenu, disponibilité ou sécurité.
          </p>

          <h3>7.2 Liens vers notre site</h3>
          <p>
            Vous pouvez créer des liens vers la page d'accueil du Site sans autorisation préalable, 
            à condition que :
          </p>
          <ul>
            <li>Le lien ne soit pas trompeur</li>
            <li>Il ne suggère pas d'association ou d'approbation de votre part</li>
            <li>Il ne soit pas placé sur un site au contenu illégal ou offensant</li>
          </ul>
        </section>

        <section>
          <h2>8. Responsabilité</h2>
          
          <h3>8.1 Exactitude des informations</h3>
          <p>
            L'éditeur s'efforce de fournir des informations exactes et à jour. Toutefois, 
            il ne garantit pas :
          </p>
          <ul>
            <li>L'exactitude, la complétude ou l'actualité des informations</li>
            <li>L'absence d'erreurs ou d'omissions</li>
            <li>La disponibilité continue du Site</li>
          </ul>

          <h3>8.2 Limitation de responsabilité</h3>
          <p>
            Dans toute la mesure permise par la loi, l'éditeur ne saurait être tenu responsable :
          </p>
          <ul>
            <li>Des dommages directs ou indirects résultant de l'utilisation du Site</li>
            <li>De l'impossibilité d'accéder au Site</li>
            <li>Des virus ou programmes malveillants</li>
            <li>Des pertes de données ou interruptions de service</li>
            <li>Des contenus sur les sites tiers liés</li>
          </ul>

          <h3>8.3 Utilisation à vos risques</h3>
          <p>
            Vous utilisez le Site à vos propres risques. Le Site est fourni "tel quel" sans 
            garantie d'aucune sorte.
          </p>
        </section>

        <section>
          <h2>9. Données personnelles</h2>
          <p>
            Le traitement de vos données personnelles est décrit dans notre 
            <router-link to="/privacy-policy">politique de confidentialité</router-link>, 
            qui fait partie intégrante des présentes conditions.
          </p>
          <p>
            En utilisant le Site, vous consentez au traitement de vos données conformément 
            à cette politique.
          </p>
        </section>

        <section>
          <h2>10. Cookies</h2>
          <p>
            Le Site utilise des cookies. Pour plus d'informations, consultez notre 
            <router-link to="/cookies">politique de cookies</router-link>.
          </p>
        </section>

        <section>
          <h2>11. Modification du site</h2>
          <p>
            L'éditeur se réserve le droit de :
          </p>
          <ul>
            <li>Modifier ou supprimer tout contenu du Site</li>
            <li>Suspendre ou arrêter le Site à tout moment</li>
            <li>Modifier les fonctionnalités disponibles</li>
          </ul>
          <p>
            Ces modifications peuvent intervenir sans préavis.
          </p>
        </section>

        <section>
          <h2>12. Suspension d'accès</h2>
          <p>
            L'éditeur se réserve le droit de suspendre ou de bloquer l'accès au Site à tout 
            utilisateur qui :
          </p>
          <ul>
            <li>Ne respecte pas les présentes conditions</li>
            <li>Adopte un comportement nuisible ou abusif</li>
            <li>Tente de porter atteinte à la sécurité du Site</li>
          </ul>
          <p>
            Cette suspension peut intervenir sans préavis ni justification.
          </p>
        </section>

        <section>
          <h2>13. Loi applicable et juridiction</h2>
          <p>
            Les présentes conditions d'utilisation sont régies par le droit français.
          </p>
          <p>
            En cas de litige, et à défaut d'accord amiable, les tribunaux français seront 
            seuls compétents, conformément aux règles de compétence en vigueur.
          </p>
        </section>

        <section>
          <h2>14. Divisibilité</h2>
          <p>
            Si une disposition des présentes conditions est jugée invalide ou inapplicable, 
            les autres dispositions resteront pleinement en vigueur.
          </p>
        </section>

        <section>
          <h2>15. Intégralité</h2>
          <p>
            Les présentes conditions d'utilisation, ainsi que la politique de confidentialité 
            et la politique de cookies, constituent l'intégralité de l'accord entre vous et 
            l'éditeur concernant l'utilisation du Site.
          </p>
        </section>

        <section>
          <h2>16. Contact</h2>
          <p>
            Pour toute question concernant ces conditions d'utilisation :
          </p>
          <div class="info-box">
            <p><strong>Email :</strong> <a href="mailto:contact@example.com">contact@example.com</a></p>
          </div>
          <div class="contact-buttons">
            <router-link to="/contact" class="btn btn-primary">
              Nous contacter
            </router-link>
            <router-link to="/legal-notice" class="btn btn-secondary">
              Mentions légales
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
  flex-wrap: wrap;
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
  
  &.btn-secondary {
    background: transparent;
    color: #00ffff;
    border: 2px solid #00ffff;
    
    &:hover {
      background: rgba(0, 255, 255, 0.1);
      transform: translateY(-2px);
    }
  }
}
</style>