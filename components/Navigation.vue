<template>
  <div class="navigation position-fixed t-0 l-0 w-100 on-top d-flex justify-content-between">
    <div>
        <logo class="logo"></logo>
    </div>
    <div class="color-white">
        <router-link 
        v-for='(item, index) in items'
        :key="index"
        v-if='item.url'
        :to='item.url'
        class="d-none d-md-block color-white tiny uppercase link">{{item.fields.title}}</router-link>

        <div class="hamburger-wrapper d-flex d-md-none align-items-center justify-content-end h-100">
            <div class="cursor-pointer d-flex align-items-center no-select enabled" @click="toggleMenu()">
                <span class='lh-12 transition h6' :class="{'fade-out' : menuOpen}"></span>
                <hamburger></hamburger>
            </div>
        </div>
    </div>
        
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Logo from '@/assets/svg/logo.svg?inline'

export default {
  name: "navigation",

  data: () => ({}),

  props: ["page"],

  mixins: [],

  watch: {},

  mounted() {
    console.log("NAVIGATION", this.navigationModel)
  },

  methods: {
    toggleMenu(state) {
        let self = this;

        this.$store.dispatch("app/SET_STATE", {
            menuOpen: state === false ? false : !self.menuOpen
        });
        return true;
    }
  },

  computed: {
    ...mapGetters({
        getState: 'pages/getState'
    }),

    items(){
      return this.navigationModel.fields.pages
    },
    navigationModel() {
        return this.$store.getters["pages/getState"]("navigation");
    },
    menuOpen() {
        return this.$store.getters["app/getState"]("menuOpen");
    }
  },

  components: {
    Logo,
    Hamburger
  }
};
</script>

<style lang="scss" scoped="">
.navigation {
    z-index: 100000;
    transition: 0.4s;
    padding: 1rem;
    @include media-breakpoint-up(md) {
        padding: 2rem 3rem;
    }
    .logo {
        width: 8rem;
        height: 2rem;
        fill: $white;
    }
}
</style>