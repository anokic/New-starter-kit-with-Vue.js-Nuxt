<template>
<div class="scroll-wrapper" :class='{"no-scrollbar" : noScrollbar}'>
    <slot></slot>
    <div ref='fake' class='d-none'></div>
</div>

</template>

<script>
// import Scrollbar, { ScrollbarPlugin } from 'smooth-scrollbar';
import Vue from 'vue'

import Scrollbar from 'smooth-scrollbar';
// import OverscrollPlugin from '@/plugins/overscroll';
// import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';

import { ScrollbarPlugin } from 'smooth-scrollbar';
class EdgeEasingPlugin extends Scrollbar.ScrollbarPlugin {
    constructor() {
        super(...arguments);
        this._remainMomentum = {
            x: 0,
            y: 0,
        };

        this.options.disabled = false
    }
    transformDelta(delta) {

        if(this.options.disabled){
            this.scrollbar.setMomentum(0, 0)
            return { x: 0, y: 0 }
        }

        const { limit, offset, } = this.scrollbar;
        const x = this._remainMomentum.x + delta.x;
        const y = this._remainMomentum.y + delta.y;

        // clamps momentum within [-offset, limit - offset]
        this.scrollbar.setMomentum(
            Math.max(-offset.x, Math.min(x, limit.x - offset.x)), 
            Math.max(-offset.y, Math.min(y, limit.y - offset.y))
        )

        return { x: 0, y: 0 };
    }
    onRender(remainMomentum) {
        Object.assign(this._remainMomentum, remainMomentum);
    }
}
EdgeEasingPlugin.pluginName = 'edgeEasing';



export default {
    data: () => ({
        defaults: {
            // speed: 3,
            damping: 0.1,
            renderByPixels: true,
            // thumbMinSize: 80,
            alwaysShowTracks: false,
            // plugins: {
            //     overscroll: {
            //         enable: true,
            //         maxOverscroll: 100,
            //         damping: 0.12
            //     }
            // }
        }
    }),

    props: [

        'customOptions',

        'preventEvents',

        'scrollTo',

        'noScrollbar',

        'pageId',

        'forceEvents',

        'disabled',

        'startTop'
    ],

    computed: {
        smoothOptions()  {
            var options = _.merge({}, this.defaults, this.customOptions)
            return options
        },

        activePageId() {
            let a1 = this.$store.getters['pages/getState']('activePage')

            if(!a1){
                return 'nono'
            }

            return a1 && a1.sys ? a1.sys.id : a1.id
        },

        noSmooth() {
            return this.$store.getters['app/getState']('noSmooth')
        },

        isIE() {
            return this.$store.getters['app/getState']('isIE')
        },

        scrollTop() {
            return this.$store.getters['app/getState']('scrollTop')
        },

        isCurrentPage(){
            return this.activePageId == this.pageId
        }
    },

    beforeDestroy()  {
        if (this.scrollbar) {
            this.scrollbar.removeListener()
            // this.scrollbar.destroy()
        }

        this.$store.dispatch('app/SET_STATE', {
            scrollTop: 0
        })


        window.removeEventListener('scroll', this.onScroll)

        setTimeout(() => {
            this.$store.dispatch('app/SET_STATE', {
                scrollStart: false,
                scrolled: false
            })
        }, 300)

        this.$bus.$off('scrollTo')
        this.$bus.$off('updateScrollbar')
        this.$bus.$off('enableScrollbar', this.enable)
        this.$bus.$off('disableScrollbar', this.disable)
    },

    mounted()  {

        // if(!this.disabled){
        this.initSmooth(this.$el)
        // }
    },

    watch: {
        disabled(d) {

            if(d){
                this.disable()
            }else {
                this.enable()
            }

            // if(d){
            //     this.scrollbar.removeListener()
            //     // this.scrollbar.destroy()
            // }else{
            //     this.initSmooth(this.$el)
            // }
        },


        startTop(st){
            this.scrollbar && this.scrollbar.scrollTo(0, st, 0)
        },


        scrollTo(y)  {
            this.scrollbar && this.scrollbar.scrollTo(0, y, 600)
        },

       scrollTop(top) {
            let scrollingDown = top > 10
            let s = this.sTop < top && top > 10

            this.sTop = top
            this.scrolled = s

            this.$store.dispatch('app/SET_STATE', {
                scrollStart: scrollingDown,
                scrolled: this.scrolled
            })
            
        }
    },

    methods: {
        onScroll(e)  {
            var self = this

            self.$store.dispatch('app/SET_STATE', {
                scrollTop: window.scrollY
            })
        },

        enable() {
            if(!this.scrollbar){
                return
            }

            // console.log("ENABLE THE SCROLL!!!")

            this.scrollbar.updatePluginOptions('edgeEasing', { disabled: false });
        },

        disable() {
            if(!this.scrollbar){
                return
            }

            // console.log("DISABLE THE SCROLL!!!")

            this.scrollbar.updatePluginOptions('edgeEasing', { disabled: true });
        },

        onSmoothScroll(status) {
            if (this.transitioning || !this.isCurrentPage || this.$store.state.route.query.case || this.disabled ) {
                return
            }

            // this.scrollbar._plugins[0].options.disabled

            // this.$nextTick(() => {
            // requestAnimationFrame(() => {
                this.$store.dispatch('app/SET_STATE', {
                    scrollTop: status.offset.y
                })

            // })
            // })
        },

        initSmooth(el)  {
            var self = this

            if(this.scrollbar){
                this.scrollbar.removeListener()
                return
            }

            
            if (this.$device.isMobileOrTablet || this.noSmooth) {

                window.removeEventListener('scroll', self.onScroll)
                window.addEventListener('scroll', self.onScroll)

                this.$bus.$on('scrollTo', (top) => {

                    window.scrollTo({
                        top: top,
                        // behavior: 'smooth'
                    })
                })

                return
            }

            // Scrollbar.use(OverscrollPlugin)            

            Scrollbar.use(EdgeEasingPlugin);

            this.scrollbar = Scrollbar.init(el, this.smoothOptions)

            if(this.startTop){
                this.scrollbar.setPosition(0, this.startTop)
                this.$store.dispatch('app/SET_STATE', {
                    scrollTop: this.startTop
                })                
            }


            if(this.disabled){
                this.disable()
            }else {
                this.enable()
            }

            this.scrollbar.addListener(this.onSmoothScroll)

            this.$bus.$on('updateScrollbar', e => {
                this.scrollbar.update()
            })

            if (this.preventEvents) {
                return
            }

            this.$bus.$on('enableScrollbar', this.enable)
            this.$bus.$on('disableScrollbar', this.disable)


            this.$bus.$on('scrollTo', (top, dur) => {

                if(this.$device.isMobileOrTablet){
                    window.scrollTo(0, 0)
                    return
                }

                let duration = _.isNumber(dur) ? dur : 600
                this.scrollbar.scrollTo(0, top, duration)
            })

        }
    }
};
</script>

<style lang="scss">
    .no-scrollbar{
        .scrollbar-track{
            transform: scale(0);
        }
    }

    .scrollbar-track{
        display: none!important;
    }
</style>

<style lang="scss" scoped="">
// .scroll-wrapper {
//     @include media-breakpoint-up(xl) {
//         position: absolute;
//         width: 100%;
//         height: 100%;
//         top: 0;
//         left: 0;
//     }
// }
</style>