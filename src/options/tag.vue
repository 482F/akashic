<template>
  <v-chip
    v-if="existing"
    @click.prevent="$emit('click', tag)"
    @click:close="remove"
    small
    close
    class="mx-1"
    >{{ tag }}</v-chip
  >
</template>

<script>
import { updateValueByKey } from "@utls/storages.js"

export default {
  name: "tag",
  data() {
    return {
      existing: true,
    }
  },
  props: {
    tag: {
      type: String,
      require: true,
    },
    history: {
      type: Object,
      require: true,
    },
  },
  methods: {
    async remove() {
      const tags = this.history.tags
      tags.splice(tags.indexOf(this.tag), 1)
      await updateValueByKey("page", this.history.url, { tags })
      this.existing = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
