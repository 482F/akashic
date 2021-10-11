<template>
  <v-app>
    <v-container class="root">
      <v-row>
        <v-text-field filled class="search" v-model="searchPattern">
          <template v-slot:append>
            <v-progress-circular
              v-if="!rawHistories.finished"
              indeterminate
            ></v-progress-circular>
          </template>
        </v-text-field>
      </v-row>
      <v-row>
        <div class="tools">
          <v-switch
            v-model="uniqueFlag"
            label="重複を表示しない"
            dense
            class="inline-block mr-2"
          />
          <v-switch
            v-model="filterStar"
            @change="switchFilterStar"
            label="スターのみ表示"
            dense
            class="inline-block mr-2"
          />
        </div>
      </v-row>
      <v-row>
        <v-col cols="6" class="scrollable">
          <history-overviews
            :rawHistories="
              rawHistories.value.slice(
                (page - 1) * historyPerPage,
                page * historyPerPage
              )
            "
            @select="(value) => (activeHistory = value)"
            @tag="searchTag"
          />
        </v-col>
        <v-col cols="6" class="scrollable">
          <history-detail :rawHistory="activeHistory" @tag="searchTag" />
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
import {
  assignAsyncGenerator,
  filterAsyncGenerator,
  uniqueAsyncGenerator,
  arrayToAsyncGenerator,
} from "@utls/asyncs.js"
import {
  getStorage,
  getListContentsReverse,
  getValueById,
} from "@utls/storages.js"
import HistoryOverviews from "./historyOverviews.vue"
import HistoryDetail from "./historyDetail.vue"

const historyPerPage = 100
let filterStar = false

async function searchHistories(searchPattern) {
  const reservedPatterns = {
    tag: (history, value) => Object.keys(history.tags).includes(value),
  }
  const searchers = searchPattern.split(" ").map((pattern) => {
    let searcher = (history) =>
      (history.name || history.url).match(new RegExp(pattern, "i"))
    for (const key of Object.keys(reservedPatterns)) {
      const match = pattern.match(new RegExp(key + ":(.+)"))
      if (match) {
        searcher = (history) => reservedPatterns[key](history, match[1])
        break
      }
    }
    return searcher
  })
  const asyncGenerator = filterStar
    ? arrayToAsyncGenerator(
        Object.keys((await getStorage("stars")) || {}).map((id) => ({ id }))
      )
    : getListContentsReverse("history")
  return filterAsyncGenerator(asyncGenerator, async function (rawHistory) {
    const history = await getValueById("page", rawHistory.id)
    return searchers.every((searcher) => searcher(history))
  })
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
        finished: false,
      },
      activeHistory: undefined,
      searchPattern: "",
      stopAssignFunc: () => undefined,
      uniqueFlag: false,
      filterStar,
    }
  },
  computed: {
    historyPerPage: () => historyPerPage,
  },
  methods: {
    async init(value = "") {
      this.stopAssignFunc()
      let asyncGenerator = await searchHistories(value)
      if (this.uniqueFlag) {
        asyncGenerator = uniqueAsyncGenerator(
          asyncGenerator,
          (alreadyValue, newValue) => alreadyValue.id === newValue.id
        )
      }
      this.stopAssignFunc = assignAsyncGenerator(
        asyncGenerator,
        this.rawHistories,
        "value"
      )
    },
    searchTag(tag) {
      this.searchPattern = "tag:" + tag
    },
    switchFilterStar(value) {
      filterStar = value
    },
  },
  watch: {
    searchPattern(value) {
      this.init(value)
    },
    uniqueFlag() {
      this.init(this.searchPattern)
    },
    filterStar() {
      this.init(this.searchPattern)
    },
  },
}
</script>

<style lang="scss" scoped>
.search {
  height: 5vh;
}
.tools {
  height: 5vh;
  @apply mx-2;
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
.scrollable {
  height: 75vh;
  @apply overflow-auto;
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 100px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #a8a8a8;
    border-radius: 100px;
  }
}
</style>
