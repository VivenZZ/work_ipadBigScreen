<template>
  <div class="hot">
    <div class="h100"></div>
    <ul class="goods_list">
      <li v-for="(data, index) in hotgoods" :key="index">
        <div class="goods_img">
          <p class="star" :class="data.ischoice === true ? 'current' : ''" @click="choice(data.productid, index)"></p>
          <a href="javascript:;"  @click="showgDialog(data.productid, data.code)">
            <img v-lazy="{src: data.picture, error: '/static/images/onerror260.jpg'}">
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
  </div>
</template>
<script>
import Vue from 'vue'
import VueScroller from 'vue-scroller'
Vue.use(VueScroller)
export default {
  name: 'Hotgoods',
  data () {
    return {
      hotgoods: [],
      noDataText: '',
      index: 0,
      pageIndex: 0
    }
  },
  created () {
    let _this = this
    _this.api.post('market/product/promotionlist', {}, function (result) {
      if (!result.IsError) {
        result.Data.promotiongoods.forEach(e => {
          _this.hotgoods.push(e)
        })
      }
    })
  },
  methods: {
    showgDialog (id, code) {
      // window.location.href = 'http://0.0.0.0:8081/#/goodsDetails/' + id + '/' + code
      this.sdk.bridge.showInDialog(this.common.url + '/#/goodsDetails/' + id + '/' + code)
    },
    choice (id, index) {
      if (this.hotgoods[index].ischoice === true) {
        this.api.post('market/choice/cancel', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
          }
        })
        this.hotgoods[index].ischoice = false
      } else {
        this.api.post('market/choice', {type: 1, id: id}, function (result) {
          if (!result.IsError) {
          }
        })
        this.hotgoods[index].ischoice = true
      }
    }
    // refresh () {
    //   let _this = this
    //   _this.pageIndex = 1
    //   _this.api.post('/market/product/promotionlist', {pageIndex: 1, pageSize: 10}, function (result) {
    //     if (!result.IsError) {
    //       _this.hotgoods = result.Data.promotiongoods
    //       _this.$refs.my_scroller.finishPullToRefresh()
    //     }
    //   })
    // },
    // infinite () {
    //   let _this = this
    //   _this.pageIndex++
    //   _this.api.post('/market/product/promotionlist', {pageIndex: _this.pageIndex, pageSize: 10}, function (result) {
    //     if (!result.IsError) {
    //       result.Data.promotiongoods.forEach(e => {
    //         _this.hotgoods.push(e)
    //       })
    //       if (result.Data.promotiongoods.length <= 10) { // 当数据小于10条的时候取消加载 显示nodatatext
    //         _this.$refs.my_scroller.finishInfinite(true)
    //       } else {
    //         _this.$refs.my_scroller.finishInfinite(false)
    //       }
    //     }
    //   })
    // }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.goods_list{
  overflow: hidden;
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
.h100{
  height: 100/102.4rem;
}
</style>
