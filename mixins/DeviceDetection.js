var DeviceDetection = {

    computed: {
        oldPhone()  {
            return this.$store.getters['app/getState']('oldPhone')
        },

        isIE()  {
            return this.$store.getters['app/getState']('isIE')
        },

        isEdge()  {
            return this.$store.getters['app/getState']('isEdge')
        }
    },

    methods: {
        detectIE()  {
            const ua = window.navigator.userAgent;

            let crappyIE = false;
            let msie = ua.indexOf('MSIE ');
            if (msie > 0) {// IE 10 or older => return version number        
                crappyIE = true;
            }
            let trident = ua.indexOf('Trident/');
            if (trident > 0) {// IE 11 => return version number        
                crappyIE = true;
            }

            let isEdge = false
            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                isEdge = true
            }

            this.$store.dispatch('app/SET_STATE', {
                isIE: crappyIE,
                isEdge: isEdge
            })

            return crappyIE;
        },

         detectOldPhones()  {

            let isIphone = () => {
                return !!navigator.userAgent.match(/iPhone/i)
            }

            // iPhone model checks.
            let getiPhoneModel = () => {

                // Create a canvas element which can be used to retrieve information about the GPU.
                var canvas = document.createElement('canvas')
                if (canvas) {
                    var context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
                    if (context) {
                        var info = context.getExtension('WEBGL_debug_renderer_info')
                        if (info) {
                            var renderer = context.getParameter(info.UNMASKED_RENDERER_WEBGL)
                        }
                    }
                }

                console.log("renderer", renderer)

                // iPhone X
                if ((window.screen.height / window.screen.width === 812 / 375) && (window.devicePixelRatio === 3)) {
                    return 'iPhone X'
                // iPhone 6+/6s+/7+ and 8+
                } else if ((window.screen.height / window.screen.width === 736 / 414) && (window.devicePixelRatio === 3)) {
                    switch (renderer) {
                        default:
                            return 'iPhone 6 Plus, 6s Plus, 7 Plus or 8 Plus'
                        case 'Apple A8 GPU':
                            return 'iPhone 6 Plus'
                        case 'Apple A9 GPU':
                            return 'iPhone 6s Plus'
                        case 'Apple A10 GPU':
                            return 'iPhone 7 Plus'
                        case 'Apple A11 GPU':
                            return 'iPhone 8 Plus'
                    }
                // iPhone 6+/6s+/7+ and 8+ in zoom mode
                } else if ((window.screen.height / window.screen.width === 667 / 375) && (window.devicePixelRatio === 3)) {
                    switch (renderer) {
                        default:
                            return 'iPhone 6 Plus, 6s Plus, 7 Plus or 8 Plus (display zoom)'
                        case 'Apple A8 GPU':
                            return 'iPhone 6 Plus (display zoom)'
                        case 'Apple A9 GPU':
                            return 'iPhone 6s Plus (display zoom)'
                        case 'Apple A10 GPU':
                            return 'iPhone 7 Plus (display zoom)'
                        case 'Apple A11 GPU':
                            return 'iPhone 8 Plus (display zoom)'
                    }
                // iPhone 6/6s/7 and 8
                } else if ((window.screen.height / window.screen.width === 667 / 375) && (window.devicePixelRatio === 2)) {
                    switch (renderer) {
                        default:
                            return 'iPhone 6, 6s, 7 or 8'
                        case 'Apple A8 GPU':
                            return 'iPhone 6'
                        case 'Apple A9 GPU':
                            return 'iPhone 6s'
                        case 'Apple A10 GPU':
                            return 'iPhone 7'
                        case 'Apple A11 GPU':
                            return 'iPhone 8'
                    }
                // iPhone 5/5C/5s/SE or 6/6s/7 and 8 in zoom mode
                } else if ((window.screen.height / window.screen.width === 1.775) && (window.devicePixelRatio === 2)) {
                    switch (renderer) {
                        default:
                            return 'iPhone 5, 5C, 5S, SE or 6, 6s, 7 and 8 (display zoom)'
                        case 'PowerVR SGX 543':
                            return 'iPhone 5 or 5c'
                        case 'Apple A7 GPU':
                            return 'iPhone 5s'
                        case 'Apple A8 GPU':
                            return 'iPhone 6 (display zoom)'
                        case 'Apple A9 GPU':
                            return 'iPhone SE or 6s (display zoom)'
                        case 'Apple A10 GPU':
                            return 'iPhone 7 (display zoom)'
                        case 'Apple A11 GPU':
                            return 'iPhone 8 (display zoom)'
                    }
                // iPhone 4/4s
                } else if ((window.screen.height / window.screen.width === 1.5) && (window.devicePixelRatio === 2)) {
                    switch (renderer) {
                        default:
                            return 'iPhone 4 or 4s'
                        case 'PowerVR SGX 535':
                            return 'iPhone 4'
                        case 'PowerVR SGX 543':
                            return 'iPhone 4s'
                    }
                // iPhone 1/3G/3GS
                } else if ((window.screen.height / window.screen.width === 1.5) && (window.devicePixelRatio === 1)) {
                    switch (renderer) {
                        default:
                            return 'iPhone 1, 3G or 3GS'
                        case 'ALP0298C05':
                            return 'iPhone 3GS'
                        case 'S5L8900':
                            return 'iPhone 1, 3G'
                    }
                } else {
                    return 'Not an iPhone'
                }

            }


            let old = [
                'iPhone 6', 
                'iPhone 6s', 
                'iPhone 5 or 5c', 
                'iPhone 5s', 
                'iPhone 6 (display zoom)', 
                'iPhone SE or 6s (display zoom)',
                'iPhone 5, 5C, 5S, SE or 6, 6s, 7 and 8 (display zoom)'
            ]

            let oldPhone = isIphone() && _.includes(old, getiPhoneModel())

            this.$store.dispatch('app/SET_STATE', {
                oldPhone
            })
        },
    }
}

export default DeviceDetection;
