<template>
<div ref="holder"
     class='parallax-wrapper'
     :class="[className, { 'wrapped': wrapped, 'not-wrapped': !wrapped, 'position-absolute': absolute }]">
    <div ref="parallax"
         class="parallax"
         v-bind:style="elStyle">
        <slot></slot>
    </div>
</div>

</template>

<script>
import imagesLoaded from 'imagesloaded';

export default {
    name: 'parallax',
    data: () => ({
        height: 0,
        bounds: {},
        refBound: 0,
        opacity: 1,
        filter: 0,
        width: 0
    }),

    mounted()  {
        let self = this
        this.initParallax()

        this.$bus.$on('resize', self.resizeHandler)

        this.$watch(vm => [

            self.refSize,

            self.pageHeight,

            self.pageWidth
        ].join(), val => {
            self.$nextTick(self.resizeHandler)
        })
    },

    watch: {
        scrollOffset(top)  {}
    },

    props: [

        'model',

        'addition',

        'speedFactor',

        'wrapped',

        'absolute',

        'offset',

        'className',

        'global',

        'leftCol',

        'topOffset',

        'opacityChange',

        'horizontal',

        'toEnd',

        'log',

        'debug'
    ],

    computed: {

        elStyle() {
            return  { 
                transform: this.elTransform, 
                left: this.elLeft + 'px', 
                top: this.elTop + 'px', 
                height: this.elHeight + 'px', 
                width: this.elWidth + 'px', 
                opacity: this.opacity, 
                filter: this.filter 
            }
        },

        noScale() {
            return this.refSize == this.height
        },

        classObject()  {
            return {
                'wrapped': this.wrapped,
                'position-absolute': this.absolute
            }
        },

        topProp()  {
            return this.leftCol ? 'scrollTopLeftCol' :
                this.horizontal ? 'scrollTop' :
                    'scrollTop'
        },

        scrollOffset()  {
            return this.$store.getters['app/getState'](this.topProp)
        },

        pageHeight()  {
            return this.$store.getters['app/getState']('pageHeight')
        },

        pageWidth()  {
            return this.$store.getters['app/getState']('pageWidth')
        },

        refProp()  {
            return this.horizontal ? 'width' : 'height'
        },

        refSize()  {
            return this.$store.getters['app/getState']('height')
        },

        extraOffset()  {
            return this.addition ? this.addition :
                this.horizontal && !this.wrapped ? 600 :
                    0
        },

        elTransform()  {
            let bound = this.topOffset || this.refBound

            let start = bound - this.refSize

            let isClose = bound === 0

            start = _.isNumber(this.offset) || isClose ? 0 : start

            if(this.debug){
                console.log('start:', start)
            }

            let end = start + this.refSize

            end += this.height
            end += this.wrapped ? 0 : this.move / 2

            
            // console.log("END START", start, end, this.refSize, this.height)


            var percentage = this.scrollProgress(start, end, this.scrollOffset)


            let currentMove = this.move * percentage
            let x = this.horizontal ? currentMove : 0
            let y = !this.horizontal ? currentMove : 0

            let scale = 1 + (percentage/6)



            if(this.debug){
                // console.log("END:", this.refBound, b1)
                // console.log("START:", start, end, percentage)
            }


            return 'translate3d(' + x + 'px,' + y + 'px, ' + 0 + 'px) scale(' + scale + ')'
        },

        speedMultiplier()  {
            return this.horizontal ? 0.5 : 1
        },

        move()  {
            return this.$device.isMobile ? 600 * this.speedFactor * this.speedMultiplier :
                this.global ? this.refSize * this.speedFactor * this.speedMultiplier :
                this.height * this.speedFactor * this.speedMultiplier
        },

        elHeight()  {
            return this.getSize(this.horizontal)
        },

        elWidth()  {
            return this.getSize(!this.horizontal)
        },

        elTop()  {
            return this.getOffset(this.horizontal)
        },

        elLeft()  {
            return this.getOffset(!this.horizontal)
        }
    },

    destroyed()  {
        this.$bus.$off('resize', this.resizeHandler)
    },

    methods: {
        loaded()  {
            this.resizeHandler()
        },

        getSize(ignore)  {


            if (!this.wrapped || ignore) {
                return
            }

            let size = this.horizontal ? this.width : this.height

            var newh = this.noScale ? this.height
                : (this.offset || (this.refBound === 0 && !this.horizontal)) && !this.toEnd ? this.height
                : Math.ceil(size + Math.abs(this.move))

            return newh || ''
        },

        getOffset(ignore)  {
            if(ignore){
                return
            }

            let m = -this.move

            if(_.isNumber(this.offset)){
                return this.offset
            }

            let off = m > 0 ? 0
                : this.wrapped && this.noScale ? m / 2
                : this.refBound == 0 && !this.horizontal ? 0
                : this.wrapped ? m
                : m / 2
           
            return off
        },

        initParallax()  {
            var self = this

            self.resizeHandler()

            imagesLoaded(this.$el, () => {
                self.$nextTick(self.resizeHandler)
            })
        },

        // returning the scroll progress from 0 to 1 in between start/end pixels
        scrollProgress(start, end, scrollOffset)  {
            var scrollOffset = scrollOffset || this.scrollOffset,
                factor = (end - start) / 100,
                scrollStart = (scrollOffset - start) / factor,
                percentage = (scrollOffset >= start && scrollOffset <= end) ? scrollStart / 100 :
                    (scrollOffset > start) ? 1 : 0

            return percentage
        },

        resizeHandler()  {
            if (!this.$el) {
                return
            }

            this.bounds = this.$el.getBoundingClientRect()
            this.refBound = this.bounds.top + this.scrollOffset
            this.height = this.$el.offsetHeight
            this.width = this.$el.offsetWidth
        }

    }
}

</script>

<style lang="scss" scoped="">
.parallax-wrapper {
    height: 100%;
    width: 100%;
    left: 0;
    top: 0; // z-index: -1;
    .isMobile {
        &>.parallax {
            height: 100%!important;
            transform: none!important;
            top: 0!important;
        }
    }
    @include media-breakpoint-down(sm) {
        &.not-wrapped {
            &>.parallax {
                transform: none!important;
                top: 0!important;
            }
        }
    }
}

.wrapped {
    overflow: hidden;
    .parallax {
    }
}

.parallax {
    position: relative;
    will-change: transform;
    backface-visibility: hidden;
    height: 100%;
}

</style>
