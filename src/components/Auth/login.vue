<template>
  <div>
    <div
      class="row justify-center wrap content-center"
      style="man-width: 100vw; min-height: 100vh"
    >
      <div class="gt-xs col-md-6 col-xs-12 row justify-center">
        <img
          id="login-svg"
          src="@/assets/login.svg"
          alt="Login SVG"
          style=""
          class="inline"
        />
      </div>
      <div class="col-xs-12 col-md-6 row justify-center">
        <div class="q-pa-lg q-py-xs">
          <img
            src="@/assets/multivote.png"
            style="width: 200px; height: 40px"
            alt=""
          />
          <br />
          <div class="text-h6 text-grey-8">Sign In to vote and host polls</div>
          <q-form
            style="max-width: 500px"
            @submit="onSubmit"
            class="q-mt-md row"
          >
            <q-input
              class="col-xs-12 col-sm-12 col-md-12"
              filled
              type="email"
              v-model="email"
              label="Your Email"
              name="email"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'The email field cannot be empty',
              ]"
            />
            <br />
            <q-input
              class="col-xs-12 col-sm-12 col-md-12"
              filled
              :type="passwordVisibility ? 'text' : 'password'"
              v-model="password"
              label="Your Password"
              name="password"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'The password field is required',
                (val) =>
                  (val && val.length > 8) ||
                  'The password field should be minimum of 8 characters',
              ]"
            >
              <template v-slot:append>
                <div class="text-center">
                  <q-icon
                    @click="passwordVisibility = !passwordVisibility"
                    v-if="passwordVisibility"
                    name="visibility"
                    class="cursor-pointer"
                  >
                  </q-icon>
                  <q-icon
                    @click="passwordVisibility = !passwordVisibility"
                    v-else
                    name="visibility_off"
                    class="cursor-pointer"
                  >
                  </q-icon>
                  <q-item-label caption dense>Visibility</q-item-label>
                </div>
              </template></q-input
            >
            <div class="q-mt-md col-12">
              <q-btn
                label="Submit"
                color="primary"
                type="submit"
                :disabled="loading"
                :loading="loading"
                ><template v-slot:loading>
                  Submitting
                  <q-spinner-tail class="on-left" /> </template
              ></q-btn>
              <q-btn
                label="Reset"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
            <div>
              <div class="q-mt-md">
                You don't have an account yet?
                <router-link
                  to="/register"
                  class="text-primary"
                  style="text-decoration: none"
                  >Create One</router-link
                >
              </div>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const authStore = useAuthStore();

    const email = ref("olami02bj@gmail.com");
    const password = ref("Olamiposi2005");
    const passwordVisibility = ref(false);
    const loading = ref(false);

    const onSubmit = () => {
      loading.value = true
      authStore
        .login({ email: email.value, password: password.value })
        .then((response) => {
          if (response && response.status) {
            $q.notify({
              message: "You have successfully logged in!",
              type: "positive",
            });
            router.push("/dashboard/sessions");
          }
        })
        .catch((error) => {
          $q.notify({
            message: error.data.message,
            type: "negative",
          });
        }).finally(() => loading.value = false);
    };

    return {
      email,
      password,
      passwordVisibility,
      loading,
      onSubmit,
    };
  },
};
</script>

<style>
#login-svg {
  height: 350px;
  max-width: 500px;
}

@media only screen and (max-width: 1200px) {
  #login-svg {
    max-width: 400px;
  }
}
@media only screen and (max-width: 600px) {
  #login-svg {
    max-width: 200px;
  }
}
</style>
