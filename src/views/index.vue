<template>
  <div class="app-container container">
    <head-menu/>
    <div class="main-container">
      <transition 
        name="fade" 
        mode="out-in">
        <router-view/>
      </transition>
    </div>
  </div>
</template>
<style lang="scss">
.main-container {
  width: 100%;
  color: #000;
  padding-top: 40px;
  background-color: #f0f0f0;
}

</style>

<script>
//import headMenu from "../components/headMenu";
export default {
  components: {
    //headMenu
  },
  name: "Index",
  data() {
    return {};
  }
};
</script>