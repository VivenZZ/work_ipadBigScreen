<template>
  <div class="goods">
    <transition name="fade">
      <div class="goods_index" v-if="isShow">
        <div class="ins_collo">
          <swiper :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide  v-for="data in data" :key="data.id">
              <a :href="'#/goods/goodlist/' + data.id" @click="localStorage(data.id, data.name)">
                <img v-lazy="data.image">
                <span>{{data.name}}</span>
              </a>
            </swiper-slide>
            <!-- Optional controls -->
            <div class="swiper-pagination"  slot="pagination"></div>
          </swiper>
        </div>
        <div class="bursting" v-if="hotgoods.length > 0">
          <h2>促销爆款推荐</h2>
          <ul class="goods_list">
            <li v-for="(data, index) in hotgoods" :key="data.id" v-if="index < 8">
              <div class="goods_img">
                <p class="star" :class="data.ischoice === true ? 'current' : ''" @click="choice(data.productid, index, hotgoods)"></p>
                <a href="javascript:;"  @click="showgDialog(data.productid, data.code)">
                  <img v-lazy="{src: data.picture, error: '/static/images/onerror260.jpg'}"  :key="data.picture">
                </a>
              </div>
              <p class="goods_name">{{data.productname}}</p>
              <p v-if="data.pricediscount === data.price">
                <span class="goods_price color333">￥{{data.pricediscount}}</span>
              </p>
              <p v-else>
                <span class="goods_price ">￥{{data.pricediscount}}</span>
                <del class="goods_price_old">￥{{data.price}}</del>
              </p>
              <p class="choise">{{data.count}}款可选</p>
            </li>
          </ul>
          <p class="more" v-if="hotgoods.length > 7">
            <a  @click="openNew('hotgoods', '促销单品')" href="javascript:;">查看全部促销单品</a>
          </p>
        </div>
        <div class="bursting" v-if="promotiongoods.length > 0">
          <h2>热卖精选单品</h2>
          <ul class="goods_list">
            <li v-for="(data, index) in promotiongoods" :key="data.id" v-if="index < 8">
              <div class="goods_img">
                <p class="star" :class="data.ischoice === true ? 'current' : ''" @click="choice(data.productid, index, promotiongoods)"></p>
                <a href="javascript:;"  @click="showgDialog(data.productid, data.code)">
                  <img v-lazy="{src: data.picture, error: '/static/images/onerror260.jpg'}" :key="data.picture">
                </a>
              </div>
              <p class="goods_name">{{data.productname}}</p>
              <p v-if="data.pricediscount === data.price">
                <span class="goods_price color333">￥{{data.pricediscount}}</span>
              </p>
              <p v-else>
                <span class="goods_price ">￥{{data.pricediscount}}</span>
                <del class="goods_price_old">￥{{data.price}}</del>
              </p>
              <p class="choise">{{data.count}}款可选</p>
            </li>
          </ul>
          <p class="more" v-if="promotiongoods.length > 7"><a @click="openNew('Promotiongoods', '热卖单品')" href="javascript:;">查看全部热卖单品</a></p>
        </div>
        <goods-d :invitor='showModel' @changingType="showlDialog"/>
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
import goodsD from '@/components/goodsDetails'
import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'Goods',
  components: {
    goodsD,
    swiper,
    swiperSlide,
    FulfillingBouncingCircleSpinner
  },
  data () {
    return {
      showModel: false,
      data: [],
      hotgoods: [],
      promotiongoods: [],
      swiperOption: {
        spaceBetween: 10,
        slidesPerView: 'auto',
        freeMode: true
      },
      isShow: false,
      num: 0
    }
  },
  created () {
    let _this = this
    this.sdk.bridge.saveTrace('allGoodsMain', 0)
    // this.common.getAjaxData('/goodspic.com/', this.data, this.ShowNow)
    // this.common.getAjaxData('/goods.com/', this.goods, this.ShowNow)
    _this.api.post('market/product/index', {}, function (result) {
      if (!result.IsError) {
        console.log(result.Data)
        _this.data = result.Data.categorys
        window.localStorage.setItem('navData', JSON.stringify(_this.data)) // 保存一级导航数据
        _this.hotgoods = result.Data.promotiongoods
        _this.promotiongoods = result.Data.hotgoods
        _this.ShowNow()
      }
    })
  },
  methods: {
    localStorage (id, name) {
      this.sdk.bridge.saveTrace('allGoodsTouch' + name, 1)
      window.localStorage.setItem('currentNav', id)
    },
    openNew (url, title) {
      this.sdk.bridge.openNewPage(this.common.url + '/#/goods/' + url, 'barWithSearchShop', title)
      // window.location.href = 'http://0.0.0.0:8081/#/fullPurchase/' + this.id
    },
    showgDialog (id, code) {
      // window.location.href = 'http://0.0.0.0:8081/#/goodsDetails/' + id + '/' + code
      this.sdk.bridge.showInDialog(this.common.url + '/#/goodsDetails/' + id + '/' + code)
    },
    choice (id, index, data) {
      if (data[index].ischoice === true) {
        this.api.post('market/choice/cancel', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
          }
        })
        data[index].ischoice = false
      } else {
        this.api.post('market/choice', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
          }
        })
        data[index].ischoice = true
      }
    },
    // 显示隐藏切换
    showlDialog (data) {
      console.log(data)
      if (data === 'false') {
        this.showModel = false
      } else {
        this.showModel = true
      }
    },
    updateAjax: function (url) {
      const _this = this
      _this.axios.get(url).then(function (response) {
        _this.data.all = response.all
      }).catch(function (error) {
        console.log(error)
      })
    },
    // tab 切换
    tab (index) {
      this.num = index
    },
    ShowNow () {
      this.isShow = true
    },
    alertModel (code) {
      console.log(code)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.goods_index{
  margin-left: 74/102.4rem;
  .more{
    width: 416/102.4rem;
    height: 64/102.4rem;
    line-height: 64/102.4rem;
    border: 1px solid #ED1C24;
    border-radius: 3px;
    margin-top: 65/102.4rem;
    margin-bottom: 100/102.4rem;
    text-align: center;
    a{
      font-size: 24/102.4rem;
      color: #ED1C24;
    }
  }
  h2{
    font-size: 46/102.4rem;
    line-height: 46/102.4rem;
    font-weight: bold;
    margin: 112/102.4rem 0 40/102.4rem 0;
  }
  .swiper-slide:nth-child(1){
    margin-left: 74/102.4rem;
  }
  .swiper-slide {
    text-align: center;
    font-size: 18px;
    width: 340/102.4rem;
    height: 270/102.4rem;
    span{
      position: absolute;
      bottom: 0;
      left: 0;
      color: #333;
      font-size: 25/102.4rem;
    }
    a{
      display: block;
      width: 340/102.4rem;
      height: 270/102.4rem;
    }
  }
  .swiper-slide img {
    width: 100%;
    height: 214/102.4rem;
    max-width: 100%;
    max-height: 100%;
    border-radius: 4px;
  }
  .ins_collo{
    margin-top: .957031rem;
    margin-left: -74/102.4rem;
    .hide{
      opacity: 0;
    }
    .top{
      height: 98/102.4rem;
      font-size: 24/102.4rem;
      img{
        width: 88/102.4rem;
        vertical-align: middle;
      }
      span{
        vertical-align: middle;
        color: #ccc;
        margin-right: 98/102.4rem;
      }
      .active{
        color: #333;
      }
    }
    ul{
      overflow: hidden;
      li{
        float: left;
        text-align: center;
        span{
          display: inline-block;
          font-size: 26/102.4rem;
          line-height: 26/102.4rem;
          margin-bottom: 20/102.4rem;
          color: #333;
          margin-right: 64/102.4rem;
        }
        span.line{
          display: inline-block;
          width: 63/102.4rem;
          height: 2px;
        }
      }
      .active{
        span.line{
          background-color: #ED1C24;
        }
      }
    }
  }
  .bursting{
    margin-bottom: 200/102.4rem;
    .goods_list{
      overflow: hidden;
      margin-top: 80/102.4rem;
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
        .color333{
          color: #333;
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
      }
    }
  }
}
</style>
