<template>
<div class="enl">
  <span class="back" @click="back">
    <img src="/static/images/closed.png" alt="">
  </span>
  <swiper :options="swiperOption" ref="mySwiper">
    <swiper-slide v-for="(item, index) in images" :key="index" class="swiper-slide-l">
      <div class="swiper-zoom-container banner">
        <img v-lazy="{src: item, error: '/static/images/onerror480.jpg'}" :key="item" alt="">
      </div>
    </swiper-slide>
  </swiper>
  <div v-if="images.length !== 1" class="swiper-pagination"  slot="pagination"></div>
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
      images: [],
      swiperOption: {
        zoom: true,
        speed: 500,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'fraction'
        }
      }
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
    // this.code = this.$route.params.code
    this.sdk.bridge.getLocation(function (res) {
      let dataObject = {prov: res.prov, city: res.city, county: res.country, goodsId: _this.id}
      _this.api.post('market/product/detail', dataObject, function (result) {
        if (!result.IsError) {
          let data
          data = result.Data.SKUList
          data.forEach(e => {
            e.Gallerys.forEach(k => {
              _this.images.push(k.Img_Url)
            })
          })
        }
      })
    })
  }
}
</script>
<style lang="less" scoped>
.enl{
  width: 1024px;
  height: 668px;
  padding: 50px 0;
  background-color: white;
  position: relative;
  .back{
    width: 60px;
    height: 60px;
    line-height: .976563rem;
    text-align: center;
    position: fixed;
    right: .292969rem;
    top: .592969rem;
    font-size: .488281rem;
    color: white;
    border-radius: 50%;
    z-index: 9999;
    img{
      width: 40px;
      height: 40px;
    }
  }
}
.swiper-container{
  width: 1024px;
  height: 668px;
  .swiper-pagination-fraction{
    color: black;
    bottom: 0;
    line-height: .488281rem;
  }
}
.banner{
  width: 100%;
  height: 668px;
  img{
    height: 100%;
  }
}
</style>
