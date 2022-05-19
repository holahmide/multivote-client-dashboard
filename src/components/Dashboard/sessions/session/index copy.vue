<template>
  <div style="width: 100%">
    <div class="text-h6 q-mb-sm">Edit Voting Session</div>
    <hr />
    <div v-if="!loading && !isFailed">
      <q-form style="" class="q-mt-md" @submit="createSession">
        <div class="row">
          <div class="col-12 col-sm-6 col-md-4 col-lg-4 q-px-md">
            <q-input
              filled
              type="text"
              v-model="form.title"
              label="Session Title"
              name="title"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'The title field cannot be empty',
              ]"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-4 col-lg-4 q-px-md">
            <q-input
              filled
              v-model="form.startDate"
              label="Start Date"
              name="startDate"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'The start date field cannot be empty',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="form.startDate" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="form.startDate"
                      mask="YYYY-MM-DD HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6 col-md-4 col-lg-4 q-px-md">
            <q-input
              filled
              v-model="form.endDate"
              label="End Date"
              name="endDate"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'The end date field cannot be empty',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="form.endDate" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="form.endDate"
                      mask="YYYY-MM-DD HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 q-px-md">
            <q-input
              filled
              type="textarea"
              v-model="form.description"
              label="Session Description"
              name="title"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'The title field cannot be empty',
              ]"
            />
          </div>

          <div v-if="form.logo_preview" class="col-12 q-pa-md">
            <q-img
              spinner-color="primary"
              spinner-size="50px"
              :src="form.logo_preview"
              alt=""
              width="250px"
              height="150px"
            />
          </div>
          <div class="col-xm-10 col-sm-10 col-md-12 col-lg-12 q-px-md">
            <q-file
              class="col-xm-10 col-sm-10 col-md-10 col-lg-10"
              filled
              clearable
              bottom-slots
              accept=".jpg, image/*"
              max-file-size="20480000"
              @rejected="onRejected"
              v-model="form.logo"
              label="Click to Update Session Logo"
              @update:model-value="onImageSelect()"
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>

              <template v-slot:hint> Upload a voting session logo </template>
            </q-file>
          </div>
        </div>
        <div class="row">
          <div class="q-mt-md col-sm-12 q-pa-md">
            <q-btn
             style="width:100%;"
              label="Update"
              color="primary"
              @click="updateSession()"
              :disabled="isUpdating"
              :loading="isUpdating"
              ><template v-slot:loading>
                <q-spinner-tail class="on-left" /> </template
            ></q-btn>
          </div>
        </div>
      </q-form>
      <hr />

      <Categories
        @update-categories="updateCategories($event, argz)"
        :categories="categories"
        :session="session ? session.id : null"
        :session_is_new="false"
      />
      <hr />

      <Nominees :nominees="nominees" :sn="s_n" :categories="categories" />
    </div>
    <div v-else-if="isFailed">
      <div class="align-item-center">
        {{ error.message }} for <b>{{ params.slug }} </b>
      </div>
    </div>
    <div v-else>
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </div>
  </div>
</template>

<script>
import { ref, watch, inject } from "vue";
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { useSessionStore } from "@/store/session/index";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import Nominees from "./nominees";
import Categories from "./categories";
export default {
  components: {
    Nominees,
    Categories,
  },

  setup() {
    const moment = inject("moment");
    const router = useRouter();
    const { params } = useRoute();
    const $q = useQuasar();
    const sessionStore = useSessionStore();
    const isUpdating = ref(false);
    const isFailed = ref(false);

    // Children variables
    const nominees = ref([]);
    const s_n = ref(1);
    const categories = ref([]);

    const { result, loading, error } = useQuery(
      gql`
        query getSession($slug: String) {
          sessionBySlug(slug: $slug) {
            id
            title
            startDate
            endDate
            logo
            description
            createdAt
            categories {
              id
              name
            }
            nominees {
              id
              name
              votes
              category {
                id
                name
              }
              picture
            }
          }
        }
      `,
      { slug: params.slug },
      { fetchPolicy: "cache-and-network" }
    );

    const session = useResult(result, null, (data) => data.sessionBySlug);

    watch(session, (value) => {
      if (!session) return;
      form.value = {
        ...form.value,
        ...value,
      };
      // format dates (startDate and endDate)
      form.value.startDate = moment(form.value.startDate, "YYYY-MM-DD HH:mm");
      form.value.endDate = moment(form.value.endDate, "YYYY-MM-DD HH:mm");
      form.value.logo_preview = form.value.logo;
      categories.value = JSON.parse(JSON.stringify(value.categories));
      value.nominees.map((nominee) => {
        nominees.value.push({
          category: nominee.category.id,
          ...nominee,
          s_n: s_n.value,
          is_new: false,
          picture_preview: nominee.picture,
        });
        s_n.value++;
      });
    });

    watch(error, (value) => {
      if (value) {
        isFailed.value = true;
        $q.notify({
          message: error.value.message,
          type: "negative",
        });
      }
    });

    const form = ref({
      newLogo: null,
    });

    const createSession = () => {
      var formData = new FormData();
      Object.keys(form.value).forEach((key) => {
        formData.append(key, form.value[key]);
      });
      formData.append("categories", JSON.stringify(categories.value));
      loading.value = true;
      sessionStore
        .create(formData)
        .then((response) => {
          if (response && response.status) {
            $q.notify({
              message: "You have successfully created a new session!",
              type: "positive",
            });
            router.push({ name: "sessions" });
            loading.value = false;
          }
        })
        .catch((error) => {
          loading.value = false;
          $q.notify({
            message: error.data.message,
            type: "negative",
          });
        });
    };

    const updateSession = () => {
      isUpdating.value = true;
      let sessionValue = Object.assign({}, form.value);
      console.log(form.value);
      var formData = new FormData();
      if (sessionValue.logo && typeof sessionValue.logo != "string") {
        formData.append(`logo`, sessionValue.logo);
      }
      delete sessionValue.logo; // Remove logo object from session object
      const neededKeys = ["title", "startDate", "endDate", "description"];
      neededKeys.forEach((key) => {
        formData.append(key, sessionValue[key]);
      });
      sessionStore
        .update(sessionValue.id, formData)
        .then(() => {
          $q.notify({
            message: "Successfully updated session!",
            type: "positive",
          });
          // session.value.logo = data.updatedSession.logo;
        })
        .catch(() => {
          $q.notify({
            message: "Couldn't update the nominee! Try again",
            type: "negative",
          });
        })
        .finally(() => {
          isUpdating.value = false;
        });
    };

    const onRejected = () => {
      $q.notify({
        message:
          "File couldn't be uploaded please ensure it is not more than 10000kb",
        type: "negative",
      });
    };

    const onImageSelect = () => {
      form.value.logo_preview = null; // clears preview when logo is cleared
      if (form.value.logo) {
        const image_url = URL.createObjectURL(form.value.logo);
        form.value.logo_preview = image_url;
      }
    };

    return {
      isFailed,
      error,
      params,
      session,
      form,
      createSession,
      updateSession,
      isUpdating,
      loading,
      onRejected,
      nominees,
      s_n,
      categories,
      onImageSelect,
    };
  },
};
</script>
