<style scoped lang="less">
.seriesNav,.currentPage{
  box-shadow: 0 4px 6px rgba(0,0,0,.05);
}
.page{
  position: relative;
  width: 100%;
  min-height: 100%;
  background-color: #F9F9F9;
  font-family: PingFangSC-Regular, sans-serif;
}
.seriesNavBox,.footTool{
  width: 950/1024*100%;
  margin:0 auto;
}
.seriesNav{
  position:fixed;
  top:0;
  width:100vw;
  z-index:1;
  background:#fff;
}
.swiperSlideItem{
  font-size:26/75rem;
  color:#ccc;
  height:96/75rem;
  line-height:96/75rem;
  text-align: center;
  width: auto;
  margin-right: 45/75rem;
}
.swiperSlideCurrent{
  color:#333;
  position: relative;
  &::after{
    content: '';
    border-bottom: 2px solid #000;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width:55/75rem;
  }
}
.footer{
  width: 100%;
  height: 96/75rem;
  line-height: 96/75rem;
  background-color: #f6f6f6;
  position: fixed;
  bottom: 0;
  left: 0;
  box-shadow: 0 -1px 5px rgba(179,179,179,.3);
  display: flex;
  text-align: center;
  font-size: 24/75rem;
  .left{
    flex: 2;
    color: #333;
    i{
      font-size:28/75rem;
      font-style:normal;
    }
  }
  .right{
    flex: 3;
    color: #E74D3D;
    background-color: #fff;
    font-weight: bold;
    i{
      font-size:32/75rem;
      font-style:normal;
    }
  }
}
.goodsList{
  padding: 10/75rem;
  padding-top: 106/75rem;
  box-sizing: content-box;
  li{
    padding: 20/75rem;
    background-color: white;
    display: flex;
    align-items: center;
    margin-bottom: 10/75rem;
    .img{
      width: 160/75rem;
      height: 160/75rem;
      position: relative;
      img{
        width: 160/75rem;
        height: 160/75rem;
      }
    }
    .content{
      flex: 1;
      margin-left: 75/75rem;
      line-height: 44/75rem;
      .name{
        font-size: 26/75rem;
        color: #333;
        width: 90%;
      }
      .speci{
        font-size: 24/75rem;
        color: #959595;
        width: 90%;
      }
      .code{
        font-size: 22/75rem;
        color: #959595;
        width: 90%;
      }
      .newPrice{
        font-size: 22/75rem;
        color: #E74D3D;
        i{
          font-style: normal;
          font-size: 32/75rem;
        }
      }
      .price_box{
        display: flex;
        margin-top: 24/75rem;
        p{
          flex: 1;
        }
        .count{
          width: 60/75rem;
          color: #959595;
        }
      }
      .oldPrice{
        font-size: 22/75rem;
        color: #959595;
        text-decoration:line-through;
        i{
          font-style: normal;
          font-size: 24/75rem;
        }
      }

    }
  }
}
.h100{
  width: 100%;
  height: 100/75rem;
}
</style>

<template>
  <div class="page">
    <div class="seriesNav">
      <div class="seriesNavBox">
        <swiper class="seriesSwiper" :options="seriesSwiperOption" ref="seriesSwiper">
          <swiper-slide class="swiperSlideItem" v-for="(item, index) in seriesNav" :key="index" :class="{'swiperSlideCurrent': currentSlide == index}" @click.native="selectSeries">
            {{item}}
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <ul class="goodsList">
      <li v-for="(item, index) in goods" :key="index">
        <div class="img">
          <img v-lazy="{src: item.img, error: '/static/images/onerror260.jpg'}" :key="item.img">
        </div>
        <div class="content">
          <p class="name">{{item.name}}</p>
          <p class="code">编号: {{item.code}}</p>
          <p class="speci">{{item.psize}} {{item.color}}</p>
          <div class="price_box">
            <p>
              <span class="newPrice">￥<i>{{item.price}}</i></span>
              <span class="oldPrice" v-if="item.price !== item.pricediscount">￥<i>{{item.pricediscount}}</i></span>
            </p>
            <span class="count">
              X{{item.count}}
            </span>
          </div>
        </div>
      </li>
    </ul>
    <div class="h100">&nbsp;</div>
    <div class="footer">
      <div class="left">
        <span>{{currentName}}商品:￥<i>{{alonePrice}}</i></span>
      </div>
      <div class="right">
        <span>所有商品:￥<i>{{productPrice}}</i></span>
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
import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'product',
  components: {
    FulfillingBouncingCircleSpinner,
    swiper,
    swiperSlide
  },
  data () {
    return {
      data: {},
      tipsShow: false,
      tipsData: '不能再减少了',
      goods: [],
      showModel: false,
      currentSlide: 0,
      productPrice: 0,
      alonePrice: 0,
      seriesNav: [],
      currentName: '',
      seriesSwiperOption: {
        slidesPerView: 'auto',
        freeMode: true
      },
      isShow: false,
      seriesName: ''
    }
  },
  mounted () {
    document.title = '报价清单'
    let sid = this.$route.params.sid
    let jid = this.$route.params.jid
    this.getlistData({sid: sid, jid: jid})
  },
  computed: {
    seriesSwiper () {
      return this.$refs.seriesSwiper.swiper
    }
  },
  methods: {
    getlistData (obj, val) {
      let _this = this
      _this.api.post2('market/quotation/share', obj, function (result) {
        if (!result.IsError) {
          _this.$nextTick(() => {
            _this.data = result.Data
            _this.productPrice = result.Data.price
            _this.changeData(_this.data, _this.currentSlide)
            _this.ShowNow()
            _this.wxConfig.wxShowMenu('报价清单', _this.data.programme.image, _this.data.programme.desc)
          })
        }
      })
    },
    changeData (data, n) {
      this.goods = data.items[n].goods
      this.alonePrice = data.items[n].price
      this.currentName = data.items[n].name
      for (let index = 0; index < data.items.length; index++) {
        this.seriesNav[index] = data.items[index].name
      }
    },
    ShowNow () {
      this.isShow = true
    },
    selectSeries () {
      this.currentSlide = this.seriesSwiper && this.seriesSwiper.clickedIndex
      this.changeData(this.data, this.currentSlide)
    },
    GetQueryString (name) {
      let search
      if (window.location.href.split('?')[1] === undefined) {
        search = '?sid=262cf2e2-84aa-4772-b441-fa84d3e73be1&jid=b4a7f6ae-9b01-4989-ba0a-4d09ebb84e75' // 测试
      } else {
        search = '?' + window.location.href.split('?')[1]
      }
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      let r = search.substr(1).match(reg)
      if (r !== null) return unescape(r[2]); return null
    }
  }
}
</script>
