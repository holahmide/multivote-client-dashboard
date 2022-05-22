import { useAuthStore } from "@/store/auth";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../components/Auth/login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../components/Auth/register.vue"),
  },
  {
    path: "/dashboard",
    component: () => import("../components/Dashboard/index.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "dashboard_view",
        redirect: '/dashboard/sessions',
        meta: { requiresAuth: true },
      },
      {
        path: "sessions",
        name: "sessions",
        component: () => import("../components/Dashboard/sessions/index.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "sessions/:slug",
        name: "session",
        component: () => import("../components/Dashboard/sessions/session/index.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "sessions/create",
        name: "create-sessions",
        component: () => import("../components/Dashboard/sessions/create.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "profile",
        name: "profile",
        component: () => import("../components/Dashboard/profile.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/:catchAll(.*)", // Unrecognized path automatically matches 404
    redirect: '/dashboard/sessions',
},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  let isAuthenticated = authStore.is_logged_in;
  if ((to.name == "Login" || to.name == "Register") && isAuthenticated)
    next({ name: "dashboard_view" });
  else if (to.meta.requiresAuth && !isAuthenticated) next({ name: "Login" });
  // Roles and permission
  else {
    next();
  }
});

export default router;
