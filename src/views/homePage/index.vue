<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.select{
  width:100%;
  margin: 0 auto;
  // height: ~'calc(100vh - 75px)';
  position:fixed;
  left:0;
  right:0;
  top:0;
  bottom:0;
  ul{
    overflow: hidden;
    margin-top: 50/102.4rem;
    margin-bottom:20/102.4rem;
    text-align: center;
    li{
      display: inline-block;
      text-align: center;
      position: relative;
      a{
        display: block;
        font-size: 26/102.4rem;
        line-height: 26/102.4rem;
        color: #333;
        text-decoration: none;
        padding:25/102.4rem 30/102.4rem;
      }
      span{
        display: block;
        width: 63/102.4rem;
        height: 3.5/102.4rem;
        line-height: 3.5/102.4rem;
        position: absolute;
        bottom: 3.5/102.4rem;
        transform: translateX(-50%);
        left: 50%;
      }
      .router-link-active~span{
        background-color: #ED1C24;
      }
    }
  }
}
</style>

<template>
  <div class="select">
    <ul>
      <li v-for="nav in navs" :key="nav.id">
        <router-link :to="nav.url">{{nav.title}}</router-link>
        <span>&nbsp;</span>
      </li>
    </ul>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      navs: [
        {
          'url': '/homePage/inspirationRoom',
          'title': '灵感居室',
          'getData': '/header.com/'
        },
        // {
        //   'url': '/homePage/brandVideo',
        //   'title': '品牌视频',
        //   'getData': '/header.com/'
        // },
        {
          'url': '/homePage/onlineMagazine',
          'title': '在线杂志',
          'getData': '/header.com/'
        },
        {
          'url': '/homePage/stores',
          'title': '全国门店',
          'getData': '/header.com/'
        }
      ]
    }
  },
  watch: {// 使用watch 监听$router的变化
    $route (to, from) {
      // 如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (to.meta.index > from.meta.index) {
        // 设置动画名称
        this.transitionName = 'slide-left'
      } else {
        this.transitionName = 'slide-right'
      }
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
