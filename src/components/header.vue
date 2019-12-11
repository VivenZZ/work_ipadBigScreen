<template>
  <div class="header">
    <div class="search_box">
      <img src="/static/images/search.png" alt="">
      <input type="search" placeholder="搜索商品/精装方案/灵感">
    </div>
    <div class="msg">
      <img src="/static/images/msg.png" alt="">
    </div>
    <div class="person">
      <img src="/static/images/person.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      msg: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.header{
  height: 88/102.4rem;
  padding: 20/102.4rem 0;
  width: 100%;
  font-size: 14px;
  display: block;
  overflow: hidden;
  position: fixed;
  top: 0;
  background: #fff;
  z-index: 999;
  .msg{
    float: left;
    width: 88/102.4rem;
    margin-left: 1rem;
    img{
      width: 100%;
    }
  }
  .person{
    float: left;
    width: 88/102.4rem;
    margin-left: 0.3rem;
    img{
      width: 100%;
    }
  }
  .search_box{
    float: left;
    width: 80%;
    height: 100%;
    text-align: left;
    box-shadow: 0 1.36px 8.16px rgb(183,183,183);
    margin-left: 60/102.4rem;
    img{
      float: left;
      width: 88/102.4rem;
      height: 88/102.4rem;
    }
    input{
      width: 70%;
      float: left;
      height: 88/102.4rem;
      border: none;
      color: #ccc;
    }
  }
}
</style>
