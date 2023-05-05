<template>
  <div class="root">
    <!-- <div class="heade" v-if="$store.state.adminlogin">
      <img class="log-root mx-2" src="@/assets/logo.png" />
      <div class="logout">
        <button class="btn btn-danger" @click="logout()">logout</button>
      </div>
    </div> -->
    <span v-if="$store.state.adminlogin" class="bt" @click="toggle()">
      <fa class="fs-4" icon="bars"></fa>
    </span>
    <div class="main">
      <div class="side" v-if="$store.state.adminlogin">
        <Slidebar class="sidebar" id="sidebar" />
      </div>
      <div class="contain">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Slidebar from "@/components/Slidebar.vue";
import axios from "axios";
export default {
  name: "App",
  components: {
    Slidebar,
  },
  beforeCreate() {
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("token");
    if (localStorage.getItem("token")) {
      axios.get("Admin/Profile").then((res) => {
        if (res.data.state) this.$store.dispatch("admin", res.data.data);
      });
    }
  },
  created() {
    if (!this.$store.state.adminlogin) {
      document.body.classList.add("imglogin");
    } else {
      document.body.classList.add("imghome");
    }
  },
  data: function () {
    return {
      togglesidebar: true,
    };
  },
  methods: {
    // logout() {
    //   this.$store.commit("logout");
    //   this.$store.dispatch("admin", null);
    //   this.$router.push("/login");
    // },
    toggle() {
      let s = document.getElementById("sidebar");
      this.togglesidebar = !this.togglesidebar;
      if (this.togglesidebar) {
        s.style.visibility = "hidden";
      } else {
        s.style.visibility = "visible";
      }
    },
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lora&display=swap');
//@import url("https://fonts.googleapis.com/css2?family=Merienda&display=swap");

:root {
  --dark: #1a73e8;
  --dark-light: #68a1eb;
  --primary: #28a745;
  --light: #fff;
  --gray-light: whitesmoke;
  --gray: #fff;
  --sidebar-width: 250px;
  --font-family-page: 'Lora';
  --bs-link-hover-color: #fff !important;
}
.active {
  background-color: var(--light);
  color: var(--dark) !important;
  border-left: 5px solid #012350;
}

.imglogin {
  background-image: url("@/assets/bg.png");
  background-size: cover;
}
.imghome {
  background-color: #f5f5f5;
}

a:hover {
  background-color: var(--dark-light);
  color:var(--light) !important;
}
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
  font-family: var(--font-family-page);
}
body {
  background-color: var(--light);
}
.Invalid {
  color: red;
}

button,
.bt,
a {
  cursor: pointer;
  appearance: none;
  outline: none;
  border: none;
  color: none;
  background: none;
}
input[type=checkbox] {
    outline: none !important;
    box-shadow: none !important;
} 
.bt {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 100;
    padding: 10px;
    border: #1a73e8 1px solid;
    border-radius: 10px;
}

.root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .heade {
    background-color: var(--dark);
    display: flex;
    min-height: 3rem;
    max-height: 4rem;
    padding: 0.5rem;
    color: var(--light);
    .logout {
      flex: 1;
      text-align: end;
      align-self: center;
    }
  }

  .main {
    display: flex;
    height: 100vh;
    .contain {
      width: 100%;
      padding: 20px;
    }
  }
  .log-root {
    width: 90px;
  }

  .bt {
    align-self: center;
    transition: 0.5s ease-out;
    &:hover {
      transform: translateY(0.1rem);
      transition: 0.2s ease-out;
    }
  }
  @media (max-width: 768px) {
    .sidebar {
      visibility: hidden;
    }
    .contain {
      overflow: auto;
    }
  }
  @media (min-width: 769px) {
    .bt {
      visibility: hidden;
    }
    .sidebar {
      visibility: visible !important;
    }
    .contain {
      overflow-x: hidden;
    }
    .side {
      min-width: 250px;
    }
  }
}
</style>
