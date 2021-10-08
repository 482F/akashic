<template>
  <v-app v-if="history">
    <div class="m-4">
      <history-detail :history="history" />
    </div>
  </v-app>
</template>

<script>
import { wait } from "@utls/asyncs.js"
import { getValueByKey } from "@utls/storages.js"
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
      history: null,
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
            await wait(async function () {
              that.history = await getValueByKey("page", url)
              return that.history
            })
          }
        }
      )
    },
  },
}
</script>

<style lang="scss" scoped></style>
