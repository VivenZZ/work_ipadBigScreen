<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.swiperSlide{
  width:100%;
  overflow: hidden;
}
.homeSwiper{
  position: fixed;
  bottom: 0;
  left: 3%;
  width: 94%;
  height: ~'calc(100vh - 75px)';
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
}
.swiper-container{
  min-height: 500px;
  width: 100%;
  .swiper-lazy-preloader{
    margin-top: 200px;
  }
}
.swiperSlide{
  overflow:hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  img{
    max-width:100%;
    max-height:100%;
    border-radius: 4px;
  }
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}
</style>

<template>
  <div class="homeSwiper">
    <swiper v-if='roomData.length > 0' class="inspirationSwiper" :options="inspirationSwiperOption" ref="inspirationSwiper">
      <swiper-slide v-for="(item, index) in roomData" :key="index">
        <!-- <div class="swiperSlide" @click="goToDetails(item.cid, item.id, index)"> -->
        <div class="swiperSlide">
          <img :data-src='item.image' class="swiper-lazy" @click="goToDetails(item.cid, item.id, index)" />
          <div class="swiper-lazy-preloader"></div>
        </div>
      </swiper-slide>
    </swiper>
    <div class="loading" v-if="!isShow">
      <fulfilling-bouncing-circle-spinner
        :animation-duration="4000"
        :size="60"
        color="#EB4D3D"
      />
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { FulfillingBouncingCircleSpinner } from 'epic-spinners'
export default {
  name: 'inspirationRoom',
  components: {
    swiper,
    swiperSlide,
    FulfillingBouncingCircleSpinner
  },
  data () {
    return {
      isShow: false,
      isLayerShow: false,
      roomData: [
      ],
      slideIndex: 0,
      inspirationSwiperOption: {
        speed: 1000,
        loop: true,
        loopedSlides: 8,
        slideToClickedSlide: true,
        autoplay: {
          delay: 5000
        },
        lazy: {
          loadPrevNext: true,
          loadPrevNextAmount: 2
        },
        initialSlide: 0
      }
    }
  },
  created () {
    let _this = this
    _this.sdk.bridge.saveTrace('roomIdeasMain', 0)
    // 数据加载
    _this.getData()
  },
  computed: {
    inspirationSwiper () {
      return this.$refs.inspirationSwiper.swiper
    }
  },
  beforeDestroy () {
    let _this = this
    // swiper插件不销毁
    _this.$refs.inspirationSwiper.swiper.destroy(false, false)
  },
  methods: {
    ShowNow: function () {
      this.isShow = true
    },
    getData () {
      let _this = this
      // 数据加载
      _this.api.post('market/roomidea', {}, function (result) {
        if (!result.IsError) {
          _this.roomData = result.Data.contents
          _this.roomData.forEach(e => {
            e.image = _this.sdk.bridge.resize(e.image, 963, 547)
          })
          _this.ShowNow()
          _this.inspirationSwiperOption.loopedSlides = _this.roomData.length
          if (_this.roomData.length > 0) {
            _this.inspirationSwiper.init()
          }
        }
      })
    },
    goToDetails (cid, id, index) {
      let _this = this
      _this.sdk.bridge.saveTrace('roomIdeasPicture', 0)
      _this.sdk.bridge.auth(function (data) {
        if (data.logined) {
          let myUrl = _this.common.url + '/#/productList/' + (cid && ('?cid=' + cid)) + '&id=' + id + '&index=' + index
          _this.sdk.bridge.openNewPage(myUrl, 'barWithSearchShop', '商品列表')
        } else {
          _this.sdk.bridge.prelogin()
        }
      })
      // let myUrl = 'http://0.0.0.0:8080/#/productList/' + (cid && ('?cid=' + cid)) + '&id=' + id + '&index=' + index
      // window.location.href = myUrl
    },
    turnIndex () {
      let index = Number(window.localStorage.getItem('index'))
      this.inspirationSwiper.slideToLoop(index, 1000, false)
      this.inspirationSwiper.autoplay.start()
    }
  },
  mounted () {
    window.turnIndex = this.turnIndex
  }
}
</script>
