<template>
  <q-layout view="lHh lpR fFf">
    <q-header reveal elevated class="bg-white text-primary">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <img
            src="@/assets/multivote.png"
            style="width: 150px; height: 30px"
          />
        </q-toolbar-title>
        <q-icon
          name="notifications"
          color="primary"
          class="q-mr-md"
          size="2.2em"
        />
        <q-btn
          @click="logout"
          color="negative"
          class="q-mr-sm"
          text-color="white"
          label="Logout"
          icon="logout"
        />
        <!-- <q-btn
          @click="logout"
          color="negative"
          class="q-mr-sm lt-sm"
          text-color="white"
          label=""
          icon="logout"
        /> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      class="bg-primary"
      v-model="leftDrawerOpen"
      side="left"
    >
      <q-scroll-area
        style="
          height: calc(100% - 220px);
          margin-top: 220px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding class="text-white">
          <!-- <router-link
            style="text-decoration: none; color: inherit"
            :to="{ name: 'dashboard_view' }"
            v-slot="{ isExactActive }"
          >
            <q-item
              :active="isExactActive"
              active-class="text-warning"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>

              <q-item-section> Dashboard </q-item-section>
            </q-item>
          </router-link> -->

          <router-link
            style="text-decoration: none; color: inherit"
            :to="{ name: 'sessions' }"
            v-slot="{ isActive }"
          >
            <q-item
              :active="isActive"
              active-class="text-warning"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="check" />
              </q-item-section>

              <q-item-section> Voting Sessions </q-item-section>
            </q-item>
          </router-link>

          <router-link
            style="text-decoration: none; color: inherit"
            :to="{ name: 'create-sessions' }"
            v-slot="{ isExactActive }"
          >
            <q-item
              :active="isExactActive"
              active-class="text-warning"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="star" />
              </q-item-section>

              <q-item-section> Host Poll </q-item-section>
            </q-item>
          </router-link>

          <!-- <router-link
            style="text-decoration: none; color: inherit"
            :to="{ name: 'sessions' }"
            v-slot="{ isActive }"
          >
            <q-item
              :active="isActive"
              active-class="text-warning"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="history" />
              </q-item-section>

              <q-item-section> History </q-item-section>
            </q-item>
          </router-link> -->

          <router-link
            style="text-decoration: none; color: inherit"
            :to="{ name: 'profile' }"
            v-slot="{ isExactActive }"
          >
            <q-item
              :active="isExactActive"
              active-class="text-warning"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>

              <q-item-section> Profile </q-item-section>
            </q-item>
          </router-link>
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 220px"
      >
        <div class="absolute-bottom bg-transparent" v-if="!loading">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">
            {{ result.user.firstName }} {{ result.user.lastName }}
          </div>
          <div>@{{ result.user.email }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <div class="q-pa-md">
        <keep-alive>
          <router-view />
        </keep-alive>
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
            message: error.data.message,
            type: "negative",
          });
        });
    };

    // graphql
    const { result, loading } = useQuery(gql`
      query getUser {
        user {
          id
          firstName
          lastName
          email
        }
      }
    `);

    watch(result, (value) => {
      if (value.user && localStorage.getItem("user")) {
        authStore.user = value.user;
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
