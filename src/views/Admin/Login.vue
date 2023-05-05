<template>
  <div class="login p-3">
    <div class="row row-login">
      <!-- <div class="col-md-3 col-sm-2 col-1"></div> -->
      <div class="form-create col-12">
        <div class="">
          <CToaster placement="top-end">
            <CToast
              :color="msgs.state ? 'success' : 'danger'"
              :key="index"
              v-for="(msg, index) in msgs.msg"
            >
              <div class="d-flex">
                <CToastBody class="text-light">{{ msg.msg }}</CToastBody>
                <CToastClose class="me-2 m-auto" />
              </div>
            </CToast>
          </CToaster>
          <div class="container">
            <div class="left">
              <div class="logo">
                <img class="log" src="@/assets/logo.png" />
              </div>
            </div>
            <div class="right">
            <h1 class="text-center">Login</h1>
            <hr />
            <form class="was-validated">
              <div class="row mb-3">
                <label class="col-sm-3 col-form-label"
                  >Email<span class="text-danger">*</span></label
                >
                <div class="col-sm-9">
                  <input
                    class="form-control"
                    v-model="admin.email"
                    type="email"
                    pattern="[a-z0-9]+@[a-z]+\.[a-z]{2,3}"
                    required
                    placeholder="Email"
                  />
                </div>
                <div class="col-3"></div>
              </div>
              <div class="row mb-3">
                <label class="col-sm-3 col-form-label"
                  >Password<span class="text-danger">*</span></label
                >
                <div class="col-sm-9">
                  <input
                    class="form-control"
                    v-model="admin.pass"
                    type="password"
                    required
                    pattern="[a-zA-Z0-9!@#$%^&*\\/)(+=._-]{8,}"
                    placeholder="Password"
                  />
                </div>
                <div class="col-3"></div>
              </div>

              <div class="row mb-3">
                <div class="col-3"></div>
                <div class="col-9">
                  <input
                    type="button"
                    id="loginbtn"
                    class="btn btn-primary mx-1"
                    @click="submit()"
                    value="Login"
                  />
                  <input type="reset" class="btn btn-dark" value="Reset" />
                </div>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { CToaster, CToastBody, CToast, CToastClose } from "@coreui/vue";
export default {
  name: "Add",
  components: { CToaster, CToastBody, CToast, CToastClose },
  computed: {
    emailIsValid() {
      var regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/g;
      const re = new RegExp(regex);
      if (re.test(this.admin.email)) return true;
      return false;
    },
    passIsValid() {
      var regex = /^[a-zA-Z0-9!@#$%^&*\\/)(+=._-]{8,}$/g;
      const re = new RegExp(regex);
      if (re.test(this.admin.pass)) return true;
      return false;
    },
  },
  data: function () {
    return {
      admin: { email: "", pass: "" },
      msgs: { msg: [], state: true },
    };
  },

  methods: {
    submit() {
      if (!(this.emailIsValid && this.passIsValid)) {
        this.msgs.state = false;
        this.msgs.msg.push({ msg: "Email or password is invaild" });
        return;
      }
      const http = {
        url: "Admin/Login",
        data: {
          Email: this.admin.email,
          Password: this.admin.pass,
        },
        method: "POST",
        header: {},
      };
      axios
        .request({
          url: http.url,
          method: http.method,
          data: http.data,
          headers: http.header,
        })
        .then((res) => {
          if (res.data) {
            this.msgs.msg.push({ msg: res.data.msg });
            this.msgs.state = res.data.state;
          }
          if (res.data.state) {
            localStorage.setItem("token", res.data.token);
            this.$store.commit("login");
            this.$store.dispatch("admin", res.data.data);
            window.location = "/";
          }
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>
<style lang="scss">
.login {
  height: 100%;
  .row-login {
    height: 100%;
    .form-create {
      margin-top: auto;
      margin-bottom: auto;
      .container {
        display: flex;
        width: 70%;
        padding: 0px;
        .left {
          display: flex;
          background-color: white;
          width: 40%;
          justify-content: center;
          box-shadow: 1px 1px 5px 2px #888888;
          border-radius: 10px 0px 0px 10px;
          .logo {
            align-self: center;
            .log {
              width: 12rem;
            }
          }
        }
        #loginbtn {
          border: 2px solid #eee;
        }
        .right {
          width: 60%;
          background-color: #1a73e8;
          color: white;
          padding: 3rem 2rem 1rem 2rem;
          border-radius: 0px 10px 10px 0px;
          box-shadow: 1px 1px 5px 2px #888888;
        }
      }
    }
  }
}
@media (max-width: 850px) {
  .container {
    width: 100% !important;
  }
  .left {
    display: none !important;
  }
  .right {
    flex: 1;
    border-radius: 10px !important;
    padding: 1.5rem !important;
  }
}
</style>

