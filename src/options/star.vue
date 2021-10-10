<template>
  <v-icon @click="switchStar">
    {{ "mdi-star" + (history.star ? "" : "-outline") }}
  </v-icon>
</template>

<script>
import { updateValueByKey } from "@utls/storages.js"

export default {
  name: "star",
  props: {
    history: {
      type: Object,
      require: true,
    },
  },
  methods: {
    async switchStar() {
      this.history.star = !this.history.star
      await updateValueByKey("page", this.history.url, {
        star: this.history.star,
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
