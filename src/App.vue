<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  name: "App",
  mounted() {
    // const that = this
    // window.onresize = throttle(getTransform, 1000 / 60)
    window.addEventListener("resize", this.sidebarSwitch);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.sidebarSwitch);
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    sidebarSwitch() {
      let w = document.documentElement.clientWidth;
      let state = Cookies.get("sidebarStatus") || 1;
      if (w < 978 && state != 0) {
        this.toggleSideBar();
      } else if (w >= 978 && state == 0) {
        this.toggleSideBar();
      }
    },
  },
};
</script>
<style lang="scss">
* {
  font-family: "Noto Sans SC", sans-serif;
  // font-family: 'Sansita Swashed', cursive;
  // font-family: 'Ma Shan Zheng', cursive;
}
</style>
