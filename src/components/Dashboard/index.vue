<template>
  <q-layout view="lHh lpR fFf">
    <q-header reveal elevated class="bg-grey text-primary q-pl-md q-pr-md">
      <q-toolbar>
        <q-toolbar-title>
          <img
            src="@/assets/multivote.png"
            style="width: 150px;height: 30px"
          />
        </q-toolbar-title>
        <router-link
          style="text-decoration: none; color: inherit"
          :to="{ name: 'create-sessions' }"
          v-slot="{ isExactActive }"
        >
          <div
            :active="isExactActive"
            active-class="primary"
            clickable
            v-ripple
          >
            <q-btn
              :color="isExactActive ? 'primary' : 'white'"
              class="q-mr-sm"
              :text-color="isExactActive ? 'white' : 'primary'"
              label=""
              icon="add"
            >
              <q-tooltip> Create New Session </q-tooltip></q-btn
            >
          </div>
        </router-link>
        <router-link
          style="text-decoration: none; color: inherit"
          :to="{ name: 'sessions' }"
          v-slot="{ isActive }"
        >
          <div
            :active="isActive"
            active-class="text-warning"
            clickable
            v-ripple
          >
            <q-btn
              :color="isActive ? 'primary' : 'white'"
              class="q-mr-sm"
              :text-color="isActive ? 'white' : 'primary'"
              label=""
              icon="check"
            ><q-tooltip> View All sessions </q-tooltip></q-btn>
          </div>
        </router-link>
        <!-- <router-link
          style="text-decoration: none; color: inherit"
          :to="{ name: 'profile' }"
          v-slot="{ isExactActive }"
        >
          <div
            :active="isExactActive"
            active-class="text-warning"
            clickable
            v-ripple
          >
            <q-btn
              :color="isExactActive ? 'primary' : 'white'"
              class="q-mr-sm"
              :text-color="isExactActive ? 'white' : 'primary'"
              label=""
              icon="person"
            />
          </div>
        </router-link> -->
        <q-btn
          @click="logout"
          color="negative"
          class="q-mr-sm"
          text-color="white"
          label=""
          icon="logout"
        />
      </q-toolbar>
    </q-header>


    <q-page-container class="bg-grey" style="min-height: 100vh;">
      <div class="q-pa-md q-ml-lg q-mr-lg" >
        <router-view v-slot="{ Component }">
            <component :is="Component" />
        </router-view>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { useAuthStore } from "@/store/auth";
import gql from "graphql-tag";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    const authStore = useAuthStore();
    const $q = useQuasar();
    const router = useRouter();

    const logout = () => {
      authStore
        .logout()
        .then((response) => {
          if (response && response.status) {
            $q.notify({
              message: "You have successfully logged out!",
              type: "positive",
            });
            router.push("/login");
          }
        })
        .catch((error) => {
          $q.notify({
            message: error.data?.message,
            type: "negative",
          });
        });
    };

    // graphql
    const { result, loading } = useQuery(gql`
      query getUser {
        admin {
          id
          firstName
          lastName
          email
        }
      }
    `);

    watch(result, (value) => {
      if (value.admin && localStorage.getItem("user")) {
        authStore.user = value.admin;
      }
    });

    return {
      result,
      loading,
      logout,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
</script>
