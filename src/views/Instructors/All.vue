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
      <div class="fs-2">All Instructors</div>
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
          <tr :key="inst.email" v-for="inst in filteredList">
            <td>{{ inst.name }}</td>
            <td>{{ inst.email }}</td>
            <th>
              <button
                @click="Edit(inst.email, inst.name, inst.password)"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                class="btn btn-primary mx-1">
                Edit
              </button>
              <button @click="Delete(inst.email)" class="btn btn-danger">
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
              <form class="was-validated" @submit="Update()">
                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label"
                    >Name<span class="text-danger">*</span></label
                  >
                  <div class="col-sm-9">
                    <input
                      class="form-control"
                      v-model="inst.name"
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
                      class="form-control"
                      v-model="inst.email"
                      type="email"
                      disabled
                      placeholder="Email" />
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
                      v-model="inst.pass"
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
      .get("Instructor/Display")
      .then((res) => {
        if (res.data.state) {
          this.insts = res.data.data;
        }
      })
      .catch((error) => console.log(error));
  },
  data: function () {
    return {
      search: "",
      insts: [],
      inst: {
        email: "",
        name: "",
        pass: "",
      },
      msgs: { msg: [], state: true },
    };
  },
  computed: {
    filteredList() {
      return this.insts.filter((inst) => {
        return inst.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
    nameIsValid() {
      var regex = /^(([A-Za-z]{3,16})([ ]{0,1})){0,4}([A-Za-z]{3,16})$/g;
      const re = new RegExp(regex);
      if (re.test(this.inst.name)) return true;
      this.msgErrName = "Not Match";
      return false;
    },
    passIsValid() {
      var regex = /^[a-zA-Z0-9!@#$%^&*\\/)(+=._-]{8,}$/g;
      const re = new RegExp(regex);
      if (re.test(this.inst.pass)) return true;
      this.msgErrPass = "Min 8";
      return false;
    },
  },
  methods: {
    Delete(email) {
      const http = {
        url: "Instructor/Delete",
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
            this.insts = res.data.data;
          }
        })
        .catch((error) => console.log(error));
    },
    Edit(email, name, pass) {
      this.inst.email = email;
      this.inst.name = name;
      this.inst.pass = pass;
    },
    Update() {
      if (!(this.nameIsValid && this.passIsValid)) {
        this.msgs.state = false;
        this.msgs.msg.push({msg:"Invalid Operation"});
        return;
      }
      const http = {
        url: "Instructor/AdminEdit",
        data: {
          Name: this.inst.name,
          Email: this.inst.email,
          Password: this.inst.pass,
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

            if (res.data.state) {
              this.insts = res.data.data;
            }
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
