<template>
  <div class="position-relative app-wrapper">
    <navigation />

    <fullscreen-menu :key="menuOpen"
                     v-if="menuOpen"></fullscreen-menu>

    <custom-transition 
    :mode='"out-in"' 
    :delay='.15'
    :pageTransition='true'>
        <nuxt :key="pageKey" />
    </custom-transition>

  </div>
</template>

<script>
import Vue from 'vue'
import _get from 'lodash/get'
// import framework from '@/plugins/framework'
import Navigation from '@/components/Navigation'
import FullscreenMenu from '@/components/FullscreenMenu'
import DeviceDetection from '@/mixins/DeviceDetection'

export default {

  components: {
    Navigation,
    FullscreenMenu
  },

  mixins: [DeviceDetection],

  data: () => ({}),

  computed: {
    activePage () {
      return this.$store.getters['pages/getState']('activePage')
    },

    pageKey () {
      return _get(this.activePage, 'sys.id') || 'not-found'
    },
    menuOpen() {
        return this.$store.getters["app/getState"]("menuOpen");
    }
  },

  watch: {},

  created () {
    Vue.prototype.$webp = this.$store.getters['app/getState']('webp')
  },

  mounted () {
    this.resizeHandler()
    window.addEventListener('resize', this.resizeHandler)
    window.addEventListener('orientationchange', this.resizeHandler)
    document.addEventListener('touchstart', function () {}, true)
  },

  methods: {
    resizeHandler () {
      this.$nextTick(() => {
        this.$bus.$emit('resize')
      })

      this.$store.dispatch('app/SET_STATE', {
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
  }

}
</script>

<style lang="scss">
</style>
