var Slider = {

    data: () => ({
        currentIndex: 0,
        pageSlider: false
    }),
  
    props: [
    ],

    watch: {
    },

    computed: {
        prevItem()  {
            return this.items[this.getPreviousIndex()] 
        },
        nextItem() {
            return this.items[this.getNextIndex()] 
        },
        prevItemLooped()  {
            return this.items[this.getPreviousIndex(true)] 
        },
        nextItemLooped() {
            return this.items[this.getNextIndex(true)] 
        },

        numOfSlides()  {
            return this.items.length
        },

        isLastSlide() {
            return this.normalizedIndex == this.numOfSlides - 1
        },

        isFirstSlide() {
            return this.normalizedIndex == 0
        },

        activeItem() {

            if(this.confirmedIndex){
                return this.items[this.confirmedIndex || 0]
            }

            if(this.pageSlider){
                return this.model
            }

            return this.items[this.normalizedIndex]
        },

        normalizedIndex(){
            return this.realIndex < this.numOfSlides ? this.realIndex 
                : this.realIndex % this.numOfSlides
        },
        
        realIndex(){
            if(!this.stepSlider){
                return this.currentIndex
            }

            return this.confirmedIndex
        }

    },

    beforeDestroy() {},

    methods: {
        goToSlide(slide) {
            this.currentIndex = slide
        },

        nextSlide(loop) {
            this.currentIndex = this.getNextIndex(loop)
        },

        prevSlide(loop) {
            this.currentIndex = this.getPreviousIndex(loop)
        },

        getPreviousIndex(loop){
            let index = this.normalizedIndex > 0 ? this.normalizedIndex - 1 
                : loop ? this.numOfSlides - 1
                : 0

            return index
        },

        getNextIndex(loop){
            let index = this.normalizedIndex < this.numOfSlides - 1 ? this.normalizedIndex + 1 
                : loop ? 0 
                : this.numOfSlides - 1

            return index
        }

    }

}


export default Slider;
