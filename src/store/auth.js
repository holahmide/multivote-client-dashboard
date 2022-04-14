import auth from "@/services/auth-service";
import { defineStore } from "pinia";
import { useAppStore } from "./app";

const user = localStorage.getItem("user");

// interface State {
//   firstName: string
//   lastName: string
//   userId: number | null
// }

export const useAuthStore = defineStore("auth", {
  state: () => ({
    /** @type {{ text: string, id: number, isFinished: boolean }[]} */
    is_logged_in: user ? true : false,
    /** @type {'all' | 'finished' | 'unfinished'} */
    user: null,
    // type will be automatically inferred to number
  }),
  getters: {
    getUserDetails: (state) => state.user,
  },
  actions: {
    register(payload) {
      const appStore = useAppStore();

      appStore.on_request = true
      // commit("SET_REQUEST_STATE", true);
      return auth
        .register(payload)
        .then((response) => {
          // commit("SET_REQUEST_STATE", false);
          return Promise.resolve(response.data);
        })
        .catch((error) => {
          // commit("SET_REQUEST_STATE", false);
          return Promise.reject(error);
        });
    },

    login(payload) {
      // commit("SET_REQUEST_STATE", true);
      return auth
        .login(payload)
        .then((response) => {
          // commit("SET_REQUEST_STATE", false);
          // commit("SET_AUTH_STATE", true);
          this.is_logged_in = true;
          this.user = response.data.user.id;
          localStorage.setItem("user", response.data.user.id);
          return Promise.resolve(response);
        })
        .catch((error) => {
          // commit("SET_REQUEST_STATE", false);
          return Promise.reject(error.response);
        });
    },

    getUser() {
      // commit("SET_REQUEST_STATE", true);
      return auth
        .getUser()
        .then((response) => {
          // commit("SET_REQUEST_STATE", false);
          // commit("SET_AUTH_STATE", true);
          this.is_logged_in = true;
          this.user = response.data.user;
          localStorage.setItem("user", response.data.user);
          return Promise.resolve(response.data);
        })
        .catch((error) => {
          if (error.response.status == 500) {
            this.is_logged_in = false;
            this.user = null;
            localStorage.removeItem("user");
          }
          // commit("SET_REQUEST_STATE", false);
          return Promise.reject(error.response);
        });
    },

    logout() {
      // commit("SET_REQUEST_STATE", true);
      this.is_logged_in = false;
      this.user = null;
      localStorage.removeItem("user");
      return auth
        .logout()
        .then((response) => {
          // commit("SET_REQUEST_STATE", false);
          return Promise.resolve(response.data);
        })
        .catch((error) => {
          // commit("SET_REQUEST_STATE", false);
          return Promise.reject(error.response);
        });
    },

    update(payload) {
      // commit("SET_REQUEST_STATE", true);
      return auth
        .update(payload)
        .then((response) => {
          // commit("SET_REQUEST_STATE", false);
          return Promise.resolve(response);
        })
        .catch((error) => {
          // commit("SET_REQUEST_STATE", false);
          return Promise.reject(error.response);
        });
    },

    changePassword(payload) {
      // commit("SET_REQUEST_STATE", true);
      return auth
        .change_password(payload)
        .then((response) => {
          // commit("SET_REQUEST_STATE", false);
          return Promise.resolve(response);
        })
        .catch((error) => {
          // commit("SET_REQUEST_STATE", false);
          return Promise.reject(error.response);
        });
    },
  },
});
