import { gsap } from 'gsap';

var animations = {
    data: () => ({
        tweens: [],

        defaultEase: 'Power4.easeOut',

        defaults: {
            opacity: {
                from: 0,
                to: 1,
                dur: 1
            },
            y: {
                from: 50,
                to: 0,
                dur: 1.6,
                ease: 'Power3.easeOut'
            },
            x: {
                from: 200,
                to: 0,
                dur: 1.8,
                ease: 'Power4.easeOut'
            },
            scale: {
                from: 1.4,
                to: 1,
                dur: 1.6,
                ease: 'Power2.easeOut'
            },
            rotation: {
                from: 10,
                to: 0,
                dur: 1.6,
                ease: 'Power2.easeOut'
            },
            clipPath: {
                from: 'polygon(30% 10%, 70% 10%, 70% 90%, 30% 90%)',
                to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                ease: 'Power4.easeInOut',
                dur: 2
            },
        },

        presets: {

            'opacity,y': {
                fromopacity: 0,
                toopacity: 1,
                fromy: 50,
                toy: 0,
                dur: 1,
                ease: 'Power3.easeOut'
            },
            'scale,y': {
                fromscale: 3,
                toscale: 1,
                fromy:-100,
                toy: 0,
                dur: 1
            },
            'opacity,x': {
                fromopacity: 0,
                toopacity: 1,
                fromx: 150,
                tox: 0,
                dur: 1.4,
                ease: 'Power3.easeOut'
            },
            'opacity,scale': {
                fromscale: 1.2,
                toscale: 1,
                fromopacity: 0,
                toopacity: 1,
                dur: 1.4,
                ease: 'Power3.easeOut'
            }
        }
    }),

    computed: {
          animationDelay()  {
              return this.$store.getters['app/getState']('animationDelay')
          }
    },

    methods: {
        toggleAnimations(options) {
            let el = options.el || this.$el
            let elemsToAnimate = el.querySelectorAll('.should-animate')
            this.runAnimation(elemsToAnimate, options.visible)
        },

        setAnimationObjects(obj, prop, visible){

            // dafault values for the specific property
            let defaultValues = this.defaults[prop]

            // setting the duration - data or preset values else default dur
            let dur = visible ? obj.dur * 1 || defaultValues.dur : 0

            let from = obj["from" + prop] ? obj["from" + prop] : defaultValues.from
            let to = obj["to" + prop] ? obj["to" + prop] : defaultValues.to

            // its depening on the animation direction
            let fromValue = visible ? from : to
            let toValue = visible ? to : from

            return {
                from: fromValue,
                to: toValue,
                dur: dur,
                ease: obj.ease,
            }
        },

        runAnimation(elems, visible) {

            gsap.set(elems, {
                opacity: 1
            })

            _.each(elems, (elem, index) => {
                if(!elem.dataset){
                    return
                }

                let dur = 0
                let preset = elem.dataset.preset
                let presetExists = _.has(this.presets, preset)

                let delay = visible ? elem.dataset.delay * 1 : 0
                let ease = elem.dataset.ease

                let startVars = {}
                let endVars = {}

                // animation values -- preset or data values
                let animationValues = presetExists ? this.presets[preset] : elem.dataset


                // override default preset values
                if(presetExists){
                    animationValues = _.merge({}, animationValues, elem.dataset)
                }

                // properties to be animated
                let propsString = preset || elem.dataset.props
                let props = propsString ? propsString.split(",") : []

                // go trough the props and set the animationObject
                _.each(props, (prop, index) => {
                    let aniObject = this.setAnimationObjects(animationValues, prop, visible)

                    // setting the values for the specific property
                    dur = aniObject.dur
                    ease = aniObject.ease || ease

                    // console.log("ANIOBJ!", aniObject, prop)

                    startVars[prop] = aniObject.from
                    endVars[prop] = aniObject.to
                })

                endVars.delay = delay


                // console.log("DELAY:", this.animationDelay, delay, endVars.delay)

                endVars.ease = ease || this.defaultEase
                endVars.overwrite = true
                
                startVars.transformOrigin = elem.dataset.origin || 'center center'

                // endVars.clearProps = "all"

                if(!animationValues.notDelayed){
                    endVars.delay += this.animationDelay
                }

                console.log("DELAY!!!!", endVars.delay, this.animationDelay)


                if(visible && !animationValues.keepProps){
                    endVars.clearProps = "transform,clipPath,transform-origin"
                }

                gsap.fromTo(elem, dur, startVars, endVars)
                
            })
        }
    }
}

export default animations;
