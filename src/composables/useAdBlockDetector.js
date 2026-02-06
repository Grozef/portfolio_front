import { ref, onMounted } from 'vue'
import { useEasterEggs } from './useEasterEggs'

/**
 * Composable pour détecter AdBlock et découvrir l'easter egg
 * 
 * Méthode de détection:
 * - Crée un élément avec une classe typique de pub
 * - Si l'élément est caché, AdBlock est actif
 * 
 * @returns {Object} adBlockDetected - État de détection
 */
export function useAdBlockDetector() {
  const adBlockDetected = ref(false)
  const { discoverEgg, EASTER_EGGS } = useEasterEggs()
  
  const detectAdBlock = async () => {
    try {
      // Créer un élément test avec classe pub typique
      const testAd = document.createElement('div')
      testAd.innerHTML = '&nbsp;'
      testAd.className = 'adsbox ad-banner ad-placement'
      testAd.style.cssText = 'position: absolute; width: 1px; height: 1px;'
      document.body.appendChild(testAd)
      
      // Attendre que AdBlock agisse
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Vérifier si l'élément est masqué
      const isHidden = window.getComputedStyle(testAd).display === 'none' || 
                      testAd.offsetHeight === 0 ||
                      testAd.offsetWidth === 0
      
      // Nettoyer
      document.body.removeChild(testAd)
      
      if (isHidden) {
        adBlockDetected.value = true
        discoverEgg(EASTER_EGGS.ADBLOCK_DETECTOR)
        
        console.log('%c🚫 AdBlock Detected!', 'color: #ff4444; font-size: 16px; font-weight: bold;')
        console.log('%c Easter Egg Discovered: AdBlock Detector', 'color: #c9a227; font-size: 14px; font-weight: bold;')
        console.log('%cYou\'re using an ad blocker! Smart move 👍', 'color: #4a9eff; font-size: 12px;')
      }
    } catch (error) {
      console.warn('AdBlock detection failed:', error)
    }
  }
  
  onMounted(() => {
    // Détecter après un court délai
    setTimeout(detectAdBlock, 500)
  })
  
  return {
    adBlockDetected
  }
}