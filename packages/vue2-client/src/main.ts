// Config should be imported as early as possible
// in order to prevent any missing values.
// TODO: remove when config is reworked.
import "./config";
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import ClientPlugin from "./plugins/client";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

Vue.use(ClientPlugin, {
  router,
  store,
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

