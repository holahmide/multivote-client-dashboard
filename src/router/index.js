import { useAuthStore } from "@/store/auth";
import { createRouter, createWebHistory } from "vue-router";
import { Notify } from "quasar";

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
    // name: 'Dashboard',
    component: () => import("../components/Dashboard/index.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "dashboard_view",
        component: () => import("../components/Dashboard/dashboard.vue"),
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
        path: "settings",
        name: "settings",
        component: () => import("../components/Dashboard/index.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const showAuthMessage = (message, type) => {
  Notify.create({
    message,
    type
  });
};

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  let isAuthenticated = authStore.is_logged_in;
  if ((to.name == "Login" || to.name == "Register") && isAuthenticated)
    next({ name: "dashboard_view" });
  else if (to.meta.requiresAuth && !isAuthenticated) next({ name: "Login" });
  // Roles and permission
  else {
    if (
      to.matched.some((record) => record.meta.roles) &&
      to.matched.some((record) => record.meta.permissions)
    ) {
      let roles = to.matched[1].meta.roles;
      let permissions = to.matched[1].meta.permissions;
      if (
        authStore.checkRoles(roles) &&
        authStore.checkPermissions(permissions)
      ) {
        next();
      } else {
        showAuthMessage('Your Permission and roles not sufficient to access this route', 'error')
        next(false);
      }
    } else if (to.matched.some((record) => record.meta.roles)) {
      let roles = to.matched[1].meta.roles;
      if (authStore.checkRoles(roles)) {
        next();
      } else {
        showAuthMessage('Your Roles not complete to access this route', 'error')
        next(false);
      }
    } else if (to.matched.some((record) => record.meta.permissions)) {
      let permissions = to.matched[1].meta.permissions;
      if (authStore.checkPermissions(permissions)) {
        next();
      } else {
        showAuthMessage('Your Permissions not complete to access this route', 'error')
        next(false);
      }
    } else {
      next();
    }
  }
});

export default router;
