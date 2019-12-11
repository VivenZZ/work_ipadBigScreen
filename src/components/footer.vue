<template>
  <div class="footer">
    <ul>
      <li v-for="nav in navs" :key="nav.id">
        <router-link :to="nav.url">
          {{ nav.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      navs: [
        {
          'url': '/selected',
          'title': '精品'
        },
        {
          'url': '/collect',
          'title': '灵感'
        },
        {
          'url': '/goods',
          'title': '商品'
        },
        {
          'url': '/inspiration',
          'title': '清单'
        },
        {
          'url': '/mine',
          'title': '我的'
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.footer{
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
  border-top: 1px solid rgba(0,0,0,.3);
  z-index: 999;
  ul{
    overflow: hidden;
    display: flex;
    li{
      flex: 1;
      text-align: center;
      line-height: .859375rem;
      height: .859375rem;
      font-size: .273438rem;
      a{
         display: inline-block;
         width: 100%;
         color: #999;
         text-decoration: none;
      }
      .router-link-active{
        color: #eb4d3d;
        text-decoration: none;
      }
    }
  }
}
</style>
