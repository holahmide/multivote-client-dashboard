import { createApp, provide, h } from "vue";
import App from "./App.vue";
import { Quasar, Notify, Loading } from "quasar";
import quasarUserOptions from "./quasar-user-options";
import router from "./router";
import { createPinia } from "pinia";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";
import moment from "./plugins/moment";

/* VUE APOLLO GRAHQL IMPLEMENTATION */
// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri:
    process.env.VUE_APP_BACKEND_GRAPHQL_URL || "http://127.0.0.1:3000/graphql",
  credentials: "include",
});
// Cache implementation
const cache = new InMemoryCache();
// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

/* App */
const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
});
app.use(router);
app.use(Quasar, {
  plugins: {
    Notify,
    Loading
  },
  config: {
    notify: {},
  },
});
app.use(quasarUserOptions);
app.use(createPinia());
app.use(moment);
app.mount("#app");
