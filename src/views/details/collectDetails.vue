<template>
  <div>
    <transition name="fade">
      <div class="collectDetails" v-if="isShow">
        <div class="top">
          <!-- <span @click="" class="back"></span> -->
          <span @click="share()" class="share"></span>
        </div>
        <h1 class="title">{{details.title}}</h1>
        <p class="describe">{{details.subtitle}}</p>
        <!-- <img v-lazy="details.cover" alt="">
        <h3>户型图</h3> -->
        <div v-for="(data,i) in details.items" :key="i">
          <swiper :options="swiperOption_l" ref="mySwiper">
            <swiper-slide v-for="(item, index) in data.items" :key="item.id" class="swiper-slide-l">
              <div class="bg" v-if="item.url" @click="move3d(i,index)">
                <img src="/static/images/3D_tag.png" alt="">
              </div>
              <img :data-src="item.image" :key="item.image"  @click="enlarge(item.image)" class="swiper-lazy">
              <div class="swiper-lazy-preloader"></div>
            </swiper-slide>
            <div class="swiper-pagination"  slot="pagination"></div>
          </swiper>
          <p class="let-title">
            {{data.name}}
          </p>
        </div>
        <div class="h"></div>
        <div class="bottom">
          <span class="price">方案预估：{{details.price}}</span>
          <span class="more" @click="openNew()">查看商品</span>
        </div>
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
import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default{
  name: 'collectDetails',
  components: {
    FulfillingBouncingCircleSpinner,
    swiper,
    swiperSlide
  },
  data () {
    return {
      id: '58923627-0401-4f1f-b1ea-370ea77a3c13',
      swiperOption_l: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        lazy: {
          loadPrevNext: true,
          loadPrevNextAmount: 2
        }
      },
      details: {},
      isShow: false,
      index: 0
    }
  },
  watch: {
    '$route' (to, from) {
      let _this = this
      // 对路由变化作出响应...
      this.id = this.$route.params.id // 传进来的动态id
      this.api.post('market/programme/detail', {pid: this.id}, function (result) {
        if (!result.IsError) {
          _this.details = result.Data
          _this.details.items.forEach(e => {
            e.items.forEach(el => {
              if (el.image.indexOf('jiaeda') === -1) {
                el.image = _this.sdk.bridge.resize(e.image, 480, 320)
              }
            })
          })
        }
      })
    }
  },
  methods: {
    move3d (i, j) {
      // window.location.href = 'http://jiaeda.com/view-full?from=singlemessage&isappinstalled=0&vId=2628'
      this.sdk.bridge.openNewPage(this.common.url + '/#/enlarge3D/' + this.id + '/' + i + '/' + j, 'nobar', '3D')
      // this.sdk.bridge.openNewPage('http://jiaeda.com/view-full?from=singlemessage&isappinstalled=0&vId=2628', 'nobar', '3D')
    },
    enlarge (url) {
      let images = []
      this.details.items.forEach((k, a) => {
        k.items.forEach((j, b) => {
          images.push(j.image)
        })
      })
      images.forEach((e, i) => {
        if (e === url) {
          this.index = i
        }
      })
      // window.location.href = 'http://localhost:8081/#/enlargeImage/' + this.id + '/' + this.index
      this.sdk.bridge.openNewPage(this.common.url + '/#/enlargeImage/' + this.id + '/' + this.index, 'nobar', '111')
    },
    share () {
      let url = this.api.shareCollect(this.id)
      let qrcodeUrl = this.api.qrcode(url)
      this.sdk.bridge.shareData(this.details.title, this.details.subtitle, this.details.cover, url, qrcodeUrl)
    },
    openNew () {
      this.sdk.bridge.openNewPage(this.common.url + '/#/fullPurchase/' + this.id, 'barWithSearchShop', this.details.title)
      // window.location.href = 'http://localhost:8081/#/fullPurchase/' + this.id
    }
  },
  created () {
    let _this = this
    this.id = this.$route.params.id
    this.api.post('market/programme/detail', {pid: this.id}, function (result) {
      if (!result.IsError) {
        _this.details = result.Data
        _this.details.items.forEach(e => {
          console.log(e)
          e.items.forEach(el => {
            if (el.image.indexOf('jiaeda') === -1) {
              el.image = _this.sdk.bridge.resize(el.image, 480, 320)
            }
          })
        })
        _this.isShow = true
      }
    })
  }
}
</script>
<style lang="less" scoped>
html,body{
  width: 100%;
  height: 100%;
  position: relative;
}
.collectDetails{
  width: 100%;
  height: 100%;
  img{
    width: 100%;
    height: 720/102.4rem;
  }
  .h{
    height: .957031rem;
    width: 100%;
  }
  .bottom{
    position: fixed;
    z-index: 999;
    bottom: 0;
    left: 0;
    height: .957031rem;
    width: 100%;
    background-color: #fff;
    border-top: 1px solid rgba(204, 204, 204, .2);
    line-height: .957031rem;
    overflow: hidden;
    border-radius: 0 0 3px 3px;
    .price{
      float: left;
      font-size: .234375rem;
      color: #333;
      margin-left: .878906rem;
    }
    .more{
      float: right;
      font-size: .234375rem;
      color: #EB4D3D;
      margin-right: .878906rem;
    }
  }
  .swiper-container {
    width: 100%;
    height: 100%;
    .swiper-slide-l{
      /* Center slide text vertically */
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
    }
    img{
      width: 100%;
      height: 720/102.4rem;
    }
    .bg{
      position: absolute;
      width: 100%;
      height: 100%;
      img{
        position: absolute;
        width: .78125rem;
        height: .78125rem;
        top: 50%;
        left: 50%;
        margin-left: -0.390625rem;
        margin-top: -0.390625rem;
      }
    }
  }
  .title{
    text-align: left;
    text-indent: .898438rem;
    font-weight: bold;
    line-height: .449219rem;
    font-size: .449219rem;
    margin-top: 1.191406rem;
    color: #333;
  }
  .describe, h3, .let-title{
    text-align: left;
    text-indent: .898438rem;
    line-height: .253906rem;
    font-size: .253906rem;
    margin: .195313rem 0 .634766rem 0;
    color: #333;
  }
  h3{
    font-weight: bold;
  }
}
.top{
  position: fixed;
  top: 0;
  left: 0;
  height: .859375rem;
  width: 100%;
  background-color: #fff;
  line-height: .957031rem;
  overflow: hidden;
  border-radius: 3px 3px 0 0;
  z-index: 9999;
  .back{
    float: left;
    width: .859375rem;
    height: .859375rem;
    background:url('/static/images/back.png') center center no-repeat;
    background-size: 100%;
    margin-left: .292969rem;
  }
  .share{
    float: right;
    width: .859375rem;
    height: .859375rem;
    background:url('/static/images/share.png') center center no-repeat;
    background-size: 100%;
    margin-right: .292969rem;
  }
}
</style>
