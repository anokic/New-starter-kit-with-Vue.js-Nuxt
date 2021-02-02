<template>
    <div class="image-div position-relative" 
    :style="{paddingBottom: paddingBottom}">

        <div class="img h-100 w-100 no-repeat position-absolute t-0 l-0"
            :class="classes"
            :style="{ backgroundImage: `url('${src}')` }">
        </div>

    </div>
</template>
<script>

export default {
    name: "image-div",

    data: () => ({
        naturalWidth: null,
        naturalHeight: null,
        ratio: 0
    }),

    props: [
        "src",

        "contain",

        "keepProportion",

        "proportion",

        "bgTop",

        "bgBottom"
    ],

    mixins: [],

    watch: {},

    created(){
        if(this.proportion){
            this.ratio = this.proportion
            return
        }
    },

    mounted() {
        let self = this;

        if(this.proportion){
            return
        }

        if (!this.keepProportion) {
            return;
        }

        var image = new Image();

        image.addEventListener(
            "load",
            () => {
                self.naturalHeight = image.naturalHeight;
                self.naturalWidth = image.naturalWidth;
                self.ratio = self.naturalHeight / self.naturalWidth;
            },
            false
        );

        image.src = this.image;
    },

    methods: {},

    computed: {
        classes() {
            return {
                'cover' : !this.contain,
                'contain' : this.contain,
                 'bg-top' : this.bgTop,
                 'bg-center' : !this.bgTop,
                 'bg-bottom' : this.bgBottom
             }
        },

        paddingBottom() {
            return this.ratio ? this.ratio * 100 + "%" : null
        }
    },

    components: {}
};

</script>

<style lang="scss" scoped="">
.image-div {
}
</style>
