<template>
  <div>
    <div class="text-h4">Your Profile</div>

    <div>
      <div>
        <div class="text-h6 q-ml-sm text-grey">Basic Information</div>
      </div>
      <q-form style="" class="q-mt-md" @submit="update">
        <div class="row">
          <div class="col-12 col-sm-6 col-md-4 col-lg-4 q-px-md">
            <q-input
              filled
              type="text"
              v-model="form.firstName"
              label="First Name"
              name="firstName"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'The first name field cannot be empty',
              ]"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-4 col-lg-4 q-px-md">
            <q-input
              filled
              type="text"
              v-model="form.lastName"
              label="Last name"
              name="lastName"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'The last name field cannot be empty',
              ]"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-4 col-lg-4 q-px-md">
            <q-input
              filled
              type="email"
              v-model="form.email"
              label="Email"
              name="email"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'The email field cannot be empty',
              ]"
            />
          </div>
        </div>
        <div class="row justify-center">
          <q-btn
            label="Update"
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
      </q-form>
      <hr />
      <div>
        <div class="text-h6 q-ml-sm text-grey">Manage Password</div>
      </div>
      <q-form style="" class="q-mt-md" @submit="changePassword">
        <div class="row">
          <div class="col-12 col-sm-6 col-md-4 col-lg-4 q-px-md">
            <q-input
              filled
              :type="passwordVisibility ? 'text' : 'password'"
              v-model="password.oldPassword"
              label="Enter Old Password"
              name="oldPassword"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'The old password field is required',
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
          </div>
          <div class="col-12 col-sm-6 col-md-4 col-lg-4 q-px-md">
            <q-input
              filled
              :type="passwordVisibility ? 'text' : 'password'"
              v-model="password.newPassword"
              label="Enter New Password"
              name="newPassword"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'The new password field is required',
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
          </div>
          <div class="col-12 col-sm-6 col-md-4 col-lg-4 q-px-md">
            <q-input
              filled
              :type="passwordVisibility ? 'text' : 'password'"
              v-model="password.cNewPassword"
              label="Re-enter New Password"
              name="cNewPassword"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'The password confirmation field is required',
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
          </div>
        </div>
        <div class="row justify-center">
          <q-btn
            label="Change Password"
            color="primary"
            type="submit"
            :disabled="loading"
            :loading="loading"
            ><template v-slot:loading>
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
      </q-form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";
// import { toRefs } from "pinia";
import { useQuasar } from "quasar";
export default {
  setup() {
    const $q = useQuasar();
    const authStore = useAuthStore();
    const form = ref({});
    authStore.$subscribe((mutation, state) => {
      form.value = Object.assign({}, state.user);
    });
    const password = ref({
      oldPassword: null,
      newPassword: null,
      cNewPassword: null,
    });
    const passwordVisibility = ref(false);
    const loading = ref(false);

    const update = () => {
      loading.value = true;
      authStore
        .update(form.value)
        .then((response) => {
          if (response) {
            $q.notify({
              message: "You have successfully updated your details",
              type: "positive",
            });
            // authStore.user = Object.assign({}, form.value)
          }
        })
        .catch((error) => {
          const message =
            error && error.data ? error.data.message : error.message;
          $q.notify({
            message: message,
            type: "negative",
          });
        })
        .finally(() => (loading.value = false));
    };

    const changePassword = () => {
      if (password.value.newPassword !== password.value.cNewPassword) {
        return $q.notify({
          message: "The passord must be the same",
          type: "negative",
        });
      }
      loading.value = true;
      authStore
        .changePassword(password.value)
        .then((response) => {
          if (response) {
            $q.notify({
              message: "You have successfully changed your password",
              type: "positive",
            });
          }
        })
        .catch((error) => {
          const message =
            error && error.data ? error.data.message : error.message;
          $q.notify({
            message: message,
            type: "negative",
          });
        })
        .finally(() => (loading.value = false));
    };

    return {
      form,
      password,
      passwordVisibility,
      loading,
      update,
      changePassword,
    };
  },
};
</script>
