<template>
<transition v-on:enter="enter"
            v-on:before-enter="beforeEnter"
            v-on:after-enter="afterEnter"
            v-on:leave="leave"
            :mode='mode'
            v-bind:css="false">
   <slot></slot>
</transition>

</template>

<script>
import { gsap, TimelineMax } from 'gsap';

export default {
    name: 'customTransition',
    data: () => ({
        duration: .64
    }),

    computed: {
        mobile()  {
            return this.$store.getters['app/getState']('mobile')
        },
        dl() {
            return this.delay || .1
        },
        dur(){
            return this.$store.getters['app/getState']("instantTransition") && this.pageTransition ? 0 : this.customDur || this.duration
        }
    },

    props: [
        'delay',
        'img',
        'noAdditionalClasses',
        'pageTransition',
        'mode',
        'customDur'
    ],

    methods: {
        afterEnter: function(el, done)  {},

        beforeEnter(el, done)  {},

        enter(el, done)  {

            this.tl = new TimelineMax({
                onComplete: () => {
                    if(this.pageTransition){
                        setTimeout(() => {
                            this.$emit('update:loading', false)
                        }, 400)
                    }

                    done()
                }
            })


            let dl = this.pageTransition ? this.dl : 0

            this.tl.fromTo(el, this.dur, {
                opacity: 0,
                rotate: 0.1,
            }, {
                opacity: 1,
                delay: dl,
                rotate: 0.01,
            })
        },

        leave(el, done)  {

            if(this.pageTransition){
                this.$emit('update:loading', true)

                // this.$store.dispatch('app/SET_STATE', {
                //     transitioning: true,
                //     animationDelay: 1.2
                // })
            }

            if(!this.noAdditionalClasses && this.mode != "out-in"){
                let cls = this.pageTransition ? ['transitioning-out'] : ['transitioning-out'] 
                el.classList.add(...cls);
            }

            let d = this.pageTransition ? this.dur / 2 : this.dur

            gsap.to(el, d, {
                opacity: 0,
                delay: .05,
                onComplete: () => {

                    if(this.pageTransition){
                        window.scrollTo(0, 0)
                        this.$store.dispatch('app/SET_STATE', {
                            scrollTop: 0
                        })
                    }

                    this.$nextTick(done)
                }
            })

        }
    }
}

</script>

<style scoped="">
</style>
