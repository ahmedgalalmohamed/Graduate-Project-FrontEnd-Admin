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
        <div class="fs-2">Add Course</div>
        <hr />
        <form class="was-validated">
          <div class="row mb-3">
            <label class="col-sm-3 col-form-label"
              >Name<span class="text-danger">*</span></label
            >
            <div class="col-sm-9">
              <input
                class="form-control"
                v-model="course.name"
                pattern="(([a-zA-Z0-9!#&*\\/)(+._-]{1,16})([ ]{0,1})){0,4}([a-zA-Z0-9!#&*\\/)(+._-]{1,16})"
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
              >desciption<span class="text-danger">*</span></label
            >
            <div class="col-sm-9">
              <textarea
                class="form-control"
                v-model="course.desciption"
                required
                placeholder="Desciption"
              ></textarea>
            </div>
            <div class="col-3"></div>
          </div>

          <div class="row mb-3">
            <label class="col-sm-3 col-form-label"
              >Choose Instructor<span class="text-danger">*</span></label
            >
            <div class="col-sm-9">
              <select
                required
                class="form-select"
                v-model="course.instructor"
                data-mdb-filter="true"
              >
                <option
                  :value="instructor.id"
                  v-for="instructor in instructors"
                  :key="instructor.id"
                >
                  {{ instructor.name }}
                </option>
              </select>
            </div>
            <div class="col-3"></div>
            <div class="col-9">
              <span class="text-danger"></span>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-3"></div>

            <div class="form-check col-9">
              <input
                class="form-check-input"
                type="checkbox"
                
              
                id="isgraduate"
                :checked="course.isgraduate"
                v-model="course.isgraduate"
              />
              <label class="form-check-label text-black" >
                Is Graduate
              </label>
           
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-3"></div>
            <div class="col-9">
              <input
                type="button"
                id="signupbtn"
                class="btn btn-success mx-1"
                @click="AddCourses()"
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
import { CToaster, CToastBody, CToast, CToastClose } from "@coreui/vue";
export default {
  name: "AddCourse",
  components: { CToaster, CToastBody, CToast, CToastClose },
  data: function () {
    return {
      course: { name: "", desciption: "", instructor: 0, instructorname: "" ,isgraduate : false},
      instructors: [],
      msgErrName: "",
      Images: null,
      msgs: { msg: [], state: true },
    };
  },
  beforeCreate() {
    axios
      .get("Instructor/Display")
      .then((res) => {
        if (res.data.state) {
          this.instructors = res.data.data;
          this.course.instructor = this.instructors[0].id;
        }
      })
      .catch((error) => console.log());
  },
  computed: {
    nameIsValid() {
      var regex =
        /^(([a-zA-Z0-9!#&*\\/)(+._-]{1,16})([ ]{0,1})){0,4}([a-zA-Z0-9!#&*\\/)(+._-]{1,16})$/g;
      const re = new RegExp(regex);
      if (re.test(this.course.name)) return true;
      this.msgErrName = "Not Match";
      return false;
    },
  },
  methods: {
    AddCourses() {
      if (!(this.nameIsValid && this.instructors.length > 0)) {
        return;
      }
      const http = {
        url: "Course/Add",
        data: {
          Name: this.course.name,
          Desciption: this.course.desciption,
          InstructorID: this.course.instructor,
          InstructorName: this.course.instructorname,
          IsGraduate: this.course.isgraduate,
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
            this.course.name = "";
            this.course.desciption = "";
            this.course.isgraduate = false;
          }
          console.log(res.data);
        })
        .catch((error) => console.log(error));
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
        axios.post("Course/AddCSV", formData, { headers }).then((res) => {
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
<style lang="scss" scoped>
.form-check-input:checked{
  background-color: #1a73e8 !important;
  border-color:#1a73e8 !important;
}
.form-check-input.is-valid, .was-validated .form-check-input:valid {
  border-color: #1a73e8;
}
.form-create {
  position: relative;
  .alertcss {
    position: absolute;
  }
}
</style>
