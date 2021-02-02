<template>
  <div class="page page--basic">
    <smooth-scroll class="h-100"
                   v-if='model'
                   :pageId='model.sys.id'>
        <div class="components-wrapper overflow-hidden">
            <!-- Page Header -->
            <div v-if="model.fields.pageHeader">
                <component :is="getComponentTemplate(model.fields.pageHeader)"
                           :model="model.fields.pageHeader" />
            </div>

            <!-- Page Components -->
            <div v-if="model.fields.components">
               <component v-for='(component,index) in model.fields.components'
                          :model='component'
                          :is='getComponentTemplate(component)'
                          :key='index'></component>
            </div>

            <!-- Page Footer -->
            <div v-if="model.fields.pageFooter">
                <component v-if='getComponentTemplate(model.fields.pageFooter)'
                           :is="getComponentTemplate(model.fields.pageFooter)"
                           :model="model.fields.pageFooter" />
            </div>
        </div>
    </smooth-scroll>
  </div>
</template>

<script>
import framework from '@/plugins/framework'
import PageComponents from '@/mixins/PageComponents';
import BasePage from '@/mixins/BasePage';


export default {
  name: 'BasicPage',

  components: {
  },

  mixins: [BasePage, PageComponents],

  data: () => ({}),

  computed: {},

  watch: {},

  async asyncData (context) {
    const urls = context.store.getters['pages/getState']('urls')

    const activePage = await framework.loadActivePage({
      route: context.route.path,
      id: context.route.name,
      urls,
      include: 4
    })

    context.store.dispatch('pages/SET_STATE', {
      activePage
    })

    return {
      model: activePage
    }
  },

  methods: {}
}
</script>

<style>
</style>
