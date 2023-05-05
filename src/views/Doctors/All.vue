<template>
  <div class="form-create">
    <div class="row">
      <CToaster placement="top-end">
        <CToast :color="msgs.state ? 'success' : 'danger'" :key="index"  v-for="(msg,index) in msgs.msg ">
          <div class="d-flex">
            <CToastBody class="text-light">{{ msg.msg}}</CToastBody>
            <CToastClose class="me-2 m-auto"/>
          </div>
        </CToast>
      </CToaster>
      <div class="fs-2">All Proffessors</div>
      <div class="">
        <form class="d-flex py-1 justify-content-end my-1" role="search">
          <input
            class="form-control"
            type="search"
            v-model="search"
            placeholder="Search"
            aria-label="Search" />
        </form>
      </div>
      <table class="table table-striped">
        <thead class="table-dark screen">
          <tr>
            <th>Name</th>
            <th>E-mail</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="prof.email" v-for="prof in filteredList">
            <td>{{ prof.name }}</td>
            <td>{{ prof.email }}</td>
            <th>
              <button
                @click="Edit(prof.email, prof.name, prof.password)"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                class="btn btn-primary mx-1">
                Edit
              </button>
              <button @click="Delete(prof.email)" class="btn btn-danger">
                Delete
              </button>
            </th>
          </tr>
        </tbody>
      </table>

      <!-- Modal -->
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Update</h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form class="was-validated">
                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label"
                    >Name<span class="text-danger">*</span></label
                  >
                  <div class="col-sm-9">
                    <input
                      class="form-control"
                      v-model="prof.name"
                      pattern="(([A-Za-z]{3,16})([ ]{0,1})){0,4}([A-Za-z]{3,16})"
                      required
                      placeholder="Name" />
                  </div>
                  <div class="col-3"></div>

                  <div class="col-sm-9 text-start">
                    <p v-if="!nameIsValid" class="Invalid">
                      {{ msgErrName }}
                    </p>
                  </div>
                </div>

                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label"
                    >Email<span class="text-danger">*</span></label
                  >
                  <div class="col-sm-9">
                    <input
                      disabled
                      class="form-control"
                      v-model="prof.email"
                      required
                      pattern="[a-zA-Z0-9!@#$%^&*\\/)(+=._-]{8,}"
                      type="email"
                      placeholder="Email" />
                  </div>
                  <div class="col-3"></div>
                </div>

                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label"
                    >New Password<span class="text-danger">*</span></label
                  >
                  <div class="col-sm-9">
                    <input
                      class="form-control"
                      v-model="prof.pass"
                      type="password"
                      required
                      pattern="[a-zA-Z0-9!@#$%^&*\\/)(+=._-]{8,}"
                      placeholder="Password" />
                  </div>
                  <div class="col-3"></div>
                  <div class="col-sm-9 text-start">
                    <p v-if="!passIsValid" class="Invalid">
                      {{ msgErrPass }}
                    </p>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal">
                Close
              </button>
              <button
                type="button"
                data-bs-dismiss="modal"
                @click="Update()"
                class="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { CToaster, CToastBody,CToast,CToastClose } from "@coreui/vue";
export default {
  name: "All",
  components: { CToaster, CToastBody,CToast,CToastClose },
  beforeCreate() {
    axios
      .get("Proffessor/Display")
      .then((res) => {
        if (res.data.state) {
          this.profs = res.data.data;
        }
      })
      .catch((error) => console.log(error));
  },
  data: function () {
    return {
      search: "",
      profs: [],
      prof: {
        email: "",
        name: "",
        pass: "",
      },
      msgs: { msg: [], state: true },
    };
  },
  computed: {
    filteredList() {
      return this.profs.filter((prof) => {
        return prof.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
    nameIsValid() {
      var regex = /^(([A-Za-z]{3,16})([ ]{0,1})){0,4}([A-Za-z]{3,16})$/g;
      const re = new RegExp(regex);
      if (re.test(this.prof.name)) return true;
      this.msgErrName = "Not Match";
      return false;
    },
    passIsValid() {
      var regex = /^[a-zA-Z0-9!@#$%^&*\\/)(+=._-]{8,}$/g;
      const re = new RegExp(regex);
      if (re.test(this.prof.pass)) return true;
      this.msgErrPass = "Min 8";
      return false;
    },
  },
  methods: {
    Delete(email) {
      const http = {
        url: "Proffessor/Delete",
        method: "DELETE",
        data: {},
        header: {},
      };
      let data = new FormData();
      data.append("email", email);
      axios
        .request({
          url: http.url,
          method: http.method,
          data: data,
          headers: http.header,
        })
        .then((res) => {
          if (res.data) {
            this.msgs.msg.push({msg:res.data.msg});
            this.msgs.state = res.data.state;
          }
          if (res.data.state) {
            this.profs = res.data.data;
          }
        })
        .catch((error) => console.log(error));
    },
    Edit(email, name, pass) {
      this.prof.email = email;
      this.prof.name = name;
      this.prof.pass = pass;
    },
    Update() {
      if (!(this.nameIsValid && this.passIsValid)) {
        this.msgs.state = false;
        this.msgs.msg.push({msg:"Invalid Operation"});
        return;
      }
      const http = {
        url: "Proffessor/AdminEdit",
        data: {
          Name: this.prof.name,
          Email: this.prof.email,
          Password: this.prof.pass,
        },
        method: "PUT",
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
            this.msgs.msg.push({msg:res.data.msg});
            this.msgs.state = res.data.state;
          }
          if (res.data.state) {
            this.profs = res.data.data;
          }
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>
<style lang="scss" scoped>
.form-create {
  position: relative;
  .alertcss {
    position: absolute;
  }
  @media (max-width: 768px) {
    .screen {
      display: none;
    }
    tr {
      display: flex;
      flex-direction: column;
      box-shadow: 1px 1px 5px 2px #888888;
      margin-bottom: 5px;
    }
  }
}
</style>
