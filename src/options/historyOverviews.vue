<template>
  <v-list two-line class="overviews">
    <v-list-item-group v-model="activeItem">
      <history-overview
        v-for="(rawHistory, i) in rawHistories"
        :key="i"
        :rawHistory="rawHistory"
        @click="(history) => $emit('select', history)"
        @tag="(tag) => $emit('tag', tag)"
      />
    </v-list-item-group>
  </v-list>
</template>

<script>
import HistoryOverview from "./historyOverview.vue"

export default {
  name: "history-overviews",
  components: {
    HistoryOverview,
  },
  data() {
    return {
      activeItem: undefined,
    }
  },
  props: {
    rawHistories: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss" scoped></style>
