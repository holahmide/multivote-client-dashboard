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

    update(id, payload) {
      // commit("SET_REQUEST_STATE", true);
      return session
        .update(id, payload)
        .then((response) => {
          // commit("SET_REQUEST_STATE", false);
          return Promise.resolve(response.data);
        })
        .catch((error) => {
          // commit("SET_REQUEST_STATE", false);
          return Promise.reject(error);
        });
    },

  delete(id) {
    // commit("SET_REQUEST_STATE", true);
    return session
      .delete(id)
      .then((response) => {
        // commit("SET_REQUEST_STATE", false);
        return Promise.resolve(response.data);
      })
      .catch((error) => {
        // commit("SET_REQUEST_STATE", false);
        return Promise.reject(error);
      });
  },


  },
});
