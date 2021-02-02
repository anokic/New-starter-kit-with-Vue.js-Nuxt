<template>
<div ref="waypoint"
     class="waypoint">
   <slot></slot>
</div>

</template>

<script>

export default {
    name: 'waypoint',
    data: () => ({
        bounds: {},
        refBound: null,
        refSize: null,
        horizontal: false
    }),

    mixins: [
    ],

    props: [
        'model',
        'debug',
        'customOffset',
        'middleOffset',
        'bottomOffset'
    ],


    beforeDestroy() {
        this.$bus.$off('resize', this.resizeHandler)
    },

    mounted(){
        this.$bus.$on('resize', this.resizeHandler)
        
        setTimeout(() => {
            this.resizeHandler()
        }, 80)

        this.$emit('toggleOneDirectionVisible', {
            visible: this.oneDirectionVisible,
            el: this.$el
        })

        this.$emit('toggleVisible', {
            visible: this.isVisible,
            el: this.$el
        })
    }, 

    watch: {
        oneDirectionVisible(visible){
            this.$emit('toggleOneDirectionVisible', {
                visible: visible,
                el: this.$el
            })
        },

        isVisible(visible){
            this.$emit('toggleVisible', {
                visible: visible,
                el: this.$el
            })
        },

        pageRefSize(size) {
            this.resizeHandler();
        }
    },

    computed: {
        offset(){
            return this.customOffset || 0
        },
        elStyle(){
            return {
                visibility: this.isVisible ? 'visible' : 'hidden'
            }
        },
        scrolled() {
            return this.$store.getters['app/getState']('scrollTop')
        },

        pageHeight() {
            return this.$store.getters['app/getState']('height')
        },

        pageWidth() {
            return this.$store.getters['app/getState']('width')
        },

        offset() {
            return this.pageRefSize * 0
        },

        pageRefSize() {
            return this.$store.getters['app/getState']('height')
        },

        oneDirectionVisible() {
            const self = this

            if (this.isMobile || this.isiPad) {
                return true;
            }

            if(!_.isNumber(this.refBound)){
                return false
            }


            let curOffset = this.refBound - this.scrolled

            let isVisible = (curOffset >= this.pageRefSize - this.offset) ? false : true
            
            return isVisible
        },

        isVisible() {
            const self = this

            if (this.isMobile || this.isiPad) {
                return true;
            }

            let start = this.refBound - this.offset - this.pageHeight;
            let end = this.refBound + this.refSize - this.offset

            return this.scrolled >= start && this.scrolled < end
        }
    },

    methods: {
        resizeHandler(notWindowResize) {

            if (!this.$el || (this.$store.getters['app/getState']('transitioning') && self.tl)) {
                return
            }

            this.bounds = this.$el.getBoundingClientRect()

            let prop = this.horizontal ? 'left' : 'top'

            this.refSize = this.horizontal ? this.$el.offsetWidth : this.$el.offsetHeight
            this.refBound = this.bounds[prop] + this.scrolled
        }
    }
}

</script>

<style scoped="">

.opacity-change{ 
   transition: all 1.2s;
   will-change: opacity, transform;
}

.waypoint {
}
</style>
