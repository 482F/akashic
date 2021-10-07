<template>
  <v-app>
    <v-container class="root">
      <v-row>
        <v-text-field filled class="search" />
      </v-row>
      <v-row>
        <v-col cols="6">
          <history-overviews
            :rawHistories="rawHistories.value"
            @select="(value) => (activeHistory = value)"
          />
        </v-col>
        <v-col cols="6">
          <history-detail :rawHistory="activeHistory" />
        </v-col>
      </v-row>
      <v-row class="pagination">
        <v-pagination :length="6" />
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { assignAsyncGenerator } from "@utls/asyncs.js"
import { getListContentsReverse } from "@utls/storages.js"
import HistoryOverviews from "./historyOverviews.vue"
import HistoryDetail from "./historyDetail.vue"

export default {
  name: "App",
  components: {
    HistoryOverviews,
    HistoryDetail,
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      rawHistories: {
        value: [],
      },
      activeHistory: undefined,
    }
  },
  methods: {
    async init() {
      assignAsyncGenerator(
        getListContentsReverse("history"),
        this.rawHistories,
        "value"
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.search {
  height: 5vh;
}
.root {
  @apply my-8;
  @apply border;
}
.pagination {
  height: 5vh;
  @apply border;
  @apply justify-center;
}
</style>
