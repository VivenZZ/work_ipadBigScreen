<template>
  <div class="tips">
    {{msg}}
  </div>
</template>
<style lang="less" scoped>
.tips{
  padding: 47/102.4rem 60/102.4rem;
  border-radius: 12/102.4rem;
  background-color: rgba(26, 26, 26, .6);
  color: white;
  font-size: 24/102.4rem;
  font-family: PingFangSC-Medium, sans-serif;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  line-height: 26/102.4rem;
  z-index: 9999999;
}
</style>
<script>
export default{
  name: 'Tips',
  props: {
    msg: String
  }
}
</script>
