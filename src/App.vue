<template>
  <div class="app" id="app">
    <input type="text" id="shareText"/>
    <div class="stm"></div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
  export default {
    name: 'App',
    components: {},
    data() {
      return {}
    }
  }
</script>
<style lang="scss"></style>
