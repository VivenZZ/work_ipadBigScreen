<template>
  <x-dialog v-model="showDialogStyle" hide-on-blur  @on-hide="hideModel" :dialog-style="{'max-width': '100%', width: '540px', height: '86%', 'background-color': '#fff'}">
    <div class="top">
      <span class="back"></span>
      <span class="share"></span>
    </div>
    <transition name="fade">
    <div class="box">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide>
          <swiper :options="swiperOption_banner" ref="mySwiper">
            <swiper-slide class="swiper_banner">
              <div width="540" height="100%" ></div>
            </swiper-slide>
            <swiper-slide class="swiper_banner">
              <div width="540" height="100%" ></div>
            </swiper-slide>
            <swiper-slide class="swiper_banner">
              <div width="540" height="100%" ></div>
            </swiper-slide>
            <swiper-slide class="swiper_banner">
              <div width="540" height="100%" ></div>
            </swiper-slide>
            <swiper-slide class="swiper_banner">
              <div width="540" height="100%" ></div>
            </swiper-slide>
          </swiper>
        </swiper-slide>
      </swiper>
    </div>
    </transition>
    <atom-spinner :animation-duration="1000" :size="120" :color="'#ED1C24'" />
  </x-dialog>
</template>
<script>
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
import {AtomSpinner} from 'epic-spinners'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  components: {
    swiper,
    swiperSlide,
    XDialog,
    AtomSpinner
  },
  directives: {
    TransferDom
  },
  props: {
    invitor: '',
    code: ''
  },
  data () {
    return {
      goodsDetailsData: {},
      showDialogStyle: this.invitor,
      swiperOption: {
        direction: 'vertical',
        slidesPerView: 'auto',
        freeMode: true,
        scrollbar: {
          el: '.swiper-scrollbar'
        },
        mousewheel: true
      },
      swiperOption_banner: {
        pagination: {
          clickable: true
        }
      }
    }
  },
  watch: {
    invitor (cur) {
      if (cur === true) {
        this.showDialogStyle = true
      }
    }
  },
  methods: {
    hideModel () {
      // 调用父组件的方法 并 传值
      this.$emit('changingType', 'false')
    }
  }
}
</script>
<style scoped lang="less">
  .box{
    width: 540px;
    height: 1054/2px;
    box-sizing: border-box;
    border: 1px solid darkblue;
    margin-top: 88/102.4rem;
    text-align: left;
    .swiper-container {
      width: 100%;
      height: 100%;
    }
    .swiper-slide {
      font-size: 18px;
      height: auto;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding: 30px;
    }
    .swiper_banner{
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
      div{
        background-color: red;
        width: 540px;
        height: 300px;
      }
    }
  }
  .top{
    position: absolute;
    top: 0;
    left: 0;
    height: 88/102.4rem;
    width: 100%;
    background-color: #fff;
    line-height: 98/102.4rem;
    overflow: hidden;
    border-radius: 3px 3px 0 0;
    .back{
      float: left;
      width: 88/102.4rem;
      height: 88/102.4rem;
      background:url('/static/images/back.png') center center no-repeat;
      background-size: 100%;
      margin-left: 30/102.4rem;
    }
    .share{
      float: right;
      width: 88/102.4rem;
      height: 88/102.4rem;
      background:url('/static/images/share.png') center center no-repeat;
      background-size: 100%;
      margin-right: 30/102.4rem;
    }
  }
</style>
