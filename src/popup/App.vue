<template>
  <v-app v-if="rawHistory">
    <div class="m-4">
      <history-detail :rawHistory="rawHistory" />
    </div>
  </v-app>
</template>

<script>
import { getStorage } from "@utls/storages.js"
import HistoryDetail from "@/options/historyDetail.vue"

export default {
  name: "App",
  components: {
    HistoryDetail,
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      rawHistory: null,
    }
  },
  methods: {
    async init() {
      const that = this
      chrome.tabs.query(
        { currentWindow: true, active: true },
        async function (tabs) {
          const url = tabs?.[0].url
          if (url) {
            that.rawHistory = {
              id: await getStorage("page", url),
              date: new Date().getTime(),
            }
          }
        }
      )
    },
  },
}
</script>

<style lang="scss" scoped></style>
