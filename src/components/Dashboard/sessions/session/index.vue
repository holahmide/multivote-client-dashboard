<template>
  <div style="width: 100%">
    <div class="text-h6 q-mb-sm">Edit Voting Session</div>
    <hr />
    <div v-if="!loading">
      <q-form style="" @submit="createSession">
        <div class="row q-gutter-lg">
          <q-input
            class="col-xm-12 col-sm-10 col-md-4 col-lg-3"
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
          <q-input
            class="col-xm-12 col-sm-10 col-md-3 col-lg-3"
            filled
            stack-label
            type="datetime-local"
            v-model="form.startDate"
            label="Start Date"
            name="startDate"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'The start date field cannot be empty',
            ]"
          />
          <q-input
            stack-label
            class="col-xm-12 col-sm-10 col-md-3 col-lg-3"
            filled
            type="datetime-local"
            v-model="form.endDate"
            label="End Date"
            name="endDate"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'The end date field cannot be empty',
            ]"
          />
          <q-input
            class="col-xm-10 col-sm-10 col-md-10 col-lg-10"
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
          <q-file
            filled
            bottom-slots
            max-file-size="20480000"
            @rejected="onRejected"
            v-model="form.logo"
            label="Session Logo"
            counter
          >
            <template v-slot:prepend>
              <q-icon name="cloud_upload" @click.stop />
            </template>
            <template v-slot:append>
              <q-icon
                name="close"
                @click.stop="model = null"
                class="cursor-pointer"
              />
            </template>

            <template v-slot:hint> Upload a voting session logo </template>
          </q-file>
        </div>
        <div class="q-mt-md col-sm-10">
          <q-btn v-if="!loading" label="Update" type="submit" color="primary" />
          <q-spinner-tail v-else color="primary" size="2em" />
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

      <Categories @update-categories="updateCategories($event, argz)" :categories="categories" :session="session.id" :session_is_new="false"/>
      <hr />

      <Nominees :nominees="nominees" :sn="s_n" :categories="categories"/>
    </div>
    <div v-else>
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { useSessionStore } from "@/store/session/index";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import Nominees from './nominees';
import Categories from './categories';
export default {
  components: {
    Nominees,
    Categories
  },
  setup() {
    const router = useRouter();
    const { params } = useRoute();
    const $q = useQuasar();
    const sessionStore = useSessionStore();

    // Children variables
    const nominees = ref([]);
    const s_n = ref(1);
    const categories = ref([]);

    const { result, loading } = useQuery(
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
      form.value = {
        ...form.value,
        ...value,
      };
      form.value.startDate = new Date(form.value.startDate);
      form.value.startDate = form.value.startDate.toISOString().split("T")[0];
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

    const onRejected = () => {
      $q.notify({
        message:
          "File couldn't be uploaded please ensure it is not more than 10000kb",
        type: "negative",
      });
    };




    return {
      session,
      form,
      createSession,
      loading,
      onRejected,
      nominees,
      s_n,
      categories,
    };
  },
};
</script>
