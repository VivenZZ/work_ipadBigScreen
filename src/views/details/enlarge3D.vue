<template>
<div class="enl">
  <iframe :src="url" width="100%" height="100%"></iframe>
  <span class="back" @click="back">
    <img src="/static/images/closed.png" alt="">
  </span>
</div>
</template>
<script>
import {AtomSpinner} from 'epic-spinners'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default{
  name: 'Enlarge',
  components: {
    AtomSpinner,
    swiper,
    swiperSlide
  },
  data () {
    return {
      url: '',
      id: '',
      column: -1,
      row: -1
    }
  },
  methods: {
    back () {
      this.sdk.bridge.back()
    }
  },
  created () {
    let _this = this
    this.id = this.$route.params.id
    this.column = this.$route.params.column
    this.row = this.$route.params.row
    this.api.post('market/programme/detail', {pid: this.id}, function (result) {
      if (!result.IsError) {
        let data = result.Data
        _this.url = data.items[_this.column].items[_this.row].url
        // _this.isShow = true
      }
    })
  }
}
</script>
<style lang="less" scoped>
.enl{
  width: 100%;
  height: 100%;
  background-color: black;
  iframe{
    border: none;
  }
  .back{
    width: 40px;
    height: 40px;
    line-height: 0.976563rem;
    text-align: center;
    position: fixed;
    right: 0.872969rem;
    top: 0.492969rem;
    font-size: 0.488281rem;
    color: white;
    border-radius: 50%;
    z-index: 9999;
    img{
      width: 34px;
      height: 34px;
    }
  }

}
.swiper-container{
  width: 100%;
  height: 100%;
  .swiper-pagination-fraction{
    color: white;
    line-height: 50px;
  }
}
.banner{
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
