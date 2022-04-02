import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    /** @type {{ boolean }} */
    on_request: false,
    // type will be automatically inferred to number
  }),
  getters: {},
  actions: {},
});
