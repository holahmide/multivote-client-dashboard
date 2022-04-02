<template>
  <div>
    <div class="text-h5">Your Voting Sessions</div>
    <div v-if="!loading" class="row q-gutter-lg">
      <div
        rounded
        outline
        class="col-sm-6 col-md-4 session-div"
        style="max-width: 220px"
        v-for="(session, index) in result.sessions"
        :key="index"
      >
        <router-link :to="{ name: 'session', params: { slug: session.slug } }" style="text-decoration: none; color: inherit">
          <div>
            <q-img
              :src="session.logo ? session.logo : '@/assets/multivote.png'"
              style="width: 100%"
              alt="banner"
            />
          </div>
          <hr />
          <div class="q-pa-sm text-body2">
            <div class="">
              Title: <em class="text-primary">{{ session.title }}</em>
            </div>
            <div class="">Created: {{ $moment(session.createdAt) }}</div>
            <div class="">Status: {{ session.isActive }}</div>
          </div>
        </router-link>
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
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
export default {
  setup() {
    // graphql
    const { result, loading } = useQuery(gql`
      query getSessions {
        sessions {
          title
          slug
          logo
          createdAt
          isActive
        }
      }
    `);

    return {
      result,
      loading,
    };
  },
};
</script>

<style lang="scss" scoped>
.session-div {
  border: solid 1px $primary;
  border-radius: 8px;
}
</style>
