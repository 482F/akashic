<template>
  <span>
    <tag
      v-for="tag in history.tags"
      :key="tag"
      :tag="tag"
      :history="history"
      @click="(tag) => $emit('tag', tag)"
    />
  </span>
</template>

<script>
import Tag from "./tag.vue"

export default {
  name: "tags",
  components: {
    Tag,
  },
  props: {
    history: {
      type: Object,
      default: undefined,
    },
  },
}
</script>

<style lang="scss" scoped></style>
