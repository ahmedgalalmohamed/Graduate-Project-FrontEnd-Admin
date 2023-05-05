import { createRouter, createWebHistory } from "vue-router";
import auth from "../../auth/auth";
import axios from "axios";
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/student/add",
    name: "AddStudent",
    component: () => import("../views/Students/Add.vue"),
  },
  {
    path: "/student/all",
    name: "AllStudent",
    component: () => import("../views/Students/All.vue"),
  },

  {
    path: "/doctor/add",
    name: "AddDocotr",
    component: () => import("../views/Doctors/Add.vue"),
  },
  {
    path: "/doctor/all",
    name: "AllDocotr",
    component: () => import("../views/Doctors/All.vue"),
  },
  {
    path: "/instructor/add",
    name: "AddInstructor",
    component: () => import("../views/Instructors/Add.vue"),
  },
  {
    path: "/instructor/all",
    name: "AllInstructor",
    component: () => import("../views/Instructors/All.vue"),
  },
  {
    path: "/course/add",
    name: "AddCourse",
    component: () => import("../views/Courses/AddCourses.vue"),
  },
  {
    path: "/course/all",
    name: "AllCourse",
    component: () => import("../views/Courses/All.vue"),
  },
  {
    path: "/login",
    name: "AdminLogin",
    component: () => import("../views/Admin/Login.vue"),
    beforeEnter: (to, from, next) => {
      if (auth()) next("/home");
      else next();
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});
router.beforeEach((to, from, next) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("token");
  if (to.name !== "AdminLogin" && !auth()) next({ name: "AdminLogin" });
  else next();
});

export default router;
