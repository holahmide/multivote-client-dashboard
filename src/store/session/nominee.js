import nominee from "@/services/nominee-service";
import { defineStore } from "pinia";

export const useNomineeStore = defineStore("nominee", {
  state: () => ({}),
  getters: {},
  actions: {
    createMultiple(payload) {
      // commit("SET_REQUEST_STATE", true);
      return nominee
        .createMultiple(payload)
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
        return nominee
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
      return nominee
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
