<template>
  <v-list two-line class="overviews">
    <v-list-item-group v-model="activeItem">
      <history-overview
        v-for="(rawHistory, i) in rawHistories"
        :key="i"
        :rawHistory="rawHistory"
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
  watch: {
    activeItem(value) {
      this.$emit("select", this.rawHistories[value])
    },
  },
}
</script>

<style lang="scss" scoped>
.overviews {
  height: 80vh;
  @apply overflow-auto;
  scrollbar-width: thin;
  scrollbar-color: #6969dd #e0e0e0;
}

.overviews::-webkit-scrollbar {
  width: 10px;
}

.overviews::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 100px;
}

.overviews::-webkit-scrollbar-thumb {
  background-color: #a8a8a8;
  border-radius: 100px;
}
</style>
