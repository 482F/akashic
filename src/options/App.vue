<template>
  <hello-world />
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue"

export default {
  name: "App",
  components: { HelloWorld },
}
</script>

<style src="@/tailwind.css">
html {
  width: 400px;
  height: 400px;
}
</style>
