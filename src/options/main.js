import Vue from "vue"
import App from "./App.vue"
import Vuetify from "vuetify/lib"
import "@/tailwind.css"

Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
})
