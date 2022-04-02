import session from "@/services/session-service";
import { defineStore } from "pinia";

export const useSessionStore = defineStore("session", {
  state: () => ({}),
  getters: {},
  actions: {
    create(payload) {
      // commit("SET_REQUEST_STATE", true);
      return session
        .create(payload)
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
      return session
        .login(payload)
        .then((response) => {
          // commit("SET_REQUEST_STATE", false);
          // commit("SET_session_STATE", true);
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
      return session
        .getUser()
        .then((response) => {
          // commit("SET_REQUEST_STATE", false);
          // commit("SET_session_STATE", true);
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
      return session
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
  },
});
