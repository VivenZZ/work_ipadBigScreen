<style scoped lang="less">
.citys-swiper {
  margin-top: 92/102.4rem;
}
.city-item {
  border: #ccc 1px solid;
  border-radius: 4px;
  padding: 12/102.4rem 30/102.4rem;
  font-size: 26/102.4rem;
  color: #ccc;
  width: auto;
  margin-left: 24/102.4rem;
  &:first-child {
    margin-left: 0;
  }
}
.city-item:nth-child(1) {
  margin-left: 74/102.4rem;
}
.city-item.active {
  border-color: #333;
  color: #333;
}
.stores-swiper {
  margin-top: 70/102.4rem;
}
.store-item {
  margin-left: 38/102.4rem;
  width: 684/102.4rem;
  &:first-child {
    margin-left: 0;
  }
  .store--img {
    width: 100%;
    height: 456/102.4rem;
    border-radius: 4px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  dl {
    margin-top: 18/102.4rem;
    dt {
      font-size: 26/102.4rem;
      font-weight: 600;
      color: #333;
      line-height: 2.2;
    }
    dd {
      font-size: 24/102.4rem;
      color: #999;
      line-height: 1.6;
    }
  }
}
.store-item:nth-child(1) {
  margin-left: 74/102.4rem;
}
</style>

<template>
  <div>
    <transition name="fade">
      <div v-show="isShow">
        <!-- 城市标签选择 -->
        <div class="citys-swiper">
          <!-- areas swiper -->
          <swiper :options="citysSwiperOption" ref="citysSwiper" @click.native="selectCity()">
            <swiper-slide class="city-item" :class="{'active': currentChecked === index}" v-for="(item,index) in citys" :key="index">
              {{item.name}}
            </swiper-slide>
          </swiper>
        </div>

        <!-- 门店列表 -->
        <div class="stores-swiper">
          <!-- stores swiper -->
          <swiper :options="storesSwiperOption" ref="storesSwiper">
            <swiper-slide class="store-item" v-for="item in storesArr" :key="item.name">
              <div class="store--img">
                <img v-lazy="{src: item.cover, error: '/static/images/onerror36.jpg'}" :key="item.cover">
              </div>
              <dl>
                <dt>{{item.name}}</dt>
                <dd>{{item.address}}</dd>
                <dd>电话号码：{{item.tel}}</dd>
                <dd>营业时间：{{item.hours}}</dd>
              </dl>
            </swiper-slide>
          </swiper>
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
import { FulfillingBouncingCircleSpinner } from 'epic-spinners'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'Stores',
  components: {
    FulfillingBouncingCircleSpinner,
    swiper,
    swiperSlide
  },
  data () {
    return {
      citysSwiperOption: {
        slidesPerView: 'auto',
        freeMode: true
      },
      storesSwiperOption: {
        slidesPerView: 'auto',
        freeMode: true
      },
      citys: [],
      storesArr: [],
      currentChecked: 0,
      isShow: false,
      // currentCity 当前定位的城市
      currentCity: ''
    }
  },
  mounted () {
    let _this = this
    _this.sdk.bridge.saveTrace('storeInfoMain', 0)
    // _this.api.post('market/store', {city: 30030}, function (result) {
    //   if (!result.IsError) {
    //     _this.citys = result.Data.citys
    //     _this.storesArr = result.Data.stores
    //     _this.isShow = true
    //   }
    // })
    // 获取到的当前地址 city 作为参数
    _this.sdk.bridge.getLocation(function (res) {
      if (res.city === void 0) {
        return
      }
      // 全国门店城市数据,传参当前city
      _this.api.post('market/store', { city: res.city }, function (result) {
        if (!result.IsError) {
          _this.citys = result.Data.citys
          _this.storesArr = result.Data.stores
          _this.isShow = true
        }
      })
      _this.currentCity = res.city
    })
  },
  computed: {
    citysSwiper () {
      return this.$refs.citysSwiper.swiper
    },
    storesSwiper () {
      return this.$refs.storesSwiper.swiper
    }
  },
  watch: {
    currentChecked () {
      /*
        当前点击的 slide 索引值即 city 索引
        根据索引获取 code
        传参 code 获取当前 city 下的 stores 列表
      */
      let _this = this
      let code = _this.citys[_this.currentChecked] && _this.citys[_this.currentChecked].code
      _this.api.post('market/store', { city: _this.currentCity, code: code }, function (result) {
        if (!result.IsError) {
          _this.storesArr = result.Data.stores
        }
      })
      _this.storesSwiper.slideTo(0, 0, false)
    }
  },
  methods: {
    // 切换选中城市
    selectCity () {
      this.sdk.bridge.saveTrace('storeInfoStore', 0)
      let _this = this
      let clickedIndex = this.citysSwiper && this.citysSwiper.clickedIndex
      if (clickedIndex === void 0) {
        return
      }
      _this.currentChecked = clickedIndex
    }
  }
}
</script>
