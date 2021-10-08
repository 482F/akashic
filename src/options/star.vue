<template>
  <v-icon @click="switchStar">
    {{ "mdi-star" + (history.star ? "" : "-outline") }}
  </v-icon>
</template>

<script>
import { getStorage, setStorage, updateValueByKey } from "@utls/storages.js"

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
      const stars = (await getStorage("stars")) || {}
      const id = await getStorage("page", this.history.url)
      if (this.history.star) {
        stars[id] = null
      } else {
        delete stars[id]
      }
      await setStorage("stars", stars)
    },
  },
}
</script>

<style lang="scss" scoped></style>
