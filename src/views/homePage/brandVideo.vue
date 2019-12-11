<style scoped lang="less">
.brandSwiper,.swiperSlide{
  position:relative;
  width:100%;
  height: ~'calc(100vh - 148px)';
}
.swiperSlide{
  background:none;
  video{
    width:100%;
    height: ~'calc(100vh - 148px)';
  }
}
.videoBtn{
  position: absolute;
  z-index: 999999;
  left: 45%;
  transform: translateX(-50%);
  top: 50%;
  transform: translateY(-50%);
  img{
    width: 170/102.4rem;
  }
}
</style>

<template>
  <div class="page">
    <div class="brandSwiper">
      <swiper class="videoSwiper" :options="videoSwiperOption" ref="videoSwiper">
        <swiper-slide v-for="(item, index) in videoData" :key="index">
          <div class="swiperSlide">
            <video preload ref="brandVideo" :poster="item.image">
              <source :src="item.video" type='video/mp4'
                webkit-playsinline
                playsinline
                x5-video-player-type="h5"
                x5-video-player-fullscreen="true"
                x5-video-orientation="portraint">
            </video>
          </div>
          <div class="videoBtn">
            <div class="videoBtn_play" v-if="isVideoPlay" @click="videoPlay(index)">
              <img src="/static/images/videoplay.png" />
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'inspirationRoom',
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      isVideoPlay: true,
      videoData: [],
      videoSwiperOption: {
        notNextTick: true,
        hashnav: true,
        speed: 1000,
        lazy: {
          lazy: true,
          loadPrevNext: true,
          loadPrevNextAmount: 2,
          loadOnTransitionStart: true
        },
        on: {
          slideChange: () => {
            this.allVideoStop()
          }
        }
      }
    }
  },
  mounted () {
    let _this = this
    _this.sdk.bridge.saveTrace('videoCenterMain', 0)
    // 数据加载
    _this.getData()
  },
  computed: {
    brandVideo () {
      return this.$refs.brandVideo
    }
  },
  methods: {
    getData () {
      let _this = this
      _this.api.post('market/video', {}, function (result) {
        if (!result.IsError) {
          _this.videoData = result.Data.contents
        }
      })
    },
    videoPlay (index) {
      this.sdk.bridge.saveTrace('videoCenterVideo', 0)
      this.allVideoStop()
      this.brandVideo[index].play()
      this.isVideoPlay = false
      this.brandVideo[index].muted = false
    },
    allVideoStop () {
      var brandVideoArr = this.brandVideo
      for (var i = 0; i < brandVideoArr.length; i++) {
        brandVideoArr[i].pause()
        brandVideoArr[i].muted = true
        this.isVideoPlay = true
      }
    }
  }
}
</script>
