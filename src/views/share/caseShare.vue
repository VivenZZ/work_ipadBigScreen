<template>
  <div class="collectDetails">
    <h1 class="title">{{details.title}}</h1>
    <p class="describe">{{details.subtitle}}</p>
    <div v-for="(data, i) in details.items" :key="data.id">
      <swiper :options="swiperOption_l" ref="mySwiper">
        <swiper-slide v-for="(item, j) in data.items" :key="item.id" class="swiper-slide-l">
          <div class="">
            <img @click="zoom(i, j)" class="img" v-lazy="item.image" alt="">
            <a v-if="item.url" class="icon_box" @click="z3d(item.url)" href="javascript:;">
              <img class="icon" src="/static/images/3D_tag.png" alt="">
            </a>
          </div>
        </swiper-slide>
        <div v-if="data.items.length !== 1" class="swiper-pagination"  slot="pagination"></div>
      </swiper>
      <p class="let-title">
        {{data.name}}
      </p>
    </div>
    <div class="h"></div>
    <div class="bg" v-if="zoonImages">
      <swiper v-if="imgtrue" :options="swiperOption" ref="mySwiper1">
        <swiper-slide v-for="(item, i) in images" :key="i" class="swiper-slide-l">
          <div class="swiper-zoom-container">
            <img class="img" v-lazy="item" :key="item" alt="">
          </div>
        </swiper-slide>
        <div v-if="images.length !== 1" class="swiper-pagination"  slot="pagination"></div>
      </swiper>
      <iframe v-if="tdtrue" :src="url" frameborder="0" width="100%" height="100%"></iframe>
      <div class="closed" @click="closed">
        <img src="/static/images/closed.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default{
  name: 'Share',
  components: {
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
        }
      },
      swiperOption: {
        zoom: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        initialSlide: 0
      },
      details: {},
      images: [],
      url: '',
      zoonImages: false,
      imgtrue: false,
      tdtrue: false,
      share: {
        title: '',
        img: '',
        desc: ''
      }
    }
  },
  methods: {
    zoom (i, j) {
      this.zoonImages = true
      this.imgtrue = true
      let img = this.details.items[i].items[j].image
      this.images.forEach((e, k) => {
        if (e === img) {
          this.swiperOption.initialSlide = k
        }
      })
    },
    z3d (url) {
      this.zoonImages = true
      this.tdtrue = true
      this.url = url
    },
    closed () {
      this.zoonImages = false
      this.imgtrue = false
      this.tdtrue = false
    }
  },
  watch: {
    '$route' (to, from) {
      let _this = this
      // 对路由变化作出响应...
      document.title = '方案详情'
      this.id = this.$route.params.id // 传进来的动态id
      this.api.post2('market/programme/share', {pid: this.id}, function (result) {
        if (!result.IsError) {
          _this.details = result.Data
        }
      })
    }
  },
  created () {
    let _this = this
    this.id = this.$route.params.id
    this.api.post2('market/programme/share', {pid: this.id}, function (result) {
      if (!result.IsError) {
        _this.details = result.Data
        _this.details.items.forEach(e => {
          e.items.forEach(k => {
            _this.images.push(k.image)
          })
        })
        document.title = _this.details.title
        _this.share.title = _this.details.title
        _this.share.img = 'http:' + _this.sdk.bridge.resize(_this.details.cover, 480, 320)
        _this.share.desc = '建筑面积：' + _this.details.number + '㎡;户型结构：' + _this.details.speic + ';价格：' + _this.details.price + ';'
        _this.wxConfig.wxShowMenu(_this.share.title, _this.share.img, _this.share.desc)
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
  .closed{
    position: fixed;
    right: 20px;
    top: 20px;
    border-radius: 50%;
    width: 1.25rem;
    height: 1.25rem;
    line-height: 50px;
    text-align: center;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    font-size: 36px;
    z-index: 1000;
    img{
      width: 1.25rem;
      height: 1.25rem;
    }
  }
  .bg{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #000;
    top: 0;
    left: 0;
    z-index: 999;
  }
  .img{
    width: 100%;
    height: 720/102.4rem;
  }
  .icon{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1.48125rem;
    height: 1.48125rem;
  }
  .icon_box{
    position: absolute;
    width: 100%;
    height: 7.03125rem;
    top: 0;
    left: 0;
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
    border-top: 1px solid rgba(204, 204, 204, .5);
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
    .swiper-pagination{
      color: white
    }
    .img{
      width: 100%;
      height: 720/102.4rem;
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
    font-size: .353906rem;
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
