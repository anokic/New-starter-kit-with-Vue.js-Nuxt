<template>
    <div class="fullscreen-menu bg-black color-white position-fixed d-flex flex-center flex-column">
       <router-link 
        v-for='(item, index) in items'
        :key="index"
        :to='item.url'
        v-if='item.url'
        @click.native="closeMenu()"
        class="color-white tiny uppercase">{{item.title}}</router-link>
    </div>
</template>

<script>
// import BaseComponent from "@/mixins/baseComponent";
import { mapGetters } from 'vuex'

export default {
  name: "fullscreen-menu",

  data: () => ({}),

  props: ["model"],

  mixins: [],

  watch: {},

  mounted() {},

  methods: {
    closeMenu() {
        this.$store.dispatch("app/SET_STATE", {
            menuOpen: false
        });

        return true;
    }
  },

  computed: {
    items(){
      return this.getState('navigation')
    },
    ...mapGetters({
        getState: 'pages/getState'
    })
  },

  components: {}
};
</script>

<style lang="scss" scoped="">
.fullscreen-menu {
    z-index: 1000;
    height: 100vh;
    width: 100vw;
    overflow: auto;
    .nav-item {
        margin-bottom: 1rem;
        &:last-child {
            margin-bottom: 0 !important;
        }
    }
}
</style>