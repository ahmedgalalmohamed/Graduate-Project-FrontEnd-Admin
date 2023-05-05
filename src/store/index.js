import { createStore } from "vuex";
import auth from "../../auth/auth";
export default createStore({
  state: {
    adminlogin: auth(),
    admin: "",
  },
  getters: {
    admin(state) {
      return state.admin;
    },
  },
  mutations: {
    admin(state, admin) {
      state.admin = admin;
    },
    login(state) {
      state.adminlogin = true;
    },
    logout(state) {
      state.adminlogin = false;
      localStorage.removeItem("token");
    },
  },
  actions: {
    admin(context, admin) {
      context.commit("admin", admin);
    },
  },
  modules: {},
});
