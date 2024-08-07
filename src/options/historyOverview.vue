<template>
  <v-list-item
    :href="history.url"
    v-if="ready"
    @click.prevent="$emit('click', history)"
  >
    <v-list-item-icon>
      <v-img :src="history.faviconSrc" class="inline-block" />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title v-text="history.name || history.url" />
      <v-list-item-subtitle>
        <tags :history="history" @click="(tag) => $emit('tag', tag)" />
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-list-item-action-text v-text="accesseDate" />
      <star :history="history" />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { dateToText, faviconIntArrToImgSrc } from "@utls/miscs.js"
import { getValueById } from "@utls/storages.js"
import Tags from "./tags.vue"
import Star from "./star.vue"

export default {
  name: "history-overview",
  components: {
    Tags,
    Star,
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      history: undefined,
      ready: false,
    }
  },
  props: {
    rawHistory: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    accesseDate() {
      return this.rawHistory.date
        ? dateToText(new Date(this.rawHistory.date))
        : ""
    },
  },
  methods: {
    async init() {
      if (!this.rawHistory) {
        return
      }
      this.history = await getValueById("page", this.rawHistory.id)
      const domain = await getValueById("domain", this.history.domain)
      this.history.faviconSrc = faviconIntArrToImgSrc(domain.favicon)
      this.ready = true
    },
    middleClicked() {
      window.open(this.history.url)
    },
  },
  watch: {
    "rawHistory.id": function () {
      this.ready = false
      this.init()
    },
  },
}
</script>

<style lang="scss" scoped></style>
