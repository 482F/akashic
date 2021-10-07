import Vue from "vue"
import App from "./App.vue"
import Vuetify from "@/plugins/vuetify"
import "@/tailwind.css"

Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  el: "#app",
  vuetify: Vuetify,
  render: (h) => h(App),
})
