<template>
<div class="enl">
  <span class="back" @click="back">
    <img src="/static/images/closed.png" alt="">
  </span>
  <swiper :options="swiperOption" ref="mySwiper">
    <swiper-slide v-for="(item, index) in images" :key="index" class="swiper-slide-l">
      <div class="swiper-zoom-container">
        <img v-lazy="{src: item, error: '/static/images/onerrornone.jpg'}" :key="item" alt="">
      </div>
    </swiper-slide>
    <div v-if="images.length !== 1" class="swiper-pagination"  slot="pagination"></div>
  </swiper>
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
        speed: 300,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'fraction'
        },
        initialSlide: 1
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
    this.swiperOption.initialSlide = this.$route.params.index
    this.api.post('market/programme/detail', {pid: this.id}, function (result) {
      if (!result.IsError) {
        let data = result.Data
        data.items.forEach(k => {
          k.items.forEach(j => {
            _this.images.push(j.image)
          })
        })
        // _this.isShow = true
      }
    })
  }
}
</script>
<style lang="less" scoped>
.enl{
  width: 1024px;
  height: 768px;
  background-color: black;
  .back{
    width: 60px;
    height: 60px;
    line-height: .976563rem;
    text-align: center;
    position: fixed;
    right: 0.292969rem;
    top: 0.392969rem;
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
  height: 100%;
  .swiper-pagination-fraction{
    color: white;
    line-height: .488281rem;
  }
  .swiper-silder{
    display: table;
  }
  img{
    width: 100%;
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
