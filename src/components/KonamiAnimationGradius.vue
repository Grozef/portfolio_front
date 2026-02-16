<template>
  <Transition name="konami-fade">
    <div v-if="show" class="konami-animation gradius">
      <!-- Starfield background -->
      <div class="starfield">
        <div 
          v-for="i in 100" 
          :key="i" 
          class="star"
          :style="getStarStyle(i)"
        ></div>
      </div>
      
      <!-- Vic Viper ship (pixel art sprite) -->
      <div class="vic-viper" ref="vicViper">
        <div class="ship-sprite">
          <!-- Main body -->
          <div class="sprite-row row-1">
            <span class="pixel"></span>
          </div>
          <div class="sprite-row row-2">
            <span class="pixel"></span>
            <span class="pixel"></span>
            <span class="pixel"></span>
          </div>
          <div class="sprite-row row-3">
            <span class="pixel wing"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel wing"></span>
          </div>
          <div class="sprite-row row-4">
            <span class="pixel wing"></span>
            <span class="pixel wing"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel cockpit"></span>
            <span class="pixel wing"></span>
            <span class="pixel wing"></span>
          </div>
          <div class="sprite-row row-5">
            <span class="pixel"></span>
            <span class="pixel wing"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel wing"></span>
            <span class="pixel"></span>
          </div>
          <div class="sprite-row row-6">
            <span class="pixel wing"></span>
            <span class="pixel wing"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel wing"></span>
            <span class="pixel wing"></span>
          </div>
          <div class="sprite-row row-7">
            <span class="pixel wing"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel body"></span>
            <span class="pixel wing"></span>
          </div>
          <div class="sprite-row row-8">
            <span class="pixel"></span>
            <span class="pixel"></span>
            <span class="pixel"></span>
          </div>
          <div class="sprite-row row-9">
            <span class="pixel"></span>
          </div>
          
          <!-- Engine flames -->
          <div class="engine-left">
            <div class="flame-particle"></div>
            <div class="flame-particle"></div>
            <div class="flame-particle"></div>
          </div>
          <div class="engine-right">
            <div class="flame-particle"></div>
            <div class="flame-particle"></div>
            <div class="flame-particle"></div>
          </div>
        </div>
        
        <!-- Laser beams -->
        <div class="lasers">
          <div class="laser laser-1"></div>
          <div class="laser laser-2"></div>
        </div>
      </div>
      
      <!-- Options (orange spheres following ship) -->
      <div 
        v-for="i in 4" 
        :key="'option-' + i"
        class="option"
        :style="getOptionStyle(i)"
      >
        <div class="option-core"></div>
      </div>
      
      <!-- Power-ups floating -->
      <div class="powerups-container">
        <div 
          v-for="(powerup, index) in powerups" 
          :key="'powerup-' + index"
          class="powerup-capsule"
          :style="getPowerupStyle(index)"
        >
          <div class="capsule-body">
            <span class="capsule-letter">{{ powerup }}</span>
          </div>
        </div>
      </div>
      
      <!-- Main message with Gradius UI -->
      <div class="gradius-ui">
        <!-- Power-up bar -->
        <div class="powerup-bar">
          <div class="bar-title">POWER UP</div>
          <div class="bar-items">
            <div 
              v-for="(item, index) in powerupBar" 
              :key="index"
              class="bar-item"
              :class="{ active: activeBarIndex >= index }"
            >
              {{ item }}
            </div>
          </div>
        </div>
        
        <!-- Main message -->
        <div class="gradius-message">
          <div class="message-box">
            <div class="box-border"></div>
            <div class="box-content">
              <div class="title-text">
                <span class="letter" v-for="(letter, i) in 'KONAMI CODE'" :key="i" :style="{ animationDelay: i * 0.05 + 's' }">
                  {{ letter === ' ' ? '\u00A0' : letter }}
                </span>
              </div>
              <div class="subtitle-text">ACTIVATED</div>
              <div class="lives-display">
                <div class="lives-icon">
                  <span v-for="i in 3" :key="i" class="life-ship">▶</span>
                </div>
                <div class="lives-count">× 30</div>
              </div>
              <div class="sequence">↑↑↓↓←→←→BA</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Enemy formations -->
      <div class="enemies">
        <div 
          v-for="i in 8" 
          :key="'enemy-' + i"
          class="enemy"
          :style="getEnemyStyle(i)"
        >
          <div class="enemy-body">◆</div>
        </div>
      </div>
      
      <!-- Explosions -->
      <div class="explosions-container">
        <div 
          v-for="i in 5" 
          :key="'explosion-' + i"
          class="explosion"
          :style="getExplosionStyle(i)"
        >
          <div class="explosion-particle" v-for="j in 8" :key="j"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: Boolean
})

const powerups = ['S', 'M', 'D', 'L', 'O', '!']
const powerupBar = ['SPEED UP', 'MISSILE', 'DOUBLE', 'LASER', 'OPTION', 'SHIELD']
const activeBarIndex = ref(5)

const getStarStyle = (index) => {
  const size = Math.random() * 3 + 1
  const top = Math.random() * 100 + '%'
  const left = Math.random() * 100 + '%'
  const duration = Math.random() * 2 + 1 + 's'
  const delay = Math.random() * 2 + 's'
  
  return {
    width: size + 'px',
    height: size + 'px',
    top: top,
    left: left,
    '--duration': duration,
    '--delay': delay
  }
}

const getPowerupStyle = (index) => {
  const delay = (index * 0.5) + 's'
  const top = (20 + (index * 10) % 60) + '%'
  const duration = (3 + Math.random()) + 's'
  
  return {
    top: top,
    '--delay': delay,
    '--duration': duration
  }
}

const getOptionStyle = (index) => {
  const delay = (index * 0.15) + 's'
  const offset = index * 60
  
  return {
    '--delay': delay,
    '--offset': offset + 'px'
  }
}

const getEnemyStyle = (index) => {
  const row = Math.floor((index - 1) / 4)
  const col = (index - 1) % 4
  const top = (15 + row * 20) + '%'
  const delay = (index * 0.2) + 's'
  
  return {
    top: top,
    '--delay': delay
  }
}

const getExplosionStyle = (index) => {
  const top = (20 + index * 15) + '%'
  const left = (30 + index * 15) + '%'
  const delay = (0.5 + index * 0.3) + 's'
  
  return {
    top: top,
    left: left,
    '--delay': delay
  }
}
</script>

<style src ="/src/assets/styles/componentsScss/konami-animation.scss" scoped lang="scss">

</style>