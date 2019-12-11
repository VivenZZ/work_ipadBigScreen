<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.seriesNav,.currentPage{
  box-shadow: 0 4px 6px rgba(0,0,0,.05);
}
.page{
  position: relative;
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
  font-size:26/102.4rem;
  color:#ccc;
  height:50px;
  line-height:50px;
  text-align: center;
  width: auto;
  margin-left: 45px;
  display: inline-block;
}
.swiperSlideCurrent{
  color:#333;
  position: relative;
  display: inline-block;
  &::after{
    content: '';
    border-bottom: 2px solid #000;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width:30px;
  }
}
.footTool{
  position: fixed;
  width:100vw;
  bottom: 0;
  box-shadow: 5px 2px 6px rgba(0,0,0,.2);
  z-index:9;
  background:#fff;
  padding: .146484rem 0;
}
.footTool,.shoppingCart,.buyBtn{
  height:50px;
}
.shoppingCart{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left:90/102.4rem;
  .price{
    font-size:26/102.4rem;
    color:#333;
  }
  .buyBtn{
    width:500/102.4rem;
    background:#eb4d3d;
    border:none;
    font-size:36/102.4rem;
    color:#fff;
    border-radius: 4px;
    margin-right: 92/102.4rem;
  }
}
.seriesList{
  margin-bottom: 50/102.4rem;
  margin-top: 210/102.4rem;
  .goods_list{
    height: calc(100vh - 160px);
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
    li{
      width: 438/102.4rem;
      height: 610/102.4rem;
      float: left;
      margin: 0 12/102.4rem 0;
      position: relative;
      text-align: center;
      .goods_img{
        width: 438/102.4rem;
        position: relative;
        .star{
          position: absolute;
          width: 146/102.4rem;
          height: 98/102.4rem;
          background: url('/static/images/star.png') no-repeat right center;
          background-size:100%;
          top: -0.32rem;
          right: -0.5rem;
        }
        .current{
          background: url('/static/images/star_current.png') no-repeat right center;
          background-size:100%;
        }
        a{
          display: block;
          width: 360/102.4rem;
          height: 360/102.4rem;
          margin: 0 auto 60/102.4rem;
          img{
            display: block;
            width: 360/102.4rem;
            height: 360/102.4rem;
          }
        }
      }
        .goods_name{
          font-size: 20/102.4rem;
          color: #333;
          line-height: 20/102.4rem;
          font-family: PingFangSC-Medium, sans-serif;
          margin: 0 0 13/102.4rem 0;
        }
        .goods_price{
          font-size: 28/102.4rem;
          color: #D34D3D;
          line-height: 28/102.4rem;
          font-weight: bold;
        }
        .goods_price_old{
          font-size: 22/102.4rem;
          color: #B4B4B4;
          line-height: 22/102.4rem;
          font-weight: bold;
        }
      .choise{
        display: inline-block;
        width: 105/102.4rem;
        height: 24/102.4rem;
        line-height: 24/102.4rem;
        margin-top: 30/102.4rem;
        border: 1px solid #808080;
        border-radius: 3px;
        color: #808080;
        font-size: 20/102.4rem;
      }
      .color333{
        color: #333;
      }
    }
  }
}
</style>

<template>
  <div>
    <transition name="fade">
      <div class="page" v-if="isShow && !no">
        <div class="seriesNav">
          <div class="seriesNavBox">
            <span class="swiperSlideItem" v-for="(item, index) in seriesNav" :key="index" :class=" currentSlide === index ? 'swiperSlideCurrent': ''" @click="changeIndex(index)">
              {{item.name}}
            </span>
          </div>
        </div>
        <!-- <product-detail :productarr='goods' /> -->
        <div class="seriesList">
          <ul class="goods_list">
            <li v-if="goods.length !== 0" v-for="(data, index) in goods" :key="index">
              <div class="goods_img">
                <p class="star" :class="data.ischoice === true ? 'current' : ''" @click="choice(data.id, index)"></p>
                <a href="javascript:;" @click="showgDialog(data.id, data.code)">
                  <img v-lazy="{src: data.img, error: '/static/images/onerror260.jpg'}" :key="data.img"> <!--通过绑定:key=imageUrl来防止数据改变图片不改-->
                </a>
              </div>
              <p class="goods_name">{{data.name}}</p>
              <p v-if="data.pricediscount === data.price">
                <span class="goods_price color333">￥{{data.pricediscount}}</span>
              </p>
              <p v-else>
                <span class="goods_price">￥{{data.pricediscount}}</span>
                <del class="goods_price_old">￥{{data.price}}</del>
              </p>
              <p class="choise">{{data.count}}款可选</p>
            </li>
          </ul>
        </div>
        <div class="footTool">
          <div class="shoppingCart">
            <div class="price">{{seriesName}}：{{productPrice}}元 </div>
            <div class="shoppingCartBtn">
              <button class="buyBtn" @click="shoppingCart()">{{jionText}} ({{goods.length}})</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="no"></div>
    </transition>
    <div class="loading" v-if="!isShow">
      <fulfilling-bouncing-circle-spinner
        :animation-duration="4000"
        :size="60"
        color="#EB4D3D"
      />
    </div>
    <tips v-if="tipsShow" :msg="tipsData" />
  </div>
</template>

<script>
import inspirationRoom from '../homePage/inspirationRoom'
import goodsD from '@/components/goodsDetails'
import { FulfillingBouncingCircleSpinner } from 'epic-spinners'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import productDetail from '../product/productDetail'
import Tips from '@/components/tips'
export default {
  name: 'product',
  components: {
    goodsD,
    FulfillingBouncingCircleSpinner,
    swiper,
    swiperSlide,
    inspirationRoom,
    productDetail,
    Tips
  },
  data () {
    return {
      tipsShow: false,
      tipsData: '不能再减少了',
      goods: [],
      showModel: false,
      currentSlide: 0,
      productPrice: 0,
      seriesNav: [],
      seriesSwiperOption: {
        spaceBetween: 45,
        slidesPerView: 'auto',
        freeMode: true
      },
      isShow: false,
      seriesName: '',
      no: false,
      jionText: '全部加购'
    }
  },
  created () {
    let _this = this
    this.api.post('market/programme/goods', {pid: this.$route.params.id}, function (result) {
      if (!result.IsError) {
        console.log(result)
        result.Data.forEach(e => {
          if (e.goods.length > 0) {
            _this.seriesNav.push(e)
          }
        })
        if (_this.seriesNav.length > 0) {
          _this.no = false
          _this.goods = _this.seriesNav[0].goods
          _this.productPrice = _this.seriesNav[0].price
          _this.seriesName = _this.seriesNav[0].name
        } else {
          _this.no = true
        }
        _this.ShowNow()
      }
    })
  },
  computed: {
    seriesSwiper () {
      return this.$refs.seriesSwiper.swiper
    }
  },
  methods: {
    showTips (m) {
      let _this = this
      if (!this.tipsShow) {
        this.tipsData = m
        this.tipsShow = true
        setTimeout(function () {
          _this.tipsShow = false
        }, 2000)
      }
    },
    changeIndex (i) {
      this.currentSlide = i
      this.goods = this.seriesNav[i].goods
      this.productPrice = this.seriesNav[i].price
      this.seriesName = this.seriesNav[i].name
    },
    showgDialog (id, code) {
      // window.location.href = 'http://0.0.0.0:8081/#/goodsDetails/' + id
      this.sdk.bridge.showInDialog(this.common.url + '/#/goodsDetails/' + id + '/' + code)
    },
    choice (id, index) {
      if (this.goods[index].ischoice === true) {
        this.api.post('market/choice/cancel', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
          }
        })
        this.goods[index].ischoice = false
      } else {
        this.api.post('market/choice', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
          }
        })
        this.goods[index].ischoice = true
      }
    },
    ShowNow () {
      this.isShow = true
    },
    shoppingCart () {
      let _this = this
      let codeArr = []
      let codeObj = {}
      let objArr = []
      for (let i in _this.goods) {
        codeArr.push(_this.goods[i].code)
      }
      for (let j in codeArr) {
        codeObj = {'Sku': codeArr[j], 'Quantity': 1}
        objArr.push(codeObj)
      }
      this.jionText = '正在加购...'
      _this.api.service('mktcart/addcarts', {skus: objArr, 'displayPos': 1}, function (res) {
        if (!res.IsError) {
          _this.showTips('商品已全部加入购物车！')
          _this.jionText = '全部加购'
          _this.sdk.bridge.notifCartNumChange()
        }
      }, function (res) {
        _this.showTips('加入购物车失败')
        _this.jionText = '全部加购'
      })
    }
  }
}
</script>
