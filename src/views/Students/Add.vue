<template>
  <div class="form-create">
    <div class="row">
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
      <div class="col-md-6 col-sm-8 col-12">
        <div>
          <div class="fs-2">Add Student</div>
          <hr />
          <form class="was-validated">
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label"
                >Name<span class="text-danger">*</span></label
              >
              <div class="col-sm-9">
                <input
                  class="form-control"
                  v-model="student.name"
                  pattern="(([A-Za-z]{3,16})([ ]{0,1})){0,4}([A-Za-z]{3,16})"
                  required
                  placeholder="Name"
                />
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
                  v-model="student.email"
                  type="email"
                  pattern="[a-z0-9]+@[a-z]+\.[a-z]{2,3}"
                  required
                  placeholder="Email"
                />
              </div>
              <div class="col-3"></div>
              <div class="col-sm-9 text-start">
                <p v-if="!emailIsValid" class="Invalid">
                  {{ msgErrEmail }}
                </p>
              </div>
            </div>

            <div class="row mb-3">
              <label class="col-sm-3 col-form-label"
                >Password<span class="text-danger">*</span></label
              >
              <div class="col-sm-9">
                <input
                  class="form-control"
                  v-model="student.pass"
                  type="password"
                  required
                  pattern="[a-zA-Z0-9!@#$%^&*\\/)(+=._-]{8,}"
                  placeholder="Password"
                />
              </div>
              <div class="col-3"></div>
              <div class="col-sm-9 text-start">
                <p v-if="!passIsValid" class="Invalid">
                  {{ msgErrPass }}
                </p>
              </div>
            </div>

            <div class="row mb-3">
              <label class="col-sm-3 col-form-label"
                >Semester<span class="text-danger">*</span></label
              >
              <div class="col-sm-9">
                <select
                  class="form-select"
                  v-model="student.semester"
                  aria-label="Default select example"
                >
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
              <label class="col-sm-3 col-form-label"
                >Choose Courses<span class="text-danger">*</span></label
              >
              <div class="col-sm-9">
                <multiselect
                  v-model="student.checkedCourses"
                  :multiple="true"
                  placeholder="Choose Courses"
                  :close-on-select="false"
                  open-direction="bottom"
                  :options="courses.map((type) => type.id)"
                  :custom-label="(opt) => courses.find((x) => x.id == opt).name"
                >
                </multiselect>
              </div>
              <div class="col-3"></div>
              <div class="col-9">
                <span class="text-danger"></span>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-3"></div>
              <div class="col-9">
                <input
                  type="button"
                  id="signupbtn"
                  class="btn btn-success mx-1"
                  @click="submit()"
                  value="Add"
                />
                <input
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  class="btn btn-dark"
                  value="UploadCSV"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- Modal -->
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Update</h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form class="was-validated" enctype="multipart/form-data">
                <div class="mb-3">
                  <label for="formFile" class="form-label">Upload CSV</label>
                  <input
                    class="form-control"
                    type="file"
                    @change="uploadFile"
                    accept=".csv"
                    ref="file"
                    id="formFile"
                  />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                data-bs-dismiss="modal"
                @click="submitFile()"
                class="btn btn-primary"
              >
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
import Multiselect from "vue-multiselect";
import { CToaster, CToastBody, CToast, CToastClose } from "@coreui/vue";
export default {
  name: "Add",
  components: { Multiselect, CToaster, CToastBody, CToast, CToastClose },
  data: function () {
    return {
      student: {
        name: "",
        email: "",
        pass: "",
        semester: 1,
        checkedCourses: null,
      },
      courses: [],
      msgErrName: "",
      msgErrEmail: "",
      msgErrPass: "",
      msgs: { msg: [], state: true },
      Images: null,
    };
  },
  computed: {
    nameIsValid() {
      var regex = /^(([A-Za-z]{3,16})([ ]{0,1})){0,4}([A-Za-z]{3,16})$/g;
      const re = new RegExp(regex);
      if (re.test(this.student.name)) return true;
      this.msgErrName = "Not Match";
      return false;
    },
    emailIsValid() {
      var regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/g;
      const re = new RegExp(regex);
      if (re.test(this.student.email)) return true;
      this.msgErrEmail = "Not Match";
      return false;
    },
    passIsValid() {
      var regex = /^[a-zA-Z0-9!@#$%^&*\\/)(+=._-]{8,}$/g;
      const re = new RegExp(regex);
      if (re.test(this.student.pass)) return true;
      this.msgErrPass = "Min 8";
      return false;
    },
  },
  beforeCreate() {
    const http = {
      url: "Course/DisplayCourse",
      data: {},
      method: "GET",
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
        if (res.data.state) {
          this.courses = res.data.data;
        }
      })
      .catch((error) => console.log(error));
  },
  methods: {
    submit() {
      if (!(this.nameIsValid && this.emailIsValid && this.passIsValid)) return;

      if (this.student.checkedCourses == null) this.student.checkedCourses = [];
      const http = {
        url: "Student/Add",
        data: {
          Name: this.student.name,
          Email: this.student.email,
          Password: this.student.pass,
          Semester: this.student.semester,
          CoursesID: this.student.checkedCourses,
        },
        method: "POST",
        header: {
          "content-type": "application/json"
        },
      };
      console.log(http);
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
        })
        .catch((error) => console.log(error));
      this.student = { semester: 1 };
    },
    uploadFile() {
      if (this.$refs.file.files[0] != null) {
        if (this.$refs.file.files[0].type == "text/csv") {
          this.Images = this.$refs.file.files[0];
        } else {
          this.Images = null;
        }
      }
    },
    submitFile() {
      if (this.Images != null) {
        const formData = new FormData();
        formData.append("readexcel", this.Images);
        const headers = { "Content-Type": "multipart/form-data" };
        axios.post("Student/AddCSV", formData, { headers }).then((res) => {
          if (res.data) {
            this.msgs.state = res.data.state;
            this.msgs.msg.push({
              msg: "Upload and Add " + res.data.msg + " records",
            });
          }
        });
        this.Images = null;
      } else {
        this.msgs.state = false;
        this.msgs.msg.push({ msg: "Not Valid File" });
      }
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
}
</style>
