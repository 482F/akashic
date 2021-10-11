<template>
  <div v-if="ready" class="my-3">
    <p class="text-h5">{{ history.name || history.url }}</p>
    <star :history="history" />
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
    <v-text-field
      v-model="tagInput"
      @keydown.enter="registerTag"
      outlined
      label="input tag"
    />
    <tag
      v-for="tag in Object.keys(history.tags)"
      :key="tag"
      :tag="tag"
      :history="history"
      @click="(tag) => $emit('tag', tag)"
    />
  </div>
</template>

<script>
import { getValueById, updateValueById } from "@utls/storages.js"
import { dateToText } from "@utls/miscs.js"
import Tag from "./tag.vue"
import Star from "./star.vue"

function makeContents(history) {
  const contents = []
  contents.push({
    title: "URL",
    body: `<a href="${history.url}">${history.url}</a>`,
  })
  contents.push({
    title: "last accessed",
    body: dateToText(new Date(history.accessDates.slice(-1)[0])),
  })
  contents.push({
    title: "access count",
    body: history.accessDates.length,
  })
  return contents
}

export default {
  name: "history-detail",
  components: {
    Tag,
    Star,
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      ready: false,
      tagInput: "",
      contents: [],
      history: undefined,
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
      this.contents = makeContents(this.history)
      this.ready = true
    },
    async registerTag() {
      const newTag = this.tagInput
      this.tagInput = ""
      this.history.tags[newTag] = null
      await updateValueById("page", this.rawHistory.id, {
        tags: this.history.tags,
      })
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
