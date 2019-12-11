<template>
  <div>
    <img :src="msg" alt="结算二维码">
  </div>
</template>
<script>
export default{
  name: 'Qrcode',
  data () {
    return {
      msg: ''
    }
  },
  created () {
    this.msg = this.$route.params.id
  }
}
</script>
<style lang="less" scoped>
</style>
