<template>
    <div class="proportion-div position-relative" :style="{paddingBottom: paddingBottom}">
        <div class='position-absolute w-100 h-100 t-0 l-0' :class='innerClasses'>
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: "proportion-div",

    props: [
        "proportion",
        "innerClasses"
    ],

    computed: {
        paddingBottom() {
            let r = this.proportion || 1
            return r * 100 + "%";
        }
    }
}
</script>
