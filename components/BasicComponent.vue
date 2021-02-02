<template>
  <div class="basic-comp">
    <h1>{{ model.fields.title }}</h1>
  </div>
</template>

<script>

export default {
  name: "basic-comp",

  data: () => ({}),

  props: ["model"],

  mixins: [],

  watch: {},

  mounted() {},

  methods: {},

  computed: {},

  components: {}
};
</script>

<style lang="scss" scoped="">
.basic-comp {
}
</style>