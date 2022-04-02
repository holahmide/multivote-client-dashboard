<template>
  <div>
    <div
      class="row justify-center wrap items-center q-gutter-xl"
      style="width: 100vw; height: 100vh"
    >
      <div class="">
        <img
          src="@/assets/login.svg"
          alt="Login SVG"
          style="max-width: 500px"
          class="gt-sm inline"
        />
      </div>
      <div class="">
        <img
          src="@/assets/multivote.png"
          style="width: 200px; height: 40px"
          alt=""
        /> <br>
        <div class="text-h6 text-grey-8">Sign In to vote and host polls</div>
        <q-form
          method="post"
          style="width: 450px"
          @submit="onSubmit"
          class="q-mt-md col-xs-12"
        >
          <q-input
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
          <div class="q-mt-md">
            <q-btn label="Submit" type="submit" color="primary" />
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
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";
// import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const authStore = useAuthStore();

    const email = ref("olami02bj@gmail.com");
    const password = ref("Olamiposi2005");
    const passwordVisibility = ref(false);
    // const { name } = storeToRefs(authStore);

    const onSubmit = () => {
      authStore
        .login({ email: email.value, password: password.value })
        .then((response) => {
          if (response && response.status) {
            $q.notify({
              message: "You have successfully logged in!",
              type: "positive",
            });
            router.push("/dashboard");
          }
        })
        .catch((error) => {
          $q.notify({
            message: error.data.message,
            type: "negative",
          });
        });
    };

    return {
      email,
      password,
      passwordVisibility,
      onSubmit,
    };
  },
};
</script>
