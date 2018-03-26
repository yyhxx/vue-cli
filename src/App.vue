<template>
  <div id="touchealth">
    
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'touchealth'
}
</script>

<style lang="scss">
// 引入样式重置
@import './static/scss/config/_reset.scss';
//引入动画配置
@import './static/scss/config/_animate.scss';
//引入常用设置
@import './static/scss/config/_setting.scss';
</style>
