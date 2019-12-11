<template>
  <div class="select">
    <ul>
      <li v-for="nav in navs" :key="nav.id">
        <router-link :to="nav.url">{{nav.title}}</router-link><br>
        <span>&nbsp;</span>
      </li>
    </ul>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Selected',
  data () {
    return {
      transitionName: null, // 防止初始化的时候 没有动画而报错
      navs: [
        // {
        //   'url': '/selected/all',
        //   'title': '全部方案',
        //   'getData': '/header.com/'
        // },
        {
          'url': '/selected/panorama',
          'title': '360全景方案',
          'getData': '/header.com/'
        },
        {
          'url': '/selected/sample',
          'title': '样板图片',
          'getData': '/header.com/'
        },
        {
          'url': '/selected/alone',
          'title': '精选单品',
          'getData': '/header.com/'
        }
      ]
    }
  },
  created () {
    this.sdk.bridge.saveTrace('choiceMain', 0)
  },
  mounted () {
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
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.select{
  width: 950/1024*100%;
  margin: 180/102.4rem auto 0;
  h1{
    font-size: 40/102.4rem;
    font-weight: bold;
    margin: 0 0 36/102.4rem 0;
  }
  ul{
    height: .976563rem;
    padding-top: 80/102.4rem;
    overflow: hidden;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    background-color: white;
    li{
      display: inline-block;
      text-align: center;
      margin:0 30/102.4rem;
      a{
        display: inline-block;
        font-size: 26/102.4rem;
        line-height: 26/102.4rem;
        color: #333;
        text-decoration: none;
        margin-bottom: 20/102.4rem;
      }
      span{
        display: inline-block;
        width: 63/102.4rem;
        height: 3/102.4rem;
      }
      .router-link-active~span{
        background-color: #ED1C24;
      }
    }
  }
}
</style>
