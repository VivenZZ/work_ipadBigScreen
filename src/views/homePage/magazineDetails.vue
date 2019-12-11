<style scoped lang="less">
.full-box{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 88/102.4rem;
}
.time-swiper{
  height: 96/102.4rem;
  background: #fff;
  box-shadow: 0 0 9px rgba(183, 183, 183, .3);
  line-height: 96/102.4rem;
  padding-right: 90/102.4rem;
}
.time-item{
  font-size: 26/102.4rem;
  color: #999;
  margin-left: 90/102.4rem;
  width: auto;
}
.time-item.active{
  color: #333;
  &:after{
    display: block;
    content: '';
    width: 52/102.4rem;
    height: 0;
    border-top: #333 3/102.4rem solid;
    margin: 0 auto;
  }
}
.magazine-container{
  top: 196/102.4rem;
  left: 0;
  bottom: 0;
  width: 100%;
  position: absolute;
  div{
    width: 100%;
    height: 100%;
  }
}
.page-item{
  img{
    width: 100%;
    height: 100%;
  }
}
</style>

<template>
  <div>
    <div class="full-box">
      <!-- 杂志列表 -->
      <div class="time-swiper">
        <!-- time swiper -->
        <swiper :options="timeSwiperOption" ref="timeSwiper" @click.native="selectTime">
          <swiper-slide class="time-item" :class="{'active': currentChecked == index}" v-for="(item,index) in magazineList" :key="index">
            {{item.name}}
          </swiper-slide>
        </swiper>
      </div>

      <!-- 杂志详情浏览 -->
      <div class="magazine-container">
        <swiper :options="magazineSwiperOption" ref="magazineSwiper">
          <!-- <swiper-slide class="page-item " v-for="item in magazineDetails" :key="item.name">
            <img v-lazy="item.image">
          </swiper-slide> -->
        </swiper>
      </div>
    </div>
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
import { FulfillingBouncingCircleSpinner } from 'epic-spinners'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'MagazineDetails',
  components: {
    FulfillingBouncingCircleSpinner,
    swiper,
    swiperSlide
  },
  data () {
    return {
      isShow: false,
      magazineList: [],
      currentChecked: 0,
      timeSwiperOption: {
        slidesPerView: 'auto',
        freeMode: true
      },
      magazineSwiperOption: {
        speed: 600,
        virtual: {
          virtual: true,
          cache: false,
          renderSlide: function (slide) {
            return `
            <div class="page-item swiper-slide">
              <img data-src="` + slide.image + `" class="swiper-lazy" style="width: 100%;height: 100%;">
              <div class="swiper-lazy-preloader"></div>
            </div>`
          }
        },
        lazy: {
          lazy: true,
          loadPrevNext: true,
          loadPrevNextAmount: 2,
          loadOnTransitionStart: true
        }
      }
    }
  },
  mounted () {
    // 在线杂志数据加载
    let _this = this
    _this.api.post('market/catalog', {}, function (result) {
      if (!result.IsError) {
        _this.magazineList = result.Data.contents
        _this.isShow = true
      }
    })
    _this.currentChecked = this.$route.query.currentChecked
    _this.getMagazineDetails(this.$route.query.cid)
  },
  computed: {
    timeSwiper () {
      return this.$refs.timeSwiper.swiper
    },
    magazineSwiper () {
      return this.$refs.magazineSwiper.swiper
    }
  },
  methods: {
    // 选择杂志时期
    selectTime () {
      let clickedIndex = this.timeSwiper && this.timeSwiper.clickedIndex
      if (clickedIndex === void 0 || clickedIndex === this.currentChecked) {
        return
      }
      this.getMagazineDetails(this.magazineList[clickedIndex].cid)
      // 更改title值
      this.sdk.bridge.setTitle(this.magazineList[clickedIndex].name)
      this.currentChecked = clickedIndex
    },
    /*
      杂志详情 数据加载
      传参 cid 获取当前 catalog 下的 images 列表
    */
    getMagazineDetails (myCid) {
      let _this = this
      _this.api.post('market/catalog/detail', {cid: myCid}, function (result) {
        if (!result.IsError) {
          // 设置虚拟slide数据并更新
          _this.magazineSwiper.virtual.slides = []
          _this.magazineSwiper.slideTo(result.Data.images.length + 1, 0, false)
          _this.magazineSwiper.slideTo(0, 0, false)
          _this.magazineSwiper.virtual.slides = result.Data.images
          _this.magazineSwiper.virtual.update()
        }
      })
    }
  }
}
</script>
