import { createApp } from "vue";
import Root from "./Root.vue";
import router from "./router";
import store from "./store";
import axios from "axios";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { library } from "@fortawesome/fontawesome-svg-core";
/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
/* import specific icons */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Promise } from "core-js";

/* add icons to the library */
library.add(fas);
let port = 7184;
axios.defaults.baseURL = "https://localhost:" + port + "/";

axios.interceptors.response.use(
  function (response) {
    if (response.status === 401) {
      store.commit("logout");
      router.push("/login");
    }
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      store.commit("logout");
      router.push("/login");
    }
    if (error.code === "ERR_NETWORK") {
      alert("The Server Is Not Connect");
      store.commit("logout");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

/* add font awesome icon component */

createApp(Root)
  .component("fa", FontAwesomeIcon)
  .use(store)
  .use(router)
  .mount("#app");
