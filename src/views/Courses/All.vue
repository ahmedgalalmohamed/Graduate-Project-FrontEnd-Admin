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

      <div class="fs-2">All Courses</div>
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
            <th>Desciption</th>
            <th>Instructor</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="course.name" v-for="course in filteredList">
            <td>{{ course.name }}</td>
            <td>{{ course.desciption }}</td>
            <th>{{ course.instructorName }}</th>
            <th>
              <button
                @click="
                  Edit(course.name, course.desciption, course.instructorID)
                "
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                class="btn btn-primary mx-1">
                Edit
              </button>
              <button @click="Delete(course.name)" class="btn btn-danger">
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
                      v-model="course.name"
                      pattern="(([a-zA-Z0-9!#&*\\/)(+._-]{1,16})([ ]{0,1})){0,4}([a-zA-Z0-9!#&*\\/)(+._-]{1,16})"
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
                    >desciption<span class="text-danger">*</span></label
                  >
                  <div class="col-sm-9">
                    <textarea
                      class="form-control"
                      v-model="course.desciption"
                      required
                      placeholder="Desciption"></textarea>
                  </div>
                  <div class="col-3"></div>
                  <div class="col-9">
                    <span class="text-danger"></span>
                  </div>
                </div>

                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label"
                    >Choose Instructor<span class="text-danger">*</span></label
                  >
                  <div class="col-sm-9">
                    <select
                      class="form-select"
                      v-model="course.instructor"
                      data-mdb-filter="true">
                      <option
                        :value="instructor.id"
                        v-for="instructor in instructors"
                        :key="instructor.id">
                        {{ instructor.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-3"></div>
                  <div class="col-9">
                    <span class="text-danger"></span>
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
import { CToaster, CToastBody,CToast,CToastClose  } from "@coreui/vue";
export default {
  name: "All",
  components: { CToaster, CToastBody,CToast,CToastClose },
  data: function () {
    return {
      search: "",
      courses: [],
      course: {
        oldname: "",
        name: "",
        desciption: "",
        instructor: 0,
      },
      instructors: [],
      msgs: { msg: [], state: true },
    };
  },
  beforeCreate() {
    axios
      .get("Course/DisplayAll")
      .then((res) => {
        if (res.data.state) {
          this.courses = res.data.data;
        }
      })
      .catch((error) => console.log(error));
  },
  created() {
    axios
      .get("Instructor/Display")
      .then((res) => {
        if (res.data.state) {
          this.instructors = res.data.data;
        }
      })
      .catch((error) => console.log(error));
  },
  computed: {
    filteredList() {
      return this.courses.filter((course) => {
        return course.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
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
    Delete(name) {
      const http = {
        url: "Course/Delete",
        method: "POST",
        data: {},
        header: {},
      };
      let data = new FormData();
      data.append("name", name);
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
            this.courses = res.data.data;
          }
        })
        .catch((error) => console.log(error));
    },
    Edit(name, desciption, instructor) {
      this.course.oldname = name;
      this.course.name = name;
      this.course.desciption = desciption;
      this.course.instructor = instructor;
    },
    Update() {
      if (!this.nameIsValid) {
        this.msgs.state = false;
        this.msgs.msg.push({msg:"Invalid Operation"});
        return;
      }
      const http = {
        url: "Course/AdminEdit",
        data: {
          Name: this.course.oldname,
          NewName: this.course.name,
          Desciption: this.course.desciption,
          InstructorID: this.course.instructor,
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
              this.courses = res.data.data;
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
