<template>
  <div v-if="ready" class="detail">
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
    <tags :history="history" @click="(tag) => $emit('tag', tag)" />
    <v-textarea
      v-model="history.note"
      outlined
      label="note"
      @change="updateNote"
    />
  </div>
</template>

<script>
import { getValueById, updateValueByKey } from "@utls/storages.js"
import { dateToText } from "@utls/miscs.js"
import Tags from "./tags.vue"
import Star from "./star.vue"

function makeContents(history) {
  const contents = []
  contents.push({
    title: "URL",
    body: `<a href="${history.url}">${history.url}</a>`,
  })

  const firstAccessDate = history.accessDates[0]
  const lastAccessDate = history.accessDates.slice(-1)[0]

  contents.push({
    title: "first accessed",
    body: dateToText(new Date(firstAccessDate)),
  })
  contents.push({
    title: "last accessed",
    body: dateToText(new Date(lastAccessDate)),
  })
  contents.push({
    title: "access count",
    body: history.accessDates.length,
  })
  contents.push({
    title: "access count per day",
    body:
      (history.accessDates.length * 1000 * 60 * 60 * 24) /
      (lastAccessDate - firstAccessDate),
  })
  return contents
}

export default {
  name: "history-detail",
  components: {
    Tags,
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
    }
  },
  props: {
    history: {
      type: Object,
      default: undefined,
    },
  },
  methods: {
    async init() {
      if (!this.history) {
        return
      }
      this.history.note = this.history.note || ""
      const domain = await getValueById("domain", this.history.domain)
      this.history.domain = domain
      this.contents = makeContents(this.history)
      this.ready = true
    },
    async registerTag() {
      const newTag = this.tagInput
      this.tagInput = ""
      this.history.tags.push(newTag)
      await updateValueByKey("page", this.history.url, {
        tags: this.history.tags,
      })
    },
    async updateNote(value) {
      await updateValueByKey("page", this.history.url, { note: value })
    },
  },
  watch: {
    "history.url"() {
      this.ready = false
      this.init()
    },
  },
}
</script>

<style lang="scss" scoped></style>
