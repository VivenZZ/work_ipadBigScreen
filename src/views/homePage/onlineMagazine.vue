<style scoped lang="less">
.swiper{
  margin-top: 92/102.4rem;
}
.magazine-item{
  width: 748/102.4rem;
  margin-left: 40/102.4rem;
  &>div{
    width: 100%;
    height: 884/102.4rem;
  }
  img{
    width: 100%;
    height: 100%;
    border-radius: 4px;
    box-shadow: 1px 6px 8px rgba(188, 188, 188, 0.3);
  }
  h6{
    color: #333;
    margin-top: 30/102.4rem;
    font-size: 26/102.4rem;
  }
}
.magazine-item:nth-child(1){
  margin-left: 74/102.4rem;
}
</style>

<template>
  <div class="swiper">
    <transition name="fade">
      <div v-if="isShow">
        <!-- swiper -->
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(item,index) in magazinesList" :key="index" class="magazine-item">
            <div @click="goToDetails(item.cid)">
              <img :data-src="item.image" class="swiper-lazy">
              <div class="swiper-lazy-preloader"></div>
            </div>
            <h6>{{item.name}}</h6>
          </swiper-slide>
        </swiper>
      </div>
    </transition>
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
  name: 'OnlineMagazine',
  components: {
    FulfillingBouncingCircleSpinner,
    swiper,
    swiperSlide
  },
  data () {
    return {
      magazinesList: [],
      swiperOption: {
        slidesPerView: 'auto',
        freeMode: true,
        lazy: {
          loadPrevNext: true,
          loadPrevNextAmount: 4
        }
      },
      isShow: false
    }
  },
  mounted () {
    // 在线杂志数据加载
    let _this = this
    _this.sdk.bridge.saveTrace('onlineMagazineMain', 0)
    _this.api.post('market/catalog', {}, function (result) {
      if (!result.IsError) {
        _this.magazinesList = result.Data.contents
        _this.isShow = true
      }
    })
  },
  methods: {
    goToDetails (cid) {
      let _this = this
      _this.sdk.bridge.saveTrace('onlineMagazinePicture', 0)
      // 判断用户是否登录
      _this.sdk.bridge.auth(function (data) {
        if (data.logined) {
          // 已登录 跳转至详情页
          let myUrl = _this.common.url + '/#/magazineImage/' + cid
          // window.location.href = 'http://192.168.85.130:8080/magazineDetails/' + (cid && ('?cid=' + cid)) + '&currentChecked=' + currentChecked
          _this.sdk.bridge.openNewPage(myUrl, 'nobar', '1111')
        } else {
          // 未登录 弹出登录弹窗
          _this.sdk.bridge.prelogin()
        }
      })
    }
  }
}
</script>
