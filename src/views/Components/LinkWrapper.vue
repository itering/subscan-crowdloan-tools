<template>
  <a class="link" :href="href">{{text}}</a>
</template>

<script>
export default {
  name: "link-wrapper",
  props: {
    href: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
  },
  mounted() {
  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
.link {
  color: var(--link-color);
}
</style>
