<template>
  <aside class="">
    <div class="scroll-side">
      <ul class="nav flex-column">
        <li class="">
          <router-link
            id="try"
            class="nav-link d-flex"
            to="/"
          >
            <img class="img icon" :src="require(`@/assets/${logo}`)" />
            <div class="d-flex flex-column">
              <span style="font-size: 18px">
                {{ $store.getters.admin.name }}
              </span>
              <span class="" style="font-size: 12px">
                {{ $store.getters.admin.email }}
              </span>
            </div>
          </router-link>
        </li>

        <hr />

        <li class="">
          <a class="nav-link" @click="togglest = !togglest">
            <fa class="icon" icon="graduation-cap" />
            <span class="">Students</span>
            <span class="float-end">
              <fa v-if="!togglest" icon="angle-left"></fa>
              <fa v-else icon="angle-down"></fa>
            </span>
          </a>

          <ul
            v-if="togglest"
            :class="{ shake: togglest }"
            class="nav flex-column"
          >
            <router-link class="nav-link sub-router" to="/student/all">
              <fa class="icon" icon="users" />
              <span class=""> All Students </span>
            </router-link>
            <router-link class="nav-link sub-router" to="/student/add">
              <fa class="icon" icon="plus" />
              <span class=""> Add Student </span>
            </router-link>
          </ul>
        </li>

        <li class="">
          <hr />
          <a class="nav-link" @click="togglein = !togglein">
            <fa class="icon" icon="person-chalkboard" />
            <span class="">Instructors</span>
            <span class="float-end">
              <fa v-if="!togglein" icon="angle-left"></fa>
              <fa v-else icon="angle-down"></fa>
            </span>
          </a>
          <i class="fa-solid fa-person-chalkboard"></i>
          <ul
            v-if="togglein"
            :class="{ shake: togglein }"
            class="nav flex-column"
          >
            <router-link class="nav-link sub-router" to="/instructor/all">
              <fa class="icon" icon="users" />
              <span class=""> All Instructor </span>
            </router-link>
            <router-link class="nav-link sub-router" to="/instructor/add">
              <fa class="icon" icon="plus" />
              <span class=""> Add Instructor</span>
            </router-link>
          </ul>
        </li>
        <hr />
        <li class="">
          <a class="nav-link" @click="toggledr = !toggledr">
            <fa class="icon" icon="user-tie" />

            <span class="">Professors</span>
            <span class="float-end">
              <fa v-if="!toggledr" icon="angle-left"></fa>
              <fa v-else icon="angle-down"></fa>
            </span>
          </a>
          <ul
            v-if="toggledr"
            :class="{ shake: toggledr }"
            class="nav flex-column"
          >
            <router-link class="nav-link sub-router" to="/doctor/all">
              <fa class="icon" icon="users" />
              <span class=""> All Professors</span>
            </router-link>
            <router-link class="nav-link sub-router" to="/doctor/add">
              <fa class="icon" icon="plus" />
              <span class=""> Add Professor</span>
            </router-link>
          </ul>
        </li>
        <hr />
        <li class="">
          <a class="nav-link" @click="togglecr = !togglecr">
            <fa class="icon" icon="graduation-cap" />
            <span class="">Courses</span>
            <span class="float-end">
              <fa v-if="!togglecr" icon="angle-left"></fa>
              <fa v-else icon="angle-down"></fa>
            </span>
          </a>
          <ul
            v-if="togglecr"
            :class="{ shake: togglecr }"
            class="nav flex-column"
          >
            <router-link class="nav-link sub-router" to="/course/all">
              <fa class="icon" icon="users" />
              <span class=""> All Courses </span>
            </router-link>
            <router-link class="nav-link sub-router" to="/course/add">
              <fa class="icon" icon="plus" />
              <span class=""> Add Courses </span>
            </router-link>
          </ul>
        </li>
        <hr />
        <li>
          <div class="logout nav flex-column">
            <button class="btn btn-primary mx-1" id="logoutbtn" @click="logout()">logout</button>
          </div>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
export default {
  name: "Slidebar",
  components: {},
  computed: {},
  data: function () {
    return {
      togglest: false,
      toggledr: false,
      togglein: false,
      togglecr: false,
      logo: "logo.png",
    };
  },
  methods: {
    logout() {
      this.$store.commit("logout");
      this.$store.dispatch("admin", null);
      window.location = "/login";
    },
    // logoChange() {
    //   if (document.getElementById("try").classList.contains("active"))
    //     this.logo = "logo.png";
    //   else this.logo = "logo2.png";
    // },
  },

};
</script>

<style lang="scss" scoped>
.shake {
  animation: shake 500ms ease-in-out;
}

@keyframes shake {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  80% {
    transform: scale(1.07);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
  from {
    transform: translate3d(0, 10px, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
hr {
  margin-top: 0px;
  margin-bottom: 0px;
}
.sub-router {
  padding-left: 2rem;
}
aside {
  background-color: var(--dark);
  color: var(--gray-light);
  .icon {
    font-size: 1.5rem;
    margin-right: 5px;
  }
  .scroll-side {
    position: sticky;
    top: 3rem;
    display: block;
    height: 100vh;
    //height: calc(100vh - 4rem);
    overflow-y: auto;
    overflow-x: hidden;
  }
  ul {
    li {
      .img {
        width: 60px;
        border-radius: 10px;
      }
      a {
        color: var(--gray);
      }
      .logout {
        margin: 15px;
      }
      #logoutbtn {
        border: 2px solid #eee;
      }
    }
  }
  @media (max-width: 768px) {
    position: fixed;
    z-index: 99;
  }
}
</style>
