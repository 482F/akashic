<template>
  <v-app>
    <v-container class="root">
      <v-row>
        <v-text-field filled class="search" v-model="searchPattern" />
      </v-row>
      <v-row>
        <v-col cols="6">
          <history-overviews
            :rawHistories="
              rawHistories.value.slice(
                (page - 1) * historyPerPage,
                page * historyPerPage
              )
            "
            @select="(value) => (activeHistory = value)"
          />
        </v-col>
        <v-col cols="6">
          <history-detail :rawHistory="activeHistory" />
        </v-col>
      </v-row>
      <v-row class="pagination">
        <v-pagination
          v-model="page"
          :length="Math.ceil(rawHistories.value.length / historyPerPage)"
          :total-visible="10"
        />
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { assignAsyncGenerator, filterAsyncGenerator } from "@utls/asyncs.js"
import { getListContentsReverse, getValueById } from "@utls/storages.js"
import HistoryOverviews from "./historyOverviews.vue"
import HistoryDetail from "./historyDetail.vue"

const historyPerPage = 100

function searchHistories(searchPattern) {
  const regex = new RegExp(searchPattern, "i")
  return filterAsyncGenerator(
    getListContentsReverse("history"),
    async function (rawHistory) {
      const history = await getValueById("page", rawHistory.id)
      return history.name.match(regex)
    }
  )
}

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
      page: 1,
      rawHistories: {
        value: [],
      },
      shownRawHistories: [],
      activeHistory: undefined,
      searchPattern: "",
      stopAssignFunc: () => undefined,
    }
  },
  computed: {
    historyPerPage: () => historyPerPage,
  },
  methods: {
    async init() {
      this.stopAssignFunc = assignAsyncGenerator(
        getListContentsReverse("history"),
        this.rawHistories,
        "value"
      )
    },
  },
  watch: {
    searchPattern(value) {
      this.stopAssignFunc()
      this.stopAssignFunc = assignAsyncGenerator(
        searchHistories(value),
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
