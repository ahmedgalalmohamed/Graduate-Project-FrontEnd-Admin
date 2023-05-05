<template>
  <div class="d-flex flex-column home">
    <h3 class="text-center">Welcome {{ $store.getters.admin.name }}</h3>
    <div class="d-flex">
      <img src="@/assets/flag.png" class="img-fluid" alt="Flag" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>
<style scoped lang="scss">
.home {
  height: 80%;
  margin-top: 6%;
  background-color: #5697ec;
  border-radius: 20px;

  h3 {
    margin: 10px;
    background-color: white;
    padding: 25px;
    border-radius: 20px;
  }

  div {
    flex: 1;
    justify-content: center;

    img {
      align-self: center;
      background-color: white;
      padding: 25px;
      border-radius: 20px;
    }
  }
}
</style>
