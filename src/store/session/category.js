import category from "@/services/category-service";
import { defineStore } from "pinia";

export const useCategoryStore = defineStore("category", {
  state: () => ({}),
  getters: {},
  actions: {
    create(payload) {
      // commit("SET_REQUEST_STATE", true);
      return category
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
        return category
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
      return category
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
