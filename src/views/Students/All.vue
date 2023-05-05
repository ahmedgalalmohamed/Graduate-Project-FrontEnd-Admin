<template>
  <div class="form-create">
    <div class="row">
      <CToaster placement="top-end">
        <CToast :color="msgs.state ? 'success' : 'danger'" :key="index" v-for="(msg, index) in msgs.msg ">
          <div class="d-flex">
            <CToastBody class="text-light">{{ msg.msg }}</CToastBody>
            <CToastClose class="me-2 m-auto" />
          </div>
        </CToast>
      </CToaster>
      <div class="fs-2">All Students</div>
      <div class="">
        <form class="d-flex py-1 justify-content-end my-1" role="search">
          <input class="form-control" type="search" v-model="search" placeholder="Search" aria-label="Search" />
        </form>
      </div>
      <table class="table table-striped">
        <thead class="table-dark screen">
          <tr>
            <th>Name</th>
            <th>E-mail</th>
            <th>Semester</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="student.email" v-for="student in filteredList">
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
            <th>{{ student.semester }}</th>
            <th>
              <button @click="Edit(student)" data-bs-toggle="modal" data-bs-target="#exampleModal"
                class="btn btn-primary mx-1">
                Edit
              </button>
              <button @click="Delete(student.email)" class="btn btn-danger">
                Delete
              </button>
            </th>
          </tr>
        </tbody>
      </table>

      <!-- Modal -->
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Update</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form class="was-validated" @submit="Update()">
                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">Name<span class="text-danger">*</span></label>
                  <div class="col-sm-9">
                    <input class="form-control" v-model="name" pattern="(([A-Za-z]{3,16})([ ]{0,1})){0,4}([A-Za-z]{3,16})"
                      required placeholder="Name" />
                  </div>
                  <div class="col-3"></div>
                  <div class="col-sm-9 text-start">
                    <p v-if="!nameIsValid" class="Invalid">
                      {{ msgErrName }}
                    </p>
                  </div>
                </div>

                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">Email<span class="text-danger">*</span></label>
                  <div class="col-sm-9">
                    <input disabled class="form-control" v-model="student.email" type="email" placeholder="Email" />
                  </div>
                  <div class="col-3"></div>
                  <div class="col-9">
                    <span class="text-danger"></span>
                  </div>
                </div>

                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">Password<span class="text-danger">*</span></label>
                  <div class="col-sm-9">
                    <input class="form-control" v-model="student.password" type="password" required
                      pattern="[a-zA-Z0-9!@#$%^&*\\/)(+=._-]{8,}" placeholder="Password" />
                  </div>
                  <div class="col-3"></div>
                  <div class="col-sm-9 text-start">
                    <p v-if="!passIsValid" class="Invalid">
                      {{ msgErrPass }}
                    </p>
                  </div>
                </div>

                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">Semester<span class="text-danger">*</span></label>
                  <div class="col-sm-9">
                    <select class="form-select" v-model="semester" aria-label="Default select example">
                      <option selected>1</option>
                      <option v-for="index in 7" :key="index + 1">
                        {{ index + 1 }}
                      </option>
                    </select>
                  </div>
                  <div class="col-3"></div>
                  <div class="col-9">
                    <span class="text-danger"></span>
                  </div>
                </div>

                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">Choose Courses<span class="text-danger">*</span></label>
                  <div class="col-sm-9">
                    <multiselect v-model="student.coursesID" :multiple="true" placeholder="Choose Courses"
                      :close-on-select="false" open-direction="bottom" :options="courses.map((type) => type.id)"
                      :custom-label="
                        (opt) => courses.find((x) => x.id == opt).name
                      ">
                    </multiselect>
                  </div>
                  <div class="col-3"></div>
                  <div class="col-9">
                    <span class="text-danger"></span>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" data-bs-dismiss="modal" @click="Update()" class="btn btn-primary">
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
import Multiselect from "vue-multiselect";
import axios from "axios";
import { CToaster, CToastBody, CToast, CToastClose } from "@coreui/vue";
export default {
  name: "All",
  components: { CToaster, CToastBody, CToast, CToastClose, Multiselect },
  data: function () {
    return {
      search: "",
      students: [],
      name: "",
      semester: 1,
      student: {
        name: "",
        email: "",
        password: null,
        semester: 1,
        coursesID: null,
      },
      courses: [],
      msgs: { msg: [], state: true },
    };
  },
  beforeCreate() {
    axios
      .get("Student/Display")
      .then((res) => {
        console.log(res.data);
        if (res.data.state) {
          this.students = res.data.data;
        }
      })
      .catch((error) => console.log(error));
  },
  created() {
    axios
      .get("Course/Display")
      .then((res) => {
        if (res.data.state) {
          this.courses = res.data.data;
        }
      })
      .catch((error) => console.log(error));
  },
  computed: {
    filteredList() {
      return this.students.filter((student) => {
        return student.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
    nameIsValid() {
      var regex = /^(([A-Za-z]{3,16})([ ]{0,1})){0,4}([A-Za-z]{3,16})$/g;
      const re = new RegExp(regex);
      if (re.test(this.student.name)) return true;
      this.msgErrName = "Not Match";
      return false;
    },
    passIsValid() {
      var regex = /^[a-zA-Z0-9!@#$%^&*\\/)(+=._-]{8,}$/g;
      const re = new RegExp(regex);
      if (re.test(this.student.password)) return true;
      this.msgErrPass = "Min 8";
      return false;
    },
  },
  methods: {
    Delete(email) {
      const http = {
        url: "Student/Delete",
        method: "POST",
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
            this.msgs.msg.push({ msg: res.data.msg });
            this.msgs.state = res.data.state;
          }
          if (res.data.state) {
            this.students = res.data.data;
          }
        })
        .catch((error) => console.log(error));
    },
    Edit(std) {
      this.student = std;
      this.name = std.name;
      this.semester = std.semester;
    },
    Update() {
      if (!(this.nameIsValid && (this.passIsValid || this.student.password == null)) ) {
        this.msgs.state = false;
        this.msgs.msg.push({ msg: "Invalid Operation" });
        return;
      }
      let data = {
        Name: this.name,
        Email: this.student.email,
        Password: this.student.password==null? "":this.student.password,
        Semester: this.semester,
        CoursesID: this.student.coursesID,
      }
      console.log(data);
      axios.post("Student/AdminEdit", data)
        .then((res) => {
          if (res.data) {
            this.msgs.msg.push({ msg: res.data.msg });
            this.msgs.state = res.data.state;
            if (res.data.state) {
              this.students = res.data.data;
            }
          }
        })
    },
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
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
