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
      return auth
        .register(payload)
        .then((response) => {
          return Promise.resolve(response.data);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },

    login(payload) {
      return auth
        .login(payload)
        .then((response) => {
          this.is_logged_in = true;
          this.user = response.data.user.id;
          localStorage.setItem("user", response.data.user.id);
          return Promise.resolve(response);
        })
        .catch((error) => {
          return Promise.reject(error.response);
        });
    },

    getUser() {
      return auth
        .getUser()
        .then((response) => {
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
          return Promise.reject(error.response);
        });
    },

    logout() {
      this.is_logged_in = false;
      this.user = null;
      localStorage.removeItem("user");
      return auth
        .logout()
        .then((response) => {
          return Promise.resolve(response.data);
        })
        .catch((error) => {
          return Promise.reject(error.response);
        });
    },

    update(payload) {
      return auth
        .update(payload)
        .then((response) => {
          return Promise.resolve(response);
        })
        .catch((error) => {
          return Promise.reject(error.response);
        });
    },

    changePassword(payload) {
      return auth
        .change_password(payload)
        .then((response) => {
          return Promise.resolve(response);
        })
        .catch((error) => {
          return Promise.reject(error.response);
        });
    },
  },
});
