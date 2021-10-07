<template>
  <div v-if="ready" class="my-3">
    <p class="text-h5">{{ history.name }}</p>
    <v-list disable>
      <v-list-item v-for="content in contents" :key="content.title" two-line>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            {{ content.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-body-1" v-html="content.body" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { getValueById } from "@utls/storages.js"
import { dateToText } from "@utls/miscs.js"

export default {
  name: "history-detail",
  mounted() {
    this.init()
  },
  data() {
    return {
      ready: false,
      contents: [],
    }
  },
  props: {
    rawHistory: {
      type: Object,
      default: undefined,
    },
  },
  methods: {
    async init() {
      if (!this.rawHistory) {
        return
      }
      this.history = await getValueById("page", this.rawHistory.id)
      const domain = await getValueById("domain", this.history.domain)
      this.history.domain = domain
      this.contents = [
        {
          title: "URL",
          body: `<a href="${this.history.url}">${this.history.url}</a>`,
        },
        {
          title: "last accessed",
          body: dateToText(new Date(this.rawHistory.date)),
        },
        {
          title: "access count",
          body: this.history.accessDates.length,
        },
      ]
      this.ready = true
    },
  },
  watch: {
    rawHistory() {
      this.ready = false
      this.init()
    },
  },
}
</script>

<style lang="scss" scoped></style>