import Animations from '@/mixins/animations'

var WaypointTrigger = {

    mixins: [
        Animations
    ],

    methods: {
        toggleWaypoint(options) {
            let dir = options.visible

            let elemsToAnimate = options.el.querySelectorAll('.should-animate')

            this.runAnimation(elemsToAnimate, options.visible)

            this.visibleWaypoint = options.visible
        }
    }

}

export default WaypointTrigger;