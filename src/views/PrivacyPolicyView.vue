<template>
  <div class="privacy-policy">
    <div class="container">
      <div class="header">
        <h1>Politique de confidentialité</h1>
        <p class="last-updated">Dernière mise à jour : {{ lastUpdated }}</p>
      </div>

      <div class="content">
        <section>
          <h2>1. Introduction</h2>
          <p>
            La présente politique de confidentialité décrit comment nous collectons, utilisons et 
            protégeons vos données personnelles lorsque vous utilisez ce site web (ci-après "le Site").
          </p>
          <p>
            Nous nous engageons à protéger votre vie privée et à traiter vos données personnelles 
            conformément au Règlement Général sur la Protection des Données (RGPD) et aux lois 
            applicables en matière de protection des données.
          </p>
        </section>

        <section>
          <h2>2. Responsable du traitement</h2>
          <div class="info-box">
            <p><strong>Nom :</strong> [Votre nom ou nom de l'entreprise]</p>
            <p><strong>Adresse :</strong> [Votre adresse]</p>
            <p><strong>Email :</strong> <a href="mailto:contact@example.com">contact@example.com</a></p>
          </div>
        </section>

        <section>
          <h2>3. Données collectées</h2>
          <p>Nous collectons les types de données suivants :</p>
          
          <h3>3.1 Données fournies directement</h3>
          <ul>
            <li><strong>Formulaire de contact :</strong> nom, email, message</li>
            <li><strong>Connexion administrateur :</strong> email, mot de passe hashé</li>
          </ul>

          <h3>3.2 Données collectées automatiquement</h3>
          <ul>
            <li><strong>Données techniques :</strong> adresse IP, type de navigateur, système d'exploitation</li>
            <li><strong>Cookies :</strong> cookies de session, préférences utilisateur</li>
            <li><strong>Logs serveur :</strong> date et heure de connexion, pages visitées</li>
          </ul>
        </section>

        <section>
          <h2>4. Finalités du traitement</h2>
          <p>Nous utilisons vos données pour :</p>
          <ul>
            <li>Répondre à vos demandes de contact</li>
            <li>Gérer l'accès à l'interface d'administration</li>
            <li>Assurer la sécurité du site</li>
            <li>Améliorer nos services</li>
            <li>Se conformer aux obligations légales</li>
          </ul>
        </section>

        <section>
          <h2>5. Base légale du traitement</h2>
          <p>Les bases légales de nos traitements sont :</p>
          <ul>
            <li><strong>Consentement :</strong> pour les cookies non essentiels</li>
            <li><strong>Exécution d'un contrat :</strong> pour répondre à vos demandes</li>
            <li><strong>Intérêt légitime :</strong> pour la sécurité et l'amélioration du site</li>
            <li><strong>Obligation légale :</strong> pour la conservation des logs</li>
          </ul>
        </section>

        <section>
          <h2>6. Destinataires des données</h2>
          <p>Vos données peuvent être partagées avec :</p>
          <ul>
            <li><strong>Hébergeur :</strong> [Nom de l'hébergeur] - pour l'hébergement du site</li>
            <li><strong>Services tiers :</strong> 
              <ul>
                <li>GitHub API - pour afficher les projets publics</li>
                <li>Google Books API - pour les informations sur les livres</li>
              </ul>
            </li>
          </ul>
          <p>Aucune donnée n'est vendue à des tiers.</p>
        </section>

        <section>
          <h2>7. Transferts internationaux</h2>
          <p>
            Certains de nos prestataires peuvent être situés en dehors de l'Union Européenne. 
            Dans ce cas, nous nous assurons que des garanties appropriées sont en place 
            (clauses contractuelles types, Privacy Shield, etc.).
          </p>
        </section>

        <section>
          <h2>8. Durée de conservation</h2>
          <ul>
            <li><strong>Messages de contact :</strong> 3 ans après le dernier échange</li>
            <li><strong>Logs de connexion :</strong> 12 mois maximum</li>
            <li><strong>Cookies :</strong> 13 mois maximum</li>
            <li><strong>Comptes administrateurs :</strong> pendant la durée d'utilisation + 1 an</li>
          </ul>
        </section>

        <section>
          <h2>9. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          
          <div class="rights-grid">
            <div class="right-card">
              <h4>Droit d'accès</h4>
              <p>Obtenir une copie de vos données personnelles</p>
            </div>
            
            <div class="right-card">
              <h4>Droit de rectification</h4>
              <p>Corriger vos données inexactes ou incomplètes</p>
            </div>
            
            <div class="right-card">
              <h4>Droit à l'effacement</h4>
              <p>Demander la suppression de vos données</p>
            </div>
            
            <div class="right-card">
              <h4>Droit à la limitation</h4>
              <p>Limiter le traitement de vos données</p>
            </div>
            
            <div class="right-card">
              <h4>Droit d'opposition</h4>
              <p>Vous opposer au traitement de vos données</p>
            </div>
            
            <div class="right-card">
              <h4>Droit à la portabilité</h4>
              <p>Recevoir vos données dans un format structuré</p>
            </div>
          </div>

          <div class="info-box">
            <p>
              <strong>Pour exercer vos droits :</strong><br>
              Envoyez un email à <a href="mailto:contact@example.com">contact@example.com</a> 
              avec une copie de votre pièce d'identité.
            </p>
            <p>
              Nous répondrons à votre demande dans un délai d'un mois maximum.
            </p>
          </div>
        </section>

        <section>
          <h2>10. Réclamation</h2>
          <p>
            Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une 
            réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) :
          </p>
          <div class="info-box">
            <p><strong>CNIL</strong></p>
            <p>3 Place de Fontenoy - TSA 80715</p>
            <p>75334 PARIS CEDEX 07</p>
            <p>Tél : 01 53 73 22 22</p>
            <p>Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a></p>
          </div>
        </section>

        <section>
          <h2>11. Cookies</h2>
          <p>
            Nous utilisons des cookies pour améliorer votre expérience. Pour plus d'informations, 
            consultez notre <router-link to="/cookies">politique de cookies</router-link>.
          </p>
        </section>

        <section>
          <h2>12. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour 
            protéger vos données contre tout accès non autorisé, perte, destruction ou altération :
          </p>
          <ul>
            <li>Chiffrement HTTPS/SSL</li>
            <li>Hashage des mots de passe (bcrypt)</li>
            <li>Sauvegardes régulières</li>
            <li>Limitation des accès aux données</li>
            <li>Journalisation des accès</li>
          </ul>
        </section>

        <section>
          <h2>13. Modifications</h2>
          <p>
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
            Les modifications entreront en vigueur dès leur publication sur le Site.
          </p>
        </section>

        <section>
          <h2>14. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité ou le traitement de 
            vos données personnelles, vous pouvez nous contacter :
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
        
        ul {
          margin-top: 0.5rem;
          margin-left: 1rem;
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

.rights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.right-card {
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
    font-size: 1rem;
  }
  
  p {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
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