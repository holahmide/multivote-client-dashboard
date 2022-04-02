<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { useQuasar } from "quasar";
export default {
  name: "App",
  setup() {
    const authStore = useAuthStore();
    const $q = useQuasar();
    const router = useRouter();

    onBeforeMount(() => {
      if (localStorage.getItem("user")) {
        authStore
          .getUser()
          .then(() => {})
          .catch((error) => {
            if (error.status == 500) {
              $q.notify({
                message: "Your session has expired! please login again",
                type: "negative",
              });
              router.push("/login");
            } else if (error && error.data) $q.notify(error.data.message);
          });
      }
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
router-link a{
    text-decoration: none !important;
}
</style>
