<template>
    <button class="hamburger" type="button" :class='{"is-active" : menuOpen || closeButton}'>
        <span class="hamburger-box">
            <span class="line line--1"></span>
            <!-- <span class="line line--2"></span> -->
            <span class="line line--3"></span>
        </span>
    </button>
</template>
<script>
export default {
    name: "hamburger",
    data: () => ({}),

    props: ["closeButton"],

    methods: {

    },

    computed: {
        menuOpen() {
            return this.$store.getters["app/getState"]("menuOpen");
        }
    }
};

</script>
<style lang="scss" scoped="">
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins";
@import "~/assets/css/variables.scss";

$line-h: 2px;

$h-width: 1.5rem;
$h-height: .3rem;

.hamburger {
    display: inline-block;
    font: inherit;
    color: inherit;
    text-transform: none;
    background-color: transparent;
    border: 0;
    margin: 0;
    // padding: 1rem 0;
    overflow: visible;
}

.hamburger:focus {
    outline: none;
}

// .hamburger.is-active:hover {
//     .hamburger-box {
//         transform: rotate(90deg) scale(1.1);
//     }
// }

// .hamburger:not(.is-active):hover .hamburger-box {
//     transform: scale(1.1);
// }

.hamburger-box {
    position: relative;
    width: $h-width * 1.3;
    height: .5rem;
    display: block;
    cursor: pointer;
    transition: transform .3s;

    @include media-breakpoint-up(xl) {
        width: $h-width;
        height: $h-height;
    }

    .line {
        position: absolute;
        left: 0;
        display: block;
        background-color: $white;
        width: 100%;
        height: $line-h;
        transition: .4s;
        transform-origin: center;

        &--1 {
            top: 0;
        }

        // &--2 {
        //     top: 50%;
        //     transform: translate3d(0, -50%, 0);
        // }

        &--3 {
            bottom: 0;
        }
    }
}

.is-active {
    .hamburger-box {
        transform: rotate(90deg);
    }

    .line--1 {
        width: 100%;
        transform: translate3d(0, -50%, 0) rotate(45deg);
        top: 50%;
        background-color: $white;
    }

    // .line--2 {
    //     transition: .2s;
    //     opacity: 0;
    //     background-color: $white;
    // }

    .line--3 {
        width: 100%;
        transform: translate3d(0, 50%, 0) rotate(-45deg);
        bottom: 50%;
        background-color: $white;
    }
}

</style>
