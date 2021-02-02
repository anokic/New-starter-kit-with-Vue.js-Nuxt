import Vue from 'vue'

var BasePage = {

    mounted() {
        if(this.resizeHandler){
            this.$bus.$on('resize', this.resizeHandler)
            this.$nextTick(this.resizeHandler)
        }
    },

    beforeDestroy(){
        if(this.resizeHandler){
            this.$bus.$off('resize', this.resizeHandler)
        }
    },

    computed: {
    },

    methods: {
        getComponentTemplate(component) {
            let template = _.get(component, 'fields.template') || _.get(component, 'sys.contentType.sys.id')
            return this.returnComponent(template.capitalize())
        },

        // returnComponent(component){
        //     console.log("COMPONENT", component)
        //     if(!component){
        //         return
        //     }

        //     component = component.replace(/\_/g, '-')

        //     return component

        //     let componentExists = Vue.options.components[component]
        //     || this.$options.components[component]

        //     return componentExists ? component : null
        // }
        returnComponent(component){
            let componentExists = Vue.options.components[component]
            || this.$options.components[component]

            return componentExists ? component : null
        }
    }

}


export default BasePage;
