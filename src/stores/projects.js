import { defineStore } from 'pinia'

export const useProjectStore = defineStore('projects', {
  state: () => ({
    featuredOrder: ["omni-share-tool", "adaptive-media-engine", "art-showcase-v2"],
    customizations: {
      "art-showcase-v2": {
        image: "/images/portfolio-illustrateur.jpg",
        customDesc: "Application mobile & web (Ionic/Vue 3) pour artistes numériques.",
        tags: ["Vue 3", "Ionic", "Laravel", "Capacitor"],
        problem: "Difficulté d'exposer des oeuvres haute définition sur mobile sans ralentissement.",
        solution: "Système de cache intelligent avec Capacitor et API Laravel optimisée pour le stream d'images.",
        role: "Full-stack Developer",
        outcomes: "Fluidité native (60fps) et support du mode hors-ligne."
      },
      "adaptive-media-engine": {
        image: "/images/resize-tool-demo.jpg",
        customDesc: "Moteur de traitement média automatisé via API Laravel.",
        tags: ["Laravel", "FFmpeg", "Vue 3", "Redis"],
        problem: "Chronophagie du redimensionnement manuel pour les réseaux sociaux.",
        solution: "Files d'attente Redis pour traiter les transformations FFmpeg en asynchrone.",
        role: "Backend Engineer",
        outcomes: "Automatisation complète du workflow de publication."
      },
      "omni-share-tool": {
        image: "/images/omni-share-preview.jpg",
        customDesc: "Hub de multidiffusion sociale (Socialite/Laravel).",
        tags: ["Vue 3", "Laravel", "Socialite", "OAuth2"],
        problem: "Fragmentation de la présence sociale et perte de temps en publications manuelles.",
        solution: "Centralisation via OAuth2 et tableau de bord unifié en Vue 3.",
        role: "Full-stack Developer",
        outcomes: "Publication simultanée sur 5 plateformes en un clic."
      }
    }
  }),

  getters: {
    getCustomization: (state) => (repoName) => {
      return state.customizations[repoName] || null
    },

    hasCustomization: (state) => (repoName) => {
      return !!state.customizations[repoName]
    }
  }
})