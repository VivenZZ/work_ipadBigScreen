<template>
  <div id="app">
    <!-- <Header/> -->
    <!-- <Footer/> -->
    <transition :name="transitionName">
      <router-view v-if="isRouterAlive"/>
    </transition>
  </div>
</template>

<script>
import Header from './components/header'
import Footer from './components/footer'
export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      transitionName: null, // 防止初始化的时候 没有动画而报错
      isRouterAlive: true
    }
  },
  watch: {// 使用watch 监听$router的变化
    $route (to, from) {
      // 如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (to.meta.index > from.meta.index) {
        // 设置动画名称
        this.transitionName = 'fade'
      } else {
        this.transitionName = 'fade'
      }
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active{
    will-change: transform;
    transition: all 1s;
    position: absolute;
    width:100%;
    left:0;
}
.slide-right-enter {
    transform: translateX(-200%);
}
.slide-right-leave-active {
    transform: translateX(200%);
}
.slide-left-enter {
    transform: translateX(200%);
}
.slide-left-leave-active {
    transform: translateX(-200%);
}
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}
.fade-enter-active{
  transition: opacity 1s ease-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.atom-spinner{
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -60px;
  margin-top: -60px;
}
img[lazy="loading"]{
  width: 32px !important;
  height: 32px !important;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -16px;
  margin-top: -16px;
}
/* .swiper-lazy-preloader{
  width: 32px;
  height: 32px;
  background: url(../static/images/loading.gif) no-repeat;
} */
</style>
